"use client";

import {useParams} from "next/navigation";
import {Breadcrumbs} from "@/components/pagers/breadcrumbs";
import {routes} from "@/lib/routes";
import {useStrategy} from "@/services/strategy/hooks";
import ConfigStrategyForm from "@/components/forms/config-strategy-form";
import {useActionsByStrategy} from "@/services/actions/hooks";
import {ConfigStratSkeletonLoader} from "@/components/skeleton/config-strat-loader";

export default function ConfigStrategyPage() {
  const { id } = useParams();
  const strategyId = Array.isArray(id) ? id[0] : id;
  const { data: strategy, isLoading: strategyLoading } = useStrategy(strategyId as string);
  const { data: strategy_actions, isLoading: botsLoading, error: botsError } = useActionsByStrategy(strategyId as string);

  console.log("Strategy ID:", strategyId);
  console.log("Strategy Data:", strategy);
  console.log("Strategy Bots Data:", strategy_actions);
  console.log("Bots Loading:", botsLoading);
  console.log("Bots Error:", botsError);

  if (strategyLoading || botsLoading) {
    return <div><ConfigStratSkeletonLoader count={strategy_actions?.length || 1} /></div>;
  }

  if (botsError) {
    return <div>Error loading bots: {botsError.message}</div>;
  }

  return (
    <div className="space-y-5">
      <Breadcrumbs
        segments={[
          { title: "Stratégie", href: routes.dashboard.strategy.index },
          {
            title: `Configuration - ${strategy?.name}`,
            href: routes.dashboard.strategy.config(strategyId),
          },
        ]}
      />
      <div className="space-y-6">
        {strategy && (
          <ConfigStrategyForm
            daysNumber={strategy.days_number}
            strategyId={strategy.id}
            strategyActions={strategy_actions}
          />
        )}
      </div>
    </div>
  );
}