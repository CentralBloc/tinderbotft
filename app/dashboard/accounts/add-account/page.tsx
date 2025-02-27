import {Metadata} from "next";
import {Breadcrumbs} from "@/components/pagers/breadcrumbs";
import {routes} from "@/lib/routes";
import AddOrUpdateAccountForm from "@/components/forms/add-account-form";

export const metadata: Metadata = {
  title: "Dashboard - Add new account",
  description: "Dashboard add account page",
};

export default function AddAccountPage() {
  return (
    <div className="space-y-5">
      <Breadcrumbs
        segments={[
          { title: "Account", href: routes.dashboard.account.index },
          { title: "Add Account", href: routes.dashboard.account.add },
        ]}
      />
      <div className="w-full">
        <AddOrUpdateAccountForm mode={"add"} />
      </div>
    </div>
  );
}
