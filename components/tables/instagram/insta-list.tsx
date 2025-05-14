"use client";


import {DataTable} from "@/components/ui/data-table";
import {instaListColumns} from "@/components/tables/instagram/insta-columns";
import {useThreadAccountAll} from "@/services/threads/account/hooks";


export default function InstaList() {
  const {data: instaAccount = [], isError} = useThreadAccountAll();
  return (
    <div className="space-y-5">
      <h1 className="font-heading">Insta Account list</h1>

      <div className="space-y-6">
        <DataTable columns={instaListColumns} data={instaAccount ?? []}/>
      </div>
    </div>
  );
}
