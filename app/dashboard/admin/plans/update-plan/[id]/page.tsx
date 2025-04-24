import Link from "next/link"
import {ArrowLeft} from "lucide-react"
import {Button} from "@/components/ui/button"
import {routes} from "@/lib/routes"
import PlanForm from "@/components/forms/add-plan-form"
import {usePlan} from "@/services/plans/hooks";
import {useParams} from "next/navigation";

export default function UpdatePlanPage() {
    const {id} = useParams()
    const planId = Array.isArray(id) ? id[0] : id
    const {data: plan} = usePlan(planId)
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

            <PlanForm mode="update" initialData={plan}/>
        </div>
    )
}
