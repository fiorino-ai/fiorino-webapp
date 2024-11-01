import { ApiKeyDialog } from "@/components/custom/ApiKeyDialog";
import { DeleteApiKeyDialog } from "@/components/custom/DeleteApiKeyDialog";
import { SaveApiKeyDialog } from "@/components/custom/SaveApiKeyDialog";
import { EditApiKeyDialog } from "@/components/custom/EditApiKeyDialog";
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
import { ApiKey, NewApiKey, EditedApiKey } from "@/types";
import { Check, Pencil, Plus, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { LLMCostsTable } from "@/components/custom/LLMCostsTable";
import LLMCostForm from "@/components/custom/LLMCostForm";

const realmDataSelector = (state: RealmDataState) => ({
  apiKeys: state.apiKeys,
  fetchApiKeys: state.fetchApiKeys,
  loading: state.loading,
  submitting: state.submitting,
  createApiKey: state.createApiKey,
  deleteApiKey: state.deleteApiKey,
  updateApiKey: state.updateApiKey,
  llmCosts: state.llmCosts,
  fetchLLMPricing: state.fetchLLMPricing,
});

const realmsSelector = (state: RealmsState) => ({
  activeRealm: state.activeRealm,
});

export const LLMCostsScreen: React.FC = () => {
  const { activeRealm } = useRealmsStore(useShallow(realmsSelector));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentApiKey, setCurrentApiKey] = useState<ApiKey | null>(null);
  const [newApiKey, setNewApiKey] = useState<ApiKey | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingApiKey, setEditingApiKey] = useState<ApiKey | null>(null);

  console.log({ activeRealm });

  const {
    apiKeys,
    fetchApiKeys,
    loading,
    submitting,
    createApiKey,
    deleteApiKey,
    updateApiKey,
    llmCosts,
    fetchLLMPricing,
  } = useRealmDataStore(useShallow(realmDataSelector));

  useEffect(() => {
    console.log({ activeRealm });
    if (activeRealm?.id && !loading) {
      fetchLLMPricing(activeRealm.id);
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

  const handleDelete = async () => {
    if (!currentApiKey || !activeRealm) return;

    await deleteApiKey(activeRealm.id, currentApiKey.id);
    setIsDeleteDialogOpen(false);
    setCurrentApiKey(null);
  };

  const handleOnDeleteClick = (apiKey: ApiKey) => {
    setCurrentApiKey(apiKey);
    setIsDeleteDialogOpen(true);
  };

  const handleEdit = (apiKey: ApiKey) => {
    setEditingApiKey(apiKey);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (values: EditedApiKey) => {
    if (!activeRealm || !editingApiKey) return;

    await updateApiKey(activeRealm.id, editingApiKey.id, values);
    setIsEditDialogOpen(false);
    setEditingApiKey(null);
    // Optionally, you can refresh the API keys list here
    // await fetchApiKeys(activeRealm.id);
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
          <h2 className="text-xl font-bold mb-2">LLM Pricing</h2>
        </div>
        <LLMCostForm />
      </div>

      <div>
        <LLMCostsTable llmCosts={llmCosts} />
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
      {currentApiKey && (
        <DeleteApiKeyDialog
          open={isDeleteDialogOpen}
          onOpenChange={() => {
            setCurrentApiKey(null);
            setIsDeleteDialogOpen(false);
          }}
          apiKey={currentApiKey}
          onConfirm={handleDelete}
        />
      )}
      {editingApiKey && (
        <EditApiKeyDialog
          apiKey={editingApiKey}
          open={isEditDialogOpen}
          onOpenChange={() => {
            setEditingApiKey(null);
            setIsEditDialogOpen(false);
          }}
          submitting={submitting}
          onSubmit={handleEditSubmit}
        />
      )}
    </>
  );
};
