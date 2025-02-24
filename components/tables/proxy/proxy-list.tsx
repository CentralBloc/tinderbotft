"use client";


import {DataTable} from "@/components/ui/data-table";
import {useProxies} from "@/services/proxy/hooks";
import {proxyListColumns} from "@/components/tables/proxy/proxy-columns";

export default function ProxyList() {
  const { data: proxies = [], isLoading, isError } = useProxies();
  return (
    <div className="space-y-3">
      <h1 className="font-heading">Proxy list</h1>
      <DataTable columns={proxyListColumns} data={proxies ?? []} />
    </div>
  );
}
