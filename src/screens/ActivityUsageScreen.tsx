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
import { getFirstDayOfMonth, getLastDayOfMonth } from "@/lib/date";
import { RealmDataState, useRealmDataStore } from "@/stores/RealmDataStore";
import { RealmsState, useRealmsStore } from "@/stores/RealmStore";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useShallow } from "zustand/react/shallow";

const realmDataSelector = (state: RealmDataState) => ({
  kpi: state.activityKPI,
  fetchActivityKPI: state.fetchActivityKPI,
  period: state.kpiPeriod,
  loading: state.loading,
  setPeriod: state.setKpiPeriod,
});

const realmsSelector = (state: RealmsState) => ({
  activeRealm: state.activeRealm,
});

export const ActivityUsageScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accountId = searchParams.get("accountId");

  const { activeRealm } = useRealmsStore(useShallow(realmsSelector));
  const { kpi, fetchActivityKPI, loading, period, setPeriod } =
    useRealmDataStore(useShallow(realmDataSelector));

  useEffect(() => {
    if (activeRealm?.id) {
      fetchActivityKPI(activeRealm.id, accountId || undefined);
    }
  }, [activeRealm, period, accountId]);

  const handleNavigateToCost = () => {
    if (accountId) {
      navigate(`/realms/usage?accountId=${accountId}`);
    } else {
      navigate(`/realms/usage`);
    }
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
            <div>
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

              <ChartContainer
                config={{
                  amount: {
                    label: "Amount",
                  },
                }}
                className="min-h-[100px] w-full max-h-[300px]"
              >
                <BarChart data={kpi.daily_tokens}>
                  <XAxis dataKey="date" />
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
            </div>
            <div>
              <h3>Model Usage</h3>
              <div className="grid grid-cols-2 gap-6">
                {kpi.model_daily_tokens.map((model, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold mb-4">
                      {model.llm_model_name}
                    </h3>
                    <ChartContainer
                      key={index}
                      config={{
                        tokens: {
                          label: model.llm_model_name,
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={model.data}>
                          <XAxis dataKey="date" />
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
            </div>
          </div>
          <div className="w-[30%] space-y-6">
            <div>
              <h3>Most Active Users</h3>
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
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};
