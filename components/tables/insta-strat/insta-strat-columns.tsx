import {ColumnDef} from "@tanstack/react-table";
import Link from "next/link";
import {routes} from "@/lib/routes";
import {Cog, PencilLine} from "lucide-react";


export const instaStratListColumns: ColumnDef<any>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "day_number",
        header: "Day Number",
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-2">
                    <Link
                        href={routes.dashboard.insta.strat.update(row.original.id)}
                        className="btn btn-primary"
                    >
                        <PencilLine size={20} color="#2b00ff" strokeWidth={1.25} />
                    </Link>
                    <Link
                        href={routes.dashboard.insta.strat.config(row.original.id)}
                        className="btn btn-primary"
                    >
                        <Cog size={20} strokeWidth={1.25} />
                    </Link>
                </div>
            );
        },
    },
];
