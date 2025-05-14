import {useParams} from "next/navigation";
import {Breadcrumbs} from "@/components/pagers/breadcrumbs";
import {routes} from "@/lib/routes";
import {useUpdateThreadAccount} from "@/services/threads/account/hooks";
import AddOrUpdateThreadAccountForm from "@/components/forms/add-thread-account-form";


export default function UpdateThreadAccountPage() {
  const {id} = useParams();
  const accountId = Array.isArray(id) ? id[0] : id;
  const {data: account} = useUpdateThreadAccount(accountId);


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
          <AddOrUpdateThreadAccountForm mode="update" initialData={account}/>
        )}
      </div>
    </div>
  );
}
