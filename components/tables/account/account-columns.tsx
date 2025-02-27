import {BotAccountInterface} from "@/types";
import {useEffect, useState} from "react";
import {
    useRemoveBotAccount,
    useSetAccountBio,
    useStartBotAccount,
    useUpdateBotaccount,
    useUpdateBotAccountContent
} from "@/services/bot-account/hooks";
import {
    ArrowLeftRight,
    BookUser,
    Check,
    ChevronsUpDown,
    ExternalLink,
    Heart,
    PencilLine,
    Play,
    RefreshCcwDot,
    SquareTerminal,
    ThumbsUp,
    Trash2
} from "lucide-react";
import Link from "next/link";
import {routes} from "@/lib/routes";
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
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import {useStrategies} from "@/services/strategy/hooks";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Command} from "cmdk";
import {CommandEmpty, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {cn} from "@/lib/utils";
import {EditableStrategyCell} from "../strategies/strategy-columns";
import {ModelCell} from "@/components/tables/modele/model-columns";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Input} from "@/components/ui/input";
import {EditableProxyCell} from "@/components/tables/proxy/proxy-columns";

interface TinderBioCellProps {
    row: {
        original: Partial<BotAccountInterface>
    }
}
const AccountActionsCell = ({row,}: { row: { original: BotAccountInterface }; }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const deleteMutation = useRemoveBotAccount(row.original.id);

    const handleDelete = () => {
        deleteMutation.mutate();
        setIsModalOpen(false);
    };

    const startMutation = useStartBotAccount(row.original.id);
    const handleStart = () => {
        startMutation.mutate();
    };

    const updateContentMutation = useUpdateBotAccountContent(row.original.id);
    const handleUpdateContent = () => {
        updateContentMutation.mutate();
    }

    return (
        <div className="flex items-center gap-2">
            <button className="btn btn-primary" onClick={handleStart}>
                <Play size={20} color="#065c00" strokeWidth={1.25} />
            </button>
            <button className="btn btn-primary" onClick={handleUpdateContent}>
                <RefreshCcwDot size={20} color="#ff6190" strokeWidth={1.25} />
            </button>
            <Link
                href={routes.dashboard.account.update(row.original.id)}
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
                            Are you sure you want to delete this account?
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

export const EditableProgressCell = ({row,}: { row: { original: BotAccountInterface }; }) => {
    const { data: strategies = [] } = useStrategies();
    const updateMutation = useUpdateBotaccount(row.original.id);
    const [daysNumber, setDaysNumber] = useState<number[]>([]);

    useEffect(() => {
        const strategyId = row.original.strategy
            ? typeof row.original.strategy === "object"
                ? row.original.strategy.id
                : row.original.strategy
            : undefined;

        const strategy = strategies.find((strategy) => strategy.id === strategyId);
        if (strategy) {
            setDaysNumber(
                Array.from({ length: strategy.days_number }, (_, i) => i + 1),
            );
        } else {
            setDaysNumber([]);
        }
    }, [row.original.strategy, strategies]);

    const handleProgressChange = (newProgress: string) => {
        updateMutation.mutate({ progress: parseInt(newProgress, 10) });
    };

    if (daysNumber.length === 0) {
        return <div>{row.original.progress}</div>;
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                    {row.original.progress
                        ? `Day ${row.original.progress}`
                        : "Select Progress"}
                    <ChevronsUpDown className="ml-2 size-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search progress day..." />
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
                                        row.original.progress === day ? "opacity-100" : "opacity-0",
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

export const TinderBioCell = ({ row }: TinderBioCellProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newBio, setNewBio] = useState(row.original.tinder_bio ?? "")
    const updateMutation = useSetAccountBio(row.original.id ?? "")

    const handleSave = () => {
        updateMutation.mutate(newBio)
        setIsModalOpen(false)
    }

    const iconColor = row.original.tinder_bio ? "text-blue-500" : "text-red-500"

    return (
        <div className="flex items-center">
            <Link href={routes.dashboard.account.view(row.original.id ?? "")}>
                <Button variant="ghost" className="flex items-center gap-2 ">
                    <ExternalLink color="#5c0783" />
                </Button>
            </Link>
            <SquareTerminal color="#4053b5" />
            <TooltipProvider>
                <Tooltip>
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <TooltipTrigger asChild>
                            <DialogTrigger asChild>
                                <Button variant="ghost" className={`${iconColor} flex items-center gap-2`}>
                                    <BookUser  />
                                </Button>
                            </DialogTrigger>
                        </TooltipTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Tinder Bio</DialogTitle>
                            </DialogHeader>
                            <Input
                                type="text"
                                value={newBio}
                                onChange={(e) => setNewBio(e.target.value)}
                                placeholder="Enter new bio"
                            />
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSave}>Save</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <TooltipContent>
                        <p>{row.original.tinder_bio ||  "No bio set"}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}

export const accountListColumns: ColumnDef<BotAccountInterface>[] = [
    {
        accessorKey: "profile_url",
        header:"",
        cell: ({ row }) => {
            return (
                <Image
                    src={row.original.profile_url ?? "/public/images/landscape-placeholder.svg"} width={40} height={40}
                    alt="profile"
                />
            );
        }
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "modele",
        header: "Model",
        cell: ModelCell,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            if (row.original.status === "active") {
                return <Badge className="bg-green-800">Active</Badge>;
            } else if (row.original.status === "failed") {
                return <Badge className="bg-amber-800">Token Expired</Badge>;
            } else if (row.original.status === "shadowBan" || row.original.status === "banned") {
                return <Badge variant="destructive">Ban</Badge>;
            } else if (row.original.status === "standby") {
                return <Badge className="bg-blue-800">Inactive</Badge>;
            } else if ( row.original.status === "working") {
                return <Badge className="bg-purple-700">Working</Badge>;
            } else {
                return <Badge className="bg-gray-800">{row.original.status}</Badge>;
            }
        },
    },
    {
        accessorKey: "progress",
        header: "Day Progress",
        cell: ({ row }) => <EditableProgressCell row={row} />,
    },
    {
        accessorKey: "infos",
        header: "Account infos",
        cell: ({ row }) => <TinderBioCell row={row} />,

    },
    {
        accessorKey: "strategy",
        header: "Strategy",
        cell: ({ row }) => <EditableStrategyCell row={row} />,
    },
    {
        accessorKey: "proxy",
        header: "Proxy",
        cell: ({ row }) => <EditableProxyCell row={row} view="account" />, // Utilisation de la cellule modifiable
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => <AccountActionsCell row={row} />,
    },
];

export const accountStatsColumns: ColumnDef<BotAccountInterface>[] = [
    {
        accessorKey: "profile_url",
        header:"",
        cell: ({ row }) => {
            return (
                <Image
                    src={row.original.profile_url ?? "/public/images/landscape-placeholder.svg"} width={40} height={40}
                    alt="profile"
                />
            );
        }
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "modele",
        header: "Model",
        cell: ModelCell,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            if (row.original.status === "active") {
                return <Badge className="bg-green-800">Active</Badge>;
            } else if (row.original.status === "failed") {
                return <Badge className="bg-amber-800">Token Expired</Badge>;
            } else if (row.original.status === "shadowBan" || row.original.status === "banned") {
                return <Badge variant="destructive">Ban</Badge>;
            } else if (row.original.status === "standby") {
                return <Badge className="bg-blue-800">Inactive</Badge>;
            } else if ( row.original.status === "working") {
                return <Badge className="bg-purple-700">Working</Badge>;
            } else {
                return <Badge className="bg-gray-800">{row.original.status}</Badge>;
            }
        },
    },
    {
        accessorKey: "infos",
        header: "Account infos",
        cell: ({ row }) => <TinderBioCell row={row} />,

    },
    {
        accessorKey: "proxy",
        header: "Proxy",
        cell: ({ row }) => <EditableProxyCell row={row} view="account" />, // Utilisation de la cellule modifiable
    },
    {
        accessorKey: "stats",
        header: "Account stats",
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-2">
                    {row.original.swipes}<ArrowLeftRight color="#201dc9" className="ml-2 size-4" />
                    {row.original.likes} <ThumbsUp color="#0b4116" className="ml-2 size-4" />
                    {row.original.matches} <Heart className="ml-2 size-4 " color="#c91d1d" />
                </div>
            );
        },

    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => <AccountActionsCell row={row} />,
    },
];