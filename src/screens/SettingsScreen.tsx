import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RealmsState, useRealmsStore } from "@/stores/RealmStore";
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

const realmsSelector = (state: RealmsState) => ({
  activeRealm: state.activeRealm,
  updateRealm: state.updateRealm,
  deleteRealm: state.deleteRealm,
  submitting: state.submitting,
});

const UpdateRealmFormSchema = z.object({
  name: z.string().min(2, {
    message: "Please enter a valid realm name.",
  }),
});

export const SettingsScreen: React.FC = () => {
  const { activeRealm, updateRealm, deleteRealm, submitting } = useRealmsStore(
    useShallow(realmsSelector)
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof UpdateRealmFormSchema>>({
    resolver: zodResolver(UpdateRealmFormSchema),
    defaultValues: {
      name: activeRealm?.name || "",
    },
  });

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
              <Button type="submit" disabled={submitting}>
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
          <div className="flex items-center justify-between">
            <span>Enable Bill Limit</span>
            <Switch
              checked={activeRealm.bill_limit_enabled}
              onCheckedChange={handleToggleBillLimit}
              disabled={submitting}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Overhead</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span>Enable Overhead</span>
            <Switch
              checked={activeRealm.overhead_enabled}
              onCheckedChange={handleToggleOverhead}
              disabled={submitting}
            />
          </div>
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
    </div>
  );
};
