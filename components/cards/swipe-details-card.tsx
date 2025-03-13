"use client"

import {ArrowLeftRight, Bot, Heart, MoreHorizontal, Shield, ThumbsUp, Wifi} from "lucide-react"
import {Card, CardContent, CardFooter} from "@/components/ui/card"
import {Progress} from "@/components/ui/progress"
import type {BotAccountInterface, StrategyInterface, SwipesInterface} from "@/types"
import {useEffect, useState} from "react"
import {useStrategy} from "@/services/strategy/hooks"
import {useBotaccount} from "@/services/bot-account/hooks"
import {Button} from "@/components/ui/button"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"

interface SwipeCardProps {
    swipe: SwipesInterface
    onEdit?: (id: string) => void
    onDelete?: (id: string) => void
    className?: string
}

export function SwipeCard({ swipe, onEdit, onDelete, className }: Readonly<SwipeCardProps>) {
    const [strategyData, setStrategyData] = useState<StrategyInterface | null>(null)
    const [accountData, setAccountData] = useState<BotAccountInterface | null>(null)

    const botAccountId = typeof swipe?.account === "object" ? swipe.account.id : swipe?.account || ""
    const strategyId = typeof swipe?.strategy === "string" ? swipe.strategy : ""

    const { data: fetchedStrategy } = useStrategy(strategyId)
    const { data: fetchedAccount } = useBotaccount(botAccountId)

    useEffect(() => {
        if (swipe) {
            if (typeof swipe.strategy === "object") {
                setStrategyData(swipe.strategy)
            } else if (fetchedStrategy) {
                setStrategyData(fetchedStrategy)
            }

            if (typeof swipe.account === "object") {
                setAccountData(swipe.account)
            } else if (fetchedAccount) {
                setAccountData(fetchedAccount)
            }
        }
    }, [fetchedStrategy, fetchedAccount, swipe])

    if (!swipe) return null

    const progressPercentage =
        accountData?.progress !== undefined && (strategyData?.days_number || 1) > 0
            ? (swipe.days / (strategyData?.days_number || 1)) * 100
            : 0

    return (
        <Card className={`overflow-hidden border-0 bg-[#111827] text-white shadow-lg ${className}`}>
            <CardContent className="p-6">
                <div className="space-y-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#1e293b]">
                                <Bot className="size-5 text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold tracking-tight">{accountData?.title || "Unnamed Bot"}</h3>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-8 text-gray-400 hover:text-white">
                                    <MoreHorizontal className="size-4" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {onEdit && <DropdownMenuItem onClick={() => onEdit(swipe.id)}>Edit</DropdownMenuItem>}
                                {onDelete && (
                                    <DropdownMenuItem onClick={() => onDelete(swipe.id)} className="text-red-500 focus:text-red-500">
                                        Delete
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Progress</span>
                            <span className="font-medium">{progressPercentage.toFixed(0)}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2 bg-[#1e293b]" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                            <Shield className="size-4 text-blue-400" />
                            <span className="truncate">{strategyData?.name || "Unknown Strategy"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Wifi className="size-4 text-blue-400" />
                            <span className="truncate">{accountData?.location || "Unknown Location"}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col items-center rounded-lg bg-[#1e293b] p-3 transition-colors hover:bg-[#2d3748]">
                            <ThumbsUp className="mb-2 size-5 text-blue-400" />
                            <span className="text-xl font-bold">{swipe.likes ?? 0}</span>
                            <span className="text-xs text-gray-400">Likes</span>
                        </div>
                        <div className="flex flex-col items-center rounded-lg bg-[#1e293b] p-3 transition-colors hover:bg-[#2d3748]">
                            <ArrowLeftRight className="mb-2 size-5 text-blue-400" />
                            <span className="text-xl font-bold">{swipe.swipe_number ?? 0}</span>
                            <span className="text-xs text-gray-400">Swipes</span>
                        </div>
                        <div className="flex flex-col items-center rounded-lg bg-[#1e293b] p-3 transition-colors hover:bg-[#2d3748]">
                            <Heart className="mb-2 size-5 text-blue-400" />
                            <span className="text-xl font-bold">{swipe.matches ?? 0}</span>
                            <span className="text-xs text-gray-400">Matches</span>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="border-t border-[#1e293b] bg-[#0f172a] p-4">
                <div className="flex w-full items-center justify-between">
                    <div className="text-sm text-gray-400">
                        {swipe.days} / {strategyData?.days_number || 0} days
                    </div>
                    <div className="flex gap-2">
                        {onEdit && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(swipe.id)}
                                className="border-[#1e293b] bg-transparent text-white hover:bg-[#1e293b]"
                            >
                                View Details
                            </Button>
                        )}
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

