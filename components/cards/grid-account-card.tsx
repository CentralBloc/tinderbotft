"use client"

import {ArrowLeftRight, Heart, MapPin, ThumbsUp} from 'lucide-react'
import {Progress} from "@/components/ui/progress"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardFooter} from "@/components/ui/card"
import {BotAccountInterface, ModelInterface, ProxyInterface, StrategyInterface} from "@/types"
import Image from "next/image"
import {useEffect, useState} from "react"
import {useModel} from "@/services/models/hooks";
import {useStrategy} from "@/services/strategy/hooks";
import {useProxy} from "@/services/proxy/hooks";
import {routes} from "@/lib/routes";
import Link from "next/link";


interface GridCardProps {
    botAccount: BotAccountInterface
    onFavorite?: (id: string) => void
    onViewDetails?: (id: string) => void
}

export function GridAccountCard({ botAccount, onFavorite, onViewDetails }: GridCardProps) {
    const [modelData, setModelData] = useState<ModelInterface | null>(null)
    const [strategyData, setStrategyData] = useState<StrategyInterface | null>(null)
    const [proxyData, setProxyData] = useState<ProxyInterface | null>(null)

    const modelId = typeof botAccount?.modele === "string" ? botAccount.modele : ''
    const strategyId = typeof botAccount?.strategy === "string" ? botAccount.strategy : ''
    const proxyId = typeof botAccount?.proxy === "string" ? botAccount.proxy : ''

    const { data: fetchedModel } = useModel(modelId)
    const { data: fetchedStrategy } = useStrategy(strategyId)
    const { data: fetchedProxy } = useProxy(proxyId)

    useEffect(() => {
        if (botAccount) {
            if (typeof botAccount.modele === "object" && botAccount.modele !== null) {
                setModelData(botAccount.modele)
            } else if (fetchedModel) {
                setModelData(fetchedModel)
            }

            if (typeof botAccount.strategy === "object" && botAccount.strategy !== null) {
                setStrategyData(botAccount.strategy)
            } else if (fetchedStrategy) {
                setStrategyData(fetchedStrategy)
            }

            if (typeof botAccount.proxy === "object" && botAccount.proxy !== null) {
                setProxyData(botAccount.proxy)
            } else if (fetchedProxy) {
                setProxyData(fetchedProxy)
            }
        }
    }, [botAccount, fetchedModel, fetchedStrategy, fetchedProxy])

    if (!botAccount) return null

    const getStatusColor = (status = "") => {
        switch (status.toLowerCase()) {
            case "active":
                return "bg-green-800"
            case "expired":
                return "bg-gray-800"
            case "working":
                return "bg-blue-800"
            case "inactive":
                return "bg-dark"
            case "banned":
                return "bg-red-800"
            case "shadowban":
                return "bg-organge-800"
            case "paused":
                return "bg-purple-800"
            case "completed":
                return "bg-amber-800"
        }
    }

    // Calculate progress percentage safely
    const strategyDays = strategyData?.days_number ?? 1
    const progressPercentage = botAccount.progress !== undefined && strategyDays > 0
        ? (botAccount.progress / strategyDays) * 100
        : 0

    // Get names safely
    const modelName = modelData?.name || "Unknown Model"
    const strategyName = strategyData?.name || "No Strategy"
    const proxyName = proxyData?.name || "No Proxy"

    return (
        <Card className="group overflow-hidden">
            <div className="relative">
                <Image
                    src={botAccount.profile_url || "/placeholder.svg?height=192&width=384"}
                    alt={botAccount.title || "Bot account"}
                    width={300}
                    height={192}
                    className="max-h-48 w-full object-cover transition-transform group-hover:scale-105"
                />
                <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-4 top-4 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => onFavorite?.(botAccount.id)}
                >
                    <Heart className="size-4" />
                    <span className="sr-only">Favorite</span>
                </Button>
                <Badge className={`${getStatusColor(botAccount.status)} absolute left-4 top-4`}>
                    {botAccount.status || "Unknown"}
                </Badge>
            </div>
            <CardContent className="p-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-primary/10">
                            {modelName}
                        </Badge>
                        <p className="text-lg font-bold">{strategyName}</p>
                    </div>
                    <h3 className="truncate font-semibold">{botAccount.title || "Untitled"}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="bg- mr-1 size-4" />
                        <span className="truncate">{botAccount.location || "No location"}</span>
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <ArrowLeftRight className="size-4" />
                        <span>{botAccount.swipes || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <ThumbsUp className="size-4" />
                        <span>{botAccount.likes || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Heart className="size-4" />
                        <span>{botAccount.matches || 0}</span>
                    </div>
                </div>
                {typeof botAccount.progress === "number" && (
                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{progressPercentage.toFixed(0)}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                    </div>
                )}
            </CardContent>
            <CardFooter className="bg-muted/50 p-4">
                <Link href={routes.dashboard.account.view(botAccount.id ?? "")} className="w-full">
                    <Button className="w-full" >
                        View Details
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
