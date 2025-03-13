"use client"

import {useRef, useState} from "react"
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

interface AccountDetailViewProps {
    botAccount: BotAccountInterface
    modelData?: ModelInterface | null
    strategyData?: StrategyInterface | null
    proxyData?: ProxyInterface | null
    recentSwipes?: BotAccountInterface[]
}

export default function AccountDetailView({
                                              botAccount,
                                              modelData,
                                              strategyData,
                                              proxyData,
                                              recentSwipes = [],
                                          }: AccountDetailViewProps) {
    const [activeTab, setActiveTab] = useState("details")
    const [showMap, setShowMap] = useState(false)
    const mapRef = useRef(null)

    if (!botAccount) return null

    // Calculate progress percentage safely
    const strategyDays = strategyData?.days_number ?? 1
    const progressPercentage =
        botAccount.progress !== undefined && strategyDays > 0 ? (botAccount.progress / strategyDays) * 100 : 0

    // Get names safely
    const modelName = modelData?.name || "Unknown Model"
    const strategyName = strategyData?.name || "No Strategy"
    const proxyName = proxyData?.name || "No Proxy"

    const getStatusColor = (status = "") => {
        switch (status.toLowerCase()) {
            case "active":
                return "bg-green-700 text-white"
            case "paused":
                return "bg-purple-700 text-white"
            case "banned":
                return "bg-red-700 text-white"
            case "inactive":
                return "bg-gray-800 text-gray-200"
            case "expired":
                return "bg-gray-700 text-gray-200"
            case "working":
                return "bg-blue-700 text-white"
            case "shadowbanned":
                return "bg-orange-700 text-white"
            default:
                return "bg-gray-800 text-gray-200"
        }
    }

    return (
        <div className="flex h-screen flex-col bg-black text-white md:flex-row">
            {/* Left side - Profile Image */}
            <div className="relative h-[40vh] w-full md:h-screen md:w-1/2">
                <div className="absolute left-4 top-4 z-10">
                    <Badge variant="outline" className="bg-black/50 text-white backdrop-blur-sm">
                        {botAccount.status || "Unknown"}
                    </Badge>
                </div>
                <div className="absolute right-4 top-4 z-10">
                    <Badge variant="outline" className="bg-black/50 text-white backdrop-blur-sm">
                        {modelName}
                    </Badge>
                </div>
                <Image
                    src={botAccount.profile_url ?? "/placeholder.svg?height=800&width=600"}
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
                    <div className="mb-4 flex items-center gap-2 text-gray-400">
                        <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                            {strategyName}
                        </Badge>
                        <div className="flex-1"></div>
                        <Wifi className="size-4" />
                        <span>{proxyName}</span>
                    </div>

                    <div className="mb-4">
                        <p className="mb-1 text-gray-300">{botAccount.tinder_bio || "No bio available"}</p>
                    </div>

                    <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab}>
                        <TabsList className="mb-4 grid w-full grid-cols-2">
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="statistics">Statistics</TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Age Range:</span>
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
                                <div className="flex items-center text-gray-400">
                                    <Clock className="mr-1 size-3.5" />
                                    <span>Progress</span>
                                </div>
                                <span className="font-medium">{progressPercentage.toFixed(0)}%</span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                        </div>
                    )}

                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <Button variant="outline" className="flex items-center gap-2">
                            <Edit className="size-4" />
                            Edit Account
                        </Button>
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

                            {recentSwipes.length > 0 ? (
                                <div className="space-y-4">
                                    {recentSwipes.map((swipe) => (
                                        <Card key={swipe.id} className="border-gray-800 bg-gray-900">
                                            <CardContent className="p-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="relative size-16 shrink-0 overflow-hidden rounded-md">
                                                        <Image
                                                            src={swipe.profile_url || "/placeholder.svg?height=64&width=64"}
                                                            alt={swipe.title || "Profile"}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <h3 className="font-medium">{swipe.title || "Unknown"}</h3>
                                                            <Badge className={getStatusColor(swipe.status)}>{swipe.status || "Unknown"}</Badge>
                                                        </div>
                                                        <p className="line-clamp-1 text-sm text-gray-400">{swipe.tinder_bio || "No bio"}</p>
                                                        <div className="mt-2 flex items-center gap-4 text-sm">
                                                            <div className="flex items-center gap-1">
                                                                <ThumbsUp className="size-3.5 text-green-500" />
                                                                <span>{swipe.likes || 0}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Heart className="size-3.5 text-rose-500" />
                                                                <span>{swipe.matches || 0}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card className="border-gray-800 bg-gray-900">
                                    <CardContent className="p-6 text-center">
                                        <p className="text-gray-400">No recent swipes available</p>
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
                                    <Image
                                        src="/placeholder.svg?height=300&width=600"
                                        alt="Map"
                                        fill
                                        className="object-cover opacity-50"
                                    />
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}

