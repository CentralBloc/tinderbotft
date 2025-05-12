import {Metadata} from "next";
import {Breadcrumbs} from "@/components/pagers/breadcrumbs";
import {routes} from "@/lib/routes";
import AddOrUpdateInstaStratForm from "@/components/forms/add-thread-strat-form";

export const metadata: Metadata = {
  title: "Dashboard - Add new insta strategy",
  description: "Dashboard add insta strategy page",
};

export default function AddStrategyPage() {
  return (
    <div className="space-y-5">
      <Breadcrumbs
        segments={[
          {title: "Insta Strategy", href: routes.dashboard.insta.strat.index},
          {
            title: "Add new insta strategy",
            href: routes.dashboard.insta.strat.add,
          },
        ]}
      />
      <div className="w-full">
        <AddOrUpdateInstaStratForm mode="add"/>
      </div>
    </div>
  );
}
