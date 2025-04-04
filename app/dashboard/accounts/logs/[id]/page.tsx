"use client";

import {useParams} from "next/navigation";
import {useBotaccount} from "@/services/bot-account/hooks";
import {routes} from "@/lib/routes";
import {Breadcrumbs} from "@/components/pagers/breadcrumbs";
import RealtimeSessionLog from "@/components/logs/realtime-session-log";
import {WebSocketProvider} from "@/lib/providers/websocket.provider";

export default function LogAccountPage() {
    const { id } = useParams();
    const accountId = Array.isArray(id) ? id[0] : id;
    const { data: account, isLoading } = useBotaccount(accountId);

    return (
        <div className="space-y-5">
            <Breadcrumbs
                segments={[
                    { title: "Account", href: routes.dashboard.account.index },
                    {
                        title: "Account Logs Details",
                        href: routes.dashboard.account.view(accountId),
                    },
                ]}
            />
            <div className="space-y-4">
                <WebSocketProvider>
                    <div className="container mx-auto max-w-5xl p-4">
                        <h1 className="mb-6 text-2xl font-bold">Live Swipe Session</h1>
                        <RealtimeSessionLog accountId={accountId} />
                    </div>
                </WebSocketProvider>
            </div>
        </div>
    );
}