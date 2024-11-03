"use client";

import {
  Globe,
  Plus,
  Copy,
  Key,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import { useToast } from "@/components/ui/use-toast";

type RequestData = {
  id: string;
  status: string;
  method: string;
  endpoint: string;
  time: string;
  date: string;
  apiVersion: string;
  source: string;
  idempotencyKey: string;
  origin: string;
  ipAddress: string;
  responseBody: string;
};

const mockData: RequestData[] = [
  {
    id: "req_1",
    status: "200 OK",
    method: "POST",
    endpoint: "/v1/promotion_codes",
    time: "17:47:42",
    date: "28 OCT 2024",
    apiVersion: "2023-08-16",
    source: "Dashboard – root@themostaza.com",
    idempotencyKey: "e671b9dc-4a8c-4742-8529-e78cbdcd1f58",
    origin: "https://dashboard.example.com",
    ipAddress: "93.149.221.62",
    responseBody: JSON.stringify(
      {
        id: "promo_1QEw6UJCE5bTdo5crVm46Txu",
        object: "promotion_code",
        active: true,
        code: "GZYINFHN",
      },
      null,
      2
    ),
  },
  {
    id: "req_2",
    status: "200 OK",
    method: "POST",
    endpoint: "/v1/coupons",
    time: "17:46:58",
    date: "28 OCT 2024",
    apiVersion: "2023-08-16",
    source: "Dashboard – root@themostaza.com",
    idempotencyKey: "a123b456-7890-4742-8529-e78cbdcd1f58",
    origin: "https://dashboard.example.com",
    ipAddress: "93.149.221.62",
    responseBody: JSON.stringify(
      {
        id: "coup_1QEw6UJCE5bTdo5crVm46Txu",
        object: "coupon",
        active: true,
      },
      null,
      2
    ),
  },
  {
    id: "req_3",
    status: "200 OK",
    method: "POST",
    endpoint: "/v1/pricing_tables/prctbl_1PiZVPJCE5",
    time: "18:07:16",
    date: "1 AUG 2024",
    apiVersion: "2023-08-16",
    source: "Dashboard – root@themostaza.com",
    idempotencyKey: "c789d012-3456-4742-8529-e78cbdcd1f58",
    origin: "https://dashboard.example.com",
    ipAddress: "93.149.221.62",
    responseBody: JSON.stringify(
      {
        id: "prctbl_1PiZVPJCE5",
        object: "pricing_table",
        active: true,
      },
      null,
      2
    ),
  },
];

export const DevelopersScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  // const { toast } = useToast()

  const toggleRow = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  // const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // toast({
      //   title: "Copied to clipboard",
      //   description: "The curl command has been copied to your clipboard.",
      // });
    });
  };

  const curlExample = `curl -X POST https://api.yourdomain.com/api/v1/usage/track \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your_api_key_here" \\
  -d '{"metric": "example_metric", "value": 1}'`;

  const loadMore = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
  };

  // Group requests by date
  const groupedRequests = mockData.reduce((acc, request) => {
    if (!acc[request.date]) {
      acc[request.date] = [];
    }
    acc[request.date].push(request);
    return acc;
  }, {} as Record<string, RequestData[]>);

  return (
    <>
      <div className="flex flex-col w-full min-h-screen">
        <div className="border-b">
          <div className="container py-4">
            <h1 className="text-3xl font-bold mb-4">Developers</h1>
          </div>
        </div>

        <div className="container py-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Usage Endpoint</CardTitle>
            </CardHeader>
            <CardContent>
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                POST /api/v1/usage/track
              </code>
              <p className="mt-2 text-sm text-muted-foreground">
                Use this endpoint to track metrics in your application. Set the
                API Key in the "X-API-Key" header.
              </p>
              <Button className="mt-4" variant="outline" asChild>
                <a href="/generate-api-key">
                  <Key className="w-4 h-4 mr-2" />
                  Generate New API Key
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Curl Example</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>{curlExample}</code>
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(curlExample)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Request History</h2>
            <div className="flex gap-2">
              <Button variant="outline">Import test endpoints · 1</Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add endpoint
              </Button>
            </div>
          </div>

          <div className="container py-6 space-y-6">
            <Tabs
              value={selectedTab}
              onValueChange={setSelectedTab}
              className="w-full"
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="succeeded">Succeeded</TabsTrigger>
                <TabsTrigger value="failed">Failed</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2 my-4">
                <Input
                  placeholder="Filter by resource ID..."
                  className="max-w-xs"
                />
                <Button variant="outline">Date</Button>
                <Button variant="outline">Status</Button>
                <Button variant="outline">Method</Button>
                <Button variant="outline">API endpoint</Button>
                <Button variant="outline">More...</Button>
                <Button variant="ghost" className="ml-auto">
                  Clear all
                </Button>
              </div>
              <TabsContent value="all">
                <div className="space-y-6">
                  {Object.entries(groupedRequests).map(([date, requests]) => (
                    <div key={date} className="space-y-2">
                      <h3 className="text-lg font-semibold">{date}</h3>
                      <div className="space-y-1">
                        {requests.map((request) => (
                          <div key={request.id}>
                            <div
                              className="flex items-center px-4 py-2 hover:bg-muted/50 rounded-lg cursor-pointer"
                              onClick={() => toggleRow(request.id)}
                            >
                              <button className="mr-2">
                                {expandedRows.has(request.id) ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </button>
                              <Badge
                                // variant={
                                //   request.status === "200 OK"
                                //     ? "success"
                                //     : "destructive"
                                // }
                                className="w-20 justify-center"
                              >
                                {request.status}
                              </Badge>
                              <span className="ml-4 font-mono">
                                {request.method}
                              </span>
                              <span className="ml-4 font-mono text-muted-foreground">
                                {request.endpoint}
                              </span>
                              <span className="ml-auto font-mono text-muted-foreground">
                                {request.time}
                              </span>
                            </div>
                            {expandedRows.has(request.id) && (
                              <div className="ml-10 mt-2 p-4 bg-muted/30 rounded-lg">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-4">
                                      Request Details
                                    </h4>
                                    <dl className="space-y-2">
                                      <div className="flex gap-2">
                                        <dt className="font-medium">ID:</dt>
                                        <dd className="text-muted-foreground">
                                          {request.id}
                                        </dd>
                                      </div>
                                      <div className="flex gap-2">
                                        <dt className="font-medium">Time:</dt>
                                        <dd className="text-muted-foreground">{`${request.date} ${request.time}`}</dd>
                                      </div>
                                      <div className="flex gap-2">
                                        <dt className="font-medium">
                                          IP Address:
                                        </dt>
                                        <dd className="text-muted-foreground">
                                          {request.ipAddress}
                                        </dd>
                                      </div>
                                      <div className="flex gap-2">
                                        <dt className="font-medium">
                                          API Version:
                                        </dt>
                                        <dd className="text-muted-foreground">
                                          {request.apiVersion}
                                          <Badge
                                            variant="secondary"
                                            className="ml-2"
                                          >
                                            Latest
                                          </Badge>
                                        </dd>
                                      </div>
                                      <div className="flex gap-2">
                                        <dt className="font-medium">Source:</dt>
                                        <dd className="text-muted-foreground">
                                          {request.source}
                                        </dd>
                                      </div>
                                      <div className="flex gap-2">
                                        <dt className="font-medium">
                                          Idempotency:
                                        </dt>
                                        <dd className="text-muted-foreground">
                                          {request.idempotencyKey}
                                        </dd>
                                      </div>
                                      <div className="flex gap-2">
                                        <dt className="font-medium">Origin:</dt>
                                        <dd className="text-muted-foreground">
                                          {request.origin}
                                        </dd>
                                      </div>
                                    </dl>
                                  </div>
                                  <div>
                                    <div className="flex items-center justify-between mb-4">
                                      <h4 className="font-medium">
                                        Response Body
                                      </h4>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          copyToClipboard(request.responseBody);
                                        }}
                                      >
                                        <Copy className="w-4 h-4" />
                                      </Button>
                                    </div>
                                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                                      <code>{request.responseBody}</code>
                                    </pre>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="pt-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={loadMore}
                      disabled={loading}
                    >
                      {loading ? "Loading..." : "Load more"}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="w-4 h-4" />
                  https://api.yourdomain.com
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Your API base URL</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </>
  );
};
