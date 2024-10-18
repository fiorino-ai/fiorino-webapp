import { Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "./MainLayout";
import { CostUsageScreen } from "./CostUsageScreen";
import { ActivityUsageScreen } from "./ActivityUsageScreen";

const RedirectToMainPage: React.FC = () => {
  return <Navigate to={`/usage`} />;
};

export const Navigation: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<RedirectToMainPage />} />
          <Route path="/usage" element={<CostUsageScreen />} />
          <Route path="/usage/activity" element={<ActivityUsageScreen />} />
        </Route>
      </Routes>
    </div>
  );
};
