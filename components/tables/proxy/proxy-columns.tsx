import {ProxyInterface, StrategyInterface} from "@/types";
import {useState} from "react";
import {useProxies, useRemoveProxy} from "@/services/proxy/hooks";
import Link from "next/link";
import {routes} from "@/lib/routes";
import {Check, ChevronsUpDown, PencilLine, Trash2} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {VisuallyHidden} from "react-aria";
import {Button} from "@/components/ui/button";
import {ColumnDef} from "@tanstack/react-table";
import {useUpdateStrategy} from "@/services/strategy/hooks";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Command, CommandEmpty, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {cn} from "@/lib/utils";

const ProxyCell = ({ proxyId }: { proxyId: string | undefined }) => {
    const { data: proxies = [] } = useProxies();
    const proxy = proxies.find((proxy) => proxy.id === proxyId);
    return <div>{proxy ? proxy.name : ""}</div>;
};

export const EditableProxyCell = ({
                               row,
                           }: {
    row: { original: StrategyInterface };
}) => {
    const { data: proxies = [] } = useProxies();
    const updateMutation = useUpdateStrategy(row.original.id);

    const handleProxyChange = (newProxyId: string) => {
        updateMutation.mutate({ proxy: newProxyId });
    };

    const selectedProxyId = row.original.proxy
        ? typeof row.original.proxy === "object"
            ? row.original.proxy.id
            : row.original.proxy
        : undefined;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                    {selectedProxyId
                        ? proxies.find((proxy) => proxy.id === selectedProxyId)?.name
                        : "Select Proxy"}
                    <ChevronsUpDown className="ml-2 size-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search proxy..." />
                    <CommandList>
                        <CommandEmpty>No proxies found.</CommandEmpty>
                        {proxies.map((proxy) => (
                            <CommandItem
                                key={proxy.id}
                                value={proxy.name}
                                onSelect={() => handleProxyChange(proxy.id)}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        proxy.id === selectedProxyId ? "opacity-100" : "opacity-0",
                                    )}
                                />
                                {proxy.name}
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
const ProxyActionsCell = ({ row }: { row: { original: ProxyInterface } }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const deleteMutation = useRemoveProxy(row.original.id);

    const handleDelete = () => {
        deleteMutation.mutate();
        setIsModalOpen(false);
    };

    return (
        <div className="flex items-center gap-2">
        <Link
            href={routes.dashboard.proxy.update(row.original.id)}
    className="btn btn-primary"
    >
    <PencilLine size={20} color="#2b00ff" strokeWidth={1.25} />
    </Link>

    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
    <DialogTrigger asChild>
    <button className="btn btn-secondary">
    <Trash2 size={20} color="#ff0000" strokeWidth={1.25} />
    </button>
    </DialogTrigger>
    <DialogContent>
    <VisuallyHidden>
        <DialogTitle>Confirmation</DialogTitle>
    </VisuallyHidden>
    <DialogDescription>
    Are you sure you want to delete this proxy?
        </DialogDescription>
        <DialogFooter>
        <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
    <Button onClick={handleDelete} variant="destructive">
        Delete
        </Button>
        </DialogFooter>
        </DialogContent>
        </Dialog>
        </div>
);
};

export const proxyListColumns: ColumnDef<ProxyInterface>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "host",
        header: "Host",
    },
    {
        accessorKey: "port",
        header: "Port",
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => <ProxyActionsCell row={row} />,
    },
];