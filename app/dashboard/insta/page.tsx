import {Metadata} from "next";
import {Breadcrumbs} from "@/components/pagers/breadcrumbs";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {routes} from "@/lib/routes";
import {Suspense} from "react";
import InstaList from "@/components/tables/instagram/insta-list";

export const metadata: Metadata = {
    title: "Dashboard - Insta",
    description: "Dashboard insta page",
};

export default function InstaPage() {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <Breadcrumbs segments={[{title: "Insta"}]}/>
                <Button asChild className="w-fit font-heading">
                    <Link href={routes.dashboard.insta.connect}>Connect Insta</Link>
                </Button>
            </div>

            <Suspense>
                <InstaList />
            </Suspense>
        </div>
    );
}
