import Link from "next/link"
import {ArrowLeft} from "lucide-react"
import {Button} from "@/components/ui/button"
import {routes} from "@/lib/routes"
import {useParams} from "next/navigation";
import {useSubscription} from "@/services/subscriptions/hooks";
import AddOrUpdateSubscriptionForm from "@/components/forms/add-subscription-form";

export default function UpdateSubscriptionPage() {
  const {id} = useParams()
  const subscriptionsId = Array.isArray(id) ? id[0] : id
  const {data: subscription} = useSubscription(subscriptionsId)
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href={routes.dashboard.admin.plans.index}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="size-4"/>
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Update Plan</h1>
      </div>

      <AddOrUpdateSubscriptionForm mode="update" initialData={subscription}/>
    </div>
  )
}
