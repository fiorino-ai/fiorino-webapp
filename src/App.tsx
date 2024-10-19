"use client";

import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  LogOut,
  User,
  BarChart2,
  Users,
  LayoutDashboard,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const data = [
  { date: "01 Oct", amount: 400 },
  { date: "08 Oct", amount: 300 },
  { date: "15 Oct", amount: 500 },
  { date: "22 Oct", amount: 200 },
  { date: "29 Oct", amount: 100 },
];

const mostUsedModels = [
  { name: "GPT-4", tokens: 1500000, cost: 45.0 },
  { name: "GPT-3.5-Turbo", tokens: 3000000, cost: 6.0 },
  { name: "DALL-E 3", tokens: 500, cost: 2.5 },
];

const modelUsageData = [
  {
    name: "GPT-4",
    data: [
      { date: "Week 1", tokens: 300000, cost: 9 },
      { date: "Week 2", tokens: 400000, cost: 12 },
      { date: "Week 3", tokens: 500000, cost: 15 },
      { date: "Week 4", tokens: 300000, cost: 9 },
    ],
  },
  {
    name: "GPT-3.5-Turbo",
    data: [
      { date: "Week 1", tokens: 600000, cost: 1.2 },
      { date: "Week 2", tokens: 800000, cost: 1.6 },
      { date: "Week 3", tokens: 1000000, cost: 2 },
      { date: "Week 4", tokens: 600000, cost: 1.2 },
    ],
  },
  {
    name: "DALL-E 3",
    data: [
      { date: "Week 1", tokens: 100, cost: 0.5 },
      { date: "Week 2", tokens: 150, cost: 0.75 },
      { date: "Week 3", tokens: 200, cost: 1 },
      { date: "Week 4", tokens: 50, cost: 0.25 },
    ],
  },
];

export default function Component() {
  const [currentMonth, setCurrentMonth] = useState("October");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("cost");

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const [kpi, setKpi] = useState<any>(null);
  const [models, setModels] = useState<any>([]);

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
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Usage: Cost</h1>
        <div className="flex items-center space-x-4">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select realm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realm1">Realm 1</SelectItem>
              <SelectItem value="realm2">Realm 2</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="@user" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`bg-gray-800 p-4 overflow-y-auto transition-all duration-300 ${
            isSidebarCollapsed ? "w-16" : "w-64"
          }`}
        >
          <nav className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={toggleSidebar}
            >
              <LayoutDashboard className="h-5 w-5 mr-2" />
              {!isSidebarCollapsed && <span>Overview</span>}
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <BarChart2 className="h-5 w-5 mr-2" />
              {!isSidebarCollapsed && <span>Usage</span>}
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Users className="h-5 w-5 mr-2" />
              {!isSidebarCollapsed && <span>Users</span>}
            </Button>
          </nav>
        </aside>
        <main className="flex-1 p-6 overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Monthly Spend</h2>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="cost">Cost</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Select value={currentMonth} onValueChange={setCurrentMonth}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="October">October</SelectItem>
                  <SelectItem value="November">November</SelectItem>
                  <SelectItem value="December">December</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="w-[70%] space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cost Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      amount: {
                        label: "Amount",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                  >
                    <ResponsiveContainer height="100px">
                      <BarChart data={dailyCosts.series}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        {dailyCosts.models.map((model, index) => (
                          <Bar
                            key={index}
                            dataKey={model}
                            fill={`hsl(${index * 30}, 70%, 50%)`}
                            stackId="daily-cost"
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
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
                            color: "hsl(var(--chart-1))",
                          },
                        }}
                      >
                        <h3 className="text-lg font-semibold mb-4">
                          {model.llm_model_name}
                        </h3>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={model.daily_costs}>
                            <XAxis dataKey="date" />
                            <YAxis
                              yAxisId="left"
                              orientation="left"
                              stroke="hsl(var(--chart-1))"
                            />
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
                  <div className="text-3xl font-bold mb-2">
                    ${kpi.total_cost}
                  </div>
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
        </main>
      </div>
    </div>
  );
}
