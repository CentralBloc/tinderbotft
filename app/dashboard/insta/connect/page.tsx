import {Metadata} from "next";
import {Breadcrumbs} from "@/components/pagers/breadcrumbs";
import {routes} from "@/lib/routes";
import AddOrUpdateThreadAccountForm from "@/components/forms/add-thread-account-form";

export const metadata: Metadata = {
  title: "Connect - Insta",
  description: "Connect insta page",
};

export default function InstaPage() {
  return (
    <div className="space-y-5">
      <Breadcrumbs
        segments={[
          {title: "Insta", href: routes.dashboard.insta.index},
          {title: "Add insta account", href: routes.dashboard.insta.connect},
        ]}
      />
      <div className="w-full">
        <AddOrUpdateThreadAccountForm mode="add"/>
      </div>

    </div>
  );
}
