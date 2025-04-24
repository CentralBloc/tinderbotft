"use client"

import {useEffect, useMemo, useState} from "react"
import {Edit, MoreHorizontal, Plus, Search, Trash} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Badge} from "@/components/ui/badge"
import {Switch} from "@/components/ui/switch"
import {Input} from "@/components/ui/input"
import {usePlans} from "@/services/plans/hooks"
import Link from "next/link";
import {routes} from "@/lib/routes";

export function PlansList() {
    const {data: fetchedPlans = [], isLoading, isError} = usePlans();
    const [plans, setPlans] = useState<any[]>([]);
    const [filterValue, setFilterValue] = useState("");

    // Update plans state when fetchedPlans changes
    useEffect(() => {
        if (fetchedPlans && fetchedPlans.length > 0) {
            setPlans(fetchedPlans.map(plan => ({
                ...plan,
                status: plan.account_number > 0 ? "active" : "inactive",
                usersCount: plan.account_number || 0
            })));
        }
    }, [fetchedPlans]);

    // Filter plans based on filterValue
    const filteredPlans = useMemo(() => {
        return plans.filter((plan) => {
            const searchTerm = filterValue.toLowerCase();
            return (
                (plan.name || '').toLowerCase().includes(searchTerm) ||
                (plan.description || '').toLowerCase().includes(searchTerm) ||
                (plan.status || '').toLowerCase().includes(searchTerm)
            );
        });
    }, [plans, filterValue]);

    const togglePlanStatus = (planId: string) => {
        setPlans(
            plans.map((plan) =>
                plan.id === planId
                    ? {
                        ...plan,
                        status: plan.status === "active" ? "inactive" : "active",
                    }
                    : plan,
            ),
        )
    }

    if (isLoading) {
        return <div>Loading plans...</div>;
    }

    if (isError) {
        return <div>Error loading plans. Please try again later.</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>

                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold">All Plans</h2>
                        </div>
                        <Link href={routes.dashboard.admin.plans.add}>
                            <Button>
                                <Plus className="mr-2 size-4"/>
                                Create Plan
                            </Button>
                        </Link>
                    </div>
                </CardTitle>
                <CardDescription>A list of all subscription plans in your application</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4 flex items-center">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground"/>
                        <Input
                            type="text"
                            placeholder="Search plans..."
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Users</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPlans.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No plans found.
                                </TableCell>
                            </TableRow>
                        ) : filteredPlans.map((plan) => (
                            <TableRow key={plan.id}>
                                <TableCell>
                                    <div className="font-medium">{plan.name}</div>
                                    <div className="text-sm text-muted-foreground">{plan.description}</div>
                                </TableCell>
                                <TableCell>
                                    ${plan.price}/mo
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Switch checked={plan.status === "active"}
                                                onCheckedChange={() => togglePlanStatus(plan.id)}/>
                                        <Badge variant={plan.status === "active" ? "default" : "secondary"}>
                                            {plan.status === "active" ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell>{plan.usersCount}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="size-4"/>
                                                <span className="sr-only">Open menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator/>
                                            <DropdownMenuItem>
                                                <Edit className="mr-2 size-4"/>
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator/>
                                            <DropdownMenuItem className="text-destructive">
                                                <Trash className="mr-2 size-4"/>
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}