import {
  ApiKeyDialog,
  ApiKeyFormSchema,
} from "@/components/custom/ApiKeyDialog";
import { SaveApiKeyDialog } from "@/components/custom/SaveApiKeyDialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RealmDataState, useRealmDataStore } from "@/stores/RealmDataStore";
import { RealmsState, useRealmsStore } from "@/stores/RealmStore";
import { ApiKey, NewApiKey } from "@/types";
import { Check, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

const realmDataSelector = (state: RealmDataState) => ({
  apiKeys: state.apiKeys,
  fetchApiKeys: state.fetchApiKeys,
  loading: state.loading,
  submitting: state.submitting,
  createApiKey: state.createApiKey,
});

const realmsSelector = (state: RealmsState) => ({
  activeRealm: state.activeRealm,
});

export const ApiKeysScreen: React.FC = () => {
  const { activeRealm } = useRealmsStore(useShallow(realmsSelector));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newApiKey, setNewApiKey] = useState<ApiKey | null>(null);

  console.log({ activeRealm });

  const { apiKeys, fetchApiKeys, loading, submitting, createApiKey } =
    useRealmDataStore(useShallow(realmDataSelector));

  useEffect(() => {
    console.log({ activeRealm });
    if (activeRealm?.id && !loading) {
      fetchApiKeys(activeRealm.id);
    }
  }, []);

  const handleSubmit = async (data: NewApiKey) => {
    console.log({ data, activeRealm });
    if (activeRealm?.id) {
      const apiKey = await createApiKey(activeRealm.id, data as NewApiKey);
      setIsDialogOpen(false);
      setNewApiKey(apiKey);
    }
  };

  console.log({ apiKeys });

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold mb-2">API Keys</h2>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus /> Create new secret key
        </Button>
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NAME</TableHead>
              <TableHead>SECRET_KEY</TableHead>
              <TableHead>ENABLED</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {(apiKeys || []).map((apiKey) => (
              <TableRow key={apiKey.id}>
                <TableCell>{apiKey.name}</TableCell>
                <TableCell className="font-mono">
                  ...{apiKey.masked.slice(-6)}
                </TableCell>
                <TableCell>
                  {apiKey.is_disabled ? (
                    <X className="size-4" />
                  ) : (
                    <Check className="size-4" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ApiKeyDialog
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        open={isDialogOpen}
        submitting={submitting}
      />

      {newApiKey && (
        <SaveApiKeyDialog
          apiKey={newApiKey}
          open={Boolean(true)}
          onOpenChange={() => setNewApiKey(null)}
        />
      )}
    </>
  );
};
