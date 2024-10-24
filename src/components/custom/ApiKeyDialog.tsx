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
import { NewApiKey } from "@/types";

type Props = {
  open: boolean;
  submitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: NewApiKey) => Promise<void>;
};

export const ApiKeyFormSchema = z.object({
  name: z.string().min(2, {
    message: "please enter vaild name.",
  }),
});

export const ApiKeyDialog: React.FC<Props> = ({
  onOpenChange,
  open,
  submitting,
  onSubmit,
}) => {
  const form = useForm<z.infer<typeof ApiKeyFormSchema>>({
    resolver: zodResolver(ApiKeyFormSchema),
    defaultValues: {
      name: "",
    },
  });

  function handleSubmit(values: z.infer<typeof ApiKeyFormSchema>) {
    onSubmit(values as NewApiKey);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new secret key</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600 mb-2">
          An API key is a unique identifier used to authenticate requests
          associated with your project. You can use it to track and control how
          the API is being used. Please provide a name for your new API key.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid gap-1"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder={"My test key"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                Create secret key
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
