"use client"

import {useEffect, useRef, useState} from "react"
import Image from "next/image"
import Link from "next/link"
import {
    ArrowLeft,
    ArrowLeftRight,
    CircleSmall,
    Clock,
    Edit,
    GraduationCap,
    Heart,
    MapPin,
    Orbit,
    Radio,
    School,
    ThumbsUp,
    User,
    Wifi,
} from "lucide-react"
import {Card, CardContent} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import type {BotAccountInterface, ModelInterface, ProxyInterface, StrategyInterface} from "@/types"
import {routes} from "@/lib/routes"
import {useModel} from "@/services/models/hooks"
import {useStrategy} from "@/services/strategy/hooks"
import {useProxy} from "@/services/proxy/hooks"
import {useSwipesAccount} from "@/services/swipes/hooks"
import {MapCard} from "@/components/cards/map-card";
import {Progress} from "@/components/ui/progress";
import {SwipesCarousel} from "@/components/cards/swipe-card-caroussel";

interface AccountDetailViewProps {
    botAccount: BotAccountInterface
    recentSwipes?: BotAccountInterface[]
}

export default function SingleAccountCard({ botAccount, recentSwipes = [] }: AccountDetailViewProps) {
    const [activeTab, setActiveTab] = useState("details")
    const [showMap, setShowMap] = useState(false)
    const mapRef = useRef(null)
    const [modelData, setModelData] = useState<ModelInterface | null>(null)
    const [strategyData, setStrategyData] = useState<StrategyInterface | null>(null)
    const [proxyData, setProxyData] = useState<ProxyInterface | null>(null)

    const modelId = typeof botAccount?.modele === "string" ? botAccount.modele : ""
    const strategyId = typeof botAccount?.strategy === "string" ? botAccount.strategy : ""
    const proxyId = typeof botAccount?.proxy === "string" ? botAccount.proxy : ""

    const { data: fetchedModel } = useModel(modelId)
    const { data: fetchedStrategy } = useStrategy(strategyId)
    const { data: fetchedProxy } = useProxy(proxyId)
    const { data: swipes = [], refetch: refeshSwipes } = useSwipesAccount(botAccount.id)

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
            refeshSwipes()

        }
    }, [botAccount, fetchedModel, fetchedStrategy, fetchedProxy, refeshSwipes])

    // Calculate progress percentage safely
    const strategyDays = strategyData?.days_number ?? 1
    const progressPercentage =
      botAccount.strategy && botAccount.progress !== undefined && strategyDays > 0
        ? (botAccount.progress / strategyDays) * 100
        : 0;
    // Get names safely
    const modelName = modelData?.name || "Unknown Model"
    const strategyName = strategyData?.name || "No Strategy"
    const proxyName = proxyData?.name || "No Proxy"

    // Get country code for flag
    const countryCode = botAccount.location || "FR"
    const flagUrl = `https://flagsapi.com/${countryCode}/flat/64.png`

    // Format birth date
    const birthDate = botAccount.birth_date ? new Date(botAccount.birth_date) : null
    const age = birthDate ? new Date().getFullYear() - birthDate.getFullYear() : null

    const getStatusColor = (status = "") => {
        switch (status.toLowerCase()) {
            case "active":
                return "bg-green-800 text-white"
            case "expired":
                return "bg-gray-800 text-white"
            case "working":
                return "bg-blue-800 text-white"
            case "inactive":
                return "bg-slate-800 text-white"
            case "banned":
                return "bg-red-800 text-white"
            case "shadowban":
                return "bg-orange-800 text-white"
            case "limited":
                return "bg-purple-800 text-white"
            case "completed":
                return "bg-amber-800 text-white"
            case "standby":
                return "bg-sky-600 text-white"
            default:
                return "bg-slate-800 text-white"
        }
    }

    function getZodiacSymbol(zodiac: string): string {
        switch (zodiac.toLowerCase()) {
            case "aries":
                return "♈";
            case "taurus":
                return "♉";
            case "gemini":
                return "♊";
            case "cancer":
                return "♋";
            case "leo":
                return "♌";
            case "virgo":
                return "♍";
            case "libra":
                return "♎";
            case "scorpio":
                return "♏";
            case "sagittarius":
                return "♐";
            case "capricorn":
                return "♑";
            case "aquarius":
                return "♒";
            case "pisces":
                return "♓";
            default:
                return "";
        }
    }

    return (
        <div >
            <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-lg md:flex-row">
                {/* Left side - Profile Image */}
                <div className="relative h-auto w-full md:h-auto md:w-2/5 lg:w-1/3">
                    <div className="absolute left-4 top-4 z-10">
                        <Badge
                            className={`${getStatusColor(botAccount.status)} px-3 py-1 text-xs font-medium uppercase tracking-wider`}
                        >
                            {botAccount.status || "Unknown"}
                        </Badge>
                    </div>
                    <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
                        <Badge variant="secondary" className="backdrop-blur-sm">
                            {modelName}
                        </Badge>
                        {age && (
                            <Badge variant="outline" className="bg-black/50 text-white backdrop-blur-sm">
                                {age} years
                            </Badge>
                        )}
                    </div>
                    <Image
                        src={botAccount.profile_url || "/placeholder.svg?height=800&width=600"}
                        alt={botAccount.title || "Bot account"}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Add interest badges overlay */}
                    <div className="absolute inset-x-0 bottom-20 px-6">
                        <div className="flex max-w-full flex-wrap gap-1.5">
                            {botAccount.interest && botAccount.interest.length > 0
                                ? botAccount.interest.slice(0, 5).map((interest, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="border-white/20 bg-black/50 text-xs text-white backdrop-blur-sm"
                                    >
                                        {interest}
                                    </Badge>
                                ))
                                : null}
                            {botAccount.interest && botAccount.interest.length > 5 ? (
                                <Badge variant="secondary" className="border-white/20 bg-black/50 text-xs text-white backdrop-blur-sm">
                                    +{botAccount.interest.length - 5} more
                                </Badge>
                            ) : null}
                        </div>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold">{botAccount.title || "Untitled"}</h1>
                            <div className="size-6 overflow-hidden rounded-full">
                                <Image
                                    src={flagUrl || "/placeholder.svg"}
                                    alt={`${countryCode} flag`}
                                    width={24}
                                    height={24}
                                    className="size-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                            <MapPin className="size-4" />
                            <span>{botAccount.location || "Unknown location"}</span>
                            <span className="text-sm opacity-75">{botAccount.distance || 0} km</span>
                        </div>
                    </div>
                </div>

                {/* Right side - Profile Details */}
                <div className="flex h-[60vh] w-full flex-col bg-background md:h-screen md:w-3/5 lg:w-2/3">
                    <div className="flex-none border-b p-2">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Badge variant="secondary" className="px-3 py-1">
                                    {strategyName}
                                </Badge>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Wifi className="size-3.5" />
                                    <span>{proxyName}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Link href={routes.dashboard.account.logs(botAccount.id || "/")}>
                                    <Button size="sm" variant="outline" className="h-8">
                                        <Radio className="mr-1 size-3.5" />
                                        Logs
                                    </Button>
                                </Link>
                                <Link href={routes.dashboard.account.update(botAccount.id || "/")}>
                                    <Button size="sm" variant="outline" className="h-8">
                                        <Edit className="mr-1 size-3.5" />
                                        Edit
                                    </Button>
                                </Link>
                                <Link href={routes.dashboard.account.index || "/"}>
                                    <Button size="sm" variant="ghost" className="h-8">
                                        <ArrowLeft className="mr-1 size-3.5" />
                                        Back
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="mb-4 rounded-lg bg-muted/50 p-4">
                            <p className="text-sm italic">{botAccount.tinder_bio || "No bio available"}</p>
                        </div>

                        <div className="mb-4 grid grid-cols-3 gap-4 text-center">
                            <div className="rounded-lg bg-primary/10 p-3">
                                <ThumbsUp className="mx-auto mb-1 size-5 text-primary" />
                                <div className="font-bold">{botAccount.likes || 0}</div>
                                <div className="text-xs text-muted-foreground">Likes</div>
                            </div>
                            <div className="rounded-lg bg-blue-500/10 p-3">
                                <ArrowLeftRight className="mx-auto mb-1 size-5 text-blue-500" />
                                <div className="font-bold">{botAccount.swipes || 0}</div>
                                <div className="text-xs text-muted-foreground">Swipes</div>
                            </div>
                            <div className="rounded-lg bg-rose-500/10 p-3">
                                <Heart className="mx-auto mb-1 size-5 text-rose-500" />
                                <div className="font-bold">{botAccount.matches || 0}</div>
                                <div className="text-xs text-muted-foreground">Matches</div>
                            </div>
                        </div>

                        <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab}>
                            <TabsList className="mb-4 grid w-full grid-cols-2">
                                <TabsTrigger value="details">Account Details</TabsTrigger>
                                <TabsTrigger value="interests">Map</TabsTrigger>
                            </TabsList>

                            <TabsContent value="details" className="space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 rounded-md bg-muted/50 p-2">
                                        <User className="size-4 text-muted-foreground" />
                                        <div>
                                            <div className="text-xs text-muted-foreground">Gender</div>
                                            <div className="text-sm font-medium">{botAccount.gender || "Not specified"}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 rounded-md bg-muted/50 p-2">
                                        <Orbit className="size-4 text-muted-foreground" />
                                        <div>
                                            <div className="text-xs text-muted-foreground">Zodiac</div>
                                            <div className="text-sm font-medium">
                                                {getZodiacSymbol(botAccount.zodiac ?? "") || "Not specified"}{" "}
                                                {botAccount.zodiac || "Not specified"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 rounded-md bg-muted/50 p-2">
                                        <School className="size-4 text-muted-foreground" />
                                        <div>
                                            <div className="text-xs text-muted-foreground">Schools</div>
                                            <div className="text-sm font-medium">{botAccount.school || "Not specified"}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 rounded-md bg-muted/50 p-2">
                                        <CircleSmall className="size-4 text-muted-foreground" />
                                        <div>
                                            <div className="text-xs text-muted-foreground">Interest In</div>
                                            <div className="text-sm font-medium">
                                                {botAccount.gender_interest === "0"
                                                    ? "men"
                                                    : botAccount.gender_interest === "1"
                                                        ? "women"
                                                        : "Not specified"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 rounded-md bg-muted/50 p-2">
                                        <GraduationCap className="size-4 text-muted-foreground" />
                                        <div>
                                            <div className="text-xs text-muted-foreground">Education</div>
                                            <div className="text-sm font-medium">{botAccount.education || "Not specified"}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 rounded-md bg-muted/50 p-2">
                                        <Heart className="size-4 text-muted-foreground" />
                                        <div>
                                            <div className="text-xs text-muted-foreground">Looking for</div>
                                            <div className="text-sm font-medium">{botAccount.looking_for?.join(", ") || "Not specified"}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {botAccount.interest && botAccount.interest.length > 0 ? (
                                        botAccount.interest.map((interest, index) => (
                                            <Badge key={index}  className="px-3 py-1">
                                                {interest}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No interests specified</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Age Range:</span>
                                        <span className="font-medium">
                                        {botAccount.min_age || 18} - {botAccount.max_age || 35} years
                                    </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Communication:</span>
                                        <span className="font-medium">{botAccount.communication || "Not specified"}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Strategy Days:</span>
                                        <span className="font-medium">{strategyDays} days</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Email:</span>
                                        <span className="font-medium">{botAccount.email}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Phone Number</span>
                                        <span className="font-medium">{botAccount.phone}</span>
                                    </div>

                                    {typeof botAccount.progress === "number" && (
                                        <div className="mt-4 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <div className="flex items-center">
                                                    <Clock className="mr-1 size-3.5 text-muted-foreground" />
                                                    <span className="text-muted-foreground">Strategy Progress</span>
                                                </div>
                                                <span className="font-medium">{progressPercentage.toFixed(0)}%</span>
                                            </div>
                                            <Progress value={progressPercentage} className="h-2" />
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="interests" className="space-y-3">
                                <Card className="m-6 overflow-hidden">
                                    <div className="relative h-[350px]" ref={mapRef}>
                                        <div className="absolute right-2 top-2 z-10 rounded bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-sm">
                                            <div className="flex items-center gap-1.5">
                                                <Image
                                                    src={flagUrl || "/placeholder.svg"}
                                                    alt={`${countryCode} flag`}
                                                    width={16}
                                                    height={16}
                                                    className="rounded-sm"
                                                />
                                                <span>{botAccount.location || "Location"}</span>
                                            </div>
                                            <div className="mt-1 text-[10px] opacity-80">
                                                Lat: {botAccount.latitude || "N/A"}, Lng: {botAccount.longitude || "N/A"}
                                            </div>
                                        </div>
                                        <MapCard
                                            latitude={botAccount.latitude ?? 0}
                                            longitude={botAccount.longitude ?? 0}
                                            title={botAccount.location || "Location"}
                                            zoom={13}
                                            className="size-full"
                                        />
                                    </div>
                                </Card>
                            </TabsContent>
                        </Tabs>


                    </div>

                    {/* Scrollable Recent Swipes Section */}

                </div>
            </div>
            <div className="flex-1 overflow-hidden">

                <div className="p-4">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold">Recent Swipes</h2>
                    </div>

                    {swipes.length > 0 ? (
                        <div className="w-full">
                            <SwipesCarousel
                                swipes={swipes}
                                className="mb-6"
                                onEdit={(id: string) => {
                                    console.log(`Edit swipe with ID: ${id}`)
                                }}
                            />
                        </div>
                    ) : (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                                <div className="mb-2 rounded-full bg-muted p-3">
                                    <ArrowLeftRight className="size-6 text-muted-foreground" />
                                </div>
                                <p className="text-muted-foreground">No recent swipes available</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}

