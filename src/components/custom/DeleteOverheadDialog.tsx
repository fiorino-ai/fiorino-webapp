import { Overhead } from "@/types";
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

type Props = {
  overhead: Overhead;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  onConfirm: () => Promise<void>;
  submitting?: boolean;
};

export const DeleteOverheadDialog: React.FC<Props> = ({
  onConfirm,
  onOpenChange,
  open,
  overhead,
  submitting = false,
}) => {
  const isInFuture = new Date(overhead.valid_from) > new Date();

  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isInFuture ? "Delete" : "Close"} Overhead
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isInFuture ? (
              <>
                This will delete the future overhead configuration of{" "}
                <span className="font-semibold">
                  {overhead.percentage * 100}%
                </span>{" "}
                scheduled to start on{" "}
                <span className="font-semibold">
                  {new Date(overhead.valid_from).toLocaleDateString()}
                </span>
                .
                <br />
                <br />
                This action cannot be undone.
              </>
            ) : (
              <>
                This overhead configuration of{" "}
                <span className="font-semibold">
                  {overhead.percentage * 100}%
                </span>{" "}
                is currently active (since{" "}
                <span className="font-semibold">
                  {new Date(overhead.valid_from).toLocaleDateString()}
                </span>
                ).
                <br />
                <br />
                Instead of deleting it, this action will set its end date to the
                current date.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={submitting}
          >
            {isInFuture ? "Delete" : "Close"} Overhead
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
