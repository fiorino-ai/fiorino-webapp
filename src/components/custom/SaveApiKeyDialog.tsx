import { Check, Copy } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { ApiKey } from "@/types";
import { useState } from "react";

type Props = {
  apiKey: ApiKey;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const SaveApiKeyDialog: React.FC<Props> = ({
  onOpenChange,
  open,
  apiKey,
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleCopyClick = () => {
    copyToClipboard(String(apiKey.value));
    setCopied(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save your key</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600 mb-2">
          Please, make sure to store this secret key securely as it will not be
          visible again.
        </p>

        <div className="flex flex-row gap-2">
          <Input type="text" value={apiKey.value} disabled />

          <Button onClick={handleCopyClick} className="w-28">
            {copied ? <Check /> : <Copy />}
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
