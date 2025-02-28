"use client"

import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {ArrowLeftRight, Heart, PencilLine, ThumbsUp, Undo2} from "lucide-react"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import type {BotAccountInterface, ModelInterface, ProxyInterface, StrategyInterface} from "@/types"
import Image from "next/image"
import {useEffect, useState} from "react"
import {useModel} from "@/services/models/hooks"
import {useStrategy} from "@/services/strategy/hooks"
import {useProxy} from "@/services/proxy/hooks"
import {useSwipesAccount} from "@/services/swipes/hooks"
import {SwipeCard} from "@/components/cards/swipe-details-card"
import {MapCard} from "@/components/cards/map-card"
import {routes} from "@/lib/routes";
import Link from "next/link";

// Fix for default marker icon in Leaflet
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
})

export function SingleAccountCard({ botAccount }: Readonly<{ botAccount: BotAccountInterface }>) {
    const getStatusColor = (status = "") => {
        switch (status.toLowerCase()) {
            case "active":
                return "bg-green-700"
            case "paused":
                return "bg-yellow-500/10 text-yellow-500"
            case "error":
                return "bg-red-500/10 text-red-500"
            default:
                return "bg-gray-500/10 text-gray-500"
        }
    }

    const [modelData, setModelData] = useState<ModelInterface | null>(null)
    const [strategyData, setStrategyData] = useState<StrategyInterface | null>(null)
    const [proxyData, setProxyData] = useState<ProxyInterface | null>(null)

    const modelId = typeof botAccount?.modele === "string" ? botAccount.modele : ""
    const strategyId = typeof botAccount?.strategy === "string" ? botAccount.strategy : ""
    const proxyId = typeof botAccount?.proxy === "string" ? botAccount.proxy : ""

    const { data: fetchedModel } = useModel(modelId)
    const { data: fetchedStrategy } = useStrategy(strategyId)
    const { data: fetchedProxy } = useProxy(proxyId)
    const { data: swipes = [] } = useSwipesAccount(botAccount.id)

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

    // Get names safely
    const modelName = modelData?.name || "Unknown Model"
    const strategyName = strategyData?.name || "No Strategy"
    const proxyName = proxyData?.name || "No Proxy"


    const latitude = botAccount.latitude !== undefined ? parseFloat(botAccount.latitude.toString()) : 40.7128; // Default to NYC if not available
    const longitude = botAccount.longitude !== undefined ? parseFloat(botAccount.longitude.toString()) : -74.006;
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-12 grid gap-8 md:grid-cols-2">
                {/* Product Images */}
                <div className="space-y-4">
                    <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
                        <Image
                            src={botAccount.profile_url || "/placeholder.svg"}
                            alt="Product image"
                            fill
                            className="object-cover"
                            priority
                        />
                        <Badge className={`${getStatusColor(botAccount.status)} absolute left-4 top-4`}>
                            {botAccount.status || "Unknown"}
                        </Badge>
                        <Badge className="absolute right-4 top-4 rounded-full bg-gray-800/50 px-2 py-1 text-sm">{modelName}</Badge>
                    </div>

                    {/* Map Card */}

                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold">{botAccount.title}</h1>
                    <h2 className="text-xl font-semibold text-muted-foreground">{strategyName}</h2>



                    <p className="text-muted-foreground">{botAccount.tinder_bio}</p>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="rounded-lg bg-muted/30 p-4">
                                <h4 className="mb-2 font-medium">Details</h4>
                                <p className="text-sm text-muted-foreground">Age: {botAccount.min_age} ans - {botAccount.max_age} ans</p>
                                <p className="text-sm text-muted-foreground">Distance: {botAccount.distance} Km</p>
                            </div>
                            <div className="rounded-lg bg-muted/30 p-4">
                                <h4 className="mb-2 font-medium">Statistics</h4>
                                <div className="flex items-end justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1 text-emerald-600">
                                            <ThumbsUp className="size-5" />
                                            <span className="font-medium">{botAccount.likes}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-blue-600">
                                            <ArrowLeftRight className="size-5" />
                                            <span className="font-medium">{botAccount.swipes}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-red-600">
                                            <Heart className="size-5" />
                                            <span className="font-medium">{botAccount.matches}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="flex w-full  flex-wrap gap-2">
                        <Link href={routes.dashboard.account.update(botAccount.id)}>
                            <Button className="flex-1 gap-2" size="lg" >
                                <PencilLine size={20} strokeWidth={1.25} />
                                Edit Account
                            </Button>
                        </Link>
                        <Link href={routes.dashboard.account.index} >
                            <Button variant="outline" size="lg"  className="gap-2">
                                <Undo2 size={20}  strokeWidth={1.25} />
                                Back to Accounts
                            </Button>
                        </Link>
                    </div>

                    {/* Swipes Carousel */}
                    {swipes.length > 0 && (
                        <div className="mt-8">
                            <h2 className="mb-4 text-xl font-semibold">Recent Swipes</h2>
                            <div className="overflow-x-auto pb-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {swipes.map((swipe) => (
                                        <div key={swipe.id} className="w-full">
                                            <SwipeCard swipe={swipe} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <MapCard latitude={latitude} longitude={longitude} title={`${botAccount.title} location`} className="mt-4 w-full" />        </div>
    )
}

