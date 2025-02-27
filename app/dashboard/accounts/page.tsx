import {Metadata} from "next";
import {Breadcrumbs} from "@/components/pagers/breadcrumbs";
import BotAccountsPage from "@/components/pages/accounts-page";

export const metadata: Metadata = {
  title: "Dashboard - Accounts",
  description: "Dashboard accounts page",
};

export default function AccountsPage() {
  return (
    <div className="space-y-5">
      <Breadcrumbs segments={[{ title: "Accounts" }]} />

      <div className="space-y-6">
          <BotAccountsPage />
      </div>
    </div>
  );
}
