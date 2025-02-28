"use client"

import {useState} from "react"
import {Grid, Table} from "lucide-react"
import {Button} from "@/components/ui/button"
import {useBotaccounts} from "@/services/bot-account/hooks";
import {GridAccountCard} from "@/components/cards/grid-account-card";
import AccountTabs from "@/components/tabs/account-tabs";


export default function BotAccountsPage() {
    const [viewType, setViewType] = useState<"grid" | "table">("table")

    const { data: botAccounts = [] } = useBotaccounts()

    return (
        <div className="container mx-auto space-y-6 p-4">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <h1 className="text-3xl font-bold">Bot Accounts</h1>
                <div className="flex w-full items-center gap-4 sm:w-auto">

                    <div className="flex gap-1 rounded-lg bg-muted p-1">
                        <Button
                            variant={viewType === "table" ? "secondary" : "ghost"}
                            size="icon"
                            onClick={() => setViewType("table")}
                        >
                            <Table className="size-4" />
                        </Button>
                        <Button
                            variant={viewType === "grid" ? "secondary" : "ghost"}
                            size="icon"
                            onClick={() => setViewType("grid")}
                        >
                            <Grid className="size-4" />
                        </Button>

                    </div>
                </div>
            </div>

            <div
                className={
                    viewType === "grid" ? "grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4" : "grid grid-cols-1 gap-6"
                }
            >
                {botAccounts.map((bot) =>
                    {
                        if (viewType === "grid") {
                            return <GridAccountCard key={bot.id} botAccount={bot} />
                        } else {
                            return <AccountTabs key={bot.id} />
                        }
                    }
                )}
            </div>
        </div>
    )
}

