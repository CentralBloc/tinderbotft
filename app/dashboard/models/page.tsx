import {Metadata} from "next";
import {Breadcrumbs} from "@/components/pagers/breadcrumbs";
import ModelList from "@/components/tables/modele/model-list";
import Link from "next/link";
import {routes} from "@/lib/routes";
import {Button} from "@/components/ui/button";
import {Suspense} from "react";


export const metadata: Metadata = {
    title: "Dashboard - Model",
    description: "Dashboard models page",
};

export default function ModelsPage() {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <Breadcrumbs segments={[{title: "Models"}]}/>
                <Button asChild className="w-fit font-heading">
                    <Link href={routes.dashboard.model.add}>Add new model</Link>
                </Button>
            </div>

            <Suspense>
                <ModelList/>
            </Suspense>
        </div>
    );
}
