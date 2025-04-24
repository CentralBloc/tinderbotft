"use client"

import Link from "next/link"
import {ArrowLeft} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {routes} from "@/lib/routes"
import AddOrUpdateSubscriptionForm from "@/components/forms/add-subscription-form"

export default function NewSubscriptionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href={routes.dashboard.admin.plans.index}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="size-4"/>
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create New Subscription</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Details</CardTitle>
          <CardDescription>Create a new subscription for a user</CardDescription>
        </CardHeader>
        <CardContent>
          <AddOrUpdateSubscriptionForm mode="add"/>
        </CardContent>
      </Card>
    </div>
  )
}