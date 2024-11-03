import AdvancedUsageFilter from "@/components/custom/AdvancedUsageFilter";
import MonthPicker from "@/components/custom/MonthPicker";
import { Button } from "@/components/ui/button";
import {
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
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
import { formatDailyCosts } from "@/lib/chart";
import { getFirstDayOfMonth, getLastDayOfMonth } from "@/lib/date";
import { RealmDataState, useRealmDataStore } from "@/stores/RealmDataStore";
import { RealmsState, useRealmsStore } from "@/stores/RealmStore";
import { UsageFilter } from "@/types";
import { LoaderCircle } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar } from "recharts";
import { useShallow } from "zustand/react/shallow";

const realmDataSelector = (state: RealmDataState) => ({
  kpi: state.costKPI,
  fetchCostKPI: state.fetchCostKPI,
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

export const CostUsageScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accountId = searchParams.get("accountId");
  const modelId = searchParams.get("modelId");
  const { activeRealm } = useRealmsStore(useShallow(realmsSelector));
  const {
    kpi,
    fetchCostKPI,
    loading,
    period,
    setPeriod,
    accounts,
    isLoadingAccounts,
    fetchAccounts,
    kpiFilters,
    setKpiFilters,
  } = useRealmDataStore(useShallow(realmDataSelector));

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

      fetchCostKPI(activeRealm.id);
      fetchAccounts(activeRealm.id, { page: 1, limit: 10 });
    }
  }, [activeRealm, period, accountId, modelId]);

  const handleNavigateToActivity = () => {
    if (accountId) {
      navigate(`/realms/usage/activity?accountId=${accountId}`);
    } else {
      navigate(`/realms/usage/activity`);
    }
  };

  const dailyCosts = useMemo(() => {
    return formatDailyCosts(kpi?.daily_costs || [], period);
  }, [kpi, period]);

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

    navigate(`/realms/usage?${params.toString()}`);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="w-full">
          <div className="w-full flex flex-row items-center gap-2">
            <h2 className="text-2xl font-bold mb-2">Usage: Cost</h2>
            {loading && <LoaderCircle className="animate-spin size-4" />}
          </div>

          <div className="flex justify-between flex-row w-full">
            <Tabs value={"cost"} onValueChange={handleNavigateToActivity}>
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
              <h3>Cost Overview</h3>

              <ChartContainer
                config={{
                  amount: {
                    label: "Amount",
                  },
                }}
                className="min-h-[100px] w-full max-h-[300px]"
              >
                <BarChart data={dailyCosts}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  {kpi.llms.map((model, index) => (
                    <Bar
                      key={index}
                      dataKey={model.model_name}
                      fill={`hsl(var(--chart-${index + 1}))`}
                      stackId="daily-cost"
                    />
                  ))}
                </BarChart>
              </ChartContainer>
            </div>
            <div>
              <h3>Model Cost</h3>
              <div className="grid grid-cols-2 gap-6">
                {kpi.model_costs.map((model, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold mb-4">
                      {model.model_name}
                    </h3>
                    <ChartContainer
                      config={{
                        tokens: {
                          label: model.model_name,
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={model.daily_costs}>
                          <XAxis dataKey="date" />
                          <YAxis yAxisId="left" orientation="left" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar
                            yAxisId="left"
                            dataKey="cost"
                            fill={`hsl(var(--chart-1))`}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-[30%] space-y-6">
            {activeRealm?.bill_limit_enabled && (
              <div>
                <CardHeader>
                  <CardTitle>Monthly Bill</CardTitle>
                  <CardDescription>Oct 1 - 31</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">
                    ${kpi.total_cost}
                  </div>
                  <Progress value={2} className="h-2 mb-2" />
                  <div className="text-sm text-gray-400 mb-4">
                    ${kpi.total_cost} / $50.00 limit
                  </div>
                  <Button className="w-full">Increase limit</Button>
                </CardContent>
              </div>
            )}
            {activeRealm?.overhead_enabled && (
              <div>
                <CardHeader>
                  <CardTitle>Income from Usage Overhead</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">
                    ${kpi.total_usage_fees}
                  </div>
                  <div className="text-sm text-gray-400">
                    Total income from usage fees
                  </div>
                </CardContent>
              </div>
            )}
            <div>
              <CardHeader>
                <CardTitle>Most Used Models</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model</TableHead>
                      <TableHead>Tokens</TableHead>
                      <TableHead>Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(kpi.most_used_models || []).map((usage, index) => (
                      <TableRow key={index}>
                        <TableCell>{usage.model_name}</TableCell>
                        <TableCell>
                          {usage.total_tokens.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          ${usage.total_model_price.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};
