"use client"

import {useEffect, useRef, useState} from "react"
import Image from "next/image"
import Link from "next/link"
import {ArrowLeft, ArrowLeftRight, Clock, Edit, Heart, MapPin, ThumbsUp, Wifi} from "lucide-react"
import {Card, CardContent} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Progress} from "@/components/ui/progress"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {ScrollArea} from "@/components/ui/scroll-area"
import type {BotAccountInterface, ModelInterface, ProxyInterface, StrategyInterface} from "@/types"
import {routes} from "@/lib/routes"
import {useModel} from "@/services/models/hooks";
import {useStrategy} from "@/services/strategy/hooks";
import {useProxy} from "@/services/proxy/hooks";
import {MapCard} from "@/components/cards/map-card";
import {useSwipesAccount} from "@/services/swipes/hooks";
import {SwipesCarousel} from "@/components/cards/swipe-card-caroussel";


interface AccountDetailViewProps {
    botAccount: BotAccountInterface
    recentSwipes?: BotAccountInterface[]
}

export default function SingleAccountCard({botAccount, recentSwipes = [],}: AccountDetailViewProps) {
    const [activeTab, setActiveTab] = useState("details")
    const [showMap, setShowMap] = useState(false)
    const mapRef = useRef(null)
    const [modelData, setModelData] = useState<ModelInterface | null>(null)
    const [strategyData, setStrategyData] = useState<StrategyInterface | null>(null)
    const [proxyData, setProxyData] = useState<ProxyInterface | null>(null)

    const modelId = typeof botAccount?.modele === "string" ? botAccount.modele : ''
    const strategyId = typeof botAccount?.strategy === "string" ? botAccount.strategy : ''
    const proxyId = typeof botAccount?.proxy === "string" ? botAccount.proxy : ''

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



    // Calculate progress percentage safely
    const strategyDays = strategyData?.days_number ?? 1
    const progressPercentage = botAccount.progress !== undefined && strategyDays > 0
        ? (botAccount.progress / strategyDays) * 100
        : 0

    // Get names safely
    const modelName = modelData?.name || "Unknown Model"
    const strategyName = strategyData?.name || "No Strategy"
    const proxyName = proxyData?.name || "No Proxy"

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

    return (
        <div className="flex h-screen flex-col md:flex-row">
            {/* Left side - Profile Image */}
            <div className="relative h-[40vh] w-full md:h-screen md:w-1/2">
                <div className="absolute left-4 top-4 z-10">
                    <Badge className={`${getStatusColor(botAccount.status)} absolute left-4 top-4`}>
                        {botAccount.status || "Unknown"}
                    </Badge>
                </div>
                <div className="absolute right-4 top-4 z-10">
                    <Badge variant="default" className=" backdrop-blur-sm">
                        {modelName}
                    </Badge>
                </div>
                <Image
                    src={botAccount.profile_url || "/placeholder.svg?height=800&width=600"}
                    alt={botAccount.title || "Bot account"}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Right side - Profile Details */}
            <div className="flex h-[60vh] w-full flex-col md:h-screen md:w-1/2">
                <div className="flex-none p-6">
                    <h1 className="mb-2 text-3xl font-bold">{botAccount.title || "Untitled"}</h1>
                    <div className="mb-4 flex items-center gap-2 ">
                        <Badge variant="secondary" className="">
                            {strategyName}
                        </Badge>
                        <div className="flex-1"></div>
                        <Wifi className="size-4" />
                        <span>{proxyName}</span>
                    </div>

                    <div className="mb-4">
                        <p className="mb-1 ">{botAccount.tinder_bio || "No bio available"}</p>
                    </div>

                    <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab}>
                        <TabsList className="mb-4 grid w-full grid-cols-2">
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="statistics">Statistics</TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="">Age Range:</span>
                                <span>
                                    {botAccount.min_age || 18} - {botAccount.max_age || 35} years
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Location:</span>
                                <span>{botAccount.location || "No location"}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Distance:</span>
                                <span>{botAccount.distance || 15} Km</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Strategy Days:</span>
                                <span>{strategyDays} days</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Proxy:</span>
                                <span>{proxyName}</span>
                            </div>
                        </TabsContent>

                        <TabsContent value="statistics" className="flex justify-between">
                            <div className="flex flex-col items-center">
                                <ThumbsUp className="mb-1 size-5 text-green-500" />
                                <span className="font-bold">{botAccount.likes || 0}</span>
                                <span className="text-xs text-gray-400">Likes</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <ArrowLeftRight className="mb-1 size-5 text-blue-500" />
                                <span className="font-bold">{botAccount.swipes || 0}</span>
                                <span className="text-xs text-gray-400">Swipes</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <Heart className="mb-1 size-5 text-rose-500" />
                                <span className="font-bold">{botAccount.matches || 0}</span>
                                <span className="text-xs text-gray-400">Matches</span>
                            </div>
                        </TabsContent>
                    </Tabs>

                    {typeof botAccount.progress === "number" && (
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <div className="flex items-center">
                                    <Clock className="mr-1 size-3.5" />
                                    <span>Progress</span>
                                </div>
                                <span className="font-medium">{progressPercentage.toFixed(0)}%</span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                        </div>
                    )}

                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <Link href={routes.dashboard.account.update(botAccount.id || "/")}>
                            <Button variant="outline" className="flex w-full items-center gap-2">
                                <Edit className="size-4" />
                                Edit Account
                            </Button>
                        </Link>

                        <Link href={routes.dashboard.account.index || "/"}>
                            <Button variant="outline" className="flex w-full items-center gap-2">
                                <ArrowLeft className="size-4" />
                                Back to Accounts
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Scrollable Recent Swipes Section */}
                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                        <div className="p-6">
                            <h2 className="mb-4 text-xl font-bold">Recent Swipes</h2>
                            {swipes.length > 0 ? (
                                <div className="w-full">
                                    <SwipesCarousel
                                        swipes={swipes}
                                        className="mb-6"
                                        onEdit={(id: string) => {
                                            // You can implement navigation to the swipe details page here
                                            console.log(`Edit swipe with ID: ${id}`)
                                        }}
                                    />
                                </div>
                            ) : (
                                <Card>
                                    <CardContent className="p-6 text-center">
                                        <p>No recent swipes available</p>
                                    </CardContent>
                                </Card>
                            )}

                            <Button
                                variant="outline"
                                className="mt-4 flex w-full items-center justify-center gap-2"
                                onClick={() => setShowMap(!showMap)}
                            >
                                <MapPin className="size-4" />
                                {showMap ? "Hide Location" : "Show Location"}
                            </Button>

                            {showMap && (
                                <div className="relative mt-4 h-[300px] overflow-hidden rounded-lg" ref={mapRef}>
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                                        <div className="text-center">
                                            <h3 className="mb-2 font-medium">{botAccount.location || "Location"}</h3>
                                            <p className="text-sm text-gray-400">Lat: {botAccount.latitude || "N/A"}</p>
                                            <p className="text-sm text-gray-400">Lng: {botAccount.longitude || "N/A"}</p>
                                        </div>
                                    </div>
                                    <MapCard
                                        latitude={botAccount.latitude || 0}
                                        longitude={botAccount.longitude || 0}
                                        title={botAccount.location || "Location"}
                                        zoom={13}
                                        className="absolute inset-0" />
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}
