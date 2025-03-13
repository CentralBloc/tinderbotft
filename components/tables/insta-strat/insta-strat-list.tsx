"use client";


import {DataTable} from "@/components/ui/data-table";
import {useInstaStrats} from "@/services/insta-strat/hooks";
import {instaStratListColumns} from "@/components/tables/insta-strat/insta-strat-columns";


export default function InstaStratList() {
    const {data: instaStrat = [], isError} = useInstaStrats();
    return (
        <div className="space-y-5">
            <h1 className="font-heading">Insta Strategy list</h1>

            <div className="space-y-6">
                <DataTable columns={instaStratListColumns} data={instaStrat ?? []}/>
            </div>
        </div>
    );
}
