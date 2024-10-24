import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
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
} from "../ui/form";
import { Realm } from "@/types";

type Props = {
  open: boolean;
  submitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Pick<Realm, "name">) => Promise<void>;
};

export const AddRealmFormSchema = z.object({
  name: z.string().min(2, {
    message: "Please enter a valid realm name.",
  }),
});

export const AddRealmDialog: React.FC<Props> = ({
  onOpenChange,
  open,
  submitting,
  onSubmit,
}) => {
  const form = useForm<z.infer<typeof AddRealmFormSchema>>({
    resolver: zodResolver(AddRealmFormSchema),
    defaultValues: {
      name: "",
    },
  });

  function handleSubmit(values: z.infer<typeof AddRealmFormSchema>) {
    onSubmit(values);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new realm</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600 mb-2">
          A realm is a unique space for your project. Please provide a name for
          your new realm.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My new realm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                Create realm
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
