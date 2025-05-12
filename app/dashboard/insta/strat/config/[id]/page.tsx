"use client";

import {useParams} from "next/navigation";
import {Breadcrumbs} from "@/components/pagers/breadcrumbs";
import {routes} from "@/lib/routes";
import ConfigThreadStrategyForm from "@/components/forms/config-thread-strat";
import {useThreadStrat} from "@/services/threads/strategy/hooks";
import {useThreadStratActionsAll} from "@/services/threads/action/hooks";

export default function ConfigInstaStrategyPage() {
  const {id} = useParams();
  const strategyId = Array.isArray(id) ? id[0] : id;
  const {data: strategy, isLoading: strategyLoading} = useThreadStrat(strategyId);
  const {data: strategy_actions, isLoading: botsLoading, error: botsError} = useThreadStratActionsAll(strategyId);

  if (strategyLoading || botsLoading) {
    return <div>Loading...</div>;
  }

  if (botsError) {
    return <div>Error loading bots: {botsError.message}</div>;
  }

  return (
    <div className="space-y-5">
      <Breadcrumbs
        segments={[
          {title: "Insta", href: routes.dashboard.insta.index},
          {title: "Strategy", href: routes.dashboard.insta.strat.index},
          {
            title: `Configuration - ${strategy?.name}`,
            href: routes.dashboard.insta.strat.config(strategyId),
          },
        ]}
      />
      <div className="space-y-6">
        {strategy && (
          <ConfigThreadStrategyForm
            daysNumber={strategy.day_number}
            strategyId={strategyId}
            existingActions={strategy_actions}
          />
        )}
      </div>
    </div>
  );
}
