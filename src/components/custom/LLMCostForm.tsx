"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { LLMCost } from "@/types";

interface Props {
  llmCost?: LLMCost;
  open: boolean;
  submitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<LLMCost>) => Promise<void>;
  onCancel?: () => void;
}

export default function LLMCostForm({
  llmCost,
  open,
  submitting = false,
  onOpenChange,
  onSubmit,
  onCancel,
}: Props) {
  console.log(llmCost);

  const [formData, setFormData] = useState<Partial<LLMCost>>({
    provider_name: "",
    model_name: "",
    price_per_unit: 0,
    unit_type: "1K",
    overhead: 0,
    valid_from: new Date(),
    valid_to: new Date("2099-12-31"),
  });

  const [searchProvider, setSearchProvider] = useState("");
  const [searchModel, setSearchModel] = useState("");

  const [providerOptions, setProviderOptions] = useState([
    "openai",
    "anthropic",
  ]);
  const [modelOptions, setModelOptions] = useState<Record<string, string[]>>({
    openai: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"],
    anthropic: ["claude-3-sonnet-latest", "claude-3-opus-latest"],
    "": [],
  });

  useEffect(() => {
    if (llmCost) {
      setFormData({
        provider_name: llmCost?.provider_name || "",
        model_name: llmCost?.model_name || "",
        price_per_unit: llmCost?.price_per_unit || 0,
        unit_type: llmCost?.unit_type || "1K",
        overhead: (llmCost?.overhead || 0) * 100, // Convert to percentage
        valid_from: llmCost?.valid_from || new Date(),
        valid_to: llmCost?.valid_to || new Date("2099-12-31"),
      });
    }
  }, [llmCost]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "price_per_unit" || name === "overhead") {
      const numValue = parseFloat(value);
      if (numValue < 0) return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "provider_name") {
      setFormData((prev) => ({ ...prev, model_name: "" }));
    }
  };

  const handleDateChange = (name: string, value: Date | undefined) => {
    if (value) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      overhead: parseFloat(formData.overhead?.toString() || "0") / 100,
      price_per_unit: parseFloat(formData.price_per_unit?.toString() || "0"),
    };
    await onSubmit(submissionData);
  };

  const handleCreateOption = (
    inputValue: string,
    type: "provider" | "model"
  ) => {
    if (type === "provider") {
      setProviderOptions((prev) => [...prev, inputValue]);
      handleSelectChange("provider_name", inputValue);
      setModelOptions((prev) => ({ ...prev, [inputValue]: [] }));
    } else if (type === "model") {
      setModelOptions((prev) => ({
        ...prev,
        [String(formData.provider_name)]: [
          ...(prev[String(formData.provider_name)] || []),
          inputValue,
        ],
      }));
      handleSelectChange("model_name", inputValue);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  console.log(formData);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{llmCost ? "Edit" : "Add"} LLM Cost</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="provider_name">Provider Name</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                  disabled={Boolean(llmCost)}
                >
                  {formData.provider_name || "Select provider"}
                  {!llmCost && (
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandList>
                    <CommandInput
                      placeholder="Search provider..."
                      value={searchProvider}
                      onValueChange={setSearchProvider}
                    />
                    <CommandEmpty>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          handleCreateOption(searchProvider, "provider");
                          setSearchProvider("");
                        }}
                      >
                        Create "{searchProvider}"
                      </Button>
                    </CommandEmpty>
                    <CommandGroup key={searchProvider}>
                      {providerOptions.map((option) => (
                        <CommandItem
                          key={option}
                          onSelect={() =>
                            handleSelectChange("provider_name", option)
                          }
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.provider_name === option
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {option}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model_name">LLM Model Name</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                  disabled={Boolean(llmCost)}
                >
                  {formData.model_name || "Select model"}
                  {!llmCost && (
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandList>
                    <CommandInput
                      placeholder="Search model..."
                      value={searchModel}
                      onValueChange={setSearchModel}
                    />
                    <CommandEmpty>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          handleCreateOption(searchModel, "model");
                          setSearchModel("");
                        }}
                      >
                        Create "{searchModel}"
                      </Button>
                    </CommandEmpty>
                    <CommandGroup key={searchModel}>
                      {(modelOptions[String(formData.provider_name)] || []).map(
                        (option) => (
                          <CommandItem
                            key={option}
                            onSelect={() =>
                              handleSelectChange("model_name", option)
                            }
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.model_name === option
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {option}
                          </CommandItem>
                        )
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price_per_unit">Price Per Unit</Label>
            <Input
              type="number"
              step="0.000001"
              min="0"
              name="price_per_unit"
              value={formData.price_per_unit}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit_type">Unit Type</Label>
            <Select
              name="unit_type"
              value={formData.unit_type}
              onValueChange={(value) => handleSelectChange("unit_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1K">1K</SelectItem>
                <SelectItem value="1M">1M</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="overhead">Overhead (%)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              name="overhead"
              value={formData.overhead}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Valid From</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {formData.valid_from
                    ? format(formData.valid_from, "PPP")
                    : "Pick a date"}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.valid_from}
                  onSelect={(date) => handleDateChange("valid_from", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {llmCost ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
