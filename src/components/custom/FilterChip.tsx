import { UsageFilter } from "@/types";
import { Button } from "../ui/button";
import { Cpu, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { RealmDataState, useRealmDataStore } from "@/stores/RealmDataStore";
import { useShallow } from "zustand/react/shallow";
import { RealmsState, useRealmsStore } from "@/stores/RealmStore";

type Props = {
  filter: UsageFilter;
  onRemove: (type: "model" | "account") => void;
};

const realmDataSelector = (state: RealmDataState) => ({
  getAccount: state.getAccount,
});

const realmsSelector = (state: RealmsState) => ({
  activeRealm: state.activeRealm,
});

export const FilterChip: React.FC<Props> = ({ filter, onRemove }) => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<string | undefined>(filter.value);

  const { getAccount } = useRealmDataStore(useShallow(realmDataSelector));
  const { activeRealm } = useRealmsStore(useShallow(realmsSelector));

  const loadValue = async () => {
    setLoading(true);
    try {
      if (filter.type === "account") {
        const account = await getAccount(String(activeRealm?.id), filter.id);
        setValue(account?.external_id);
      }
    } catch (error) {
      console.error("Failed to fetch account", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeRealm?.id && !filter.value) {
      loadValue();
    }
  }, [filter]);

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-8 border-dashed"
      onClick={() => onRemove(filter.type)}
    >
      {filter.type === "model" ? (
        <Cpu className="mr-2 h-4 w-4" />
      ) : (
        <User className="mr-2 h-4 w-4" />
      )}
      {loading ? "Loading..." : value}
      <X className="ml-2 h-4 w-4" />
    </Button>
  );
};
