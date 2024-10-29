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
import { ApiKey, NewApiKey, EditedApiKey, Account } from "@/types";
import { Check, Edit, Pencil, Plus, Trash, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  const PAGE_LIMIT = 2;

  const { activeRealm } = useRealmsStore(useShallow(realmsSelector));
  const {
    accounts,
    fetchAccounts,
    loading,
    deleteAccount,
    updateAccount,
    page,
    pages,
    total,
  } = useRealmDataStore(useShallow(realmDataSelector));

  // const [accounts, setAccounts] = useState(mockAccounts);
  const [searchTerm, setSearchTerm] = useState("");
  const [search] = useDebounce(searchTerm, 500);

  // const filteredAccounts = accounts.filter(
  //   (account) =>
  //     account.external_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     Object.values(account.data).some((value) =>
  //       value.toString().toLowerCase().includes(searchTerm.toLowerCase())
  //     )
  // );

  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentAccounts = filteredAccounts.slice(
  //   indexOfFirstItem,
  //   indexOfLastItem
  // );

  // const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);

  const handleDelete = (id: Account["id"]) => {
    // setAccounts(accounts.filter((account) => account.id !== id));
  };

  const handleEdit = (id: Account["id"]) => {
    // Implement edit functionality
    console.log("Edit account", id);
  };

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

  // const handleDelete = async () => {
  //   if (!currentApiKey || !activeRealm) return;

  //   await deleteApiKey(activeRealm.id, currentApiKey.id);
  //   setIsDeleteDialogOpen(false);
  //   setCurrentApiKey(null);
  // };

  // const handleOnDeleteClick = (apiKey: ApiKey) => {
  //   setCurrentApiKey(apiKey);
  //   setIsDeleteDialogOpen(true);
  // };

  // const handleEdit = (apiKey: ApiKey) => {
  //   setEditingApiKey(apiKey);
  //   setIsEditDialogOpen(true);
  // };

  // const handleEditSubmit = async (values: EditedApiKey) => {
  //   if (!activeRealm || !editingApiKey) return;

  //   await updateApiKey(activeRealm.id, editingApiKey.id, values);
  //   setIsEditDialogOpen(false);
  //   setEditingApiKey(null);
  //   // Optionally, you can refresh the API keys list here
  //   // await fetchApiKeys(activeRealm.id);
  // };

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

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
                  </Button>
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
