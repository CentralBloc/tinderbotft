"use client";

import {useParams} from "next/navigation";
import {Breadcrumbs} from "@/components/pagers/breadcrumbs";
import {routes} from "@/lib/routes";
import {useStrategy} from "@/services/strategy/hooks";
import AddOrUpdateStrategyForm from "@/components/forms/add-strategy-form";

export default function UpdateStrategyPage() {
  const { id } = useParams();
  const strategyId = Array.isArray(id) ? id[0] : id;
  const { data: strategy, isLoading } = useStrategy(strategyId as string);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-5">
      <Breadcrumbs
        segments={[
          { title: "Strategy", href: routes.dashboard.strategy.index },
          {
            title: `Update ${strategy?.name}`,
            href: routes.dashboard.strategy.update(strategyId),
          },
        ]}
      />
      <div className="space-y-6">
        {strategy && (
          <AddOrUpdateStrategyForm mode="update" initialData={strategy} />
        )}
      </div>
    </div>
  );
}
