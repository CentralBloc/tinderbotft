"use client"

import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {TabsContent} from "@radix-ui/react-tabs";
import AccountList from "@/components/tables/account/account-list";
import {accountListColumns, accountStatsColumns} from "@/components/tables/account/account-columns";
import {ChartNoAxesCombined, Users} from "lucide-react";


export default function  AccountTabs() {
    return (
        <Tabs defaultValue="account" className="w-full">
            <TabsList className="m-2 w-full">
                <TabsTrigger className="w-full" value="account"><Users size={15} /> Account</TabsTrigger>
                <TabsTrigger className="w-full" value="stats"><ChartNoAxesCombined size={15} /> Statistics</TabsTrigger>
            </TabsList>
            <TabsContent value="account"><AccountList customColumns={accountListColumns} /></TabsContent>
            <TabsContent value="stats"><AccountList customColumns={accountStatsColumns} /></TabsContent>
        </Tabs>
    )
}
