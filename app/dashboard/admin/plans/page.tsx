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
                { title: "Plans & Subscriptions", href: routes.dashboard.admin.plans},
            ]}
        />
      </div>

      <Suspense>
        <div className="space-y-6">
          <PlansList />
          <SubscriptionsList />
        </div>
      </Suspense>
    </div>
  );
}