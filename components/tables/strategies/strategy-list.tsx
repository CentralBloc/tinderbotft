"use client";


import {useStrategies} from "@/services/strategy/hooks";
import {DataTable} from "@/components/ui/data-table";
import {strategyListColumns} from "@/components/tables/strategies/strategy-columns";

export default function StrategyList() {
  const { data: strategies = [], isLoading, isError } = useStrategies();
  return (
    <div className="space-y-3">
      <h1 className="font-heading">Strategy list</h1>
      <DataTable columns={strategyListColumns} data={strategies ?? []} />
    </div>
  );
}
