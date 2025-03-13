import {Metadata} from "next";
import {Breadcrumbs} from "@/components/pagers/breadcrumbs";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {routes} from "@/lib/routes";
import {Suspense} from "react";
import InstaStratList from "@/components/tables/insta-strat/insta-strat-list";

export const metadata: Metadata = {
    title: "Dashboard - Insta - Strategy",
    description: "Dashboard insta strategy page",
};

export default function InstaStratPage() {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <Breadcrumbs segments={[{title: "Insta - Strategy"}]}/>
                <Button asChild className="w-fit font-heading">
                    <Link href={routes.dashboard.insta.index}>Insta Account</Link>
                </Button>

                <Button asChild className="w-fit font-heading">
                    <Link href={routes.dashboard.insta.strat.add}>Add Strategy</Link>
                </Button>
            </div>

            <Suspense>
                <InstaStratList />
            </Suspense>
        </div>
    );
}
