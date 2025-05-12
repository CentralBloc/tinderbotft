"use client";


import {DataTable} from "@/components/ui/data-table";
import {instaStratListColumns} from "@/components/tables/insta-strat/insta-strat-columns";
import {useThreadStrats} from "@/services/threads/strategy/hooks";


export default function InstaStratList() {
  const {data: instaStrat = [], isError} = useThreadStrats();
  return (
    <div className="space-y-5">
      <h1 className="font-heading">Insta Strategy list</h1>

      <div className="space-y-6">
        <DataTable columns={instaStratListColumns} data={instaStrat ?? []}/>
      </div>
    </div>
  );
}
