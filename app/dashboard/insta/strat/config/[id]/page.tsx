"use client";

import {useParams} from "next/navigation";
import {Breadcrumbs} from "@/components/pagers/breadcrumbs";
import {routes} from "@/lib/routes";
import {useInstaStrat} from "@/services/insta-strat/hooks";
import InstaActionForm from "@/components/forms/config-insta-strat";
import {useStrategyActions} from "@/services/insta-action/hooks";

export default function ConfigInstaStrategyPage() {
    const { id } = useParams();
    const strategyId = Array.isArray(id) ? id[0] : id;
    const { data: strategy, isLoading: strategyLoading } = useInstaStrat(strategyId);
    const { data: strategy_actions, isLoading: botsLoading, error: botsError } = useStrategyActions(strategyId);

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
                    { title: "Insta", href: routes.dashboard.insta.index },
                    { title: "Stratégie", href: routes.dashboard.insta.strat.index },
                    {
                        title: `Configuration - ${strategy?.name}`,
                        href: routes.dashboard.insta.strat.config(strategyId),
                    },
                ]}
            />
            <div className="space-y-6">
                {strategy && (
                    <InstaActionForm
                        daysNumber={strategy.day_number}
                        instaStratId={strategy.id}
                        existingActions={strategy_actions}
                    />
                )}
            </div>
        </div>
    );
}