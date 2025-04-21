"use client"

import {
    ArrowLeftRight,
    Heart,
    MapPin,
    MoreVertical,
    ThumbsUp
} from "lucide-react"
import {Progress} from "@/components/ui/progress"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardFooter} from "@/components/ui/card"
import type {BotAccountInterface, ModelInterface, ProxyInterface, StrategyInterface} from "@/types"
import Image from "next/image"
import {useEffect, useState} from "react"
import {useModel} from "@/services/models/hooks"
import {useStrategy} from "@/services/strategy/hooks"
import {useProxy} from "@/services/proxy/hooks"
import {routes} from "@/lib/routes"
import Link from "next/link"
import {cn, getStatusColor} from "@/lib/utils"
import {AccountContextMenu} from "@/components/ui/account-context-menu";

interface GridCardProps {
    botAccount: BotAccountInterface
    onFavorite?: (id: string) => void
    onViewDetails?: (id: string) => void
    className?: string
    onPlay?: (id: string) => void
    onLocation?: (id: string) => void
    onSync?: (id: string) => void
    onEdit?: (id: string) => void
    onDelete?: (id: string) => void
}

export function GridAccountCard({
                                    botAccount,
                                    onFavorite,
                                    onViewDetails,
                                    className,
                                    onPlay,
                                    onLocation,
                                    onSync,
                                    onEdit,
                                    onDelete,
                                }: GridCardProps) {
    const [modelData, setModelData] = useState<ModelInterface | null>(null)
    const [strategyData, setStrategyData] = useState<StrategyInterface | null>(null)
    const [proxyData, setProxyData] = useState<ProxyInterface | null>(null)
    const [isFavorite, setIsFavorite] = useState(false)

    const modelId = typeof botAccount?.modele === "string" ? botAccount.modele : ""
    const strategyId = typeof botAccount?.strategy === "string" ? botAccount.strategy : ""
    const proxyId = typeof botAccount?.proxy === "string" ? botAccount.proxy : ""

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

    // Get country code for flag
    const countryCode = botAccount.location || "FR"
    const flagUrl = `https://flagsapi.com/${countryCode}/flat/32.png`

    // Format birth date
    const birthDate = botAccount.birth_date ? new Date(botAccount.birth_date) : null
    const age = birthDate ? new Date().getFullYear() - birthDate.getFullYear() : null

    // Calculate progress percentage safely
    const strategyDays = strategyData?.days_number ?? 1
    const progressPercentage =
        botAccount.strategy && botAccount.progress !== undefined && strategyDays > 0
            ? (botAccount.progress / strategyDays) * 100
            : 0;
    // Get names safely
    const modelName = modelData?.name || "Unknown Model"
    const strategyName = strategyData?.name || "No Strategy"

    const handleFavorite = () => {
        setIsFavorite(!isFavorite)
        if (onFavorite) onFavorite(botAccount.id)
    }

    return (
        <Card className={cn("group overflow-hidden transition-all hover:shadow-md", className)}>
            <div className="relative">
                {/* Image with gradient overlay */}
                <div className="relative h-48 w-full overflow-hidden sm:h-40 md:h-48 lg:h-52">
                    <Image
                        src={botAccount.profile_url || "/placeholder.svg?height=192&width=384"}
                        alt={botAccount.title || "Bot account"}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>

                {/* Status badge */}
                <Badge
                    className={`${getStatusColor(botAccount.status)} absolute left-3 top-3 px-2 py-1 text-xs font-medium uppercase tracking-wider`}
                >
                    {botAccount.status || "Unknown"}
                </Badge>

                {/* Favorite button */}

                {/* Interest badges */}

                {/* Title and location */}
                <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                    <div className="flex items-center justify-between">
                        <h3 className="truncate text-lg font-bold">{botAccount.title || "Untitled"}</h3>
                        {age && (
                            <Badge variant="outline" className="border-white/30 bg-black/30 text-white backdrop-blur-sm">
                                {age}
                            </Badge>
                        )}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-1.5">
                            <MapPin className="size-3.5" />
                            <span className="truncate">{botAccount.location || "No location"}</span>
                        </div>
                        <div className="size-4 overflow-hidden rounded-sm">
                            <Image
                                src={flagUrl || "/placeholder.svg"}
                                alt={`${countryCode} flag`}
                                width={16}
                                height={16}
                                className="size-full object-cover"
                            />
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-1 right-2">
                    <AccountContextMenu 
                        account={botAccount}
                        trigger={
                            <Button
                                size="icon"
                                variant="ghost"
                                className="size-7 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50"
                            >
                                <MoreVertical size={18} className="text-white" />
                            </Button>
                        }
                    />
                </div>
            </div>

            <CardContent className="p-3 sm:p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="outline" className="bg-primary/5 text-primary text-xs sm:text-sm">
                        {modelName}
                    </Badge>
                    <Badge variant="secondary" className="bg-muted text-xs sm:text-sm">
                        {strategyName}
                    </Badge>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-1 sm:gap-2">
                    <div className="flex flex-col items-center rounded-md bg-muted/50 p-1 sm:p-2">
                        <ArrowLeftRight className="mb-1 size-3 sm:size-4 text-blue-500" />
                        <span className="text-xs sm:text-sm font-medium">{botAccount.swipes || 0}</span>
                        <span className="text-[10px] sm:text-xs text-muted-foreground">Swipes</span>
                    </div>
                    <div className="flex flex-col items-center rounded-md bg-muted/50 p-1 sm:p-2">
                        <ThumbsUp className="mb-1 size-3 sm:size-4 text-primary" />
                        <span className="text-xs sm:text-sm font-medium">{botAccount.likes || 0}</span>
                        <span className="text-[10px] sm:text-xs text-muted-foreground">Likes</span>
                    </div>
                    <div className="flex flex-col items-center rounded-md bg-muted/50 p-1 sm:p-2">
                        <Heart className="mb-1 size-3 sm:size-4 text-rose-500" />
                        <span className="text-xs sm:text-sm font-medium">{botAccount.matches || 0}</span>
                        <span className="text-[10px] sm:text-xs text-muted-foreground">Matches</span>
                    </div>
                </div>

                {/* Progress bar */}
                {typeof botAccount.progress === "number" && (
                    <div className="mt-3 sm:mt-4 space-y-1">
                        <div className="flex justify-between text-[10px] sm:text-xs">
                            <span className="text-muted-foreground">Strategy Progress</span>
                            <span className="font-medium">{progressPercentage.toFixed(0)}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-1 sm:h-1.5" />
                    </div>
                )}
            </CardContent>

            <CardFooter className="border-t bg-card p-2 sm:p-3">
                <Link href={routes.dashboard.account.view(botAccount.id ?? "")} className="w-full">
                    <Button 
                        variant="default" 
                        className="w-full text-xs sm:text-sm h-8 sm:h-10" 
                        onClick={() => onViewDetails?.(botAccount.id)}
                    >
                        View Profile
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
