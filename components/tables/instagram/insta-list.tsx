"use client";


import {DataTable} from "@/components/ui/data-table";
import {useInstaAccount} from "@/services/instagram/hooks";
import {instaListColumns} from "@/components/tables/instagram/insta-columns";


export default function InstaList() {
    const {data: instaAccount = [], isError} = useInstaAccount();
    return (
        <div className="space-y-5">
            <h1 className="font-heading">Insta Account list</h1>

            <div className="space-y-6">
                <DataTable columns={instaListColumns} data={instaAccount ?? []}/>
            </div>
        </div>
    );
}
