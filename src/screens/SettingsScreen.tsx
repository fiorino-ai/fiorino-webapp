import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RealmsState, useRealmsStore } from "@/stores/RealmStore";
import { RealmDataState, useRealmDataStore } from "@/stores/RealmDataStore";
import { useShallow } from "zustand/react/shallow";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { BillLimitDialog } from "@/components/custom/BillLimitDialog";
import { OverheadDialog } from "@/components/custom/OverheadDialog";
import { BillLimit, Overhead } from "@/types";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { BillLimitsTable } from "@/components/custom/BillLimitsTable";
import { OverheadsTable } from "@/components/custom/OverheadsTable";
import { DeleteBillLimitDialog } from "@/components/custom/DeleteBillLimitDialog";
import { DeleteOverheadDialog } from "@/components/custom/DeleteOverheadDialog";

const realmsSelector = (state: RealmsState) => ({
  activeRealm: state.activeRealm,
  updateRealm: state.updateRealm,
  deleteRealm: state.deleteRealm,
  submitting: state.submitting,
});

const realmDataSelector = (state: RealmDataState) => ({
  billLimits: state.billLimits,
  overhead: state.overhead,
  fetchBillLimits: state.fetchBillLimits,
  fetchOverhead: state.fetchOverhead,
  createBillLimit: state.createBillLimit,
  updateBillLimit: state.updateBillLimit,
  deleteBillLimit: state.deleteBillLimit,
  createOverhead: state.createOverhead,
  updateOverhead: state.updateOverhead,
  deleteOverhead: state.deleteOverhead,
  loading: state.loading,
  submitting: state.submitting,
});

const UpdateRealmFormSchema = z.object({
  name: z.string().min(2, {
    message: "Please enter a valid realm name.",
  }),
});

const isRecordActive = (validFrom: Date, validTo: Date | null) => {
  console.log(validFrom, validTo);
  const now = new Date();
  const farFuture = new Date("2099-12-31");
  return validFrom <= now && (validTo === null || validTo >= farFuture);
};

