import {Metadata} from "next";
import {Breadcrumbs} from "@/components/pagers/breadcrumbs";
import {Suspense} from "react";
import {PlansList} from "@/components/tables/super-admin/plans-list";
import {SubscriptionsList} from "@/components/tables/super-admin/subscriptions-list";
import {routes} from "@/lib/routes";

export const metadata: Metadata = {
    title: "Dashboard - Plans & Subscriptions",
    description: "Manage plans and subscriptions",
};

export default function PlansPage() {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <Breadcrumbs
                    segments={[
                        { title: "Admin", href: routes.dashboard.admin.index },
                        { title: "Plans & Subscriptions", href: routes.dashboard.admin.plans.index },
                    ]}
                />
            </div>

            <Suspense fallback={<div>Loading...</div>}>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Subscription Plans</h1>
                            <p className="text-muted-foreground">Manage subscription plans and pricing</p>
                        </div>

                    </div>
                    <PlansList />
                    <SubscriptionsList />
                </div>
            </Suspense>
        </div>
    );
}