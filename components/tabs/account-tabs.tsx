"use client"

import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {TabsContent} from "@radix-ui/react-tabs";
import AccountList from "@/components/tables/account/account-list";
import {accountListColumns, accountStatsColumns} from "@/components/tables/account/account-columns";
import {ChartNoAxesCombined, Users} from "lucide-react";

type AccountTabsProps = {
    externalFilters?: {
        accountFilter: string
        modelFilter: string | null
        statusFilter: string | null
        setAccountFilter: (value: string) => void
        setModelFilter: (value: string | null) => void
        setStatusFilter: (value: string | null) => void
    }
}

export default function AccountTabs({ externalFilters }: Readonly<AccountTabsProps>) {
    return (
        <Tabs defaultValue="account" className="w-full">
            <TabsList className="m-2 w-full">
                <TabsTrigger className="w-full" value="account"><Users size={15} /> Account</TabsTrigger>
                <TabsTrigger className="w-full" value="stats"><ChartNoAxesCombined size={15} /> Statistics</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
                <AccountList customColumns={accountListColumns} externalFilters={externalFilters} />
            </TabsContent>
            <TabsContent value="stats">
                <AccountList customColumns={accountStatsColumns} externalFilters={externalFilters} />
            </TabsContent>
        </Tabs>
    )
}
