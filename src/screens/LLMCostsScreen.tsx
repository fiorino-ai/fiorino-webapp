import { Button } from "@/components/ui/button";
import { RealmDataState, useRealmDataStore } from "@/stores/RealmDataStore";
import { RealmsState, useRealmsStore } from "@/stores/RealmStore";
import { LLMCost } from "@/types";
import { LoaderCircle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { LLMCostsTable } from "@/components/custom/LLMCostsTable";
import LLMCostForm from "@/components/custom/LLMCostForm";
import { DeleteLLMCostDialog } from "@/components/custom/DeleteLLMCostDialog";

const realmDataSelector = (state: RealmDataState) => ({
  llmCosts: state.llmCosts,
  fetchLLMPricing: state.fetchLLMPricing,
  createLLMCost: state.createLLMCost,
  updateLLMCost: state.updateLLMCost,
  deleteLLMCost: state.deleteLLMCost,
  loading: state.loading,
  submitting: state.submitting,
});

const realmsSelector = (state: RealmsState) => ({
  activeRealm: state.activeRealm,
});

export const LLMCostsScreen: React.FC = () => {
  const { activeRealm } = useRealmsStore(useShallow(realmsSelector));
  const {
    llmCosts,
    fetchLLMPricing,
    createLLMCost,
    updateLLMCost,
    deleteLLMCost,
    loading,
    submitting,
  } = useRealmDataStore(useShallow(realmDataSelector));

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentLLMCost, setCurrentLLMCost] = useState<LLMCost | null>(null);

  useEffect(() => {
    if (activeRealm?.id && !loading) {
      fetchLLMPricing(activeRealm.id);
    }
  }, [activeRealm]);

  const handleSubmit = async (data: Partial<LLMCost>) => {
    if (!activeRealm?.id) return;

    try {
      if (currentLLMCost) {
        await updateLLMCost(activeRealm.id, currentLLMCost.cost_id, data);
      } else {
        await createLLMCost(activeRealm.id, data);
      }
      setIsDialogOpen(false);
      setCurrentLLMCost(null);
      // Refresh the list after successful operation
      await fetchLLMPricing(activeRealm.id);
    } catch (error) {
      console.error("Failed to save LLM cost:", error);
    }
  };

  const handleDelete = async (reopenPreviousPrice: boolean) => {
    if (!currentLLMCost || !activeRealm) return;

    try {
      await deleteLLMCost(
        activeRealm.id,
        currentLLMCost.cost_id,
        reopenPreviousPrice
      );
      setIsDeleteDialogOpen(false);
      setCurrentLLMCost(null);
      // Refresh the list after successful deletion
      await fetchLLMPricing(activeRealm.id);
    } catch (error) {
      console.error("Failed to delete LLM cost:", error);
    }
  };

  const handleOnDeleteClick = (cost: LLMCost) => {
    setCurrentLLMCost(cost);
    setIsDeleteDialogOpen(true);
  };

  const handleEditClick = (cost: LLMCost) => {
    setCurrentLLMCost(cost);
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="w-full flex flex-row items-center gap-2">
          <h2 className="text-xl font-bold mb-2">LLM Pricing</h2>
          {loading && <LoaderCircle className="animate-spin size-4" />}
        </div>

        <Button onClick={() => setIsDialogOpen(true)} disabled={loading}>
          <Plus /> Add new pricing
        </Button>
      </div>

      <div>
        <LLMCostsTable
          llmCosts={llmCosts}
          onDelete={handleOnDeleteClick}
          onEdit={handleEditClick}
        />
      </div>

      <LLMCostForm
        llmCost={currentLLMCost || undefined}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        submitting={submitting}
      />

      {currentLLMCost && (
        <DeleteLLMCostDialog
          llmCost={currentLLMCost}
          onOpenChange={setIsDeleteDialogOpen}
          open={isDeleteDialogOpen}
          onConfirm={handleDelete}
          submitting={submitting}
        />
      )}
    </>
  );
};
