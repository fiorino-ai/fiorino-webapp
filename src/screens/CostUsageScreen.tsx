import { Button } from "@/components/ui/button";
import {
  Card,
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
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar } from "recharts";

export const CostUsageScreen: React.FC = () => {
  const navigate = useNavigate();
  const [kpi, setKpi] = useState<any>(null);

  const initData = async () => {
    const response = await fetch(
      "http://localhost:8000/api/v1/kpi/cost?start_date=2024-09-01&end_date=2024-10-01"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    console.log(data);

    setKpi(data);
  };

  useEffect(() => {
    initData();
  }, []);

  const handleNavigateToActivity = () => {
    navigate(`/usage/activity`);
  };

  const dailyCosts = useMemo(() => {
    if (!kpi) {
      return [];
    }

    const costs = {};
    const models = [];

    for (const cost of kpi.daily_costs) {
      if (!costs[cost.date]) {
        costs[cost.date] = {};
      }
      costs[cost.date][cost.llm_model_name] = cost.total_cost;

      if (!models.includes(cost.llm_model_name)) {
        models.push(cost.llm_model_name);
      }
    }

    return {
      series: Object.keys(costs).map((date) => {
        return {
          date,
          ...costs[date],
        };
      }),
      models,
    };
  }, [kpi]);

  if (!kpi) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Monthly Spend</h2>
          <Tabs value={"cost"} onValueChange={handleNavigateToActivity}>
            <TabsList>
              <TabsTrigger value="cost">Cost</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
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
              <BarChart data={dailyCosts.series}>
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                {dailyCosts.models.map((model, index) => (
                  <Bar
                    key={index}
                    dataKey={model}
                    fill={`hsl(var(--chart-${index + 1}))`}
                    stackId="daily-cost"
                  />
                ))}
              </BarChart>
            </ChartContainer>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Model Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                {kpi.model_costs.map((model, index) => (
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
                      <BarChart data={model.daily_costs}>
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" orientation="left" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar yAxisId="left" dataKey="cost" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="w-[30%] space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Bill</CardTitle>
              <CardDescription>Oct 1 - 31</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">${kpi.total_cost}</div>
              <Progress value={2} className="h-2 mb-2" />
              <div className="text-sm text-gray-400 mb-4">
                ${kpi.total_cost} / $50.00 limit
              </div>
              <Button className="w-full">Increase limit</Button>
            </CardContent>
          </Card>
          <Card>
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
          </Card>
          <Card>
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
                      <TableCell>{usage.llm_model_name}</TableCell>
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
          </Card>
        </div>
      </div>
    </>
  );
};
