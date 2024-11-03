import { LLMCost } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Label } from "../ui/label";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";

type Props = {
  llmCost: LLMCost;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  onConfirm: (reopenPreviousPrice: boolean) => Promise<void>;
  submitting?: boolean;
};

export const DeleteLLMCostDialog: React.FC<Props> = ({
  onConfirm,
  onOpenChange,
  open,
  llmCost,
  submitting = false,
}) => {
  const [reopenPreviousPrice, setReopenPreviousPrice] = useState(false);
  const hasPreviousPrice = llmCost.history.length > 1;

  const handleConfirm = async () => {
    await onConfirm(reopenPreviousPrice);
  };

  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete LLM Cost</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete the current price configuration for{" "}
            <span className="font-semibold">{llmCost.model_name}</span> from{" "}
            <span className="font-semibold">{llmCost.provider_name}</span>.
            {hasPreviousPrice && (
              <>
                <br />
                <br />
                There is a previous price configuration available:
                <br />
                Price: ${llmCost.history[1].price_per_unit}/
                {llmCost.history[1].unit_type}
                <br />
                Overhead: {(llmCost.history[1].overhead * 100).toFixed(2)}%
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {hasPreviousPrice && (
          <div className="flex items-center space-x-2 py-4">
            <Checkbox
              id="reopen"
              checked={reopenPreviousPrice}
              onCheckedChange={(checked) => setReopenPreviousPrice(!!checked)}
            />
            <Label htmlFor="reopen">
              Reactivate previous price configuration
            </Label>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={submitting}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
