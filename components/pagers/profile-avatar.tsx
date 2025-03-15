"use client"

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {UserInterface} from "@/types";

type ProfileAvatarProps = {
    user: UserInterface,
    memberSince?: string
    planType?: string
}

export function ProfileAvatar({ user, memberSince = "March 2023", planType = "Pro Plan" }: ProfileAvatarProps) {
    return (
        <Card>
            <CardContent className="flex flex-col items-center p-6">
                <div className="relative my-6">
                    <Avatar className="size-32 border-4 border-slate-700">
                        <AvatarImage src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${user?.email}`} alt={user?.username} />
                        <AvatarFallback className="bg-slate-700 text-3xl">
                            {user?.username?.substring(0, 2).toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute bottom-0 right-0 rounded-full border bg-slate-700 hover:bg-slate-600"
                    >
                        <span className="sr-only">Change avatar</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-pencil"
                        >
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            <path d="m15 5 4 4" />
                        </svg>
                    </Button>
                </div>
                <h3 className="text-xl font-medium">{user?.username}</h3>
                <p className="text-sm text-slate-400">Member since {memberSince}</p>
                <Badge className="mt-4 bg-emerald-900 text-emerald-300 hover:bg-emerald-900">{planType}</Badge>
            </CardContent>
        </Card>
    )
}
