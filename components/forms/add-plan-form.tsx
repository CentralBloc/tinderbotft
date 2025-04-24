"use client"

import type React from "react"
import {useState} from "react"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Textarea} from "@/components/ui/textarea"
import {Switch} from "@/components/ui/switch"
import {Button} from "@/components/ui/button"
import {useRouter} from "next/navigation"
import {routes} from "@/lib/routes"
import Link from "next/link"

interface PlanFormProps {
    mode: "add" | "update"
    initialData?: {
        name: string
        price: string
        billingCycle: string
        description: string
        features: string
        isActive: boolean
    }
}

export default function PlanForm({mode, initialData}: Readonly<PlanFormProps>) {
    const router = useRouter()
    const [planData, setPlanData] = useState({
        name: initialData?.name ?? "",
        price: initialData?.price ?? "",
        billingCycle: initialData?.billingCycle ?? "monthly",
        description: initialData?.description ?? "",
        features: initialData?.features ?? "",
        isActive: initialData?.isActive ?? true,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target
        setPlanData((prev) => ({...prev, [name]: value}))
    }

    const handleSelectChange = (name: string, value: string) => {
        setPlanData((prev) => ({...prev, [name]: value}))
    }

    const handleSwitchChange = (checked: boolean) => {
        setPlanData((prev) => ({...prev, isActive: checked}))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // API call logic here
        console.log("Submitting plan data:", planData)
        router.push(routes.dashboard.admin.plans.index)
    }

    return (
        <Card>
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <CardTitle>Plan Details</CardTitle>
                    <CardDescription>{mode === "add" ? "Create a new" : "Update"} subscription plan for your users</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Plan Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="e.g. Premium"
                                value={planData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Price</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="19.99"
                                    className="pl-7"
                                    value={planData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="billingCycle">Billing Cycle</Label>
                            <Select
                                value={planData.billingCycle}
                                onValueChange={(value) => handleSelectChange("billingCycle", value)}
                            >
                                <SelectTrigger id="billingCycle">
                                    <SelectValue placeholder="Select billing cycle"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <div className="flex items-center gap-2 pt-2">
                                <Switch id="status" checked={planData.isActive} onCheckedChange={handleSwitchChange}/>
                                <Label htmlFor="status" className="cursor-pointer">
                                    {planData.isActive ? "Active" : "Inactive"}
                                </Label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Enter plan description"
                            value={planData.description}
                            onChange={handleChange}
                            rows={4}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="features">Features (one per line)</Label>
                        <Textarea
                            id="features"
                            name="features"
                            placeholder="e.g. 10GB storage&#10;Unlimited projects&#10;Priority support"
                            value={planData.features}
                            onChange={handleChange}
                            rows={4}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Link href={routes.dashboard.admin.plans.index}>
                        <Button variant="outline">Cancel</Button>
                    </Link>
                    <Button type="submit">{mode === "add" ? "Create" : "Update"} Plan</Button>
                </CardFooter>
            </form>
        </Card>
    )
}