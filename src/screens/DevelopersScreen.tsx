"use client";

import {
  Copy,
  Key,
  ChevronDown,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RealmsState, useRealmsStore } from "@/stores/RealmStore";
import { useShallow } from "zustand/react/shallow";
import { RealmDataState, useRealmDataStore } from "@/stores/RealmDataStore";
import { UsageLog } from "@/types";

const realmDataSelector = (state: RealmDataState) => ({
  logs: state.logs,
  logsTotal: state.logsTotal,
  logsHasMore: state.logsHasMore,
  logsLoading: state.logsLoading,
  fetchLogs: state.fetchLogs,
  resetLogs: state.resetLogs,
});

const realmsSelector = (state: RealmsState) => ({
  activeRealm: state.activeRealm,
});

type GroupedLogs = {
  [date: string]: UsageLog[];
};

// Add this helper function to determine badge variant
const getBadgeVariant = (statusCode: number) => {
  if (statusCode >= 200 && statusCode < 300) return "default";
  if (statusCode >= 400) return "destructive";
  return "secondary";
};

export const DevelopersScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const { activeRealm } = useRealmsStore(useShallow(realmsSelector));
  const { logs, logsHasMore, logsLoading, fetchLogs, resetLogs } =
    useRealmDataStore(useShallow(realmDataSelector));

  const observer = useRef<IntersectionObserver>();
  const lastLogElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (logsLoading) return;

      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && logsHasMore) {
          fetchLogs(activeRealm!.id);
        }
      });

      if (node) observer.current.observe(node);
    },
    [logsLoading, logsHasMore]
  );

  useEffect(() => {
    if (activeRealm?.id) {
      resetLogs();
      fetchLogs(activeRealm.id, true);
    }
  }, [activeRealm, selectedTab]);

  const filteredAndGroupedLogs = useMemo(() => {
    const filteredLogs = logs.filter((log) => {
      if (selectedTab === "all") return true;
      if (selectedTab === "succeeded")
        return log.status_code >= 200 && log.status_code < 300;
      if (selectedTab === "failed") return log.status_code >= 400;
      return true;
    });

    return filteredLogs.reduce((acc: GroupedLogs, log) => {
      const date = new Date(log.created_at)
        .toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
        .toUpperCase();

      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(log);
      return acc;
    }, {});
  }, [logs, selectedTab]);

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
    if (logsHasMore) {
      fetchLogs(activeRealm!.id);
    }
  };

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
              {/* <Button className="mt-4" variant="outline" asChild>
                <a href="/generate-api-key">
                  <Key className="w-4 h-4 mr-2" />
                  Generate New API Key
                </a>
              </Button> */}
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
              <TabsContent value={selectedTab}>
                <div className="space-y-6">
                  {Object.entries(filteredAndGroupedLogs).map(
                    ([date, logs], groupIndex) => (
                      <div key={date} className="space-y-2">
                        <h3 className="text-lg font-semibold">{date}</h3>
                        <div className="space-y-1">
                          {logs.map((log, index) => (
                            <div
                              key={log.id}
                              ref={
                                groupIndex ===
                                  Object.keys(filteredAndGroupedLogs).length -
                                    1 && index === logs.length - 1
                                  ? lastLogElementRef
                                  : undefined
                              }
                            >
                              <div
                                className="flex items-center px-4 py-2 hover:bg-muted/50 rounded-lg cursor-pointer"
                                onClick={() => toggleRow(log.id)}
                              >
                                <button className="mr-2">
                                  {expandedRows.has(log.id) ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </button>
                                <Badge
                                  variant={getBadgeVariant(log.status_code)}
                                  className="w-20 justify-center"
                                >
                                  {log.status_code}
                                </Badge>
                                <span className="ml-4 font-mono">
                                  {log.method}
                                </span>
                                <span className="ml-4 font-mono text-muted-foreground">
                                  {log.path}
                                </span>
                                <span className="ml-auto font-mono text-muted-foreground">
                                  {new Date(
                                    log.created_at
                                  ).toLocaleTimeString()}
                                </span>
                              </div>
                              {expandedRows.has(log.id) && (
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
                                            {log.id}
                                          </dd>
                                        </div>
                                        <div className="flex gap-2">
                                          <dt className="font-medium">Time:</dt>
                                          <dd className="text-muted-foreground">
                                            {new Date(
                                              log.created_at
                                            ).toLocaleString()}
                                          </dd>
                                        </div>
                                        {log.origin && (
                                          <div className="flex gap-2">
                                            <dt className="font-medium">
                                              Origin:
                                            </dt>
                                            <dd className="text-muted-foreground">
                                              {log.origin}
                                            </dd>
                                          </div>
                                        )}
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
                                            copyToClipboard(
                                              JSON.stringify(
                                                log.response_body,
                                                null,
                                                2
                                              )
                                            );
                                          }}
                                        >
                                          <Copy className="w-4 h-4" />
                                        </Button>
                                      </div>
                                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                                        <code>
                                          {JSON.stringify(
                                            log.response_body,
                                            null,
                                            2
                                          )}
                                        </code>
                                      </pre>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                  {logsHasMore && (
                    <div className="pt-4">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={loadMore}
                        disabled={logsLoading}
                      >
                        {logsLoading ? "Loading..." : "Load more"}
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};
