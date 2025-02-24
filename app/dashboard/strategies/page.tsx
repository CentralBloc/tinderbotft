import {Breadcrumbs} from "@/components/pagers/breadcrumbs";
import {Button} from "@/components/ui/button";
import {routes} from "@/lib/routes";
import {Metadata} from "next";
import Link from "next/link";
import {Suspense} from "react";
import StrategyList from "@/components/tables/strategies/strategy-list";

export const metadata: Metadata = {
  title: "Dashboard - Strategies",
  description: "Dashboard strategies page",
};

export default function StrategiesPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Breadcrumbs segments={[{ title: "Strategies" }]} />
        <Button asChild className="w-fit font-heading">
          <Link href={routes.dashboard.strategy.add}>Add new strategy</Link>
        </Button>
      </div>

      <Suspense>
        <StrategyList />
      </Suspense>
    </div>
  );
}
