"use client";

import { usersListColumns } from "@/components/tables/columns";
import { DataTable } from "@/components/ui/data-table";
import { useUsers } from "@/services/users/hooks";

export default function UsersList() {
  const { data: users = [], isLoading, isError } = useUsers();
  return (
    <div className="space-y-3">
      <h1 className="font-heading">Users list</h1>
      <DataTable columns={usersListColumns} data={users ?? []} />
    </div>
  );
}
