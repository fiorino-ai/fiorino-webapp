"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Edit, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { LLMCost } from "@/types";

const formatPrice = (price: number | null, unitType: string | null) => {
  if (price === null) return "N/A";
  return `$${price.toFixed(4)}/${unitType || "unit"}`;
};

const formatOverhead = (overhead: number | null) => {
  if (overhead === null) return "N/A";
  return `${(overhead * 100).toFixed(2)}%`;
};

const formatDate = (date: Date | null) => {
  if (date === null) return "N/A";
  return date.toLocaleDateString();
};

const ExpandableRow = ({
  data,
  onEdit,
  onDelete,
}: {
  data: LLMCost;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
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
        <TableCell>{data.provider_name}</TableCell>
        <TableCell>{data.model_name}</TableCell>
        <TableCell>
          {formatPrice(data.price_per_unit, data.unit_type)}
        </TableCell>
        <TableCell>{formatOverhead(data.overhead)}</TableCell>
        <TableCell>{formatDate(data.valid_from)}</TableCell>
        <TableCell>{formatDate(data.valid_to)}</TableCell>
        <TableCell>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(data.id)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(data.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow className="bg-gray-900">
          <TableCell colSpan={8}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Overhead</TableHead>
                  <TableHead>Valid From</TableHead>
                  <TableHead>Valid To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.history.map((historyItem, index) => (
                  <TableRow key={index}>
                    <TableCell>{data.provider_name}</TableCell>
                    <TableCell>{data.model_name}</TableCell>
                    <TableCell>
                      {formatPrice(
                        historyItem.price_per_unit,
                        historyItem.unit_type
                      )}
                    </TableCell>
                    <TableCell>
                      {formatOverhead(historyItem.overhead)}
                    </TableCell>
                    <TableCell>{formatDate(historyItem.valid_from)}</TableCell>
                    <TableCell>{formatDate(historyItem.valid_to)}</TableCell>
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

type Props = {
  llmCosts: LLMCost[];
};

export const LLMCostsTable: React.FC<Props> = ({ llmCosts }) => {
  const handleEdit = (id: string) => {
    // Implement edit functionality here
    console.log(`Editing row with id: ${id}`);
  };

  const handleDelete = (id: string) => {
    // Implement delete functionality here
    // setSampleData((prevData) => prevData.filter((item) => item.id !== id));
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Overhead</TableHead>
            <TableHead>Valid From</TableHead>
            <TableHead>Valid To</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {llmCosts.map((item) => (
            <ExpandableRow
              key={item.id}
              data={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
