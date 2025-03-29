"use client";

import {useParams} from "next/navigation";
import {useBotaccount} from "@/services/bot-account/hooks";
import {routes} from "@/lib/routes";
import {Breadcrumbs} from "@/components/pagers/breadcrumbs";
import SingleAccountCard from "@/components/cards/single-account-card";


export default function SingleAccountPage() {
    const { id } = useParams();
    const accountId = Array.isArray(id) ? id[0] : id;
    const { data: account, isLoading } = useBotaccount(accountId as string);

    return (
        <div className="space-y-5">
            <Breadcrumbs
                segments={[
                    { title: "Account", href: routes.dashboard.account.index },
                    {
                        title: "Account Details",
                        href: routes.dashboard.account.view(accountId),
                    },
                ]}
            />
            <div className="space-y-4">
                {account && (
                    <SingleAccountCard botAccount={account} />
                )}
            </div>
        </div>
    );
}