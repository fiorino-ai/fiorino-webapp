import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

export const ActivityUsageScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToCost = () => {
    navigate(`/usage`);
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Monthly Spend</h2>
        <Tabs value={"activity"} onValueChange={handleNavigateToCost}>
          <TabsList>
            <TabsTrigger value="cost">Cost</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};
