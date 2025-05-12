"use client";

import {useParams} from "next/navigation";
import {Breadcrumbs} from "@/components/pagers/breadcrumbs";
import {routes} from "@/lib/routes";
import AddOrUpdateInstaStratForm from "@/components/forms/add-thread-strat-form";
import {useThreadStrat} from "@/services/threads/strategy/hooks";

export default function UpdateInstaStratPage() {
  const {id} = useParams();
  const strategyId = Array.isArray(id) ? id[0] : id;
  const {data: strategy, isLoading} = useThreadStrat(strategyId);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-5">
      <Breadcrumbs
        segments={[
          {title: "Strategy", href: routes.dashboard.strategy.index},
          {
            title: "Update Strategy",
            href: routes.dashboard.strategy.update(strategyId),
          },
        ]}
      />
      <div className="space-y-6">
        {strategy && (
          <AddOrUpdateInstaStratForm mode="update" initialData={strategy}/>
        )}
      </div>
    </div>
  );
}
