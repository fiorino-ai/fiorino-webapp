"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Check,
  ChevronsUpDown,
  Filter,
  Cpu,
  User,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "use-debounce";
import { Account, LLM, UsageFilter } from "@/types";
import { FilterChip } from "./FilterChip";

type Filter = {
  type: "model" | "account";
  value: string;
};

type Props = {
  isLoadingAccounts: boolean;
  isLoadingModels?: boolean;
  accounts: Account[];
  models?: LLM[];
  onSearchAccountsChange: (search: string) => Promise<void>;
  onSearchModelsChange?: (search: string) => Promise<void>;
  onChange?: (filters: UsageFilter[]) => void;
  filters?: UsageFilter[];
};

export default function AdvancedUsageFilter({
  isLoadingAccounts = false,
  isLoadingModels = false,
  accounts = [],
  models = [],
  onSearchAccountsChange,
  onSearchModelsChange,
  onChange,
  filters = [],
}: Props) {
  const [openModel, setOpenModel] = useState(false);
  const [openAccount, setOpenAccount] = useState(false);

  const [accountQuery, setAccountQuery] = useState("");
  const [accountSearch] = useDebounce(accountQuery, 500);

  useEffect(() => {
    onSearchAccountsChange(accountSearch);
  }, [accountSearch]);

  const addFilter = (type: "model" | "account", id: string, value?: string) => {
    const _values = [
      ...filters.filter((f) => f.type !== type),
      { type, id, value },
    ];

    onChange?.(_values);
  };

  const removeFilter = (type: "model" | "account") => {
    onChange?.(filters.filter((f) => f.type !== type));
  };

  return (
    <div className="flex items-center space-x-2">
      {filters.map((filter) => (
        <FilterChip key={filter.type} filter={filter} onRemove={removeFilter} />
      ))}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Open filter</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="end">
          <Command>
            <CommandList>
              <CommandGroup heading="Filters">
                <Popover open={openModel} onOpenChange={setOpenModel}>
                  <PopoverTrigger asChild>
                    <CommandItem onSelect={() => setOpenModel(true)}>
                      <Cpu className="mr-2 h-4 w-4" />
                      <span>Model</span>
                      <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50" />
                    </CommandItem>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search models..." />
                      <CommandList>
                        <CommandEmpty>
                          {isLoadingModels ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            "No models found."
                          )}
                        </CommandEmpty>
                        <CommandGroup>
                          {models.map((model) => (
                            <CommandItem
                              key={model.llm_model_name}
                              onSelect={() => {
                                addFilter("model", model.llm_model_name);
                                setOpenModel(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  filters.some(
                                    (f) =>
                                      f.type === "model" &&
                                      f.value === model.llm_model_name
                                  )
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {model.llm_model_name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Popover open={openAccount} onOpenChange={setOpenAccount}>
                  <PopoverTrigger asChild>
                    <CommandItem onSelect={() => setOpenAccount(true)}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Account</span>
                      <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50" />
                    </CommandItem>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0" align="start">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Search an account..."
                        value={accountQuery}
                        onValueChange={(search) => setAccountQuery(search)}
                      />
                      <CommandList key={accountQuery}>
                        <CommandEmpty>
                          {isLoadingAccounts ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            "No accounts found."
                          )}
                        </CommandEmpty>
                        <CommandGroup key={accountQuery}>
                          {accounts.map((account, index) => (
                            <CommandItem
                              key={index}
                              onSelect={() => {
                                addFilter(
                                  "account",
                                  account.id,
                                  account.external_id
                                );
                                setOpenAccount(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  filters.some(
                                    (f) =>
                                      f.type === "account" &&
                                      f.id === account.id
                                  )
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {account.external_id}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
