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
import { Overhead } from "@/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, max } from "date-fns";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

type Props = {
  overhead?: Overhead;
  open: boolean;
  submitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Partial<Overhead>) => Promise<void>;
};

export const OverheadFormSchema = z.object({
  id: z.string().optional(),
  valid_from: z.date(),
  percentage: z
    .number()
    .min(0, { message: "Percentage must be positive" })
    .max(100, { message: "Percentage cannot exceed 100%" }),
});

export const OverheadDialog: React.FC<Props> = ({
  overhead,
  onOpenChange,
  open,
  submitting,
  onSubmit,
}) => {
  const form = useForm<z.infer<typeof OverheadFormSchema>>({
    resolver: zodResolver(OverheadFormSchema),
    defaultValues: {
      id: overhead?.id,
      valid_from: overhead?.valid_from || new Date(),
      percentage: overhead ? overhead.percentage * 100 : 0,
    },
  });

  useEffect(() => {
    form.reset({
      id: overhead?.id,
      valid_from: overhead
        ? max([overhead?.valid_to || new Date(), new Date()])
        : new Date(),
      percentage: overhead ? overhead.percentage * 100 : 0,
    });
  }, [overhead, form.reset]);

  async function handleSubmit(values: z.infer<typeof OverheadFormSchema>) {
    await onSubmit({
      id: values.id,
      valid_from: overhead
        ? max([overhead?.valid_to || new Date(), new Date()])
        : new Date(),
      percentage: values.percentage / 100, // Convert percentage to decimal
    });
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{overhead ? "Edit" : "Create"} Overhead</DialogTitle>
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
                <FormItem className="flex flex-col">
                  <FormLabel>Valid From</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        fromDate={
                          overhead
                            ? max([
                                overhead?.valid_to || new Date(),
                                new Date(),
                              ])
                            : new Date()
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Percentage (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      placeholder="Enter percentage"
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
                {overhead ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
