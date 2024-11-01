"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

export default function LLMCostForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    provider_name: "",
    llm_model_name: "",
    price_per_unit: 0,
    unit_type: "1K",
    overhead: 0,
    valid_from: new Date(),
    valid_to: new Date("2099-12-31"),
  });

  const [providerOptions, setProviderOptions] = useState([
    "openai",
    "anthropic",
  ]);
  const [modelOptions, setModelOptions] = useState({
    openai: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"],
    anthropic: ["claude-3-sonnet-latest", "claude-3-opus-latest"],
    "": [], // Add an empty array for when no provider is selected
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "price_per_unit" || name === "overhead") {
      const numValue = parseFloat(value);
      if (numValue < 0) return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "provider_name") {
      setFormData((prev) => ({ ...prev, llm_model_name: "" }));
    }
  };

  const handleDateChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      overhead: parseFloat(formData.overhead) / 100,
      price_per_unit: parseFloat(formData.price_per_unit),
    };
    console.log("Form submitted:", submissionData);
    setIsOpen(false);
  };

  const handleCreateOption = (inputValue, type) => {
    if (type === "provider") {
      setProviderOptions((prev) => [...prev, inputValue]);
      handleSelectChange("provider_name", inputValue);
      setModelOptions((prev) => ({ ...prev, [inputValue]: [] }));
    } else if (type === "model") {
      setModelOptions((prev) => ({
        ...prev,
        [formData.provider_name]: [
          ...(prev[formData.provider_name] || []),
          inputValue,
        ],
      }));
      handleSelectChange("llm_model_name", inputValue);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add/Edit LLM Cost</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add/Edit LLM Cost</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="provider_name">Provider Name</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isOpen}
                  className="w-full justify-between"
                >
                  {formData.provider_name || "Select provider"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandList>
                    <CommandInput placeholder="Search provider..." />
                    <CommandEmpty>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() =>
                          handleCreateOption(formData.provider_name, "provider")
                        }
                      >
                        Create "{formData.provider_name}"
                      </Button>
                    </CommandEmpty>
                    <CommandGroup>
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
            <Label htmlFor="llm_model_name">LLM Model Name</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isOpen}
                  className="w-full justify-between"
                >
                  {formData.llm_model_name || "Select model"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandList>
                    <CommandInput placeholder="Search model..." />
                    <CommandEmpty>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() =>
                          handleCreateOption(formData.llm_model_name, "model")
                        }
                      >
                        Create "{formData.llm_model_name}"
                      </Button>
                    </CommandEmpty>
                    <CommandGroup>
                      {(modelOptions[formData.provider_name] || []).map(
                        (option) => (
                          <CommandItem
                            key={option}
                            onSelect={() =>
                              handleSelectChange("llm_model_name", option)
                            }
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.llm_model_name === option
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

          <div className="space-y-2">
            <Label>Valid To</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {formData.valid_to
                    ? format(formData.valid_to, "PPP")
                    : "Pick a date"}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.valid_to}
                  onSelect={(date) => handleDateChange("valid_to", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
