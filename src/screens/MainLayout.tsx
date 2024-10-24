import { Header } from "@/components/custom/Header";
import { Link, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart2,
  ChevronsUpDown,
  Lock,
  LogOut,
  PanelLeft,
  Plus,
  Webhook,
} from "lucide-react";
import { useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RealmsState, useRealmsStore } from "@/stores/RealmStore";
import Loading from "@/components/custom/Loading";
import { SessionState, useAuthStore } from "@/stores/SessionStore";
import { WelcomeScreen } from "./WelcomeScreen";
import { RealmDataState, useRealmDataStore } from "@/stores/RealmDataStore";
import { useShallow } from "zustand/react/shallow";
import { useState } from "react";
import { AddRealmDialog } from "@/components/custom/AddRealmDialog";
import { Realm } from "@/types";

const sessionSelector = (state: SessionState) => ({
  user: state.user,
  logout: state.logout,
});

const realmsSelector = (state: RealmsState) => ({
  realms: state.realms,
  fetchRealms: state.fetchRealms,
  loading: state.loading,
  activeRealm: state.activeRealm,
  setActiveRealm: state.setActiveRealm,
  createRealm: state.createRealm,
  submitting: state.submitting,
});

const realmDataSelector = (state: RealmDataState) => ({
  reset: state.reset,
});

// const MemoizedOutlet = memo(Outlet);

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const {
    realms,
    fetchRealms,
    loading: realmsLoading,
    activeRealm,
    setActiveRealm,
    createRealm,
    submitting,
  } = useRealmsStore(useShallow(realmsSelector));
  const { user, logout } = useAuthStore(useShallow(sessionSelector));
  const { reset } = useRealmDataStore(useShallow(realmDataSelector));
  const [isAddRealmDialogOpen, setIsAddRealmDialogOpen] = useState(false);

  useEffect(() => {
    const fetchAndSetRealms = async () => {
      await fetchRealms();
      const { realms } = useRealmsStore.getState();
      if (realms.length > 0) {
        setActiveRealm(realms[0]);
      }
    };

    fetchAndSetRealms();
  }, []);

  useEffect(() => {
    if (activeRealm) {
      reset();
    }
  }, [activeRealm]);

  const handleAddRealm = async (values: Pick<Realm, "name">) => {
    try {
      const newRealm = await createRealm(values);
      if (newRealm) {
        setIsAddRealmDialogOpen(false);
        setActiveRealm(newRealm);
      }
    } catch (error) {
      console.error("Failed to create realm", error);
      // Optionally, you can show an error message to the user
    }
  };

  if (realmsLoading) {
    return <Loading />;
  }

  if (!activeRealm) {
    return <WelcomeScreen />;
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <Webhook className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {activeRealm?.name}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Realms
                  </DropdownMenuLabel>
                  {realms.map((realm) => (
                    <DropdownMenuItem
                      key={realm.id}
                      onClick={() => setActiveRealm(realm)}
                      className="gap-2 p-2"
                    >
                      <div className="flex size-6 items-center justify-center rounded-sm border">
                        <Webhook className="size-4 shrink-0" />
                      </div>
                      {realm.name}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="gap-2 p-2"
                    onClick={() => setIsAddRealmDialogOpen(true)}
                  >
                    <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                      <Plus className="size-4" />
                    </div>
                    <div className="font-medium text-muted-foreground">
                      Add realm
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel className="cursor-pointer">
              <PanelLeft className="size-2 mr-2" /> Overview
            </SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={"usage"}>
                    <BarChart2 />
                    <span>Usage</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={"api-keys"}>
                    <Lock />
                    <span>API keys</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarFallback className="rounded-lg">
                          {user.email.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user.email.split("@")[0]}
                        </span>
                        <span className="truncate text-xs">{user.email}</span>
                      </div>
                      <ChevronsUpDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    side="bottom"
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarFallback className="rounded-lg">
                            {user.email.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {user.email.split("@")[0]}
                          </span>
                          <span className="truncate text-xs">{user.email}</span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={logout}
                    >
                      <LogOut />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        {/* <SidebarRail /> */}
      </Sidebar>
      <SidebarInset>
        {/* <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">HEADER</div>
        </header> */}
        <main className="flex-1 p-6 overflow-auto bg-card border mb-1 rounded-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* <MemoizedOutlet /> */}
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </SidebarInset>
      <AddRealmDialog
        open={isAddRealmDialogOpen}
        submitting={submitting}
        onOpenChange={setIsAddRealmDialogOpen}
        onSubmit={handleAddRealm}
      />
    </SidebarProvider>
  );

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto bg-card border mb-1 rounded-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
