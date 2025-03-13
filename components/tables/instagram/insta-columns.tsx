import {ColumnDef} from "@tanstack/react-table";
import Link from "next/link";
import {routes} from "@/lib/routes";
import {PencilLine} from "lucide-react";


export const instaListColumns: ColumnDef<any>[] = [
    {
        accessorKey: "username",
        header: "Username",
    },
    {
        accessorKey: "full_name",
        header: "Full Name",
    },
    {
        accessorKey:"status",
        header: "Status",
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => {
            return (
                <Link
                    href={routes.dashboard.insta.strat.add}
                    className="btn btn-primary"
                >
                    <PencilLine size={20} color="#2b00ff" strokeWidth={1.25} />
                </Link>
            );
        },
    },
];
