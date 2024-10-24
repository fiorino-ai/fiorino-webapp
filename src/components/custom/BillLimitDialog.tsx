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
import { BillLimit } from "@/types";

type Props = {
  billLimit?: BillLimit;
  open: boolean;
  submitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Omit<BillLimit, "id">) => Promise<void>;
};

export const BillLimitFormSchema = z.object({
  valid_from: z.string().min(1, { message: "Valid from date is required" }),
  valid_to: z.string().min(1, { message: "Valid to date is required" }),
  amount: z.number().min(0, { message: "Amount must be a positive number" }),
});

export const BillLimitDialog: React.FC<Props> = ({
  billLimit,
  onOpenChange,
  open,
  submitting,
  onSubmit,
}) => {
  const form = useForm<z.infer<typeof BillLimitFormSchema>>({
    resolver: zodResolver(BillLimitFormSchema),
    defaultValues: billLimit || {
      valid_from: "",
      valid_to: "",
      amount: 0,
    },
  });

  function handleSubmit(values: z.infer<typeof BillLimitFormSchema>) {
    onSubmit(values);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{billLimit ? "Edit" : "Create"} Bill Limit</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="valid_from"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valid From</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="valid_to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valid To</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
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
                {billLimit ? "Update" : "Create"} Bill Limit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
