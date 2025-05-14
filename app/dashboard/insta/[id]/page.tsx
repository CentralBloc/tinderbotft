"use client";

import {useParams} from "next/navigation";
import AddOrUpdateAccountForm from "@/components/forms/add-account-form";
import {routes} from "@/lib/routes";
import {Breadcrumbs} from "@/components/pagers/breadcrumbs";
import {useThreadAccount} from "@/services/threads/account/hooks";

export default function UpdateThreadAccountPage() {
  const {id} = useParams();
  const accountId = Array.isArray(id) ? id[0] : id;
  const {data: account, isLoading} = useThreadAccount(accountId);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-5">
      <Breadcrumbs
        segments={[
          {title: "Account", href: routes.dashboard.insta.index},
          {
            title: "Account Update",
            href: routes.dashboard.insta.update(accountId),
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
