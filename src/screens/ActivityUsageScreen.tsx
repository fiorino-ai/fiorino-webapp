import AdvancedUsageFilter from "@/components/custom/AdvancedUsageFilter";
import MonthPicker from "@/components/custom/MonthPicker";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDailyTokens, formatDateTick } from "@/lib/chart";
import { getFirstDayOfMonth, getLastDayOfMonth } from "@/lib/date";
import { RealmDataState, useRealmDataStore } from "@/stores/RealmDataStore";
import { RealmsState, useRealmsStore } from "@/stores/RealmStore";
import { UsageFilter } from "@/types";
import { LineChart, LoaderCircle } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useShallow } from "zustand/react/shallow";

const realmDataSelector = (state: RealmDataState) => ({
  kpi: state.activityKPI,
  fetchActivityKPI: state.fetchActivityKPI,
  period: state.kpiPeriod,
  loading: state.loading,
  setPeriod: state.setKpiPeriod,
  accounts: state.accounts,
  isLoadingAccounts: state.accountsLoading,
  fetchAccounts: state.fetchAccounts,
  kpiFilters: state.kpiFilters,
  setKpiFilters: state.setKpiFilters,
});

const realmsSelector = (state: RealmsState) => ({
  activeRealm: state.activeRealm,
});

export const ActivityUsageScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accountId = searchParams.get("accountId");
  const modelId = searchParams.get("modelId");

  const { activeRealm } = useRealmsStore(useShallow(realmsSelector));
  const {
    kpi,
    fetchActivityKPI,
    loading,
    period,
    setPeriod,
    accounts,
    isLoadingAccounts,
    fetchAccounts,
    kpiFilters,
    setKpiFilters,
  } = useRealmDataStore(useShallow(realmDataSelector));

  const dailyTokens = useMemo(() => {
    return formatDailyTokens(kpi?.daily_tokens || [], period);
  }, [kpi, period]);

  console.log(dailyTokens);

  useEffect(() => {
    if (activeRealm?.id) {
      const _kpiFilters: UsageFilter[] = [];

      if (accountId) {
        _kpiFilters.push({ type: "account", id: accountId });
      }
      if (modelId) {
        _kpiFilters.push({ type: "model", id: modelId });
      }

      setKpiFilters(_kpiFilters);

      fetchActivityKPI(activeRealm.id);
      fetchAccounts(activeRealm.id, { page: 1, limit: 10 });
    }
  }, [activeRealm, period, accountId, modelId]);

  const handleNavigateToCost = () => {
    if (accountId) {
      navigate(`/realms/usage?accountId=${accountId}`);
    } else {
      navigate(`/realms/usage`);
    }
  };

  const handleSearchAccountsChange = async (search: string) => {
    if (activeRealm) {
      fetchAccounts(activeRealm.id, { page: 1, limit: 10, search });
    }
  };

  const handleFiltersChange = (filters: UsageFilter[]) => {
    const params = new URLSearchParams();

    filters.forEach((filter) => {
      params.append(
        filter.type === "account" ? "accountId" : "modelId",
        filter.id
      );
    });

    navigate(`/realms/usage/activity?${params.toString()}`);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="w-full">
          <div className="w-full flex flex-row items-center gap-2">
            <h2 className="text-2xl font-bold mb-2">Usage: Activity</h2>
            {loading && <LoaderCircle className="animate-spin size-4" />}
          </div>

          <div className="flex justify-between flex-row w-full">
            <Tabs value={"activity"} onValueChange={handleNavigateToCost}>
              <TabsList>
                <TabsTrigger value="cost">Cost</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex flex-row items-center gap-2">
              <AdvancedUsageFilter
                accounts={accounts}
                isLoadingAccounts={isLoadingAccounts}
                onSearchAccountsChange={handleSearchAccountsChange}
                onChange={handleFiltersChange}
                filters={kpiFilters}
              />
              <MonthPicker
                value={period}
                minDate={
                  activeRealm?.created_at
                    ? getFirstDayOfMonth(activeRealm?.created_at)
                    : undefined
                }
                maxDate={getLastDayOfMonth(new Date())}
                onChange={setPeriod}
              />
            </div>
          </div>
        </div>
      </div>

      {kpi ? (
        <div className="flex gap-6">
          <div className="w-[70%] space-y-6">
            <div>
              <h3>Token Usage</h3>

              {dailyTokens.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[300px] border border-dashed border-gray-800 rounded-2xl">
                  <LineChart className="h-10 w-10 text-gray-500 mb-3" />
                  <p className="text-gray-400 text-sm">
                    No usage data available for this period
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Usage data will appear here once available
                  </p>
                </div>
              ) : (
                <ChartContainer
                  config={{
                    amount: {
                      label: "Amount",
                    },
                  }}
                  className="min-h-[100px] w-full max-h-[300px]"
                >
                  <BarChart data={dailyTokens}>
                    <XAxis dataKey="date" tickFormatter={formatDateTick} />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey={"total_input_tokens"}
                      fill={`hsl(var(--chart-1))`}
                      stackId="daily-cost"
                    />
                    <Bar
                      dataKey={"total_output_tokens"}
                      fill={`hsl(var(--chart-2))`}
                      stackId="daily-cost"
                    />
                  </BarChart>
                </ChartContainer>
              )}
            </div>
            <div>
              <h3>Model Usage</h3>
              {kpi.model_daily_tokens.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] border border-dashed border-gray-800 rounded-2xl">
                  <LineChart className="h-8 w-8 text-gray-500 mb-2" />
                  <p className="text-gray-400 text-sm">No model usage data</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  {kpi.model_daily_tokens.map((model, index) => (
                    <div key={index}>
                      <h3 className="text-lg font-semibold mb-4">
                        {model.model_name}
                      </h3>
                      <ChartContainer
                        key={index}
                        config={{
                          tokens: {
                            label: model.model_name,
                          },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={formatDailyTokens(model.data, period)}
                          >
                            <XAxis
                              dataKey="date"
                              tickFormatter={formatDateTick}
                            />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar
                              dataKey={"total_input_tokens"}
                              fill={`hsl(var(--chart-1))`}
                              stackId="daily-cost"
                            />
                            <Bar
                              dataKey={"total_output_tokens"}
                              fill={`hsl(var(--chart-2))`}
                              stackId="daily-cost"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="w-[30%] space-y-6">
            <div>
              <h3>Most Active Users</h3>
              {(kpi.top_users.users || []).length == 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] border border-dashed border-gray-800 rounded-2xl">
                  <LineChart className="h-8 w-8 text-gray-500 mb-2" />
                  <p className="text-gray-400 text-sm">
                    No usage data available
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    User activity statistics will appear here
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(kpi.top_users.users || []).map((user) => (
                      <TableRow key={user.account_id}>
                        <TableCell>{user.account_name}</TableCell>
                        <TableCell>
                          <Progress
                            value={user.percentage}
                            max={100}
                            className="w-full h-2"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};
