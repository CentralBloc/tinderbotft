import {ColumnDef} from "@tanstack/react-table";
import Link from "next/link";
import {EditableProxyCell} from "@/components/tables/proxy/proxy-columns";
import {EditableThreadStrategyCell} from "@/components/tables/insta-strat/insta-strat-columns";
import {ModelCell} from "@/components/tables/modele/model-columns";
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Check, ChevronsUpDown, Eye, MoreHorizontal, PencilLine, RefreshCw, Trash} from "lucide-react";
import {useDeleteThreadAccount, useSyncThreadAccount, useUpdateThreadAccount} from "@/services/threads/account/hooks";
import {toast} from "@/components/ui/use-toast";
import {routes} from "@/lib/routes";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {useEffect, useMemo, useState} from "react";
import {ThreadAccountInterface, ThreadStrategyInterface} from "@/types";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Command} from "cmdk";
import {CommandEmpty, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {cn} from "@/lib/utils";
import {useThreadStrats} from "@/services/threads/strategy/hooks";

export const EditableProgressCell = ({row}: { row: { original: ThreadAccountInterface }; }) => {
  const {data: strategies = []} = useThreadStrats();
  const updateMutation = useUpdateThreadAccount(row.original.id);
  const [daysNumber, setDaysNumber] = useState<number[]>([]);

  // Add strategy as memoized value to prevent unnecessary recalculations
  const currentStrategy = useMemo(() => {
    const strategyId = row.original.strategy
      ? typeof row.original.strategy === "object"
        ? row.original.strategy.id
        : row.original.strategy
      : undefined;

    return strategies.find((strategy: ThreadStrategyInterface) => strategy.id === strategyId);
  }, [row.original.strategy, strategies]);

  // Update daysNumber only when currentStrategy changes
  useEffect(() => {
    if (currentStrategy) {
      setDaysNumber(
        Array.from({length: currentStrategy.days_number}, (_, i) => i + 1)
      );
    } else {
      setDaysNumber([]);
    }
  }, [currentStrategy]);

  const handleProgressChange = (newProgress: string) => {
    updateMutation.mutate({progress: parseInt(newProgress, 10)});
  };

  if (daysNumber.length === 0) {
    return <div>{row.original.day_progress}</div>;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {row.original.day_progress
            ? `Day ${row.original.day_progress}`
            : "Select Progress"}
          <ChevronsUpDown className="ml-2 size-4 opacity-50"/>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search progress day..."/>
          <CommandList>
            <CommandEmpty>No days found.</CommandEmpty>
            {daysNumber.map((day) => (
              <CommandItem
                key={day}
                value={day.toString()}
                onSelect={() => handleProgressChange(day.toString())}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    row.original.day_progress === day ? "opacity-100" : "opacity-0",
                  )}
                />
                {day}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};


export const ThreadAccountActionsCell = ({row}: { row: { original: any } }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteMutation = useDeleteThreadAccount(row.original.id);
  const syncMutation = useSyncThreadAccount(row.original.id);

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(undefined, {
      onSuccess: () => {
        toast({title: "Account deleted successfully"});
        setShowDeleteDialog(false);
      },
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "An error occurred",
          description: error.response?.data?.error || "Failed to delete account"
        });
      }
    });
  };

  const handleSync = async () => {
    await syncMutation.mutateAsync(undefined, {
      onSuccess: () => {
        toast({title: "Account synced successfully"});
      },
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "An error occurred",
          description: error.response?.data?.error || "Failed to sync account"
        });
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className="size-4"/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={routes.dashboard.insta.view(row.original.id)}>
              <Eye className="mr-2 size-4"/>
              View
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={routes.dashboard.insta.update(row.original.id)}>
              <PencilLine className="mr-2 size-4"/>
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSync} disabled={syncMutation.isPending}>
            <RefreshCw className="mr-2 size-4"/>
            Sync
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600"
          >
            <Trash className="mr-2 size-4"/>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const instaListColumns: ColumnDef<any>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "modele",
    header: "Model",
    cell: ModelCell,
  },
  {
    accessorKey: "day_progress",
    header: "Progress",
    cell: ({row}) => <EditableProgressCell row={row}/>,
  },
  {
    accessorKey: "status",
    header: "Status",
  },

  {
    accessorKey: "strategy",
    header: "Strategy",
    cell: ({row}) => <EditableThreadStrategyCell row={row}/>,
  },
  {
    accessorKey: "proxy",
    header: "Proxy",
    cell: ({row}) => <EditableProxyCell row={row} view="thread"/>, // Utilisation de la cellule modifiable
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({row}) => <ThreadAccountActionsCell row={row}/>,
  }
];
