import {Metadata} from "next";
import {Breadcrumbs} from "@/components/pagers/breadcrumbs";
import {routes} from "@/lib/routes";
import AddOrUpdateModelForm from "@/components/forms/add-model-form";

export const metadata: Metadata = {
    title: "Dashboard - Add Model",
    description: "Dashboard add model page",
};

export default function AddModelPage() {
    return (
        <div className="space-y-5">
            <Breadcrumbs
                segments={[
                    {title: "Model", href: routes.dashboard.model.index},
                    {title: "Add new model", href: routes.dashboard.model.add},
                ]}
            />
            <div className="w-full">
                <AddOrUpdateModelForm mode="add"/>
            </div>
        </div>
    );
}
