"use client";

import {cn} from "@/lib/utils";
import {PaymentHistoryInterface, UserInterface,} from "@/types";
import {ColumnDef} from "@tanstack/react-table";
import {Switch} from "@/components/ui/switch";
import {useAllowAccess} from "@/services/users/hooks";


export const paymentHistoryColumns: ColumnDef<PaymentHistoryInterface>[] = [
  {
    accessorKey: "pack",
    header: "Pack",
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.original.status;
      let badgeClass = "";

      switch (status) {
        case "Succès":
          badgeClass = "bg-green-100 dark:bg-green-500/20 text-green-500";
          break;
        case "Échoué":
          badgeClass =
            "bg-destructive/10 dark:bg-red-500/20 text-destructive dark:text-red-500/80";
          break;
        case "En attente":
          badgeClass = "bg-blue-100 dark:bg-blue-500/20 text-blue-500";
          break;
        default:
          badgeClass = "bg-gray-100 dark:bg-gray-500/20 text-gray-500";
      }

      return (
        <div
          className={`flex w-fit items-center gap-x-1 rounded-full px-2 py-1 text-xs font-medium ${badgeClass}`}
        >
          <div
            className={cn("size-2 rounded-full", {
              "bg-green-500": status === "Succès",
              "bg-destructive dark:bg-red-500/80": status === "Échoué",
              "bg-blue-600": status === "En attente"
            })}
          ></div>
          {status}
        </div>
      );
    },
  },
];

const ActionsCell = ({ row }: { row: { original: UserInterface } }) => {
  const allow_access = useAllowAccess(row.original.id);

  const handleToggle = () => {
    allow_access.mutate();
  };

  return (
    <div className="flex items-center gap-2">
      <Switch checked={row.original.is_active} onCheckedChange={handleToggle} />
    </div>
  );
};

export const usersListColumns: ColumnDef<UserInterface>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "active",
    header: "Active",
    cell: ActionsCell,
  },
];

