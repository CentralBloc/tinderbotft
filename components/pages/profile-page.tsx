"use client"

import {useState} from "react"
import {CheckCircle, CreditCard, Edit, User} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Avatar, AvatarFallback} from "@/components/ui/avatar"
import {Badge} from "@/components/ui/badge"
import {Separator} from "@/components/ui/separator"
import useAuth from "@/contexts/auth/hook";
import {ProfileForm} from "@/components/forms/profile-form";
import {PasswordForm} from "@/components/forms/password-form";
import {ProfileAvatar} from "@/components/pagers/profile-avatar";
import {z} from "zod";
import {updateProfileSchema} from "@/lib/validations/user";

export default function ProfilePager() {
    const [isEditing, setIsEditing] = useState(false)
    const { user, isLoading } = useAuth();

    const handleProfileUpdate = async (data: z.infer<typeof updateProfileSchema>) => {
        console.log("Updating profile:", data)
        // Implement your API call here
    }

    // Handle password update
    const handlePasswordUpdate = async (data: any) => {
        console.log("Updating password:", data)
        // Implement your API call here
    }

    return (
        <div>
            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="border">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="subscription">Subscription</TabsTrigger>
                    <TabsTrigger value="organization">Organization</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-[250px_1fr]">
                        {/* Profile Avatar */}
                        {user ? <ProfileAvatar user={user} /> : <div>Loading...</div>}

                        <div className="space-y-6">
                            {/* Personal Information Form */}
                            {user ? <ProfileForm user={user} onSubmit={handleProfileUpdate} /> : <div>Loading...</div>}

                            {/* Password Form */}
                                <PasswordForm onSubmit={handlePasswordUpdate} />
                        </div>
                    </div>
                </TabsContent>

                {/* Subscription Tab */}
                <TabsContent value="subscription" className="mt-6">
                    <Card className="border-slate-800 bg-slate-900">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Subscription Details</span>
                                <Badge className="bg-emerald-900 text-emerald-300 hover:bg-emerald-900">Active</Badge>
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Manage your subscription plan and billing information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold">Pro Plan</h3>
                                        <p className="mt-1 flex items-center text-emerald-400">
                                            <CheckCircle size={16} className="mr-1" /> Active until April 15, 2025
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold">
                                            $49.99<span className="text-sm font-normal text-slate-400">/month</span>
                                        </p>
                                        <p className="text-sm text-slate-400">Billed monthly</p>
                                    </div>
                                </div>

                                <Separator className="my-4 bg-slate-700" />

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={16} className="text-emerald-400" />
                                        <span className="text-sm">Unlimited swipes</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={16} className="text-emerald-400" />
                                        <span className="text-sm">Advanced analytics</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={16} className="text-emerald-400" />
                                        <span className="text-sm">Custom strategies</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={16} className="text-emerald-400" />
                                        <span className="text-sm">Priority support</span>
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-3">
                                    <Button className="bg-slate-700 hover:bg-slate-600">Change Plan</Button>
                                    <Button variant="outline" className="border-slate-700 hover:bg-slate-800">
                                        Cancel Subscription
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-4 text-lg font-medium">Payment Method</h3>
                                <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded bg-slate-700 p-2">
                                            <CreditCard size={20} />
                                        </div>
                                        <div>
                                            <p className="font-medium">•••• •••• •••• 4242</p>
                                            <p className="text-sm text-slate-400">Expires 09/2025</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" className="hover:bg-slate-700">
                                        Update
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-4 text-lg font-medium">Billing History</h3>
                                <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
                                    <div className="grid grid-cols-4 bg-slate-900 p-3 text-sm font-medium text-slate-400">
                                        <div>Date</div>
                                        <div>Amount</div>
                                        <div>Status</div>
                                        <div className="text-right">Invoice</div>
                                    </div>
                                    <div className="divide-y divide-slate-700">
                                        <div className="grid grid-cols-4 p-3 text-sm">
                                            <div>Mar 15, 2023</div>
                                            <div>$49.99</div>
                                            <div>
                                                <Badge className="bg-emerald-900 text-emerald-300">Paid</Badge>
                                            </div>
                                            <div className="text-right">
                                                <Button variant="link" className="h-auto p-0">
                                                    Download
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 p-3 text-sm">
                                            <div>Feb 15, 2023</div>
                                            <div>$49.99</div>
                                            <div>
                                                <Badge className="bg-emerald-900 text-emerald-300">Paid</Badge>
                                            </div>
                                            <div className="text-right">
                                                <Button variant="link" className="h-auto p-0">
                                                    Download
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 p-3 text-sm">
                                            <div>Jan 15, 2023</div>
                                            <div>$49.99</div>
                                            <div>
                                                <Badge className="bg-emerald-900 text-emerald-300">Paid</Badge>
                                            </div>
                                            <div className="text-right">
                                                <Button variant="link" className="h-auto p-0">
                                                    Download
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Organization Tab */}
                <TabsContent value="organization" className="mt-6">
                    <Card className="border-slate-800 bg-slate-900">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Organization Details</span>
                                <Button variant="outline" className="border-slate-700 hover:bg-slate-800">
                                    <Edit size={16} className="mr-2" />
                                    Edit Organization
                                </Button>
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Manage your organization settings and team members
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Organization Name</label>
                                        <Input
                                            disabled
                                            defaultValue="Diamond Factory"
                                            className="border-slate-700 bg-slate-800 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Industry</label>
                                        <Input
                                            disabled
                                            defaultValue="Technology"
                                            className="border-slate-700 bg-slate-800 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Website</label>
                                        <Input
                                            disabled
                                            defaultValue="https://diamondfactory.com"
                                            className="border-slate-700 bg-slate-800 text-white"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Organization Size</label>
                                        <Input
                                            disabled
                                            defaultValue="10-50 employees"
                                            className="border-slate-700 bg-slate-800 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Location</label>
                                        <Input
                                            disabled
                                            defaultValue="Paris, France"
                                            className="border-slate-700 bg-slate-800 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Founded</label>
                                        <Input disabled defaultValue="2018" className="border-slate-700 bg-slate-800 text-white" />
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-slate-800" />

                            <div>
                                <h3 className="mb-4 text-lg font-medium">Team Members</h3>
                                <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
                                    <div className="grid grid-cols-4 bg-slate-900 p-3 text-sm font-medium text-slate-400">
                                        <div>Name</div>
                                        <div>Email</div>
                                        <div>Role</div>
                                        <div className="text-right">Actions</div>
                                    </div>
                                    <div className="divide-y divide-slate-700">
                                        <div className="grid grid-cols-4 items-center p-3">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="size-8">
                                                    <AvatarFallback className="bg-slate-700 text-xs">U7</AvatarFallback>
                                                </Avatar>
                                                <span>Ulrich</span>
                                            </div>
                                            <div className="text-sm">uhoungbo@gmail.com</div>
                                            <div>
                                                <Badge className="bg-blue-900 text-blue-300">Admin</Badge>
                                            </div>
                                            <div className="text-right">
                                                <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-400">
                                                    Manage
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 items-center p-3">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="size-8">
                                                    <AvatarFallback className="bg-slate-700 text-xs">JD</AvatarFallback>
                                                </Avatar>
                                                <span>John Doe</span>
                                            </div>
                                            <div className="text-sm">john@example.com</div>
                                            <div>
                                                <Badge className="bg-slate-700 text-slate-300">Member</Badge>
                                            </div>
                                            <div className="text-right">
                                                <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-400">
                                                    Manage
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 items-center p-3">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="size-8">
                                                    <AvatarFallback className="bg-slate-700 text-xs">AS</AvatarFallback>
                                                </Avatar>
                                                <span>Alice Smith</span>
                                            </div>
                                            <div className="text-sm">alice@example.com</div>
                                            <div>
                                                <Badge className="bg-slate-700 text-slate-300">Member</Badge>
                                            </div>
                                            <div className="text-right">
                                                <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-400">
                                                    Manage
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Button className="bg-slate-800 hover:bg-slate-700">
                                        <User size={16} className="mr-2" />
                                        Invite Team Member
                                    </Button>
                                </div>
                            </div>

                            <Separator className="bg-slate-800" />

                            <div>
                                <h3 className="mb-4 text-lg font-medium">Organization Settings</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800 p-4">
                                        <div>
                                            <h4 className="font-medium">Two-Factor Authentication</h4>
                                            <p className="text-sm text-slate-400">Require 2FA for all team members</p>
                                        </div>
                                        <Button variant="outline" className="border-slate-700 hover:bg-slate-700">
                                            Enable
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800 p-4">
                                        <div>
                                            <h4 className="font-medium">API Access</h4>
                                            <p className="text-sm text-slate-400">Manage API keys and permissions</p>
                                        </div>
                                        <Button variant="outline" className="border-slate-700 hover:bg-slate-700">
                                            Manage
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800 p-4">
                                        <div>
                                            <h4 className="font-medium">Single Sign-On</h4>
                                            <p className="text-sm text-slate-400">Configure SSO with your identity provider</p>
                                        </div>
                                        <Button variant="outline" className="border-slate-700 hover:bg-slate-700">
                                            Configure
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

