import { BillLimit } from "@/types";
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
  billLimit: BillLimit;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  onConfirm: (reopenPreviousPrice: boolean) => Promise<void>;
  submitting?: boolean;
};

export const DeleteBillLimitDialog: React.FC<Props> = ({
  onConfirm,
  onOpenChange,
  open,
  billLimit,
  submitting = false,
}) => {
  const [reopenPreviousPrice, setReopenPreviousPrice] = useState(false);
  const hasPreviousPrice = billLimit.history.length > 1;

  const handleConfirm = async () => {
    await onConfirm(reopenPreviousPrice);
  };

  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Bill Limit</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete the current bill limit configuration of{" "}
            <span className="font-semibold">${billLimit.amount}</span>.
            {hasPreviousPrice && (
              <>
                <br />
                <br />
                There is a previous bill limit configuration available:
                <br />
                Amount: ${billLimit.history[1].amount}
                <br />
                Valid from:{" "}
                {new Date(billLimit.history[1].valid_from).toLocaleDateString()}
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
              Reactivate previous bill limit configuration
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