export const SettingsScreen: React.FC = () => {
  const {
    activeRealm,
    updateRealm,
    deleteRealm,
    submitting: realmSubmitting,
  } = useRealmsStore(useShallow(realmsSelector));
  const {
    billLimits,
    overhead,
    fetchBillLimits,
    fetchOverhead,
    createBillLimit,
    updateBillLimit,
    deleteBillLimit,
    createOverhead,
    updateOverhead,
    deleteOverhead,
    submitting,
  } = useRealmDataStore(useShallow(realmDataSelector));

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBillLimitDialogOpen, setIsBillLimitDialogOpen] = useState(false);
  const [isOverheadDialogOpen, setIsOverheadDialogOpen] = useState(false);
  const [currentBillLimit, setCurrentBillLimit] = useState<BillLimit | null>(
    null
  );
  const [currentOverhead, setCurrentOverhead] = useState<Overhead | null>(null);
  const [isDeleteBillLimitDialogOpen, setIsDeleteBillLimitDialogOpen] =
    useState(false);
  const [isDeleteOverheadDialogOpen, setIsDeleteOverheadDialogOpen] =
    useState(false);

  const form = useForm<z.infer<typeof UpdateRealmFormSchema>>({
    resolver: zodResolver(UpdateRealmFormSchema),
    defaultValues: {
      name: activeRealm?.name || "",
    },
  });

  useEffect(() => {
    if (activeRealm) {
      if (activeRealm.bill_limit_enabled) {
        fetchBillLimits(activeRealm.id);
      }
      if (activeRealm.overhead_enabled) {
        fetchOverhead(activeRealm.id);
      }
    }
  }, [
    activeRealm,
    activeRealm?.bill_limit_enabled,
    activeRealm?.overhead_enabled,
  ]);

  const handleUpdateRealm = async (
    values: z.infer<typeof UpdateRealmFormSchema>
  ) => {
    if (activeRealm) {
      await updateRealm(activeRealm.id, values);
    }
  };

  const handleDeleteRealm = async () => {
    if (activeRealm) {
      await deleteRealm(activeRealm.id);
      setIsDeleteDialogOpen(false);
      // Redirect to a different page or show a success message
    }
  };

  const handleToggleBillLimit = async () => {
    if (activeRealm) {
      await updateRealm(activeRealm.id, {
        bill_limit_enabled: !activeRealm.bill_limit_enabled,
      });
    }
  };

  const handleToggleOverhead = async () => {
    if (activeRealm) {
      await updateRealm(activeRealm.id, {
        overhead_enabled: !activeRealm.overhead_enabled,
      });
    }
  };

  const handleBillLimitSubmit = async (values: Partial<BillLimit>) => {
    if (activeRealm) {
      if (currentBillLimit) {
        await updateBillLimit(activeRealm.id, currentBillLimit.id!, values);
      } else {
        await createBillLimit(activeRealm.id, values);
      }
      setIsBillLimitDialogOpen(false);
      setCurrentBillLimit(null);
      fetchBillLimits(activeRealm.id);
    }
  };

  const handleDeleteBillLimit = async (reopenPreviousPrice: boolean) => {
    if (!currentBillLimit || !activeRealm) return;

    try {
      await deleteBillLimit(
        activeRealm.id,
        currentBillLimit.id,
        reopenPreviousPrice
      );
      setIsDeleteBillLimitDialogOpen(false);
      setCurrentBillLimit(null);
      // Refresh the list after successful deletion
      await fetchBillLimits(activeRealm.id);
    } catch (error) {
      console.error("Failed to delete bill limit:", error);
    }
  };

  const handleOverheadSubmit = async (values: Partial<Overhead>) => {
    if (activeRealm) {
      if (currentOverhead) {
        await updateOverhead(activeRealm.id, currentOverhead.id!, values);
      } else {
        await createOverhead(activeRealm.id, values);
      }
      setIsOverheadDialogOpen(false);
      setCurrentOverhead(null);
      fetchOverhead(activeRealm.id);
    }
  };

  const handleDeleteOverhead = async () => {
    if (!currentOverhead || !activeRealm) return;

    try {
      await deleteOverhead(activeRealm.id, currentOverhead.id);
      setIsDeleteOverheadDialogOpen(false);
      setCurrentOverhead(null);
      // Refresh the list after successful deletion
      await fetchOverhead(activeRealm.id);
    } catch (error) {
      console.error("Failed to delete overhead:", error);
    }
  };

  const hasActiveBillLimit =
    billLimits && isRecordActive(billLimits.valid_from, billLimits.valid_to);
  const hasActiveOverhead =
    overhead && isRecordActive(overhead.valid_from, overhead.valid_to);

  console.log(hasActiveBillLimit, hasActiveOverhead);

  if (!activeRealm) {
    return <div>No active realm selected.</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-20 max-w-3xl">
      <section>
        <h2 className="text-2xl font-bold mb-4">General</h2>
        <Separator />
        <div className="space-y-6">
          <div>
            <div className="flex space-x-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleUpdateRealm)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Realm Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={realmSubmitting}>
                    Update Realm Name
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Bill Limit</h2>
        <Separator />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Enable Bill Limit</h3>
              <p className="text-gray-400">
                Set a maximum spending limit for this realm.
              </p>
            </div>
            <Switch
              checked={activeRealm.bill_limit_enabled}
              onCheckedChange={handleToggleBillLimit}
              disabled={realmSubmitting}
            />
          </div>
          {activeRealm.bill_limit_enabled && (
            <>
              {!hasActiveBillLimit && (
                <Button onClick={() => setIsBillLimitDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Bill Limit
                </Button>
              )}
              {billLimits && (
                <BillLimitsTable
                  billLimits={billLimits}
                  onEdit={(billLimit) => {
                    setCurrentBillLimit(billLimit);
                    setIsBillLimitDialogOpen(true);
                  }}
                  onDelete={(billLimit) => {
                    setCurrentBillLimit(billLimit);
                    setIsDeleteBillLimitDialogOpen(true);
                  }}
                />
              )}
            </>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Overhead</h2>
        <Separator />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Enable Overhead</h3>
              <p className="text-gray-400">
                Configure overhead costs for this realm.
              </p>
            </div>
            <Switch
              checked={activeRealm.overhead_enabled}
              onCheckedChange={handleToggleOverhead}
              disabled={realmSubmitting}
            />
          </div>
          {activeRealm.overhead_enabled && (
            <>
              {!hasActiveOverhead && (
                <Button onClick={() => setIsOverheadDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Overhead
                </Button>
              )}
              {overhead && (
                <OverheadsTable
                  overhead={overhead}
                  onEdit={(overhead) => {
                    setCurrentOverhead(overhead);
                    setIsOverheadDialogOpen(true);
                  }}
                  onDelete={(overhead) => {
                    setCurrentOverhead(overhead);
                    setIsDeleteOverheadDialogOpen(true);
                  }}
                />
              )}
            </>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-red-500">Danger Zone</h2>
        <div className="border border-red-600 rounded-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Delete this realm</h3>
              <p className="text-gray-400">
                Once you delete a realm, there is no going back. Please be
                certain.
              </p>
            </div>
            <AlertDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete this realm</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gray-800 text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    This action cannot be undone. This will permanently delete
                    your realm and remove all associated data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={handleDeleteRealm}
                  >
                    Delete Realm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </section>

      <BillLimitDialog
        billLimit={currentBillLimit || undefined}
        open={isBillLimitDialogOpen}
        onOpenChange={setIsBillLimitDialogOpen}
        submitting={submitting}
        onSubmit={handleBillLimitSubmit}
      />

      <OverheadDialog
        overhead={currentOverhead || undefined}
        open={isOverheadDialogOpen}
        onOpenChange={setIsOverheadDialogOpen}
        submitting={submitting}
        onSubmit={handleOverheadSubmit}
      />

      {currentBillLimit && (
        <DeleteBillLimitDialog
          billLimit={currentBillLimit}
          onOpenChange={setIsDeleteBillLimitDialogOpen}
          open={isDeleteBillLimitDialogOpen}
          onConfirm={handleDeleteBillLimit}
          submitting={submitting}
        />
      )}

      {currentOverhead && (
        <DeleteOverheadDialog
          overhead={currentOverhead}
          onOpenChange={setIsDeleteOverheadDialogOpen}
          open={isDeleteOverheadDialogOpen}
          onConfirm={handleDeleteOverhead}
          submitting={submitting}
        />
      )}
    </div>
  );
};
