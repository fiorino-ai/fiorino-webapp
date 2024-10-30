import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RealmDataState, useRealmDataStore } from "@/stores/RealmDataStore";
import { RealmsState, useRealmsStore } from "@/stores/RealmStore";
import { ChartNoAxesColumn, ChartPie } from "lucide-react";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useNavigate } from "react-router-dom";

const realmDataSelector = (state: RealmDataState) => ({
  accounts: state.accounts,
  fetchAccounts: state.fetchAccounts,
  deleteAccount: state.deleteAccount,
  updateAccount: state.updateAccount,
  page: state.accountsPage,
  pages: state.accountsPages,
  total: state.accountsTotal,
  loading: state.accountsLoading,
});

const realmsSelector = (state: RealmsState) => ({
  activeRealm: state.activeRealm,
});

export const AccountsScreen: React.FC = () => {
  const PAGE_LIMIT = 25;
  const navigate = useNavigate();

  const { activeRealm } = useRealmsStore(useShallow(realmsSelector));
  const { accounts, fetchAccounts, loading, page, pages } = useRealmDataStore(
    useShallow(realmDataSelector)
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [search] = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (activeRealm?.id && !loading) {
      fetchAccounts(activeRealm.id, { limit: PAGE_LIMIT });
    }
  }, []);

  useEffect(() => {
    if (activeRealm?.id) {
      fetchAccounts(activeRealm.id, { search, limit: PAGE_LIMIT });
    }
  }, [search]);

  const handlePageChange = (page: number) => {
    if (!activeRealm?.id) return;

    fetchAccounts(activeRealm.id, { page, limit: PAGE_LIMIT });
  };

  const handleNavigateToCostKPI = (accountId: string) => {
    navigate(`/realms/usage?accountId=${accountId}`);
  };

  const handleNavigateToActivityKPI = (accountId: string) => {
    navigate(`/realms/usage/activity?accountId=${accountId}`);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold mb-2">Account Management</h2>
      </div>
      <div className="mb-4 flex justify-between items-center">
        <Input
          placeholder="Search accounts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        {/* <Select onValueChange={handleColumnSelect}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Add column" />
          </SelectTrigger>
          <SelectContent>
            {availableColumns.map((column) => (
              <SelectItem key={column} value={column}>
                {column}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>External ID</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell>{account.external_id}</TableCell>
              <TableCell>
                {new Date(account.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleNavigateToCostKPI(account.id)}
                  >
                    <ChartPie className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleNavigateToActivityKPI(account.id)}
                  >
                    <ChartNoAxesColumn className="h-4 w-4" />
                  </Button>
                  {/* <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(account.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(account.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button> */}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  !loading && handlePageChange(Math.max(page - 1, 1))
                }
              />
            </PaginationItem>
            {Array.from({ length: pages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => !loading && handlePageChange(i + 1)}
                  isActive={page === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  !loading && handlePageChange(Math.min(page + 1, pages))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* <ApiKeyDialog
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        open={isDialogOpen}
        submitting={submitting}
      />

      {newApiKey && (
        <SaveApiKeyDialog
          apiKey={newApiKey}
          open={Boolean(true)}
          onOpenChange={() => setNewApiKey(null)}
        />
      )}
      {currentApiKey && (
        <DeleteApiKeyDialog
          open={isDeleteDialogOpen}
          onOpenChange={() => {
            setCurrentApiKey(null);
            setIsDeleteDialogOpen(false);
          }}
          apiKey={currentApiKey}
          onConfirm={handleDelete}
        />
      )}
      {editingApiKey && (
        <EditApiKeyDialog
          apiKey={editingApiKey}
          open={isEditDialogOpen}
          onOpenChange={() => {
            setEditingApiKey(null);
            setIsEditDialogOpen(false);
          }}
          submitting={submitting}
          onSubmit={handleEditSubmit}
        />
      )} */}
    </>
  );
};
