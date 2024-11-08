import { useState } from "react";
import { ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BillLimit } from "@/types";

interface ExpandableRowProps {
  data: BillLimit;
  onEdit: (billLimit: BillLimit) => void;
  onDelete: (billLimit: BillLimit) => void;
}

const ExpandableRow: React.FC<ExpandableRowProps> = ({
  data,
  onEdit,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </TableCell>
        <TableCell>${data.amount.toFixed(2)}</TableCell>
        <TableCell>{new Date(data.valid_from).toLocaleDateString()}</TableCell>
        <TableCell>
          {data.valid_to ? new Date(data.valid_to).toLocaleDateString() : "-"}
        </TableCell>
        <TableCell>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(data)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(data)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={5}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Amount</TableHead>
                  <TableHead>Valid From</TableHead>
                  <TableHead>Valid To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.history.map((historyItem) => (
                  <TableRow key={historyItem.id}>
                    <TableCell>${historyItem.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(historyItem.valid_from).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {historyItem.valid_to
                        ? new Date(historyItem.valid_to).toLocaleDateString()
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

interface Props {
  billLimits: BillLimit;
  onEdit: (billLimit: BillLimit) => void;
  onDelete: (billLimit: BillLimit) => void;
}

export const BillLimitsTable: React.FC<Props> = ({
  billLimits,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Valid From</TableHead>
            <TableHead>Valid To</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <ExpandableRow
            key={billLimits.id}
            data={billLimits}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </TableBody>
      </Table>
    </div>
  );
};