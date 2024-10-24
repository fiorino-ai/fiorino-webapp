import { ApiKey } from "@/types";
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
import { Input } from "../ui/input";

type Props = {
  apiKey: ApiKey;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  onConfirm: () => void;
};

export const DeleteApiKeyDialog: React.FC<Props> = ({
  onConfirm,
  onOpenChange,
  open,
  apiKey,
}) => {
  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke secret key</AlertDialogTitle>
          <AlertDialogDescription>
            This API key will immediately be deleted. API requests made using
            this key will be rejected. Once revoked, you'll no longer be able to
            view or modify this API key.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Input type="text" value={apiKey.masked} disabled />

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Revoke</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
