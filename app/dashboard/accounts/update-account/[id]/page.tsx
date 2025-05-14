"use client";

import {useParams} from "next/navigation";
import {useBotaccount} from "@/services/bot-account/hooks";
import AddOrUpdateAccountForm from "@/components/forms/add-account-form";
import {routes} from "@/lib/routes";
import {Breadcrumbs} from "@/components/pagers/breadcrumbs";

export default function UpdateAccountPage() {
  const {id} = useParams();
  const accountId = Array.isArray(id) ? id[0] : id;
  const {data: account, isLoading} = useBotaccount(accountId);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-5">
      <Breadcrumbs
        segments={[
          {title: "Account", href: routes.dashboard.account.index},
          {
            title: "Account Update",
            href: routes.dashboard.account.update(accountId),
          },
        ]}
      />
      <div className="space-y-6">
        {account && (
          <AddOrUpdateAccountForm mode="update" initialData={account}/>
        )}
      </div>
    </div>
  );
}
