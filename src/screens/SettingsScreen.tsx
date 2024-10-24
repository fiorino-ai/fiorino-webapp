import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BillLimitDialog } from "@/components/custom/BillLimitDialog";
import { OverheadDialog } from "@/components/custom/OverheadDialog";
import { BillLimit, Overhead } from "@/types";
import { Pencil, Plus, Trash } from "lucide-react";

const realmsSelector = (state: RealmsState) => ({
  activeRealm: state.activeRealm,
  updateRealm: state.updateRealm,
  deleteRealm: state.deleteRealm,
  submitting: state.submitting,
});

const realmDataSelector = (state: RealmDataState) => ({
  billLimits: state.billLimits,
  overheads: state.overheads,
  fetchBillLimits: state.fetchBillLimits,
  fetchOverheads: state.fetchOverheads,
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

export const SettingsScreen: React.FC = () => {
  const {
    activeRealm,
    updateRealm,
    deleteRealm,
    submitting: realmSubmitting,
  } = useRealmsStore(useShallow(realmsSelector));
  const {
    billLimits,
    overheads,
    fetchBillLimits,
    fetchOverheads,
    createBillLimit,
    updateBillLimit,
    deleteBillLimit,
    createOverhead,
    updateOverhead,
    deleteOverhead,
    loading,
    submitting,
  } = useRealmDataStore(useShallow(realmDataSelector));

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBillLimitDialogOpen, setIsBillLimitDialogOpen] = useState(false);
  const [isOverheadDialogOpen, setIsOverheadDialogOpen] = useState(false);
  const [currentBillLimit, setCurrentBillLimit] = useState<BillLimit | null>(
    null
  );
  const [currentOverhead, setCurrentOverhead] = useState<Overhead | null>(null);

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
        fetchOverheads(activeRealm.id);
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

  const handleBillLimitSubmit = async (values: Omit<BillLimit, "id">) => {
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

  const handleDeleteBillLimit = async (billLimitId: string) => {
    if (activeRealm) {
      await deleteBillLimit(activeRealm.id, billLimitId);
      fetchBillLimits(activeRealm.id);
    }
  };

  const handleOverheadSubmit = async (values: Omit<Overhead, "id">) => {
    if (activeRealm) {
      if (currentOverhead) {
        await updateOverhead(activeRealm.id, currentOverhead.id!, values);
      } else {
        await createOverhead(activeRealm.id, values);
      }
      setIsOverheadDialogOpen(false);
      setCurrentOverhead(null);
      fetchOverheads(activeRealm.id);
    }
  };

  const handleDeleteOverhead = async (overheadId: string) => {
    if (activeRealm) {
      await deleteOverhead(activeRealm.id, overheadId);
      fetchOverheads(activeRealm.id);
    }
  };

  if (!activeRealm) {
    return <div>No active realm selected.</div>;
  }

  return (
    <div className="flex flex-col items-center space-y-6 max-w-md mx-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Update Realm Name</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Bill Limit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span>Enable Bill Limit</span>
            <Switch
              checked={activeRealm.bill_limit_enabled}
              onCheckedChange={handleToggleBillLimit}
              disabled={realmSubmitting}
            />
          </div>
          {activeRealm.bill_limit_enabled && (
            <>
              <Button
                onClick={() => setIsBillLimitDialogOpen(true)}
                className="mb-4"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Bill Limit
              </Button>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Valid From</TableHead>
                    <TableHead>Valid To</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billLimits.map((billLimit) => (
                    <TableRow key={billLimit.id}>
                      <TableCell>
                        {new Date(billLimit.valid_from).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(billLimit.valid_to).toLocaleDateString()}
                      </TableCell>
                      <TableCell>${billLimit.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCurrentBillLimit(billLimit);
                            setIsBillLimitDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBillLimit(billLimit.id!)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Overhead</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span>Enable Overhead</span>
            <Switch
              checked={activeRealm.overhead_enabled}
              onCheckedChange={handleToggleOverhead}
              disabled={realmSubmitting}
            />
          </div>
          {activeRealm.overhead_enabled && (
            <>
              <Button
                onClick={() => setIsOverheadDialogOpen(true)}
                className="mb-4"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Overhead
              </Button>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Valid From</TableHead>
                    <TableHead>Valid To</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overheads.map((overhead) => (
                    <TableRow key={overhead.id}>
                      <TableCell>
                        {new Date(overhead.valid_from).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(overhead.valid_to).toLocaleDateString()}
                      </TableCell>
                      <TableCell>${overhead.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCurrentOverhead(overhead);
                            setIsOverheadDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteOverhead(overhead.id!)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Realm</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your realm and remove all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteRealm}>
                  Delete Realm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

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
    </div>
  );
};
