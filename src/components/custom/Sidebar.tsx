import { useState } from "react";
import { Button } from "../ui/button";
import { BarChart2, LayoutDashboard } from "lucide-react";

export const Sidebar: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <aside
      className={`p-2 overflow-hidden transition-all duration-300 ${
        isSidebarCollapsed ? "w-16" : "w-52"
      }`}
    >
      <nav className="space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={toggleSidebar}
        >
          <LayoutDashboard className="h-5 w-5 mr-2" />
          {!isSidebarCollapsed && <span>Overview</span>}
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <BarChart2 className="h-5 w-5 mr-2" />
          {!isSidebarCollapsed && <span>Usage</span>}
        </Button>
        {/* <Button variant="ghost" className="w-full justify-start">
      <Users className="h-5 w-5 mr-2" />
      {!isSidebarCollapsed && <span>Users</span>}
    </Button> */}
      </nav>
    </aside>
  );
};
