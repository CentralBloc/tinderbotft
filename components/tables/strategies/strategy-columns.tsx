import {useRemoveStrategy, useStrategies} from "@/services/strategy/hooks";
import {BotAccountInterface, StrategyInterface} from "@/types";
import {useState} from "react";
import Link from "next/link";
import {routes} from "@/lib/routes";
import {Check, ChevronsUpDown, Cog, PencilLine, Trash2} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {ColumnDef} from "@tanstack/react-table";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Command, CommandEmpty, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {cn} from "@/lib/utils";
import {useUpdateBotaccount} from "@/services/bot-account/hooks";
import {EditableProxyCell} from "@/components/tables/proxy/proxy-columns";


const StrategyCell = ({ row }: { row: { original: any } }) => {
    const { data: strategies = [] } = useStrategies();
    const strategyId =
        typeof row.original.strategy === "object"
            ? row.original.strategy?.id
            : row.original.strategy;
    const strategy = strategies.find((strategy) => strategy.id === strategyId);
    return <div>{strategy ? strategy.name : ""}</div>;
};

const StrategyActionsCell = ({
                                 row,
                             }: {
    row: { original: StrategyInterface };
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const deleteMutation = useRemoveStrategy(row.original.id);

    const handleDelete = () => {
        deleteMutation.mutate();
        setIsModalOpen(false);
    };

    return (
        <div className="flex items-center gap-2">
            <Link
                href={routes.dashboard.strategy.config(row.original.id)}
                className="btn btn-primary"
            >
                <Cog size={20} strokeWidth={1.25} />
            </Link>
            <Link
                href={routes.dashboard.strategy.update(row.original.id)}
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
                    <DialogHeader>
                        <DialogTitle>Confirmation</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this strategy?
                        </DialogDescription>
                    </DialogHeader>
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


export const EditableStrategyCell = ({
                                  row,
                              }: {
    row: { original: BotAccountInterface };
}) => {
    const { data: strategies = [] } = useStrategies();
    const updateMutation = useUpdateBotaccount(row.original.id);

    const handleStrategyChange = (newStrategyId: string) => {
        updateMutation.mutate({ strategy: newStrategyId });
    };

    const selectedStrategyId = row.original.strategy
        ? typeof row.original.strategy === "object"
            ? row.original.strategy.id
            : row.original.strategy
        : undefined;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                    {selectedStrategyId
                        ? strategies.find((strategy) => strategy.id === selectedStrategyId)
                            ?.name
                        : "Select Strategy"}
                    <ChevronsUpDown className="ml-2 size-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search strategy..." />
                    <CommandList>
                        <CommandEmpty>No strategies found.</CommandEmpty>
                        {strategies.map((strategy) => (
                            <CommandItem
                                key={strategy.id}
                                value={strategy.name}
                                onSelect={() => handleStrategyChange(strategy.id)}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        strategy.id === selectedStrategyId
                                            ? "opacity-100"
                                            : "opacity-0",
                                    )}
                                />
                                {strategy.name}
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};




export const strategyListColumns: ColumnDef<StrategyInterface>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "days_number",
        header: "Days Number",
    },
    {
        accessorKey: "proxy",
        header: "Proxy",
        cell: ({ row }) => <EditableProxyCell row={row} />, // Utilisation de la cellule modifiable
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => <StrategyActionsCell row={row} />,
    },
];
