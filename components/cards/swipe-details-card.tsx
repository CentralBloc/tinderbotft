import {ArrowLeftRight, Bot, Heart, Shield, ThumbsUp, Wifi} from 'lucide-react'
import {Card, CardContent, CardFooter} from "@/components/ui/card"
import {Progress} from "@/components/ui/progress"
import {BotAccountInterface, StrategyInterface, SwipesInterface} from "@/types"
import {useEffect, useState} from "react"
import {useStrategy} from "@/services/strategy/hooks"
import {useBotaccount} from "@/services/bot-account/hooks"

interface GridCardProps {
    swipe: SwipesInterface
    onEdit?: (id: string) => void
    onDelete?: (id: string) => void
}

export function SwipeCard({ swipe, onEdit, onDelete }: Readonly<GridCardProps>) {
    const [strategyData, setStrategyData] = useState<StrategyInterface | null>(null)
    const [accountData, setAccountData] = useState<BotAccountInterface | null>(null)

    const botAccountId = typeof swipe?.account === "object" ? swipe.account.id : swipe?.account || ''
    const strategyId = typeof swipe?.strategy === "string" ? swipe.strategy : ''

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

    const progressPercentage = accountData?.progress !== undefined && (strategyData?.days_number || 1) > 0
        ? ((swipe.days) / (strategyData?.days_number || 1)) * 100
        : 0

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bot className="size-5 text-muted-foreground" />
                            <h3 className="truncate font-semibold">{accountData?.title || "Unnamed Bot"}</h3>
                        </div>
                    </div>

                    {typeof accountData?.progress === "number" && (
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">{progressPercentage.toFixed(0)}%</span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Shield className="size-4" />
                            <span className="truncate">{strategyData?.name || "Unknown Strategy"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Wifi className="size-4" />
                            <span className="truncate">{accountData?.location || "Unknown Location"}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2">
                        <div className="flex flex-col items-center rounded-lg bg-muted p-2">
                            <ThumbsUp className="mb-1 size-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{swipe.likes ?? 0}</span>
                            <span className="text-xs text-muted-foreground">Likes</span>
                        </div>
                        <div className="flex flex-col items-center rounded-lg bg-muted p-2">
                            <ArrowLeftRight className="mb-1 size-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{swipe.swipe_number ?? 0}</span>
                            <span className="text-xs text-muted-foreground">Swipes</span>
                        </div>
                        <div className="flex flex-col items-center rounded-lg bg-muted p-2">
                            <Heart className="mb-1 size-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{swipe.matches ?? 0}</span>
                            <span className="text-xs text-muted-foreground">Matches</span>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="gap-3 p-6 pt-0">

            </CardFooter>
        </Card>
    )
}
