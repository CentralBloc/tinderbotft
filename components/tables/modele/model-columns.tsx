import {AllModelsInterface, BotAccountInterface} from "@/types";
import {useModels, useRemoveModel} from "@/services/models/hooks";
import {Badge} from "@/components/ui/badge";
import {useState} from "react";
import Link from "next/link";
import {routes} from "@/lib/routes";
import {PencilLine, Trash2} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {ColumnDef} from "@tanstack/react-table";


export const ModelCell = ({ row }: { row: { original: BotAccountInterface } }) => {
    const { data: models = [] } = useModels();
    const modelId = row.original.modele;
    const model = models.find((model) => model.id === modelId);

    return <div><Badge>{model ? model.name : ""}</Badge></div>;
};


const ModelActionsCell = ({
                              row,
                          }: {
    row: { original: AllModelsInterface };
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const deleteMutation = useRemoveModel(row.original.id);

    const handleDelete = () => {
        deleteMutation.mutate();
        setIsModalOpen(false);
    };

    return (
        <div className="flex items-center gap-2">
            <Link
                href={routes.dashboard.model.update(row.original.id)}
                className="btn btn-primary"
            >
                <PencilLine size={20} color="#2b00ff" strokeWidth={1.25} />
            </Link>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                    <button className="btn btn-danger">
                        <Trash2 size={20} color="#ff0000" strokeWidth={1.25} />
                    </button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this model? This action cannot be
                            undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button className="btn btn-danger" onClick={handleDelete}>
                            Delete
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export const modelListColumns: ColumnDef<AllModelsInterface>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "account_count",
        header: "Account Count",
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => <ModelActionsCell row={row} />,
    },
];