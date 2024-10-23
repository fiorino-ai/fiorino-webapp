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
import { useRealmDataStore } from "@/stores/RealmDataStore";
import { useRealmsStore } from "@/stores/RealmStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export const ActivityUsageScreen: React.FC = () => {
  const navigate = useNavigate();
  const { activeRealm } = useRealmsStore();

  console.log({ activeRealm });

  const { activityKPI: kpi, fetchActivityKPI, loading } = useRealmDataStore();

  // const initData = async () => {
  //   const response = await fetch(
  //     "http://localhost:8000/api/v1/kpi/activity?start_date=2024-09-01&end_date=2024-10-01"
  //   );

  //   if (!response.ok) {
  //     throw new Error("Failed to fetch data");
  //   }

  //   const data = await response.json();
  //   console.log(data);

  //   setKpi(data);
  // };

  // useEffect(() => {
  //   initData();
  // }, [activeRealm]);

  useEffect(() => {
    if (activeRealm?.id) {
      fetchActivityKPI(activeRealm.id);
    }
  }, [activeRealm]);

  const handleNavigateToCost = () => {
    navigate(`/realms/usage`);
  };

  // if (!kpi) {
  //   return <div>Loading...</div>;
  // }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Monthly Spend</h2>
          <Tabs value={"activity"} onValueChange={handleNavigateToCost}>
            <TabsList>
              <TabsTrigger value="cost">Cost</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
          </Tabs>
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
                  <ChartContainer
                    key={index}
                    config={{
                      tokens: {
                        label: model.llm_model_name,
                      },
                    }}
                  >
                    <h3 className="text-lg font-semibold mb-4">
                      {model.llm_model_name}
                    </h3>
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
                  {(kpi.top_users.users || []).map((user, index) => (
                    <TableRow key={user.user_id}>
                      <TableCell>{user.user_id}</TableCell>
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
