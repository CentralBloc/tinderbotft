import {Bath, Bed, Heart, MapPin, Maximize, Phone} from "lucide-react"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Card} from "@/components/ui/card"
import {BotAccountInterface, ModelInterface, ProxyInterface, StrategyInterface} from "@/types";
import Image from "next/image";
import {Progress} from "@/components/ui/progress";

interface ListCardProps {
    botAccount: BotAccountInterface
    onFavorite?: (id: string) => void
    onViewDetails?: (id: string) => void
    onContact?: (id: string) => void
}

export function ListAccountCard({ botAccount, onFavorite, onViewDetails, onContact }: ListCardProps) {

    const getStatusColor = (status = "") => {
        switch (status.toLowerCase()) {
            case "active":
                return "bg-green-500/10 text-green-500"
            case "paused":
                return "bg-yellow-500/10 text-yellow-500"
            case "error":
                return "bg-red-500/10 text-red-500"
            default:
                return "bg-gray-500/10 text-gray-500"
        }
    }

    // Type guards
    const isModelInterface = (modele: ModelInterface | undefined | string): modele is ModelInterface => {
        return typeof modele === "object" && modele !== null && "name" in modele
    }

    const isStrategyInterface = (strategy: StrategyInterface | undefined | string): strategy is StrategyInterface => {
        return typeof strategy === "object" && strategy !== null && "name" in strategy
    }

    const isProxyInterface = (proxy: ProxyInterface | undefined | string): proxy is ProxyInterface => {
        return typeof proxy === "object" && proxy !== null && "name" in proxy
    }

    const progressPercentage = ((botAccount.progress ?? 0) / (isStrategyInterface(botAccount.strategy) ? botAccount.strategy.days_number : 1)) * 100;
    return (
        <Card className="overflow-hidden">
            <div className="flex flex-col sm:flex-row">
                <div className="relative h-48 w-full sm:w-72">
                    <Image src={botAccount.profile_url || "/placeholder.svg"} alt={botAccount.title} className="size-full object-cover"  width={300}
                           height={192} />
                    <Badge className={`${getStatusColor(botAccount.status)} absolute left-4 top-4`}>{botAccount.status}</Badge>
                </div>
                <div className="flex-1 p-6">
                    <div className="flex h-full flex-col">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Badge variant="secondary" className="bg-primary/10">
                                    {botAccount.modele && isModelInterface(botAccount.modele) ? botAccount.modele.name : "Unknown"}
                                </Badge>
                                <Button variant="ghost" size="icon" onClick={() => onFavorite?.(botAccount.id)}>
                                    <Heart className="size-4" />
                                </Button>
                            </div>
                            <div className="flex items-start justify-between">
                                <h3 className="text-lg font-semibold">{botAccount.title}</h3>
                                <p className="text-lg font-bold">{botAccount.strategy && isStrategyInterface(botAccount.strategy) ? botAccount.strategy.name : "No strategy"}</p>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <MapPin className="mr-1 size-4" />
                                <span>{botAccount.location}</span>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Bed className="size-4" />
                                <span>{botAccount.swipes} swipes</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Bath className="size-4" />
                                <span>{botAccount.likes} likes</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Maximize className="size-4" />
                                <span>{botAccount.matches} matches</span>
                            </div>
                        </div>

                        {typeof botAccount.progress === "number" && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-medium">{progressPercentage.toFixed(2)}%</span>
                                </div>
                                <Progress value={progressPercentage} className="h-2" />
                            </div>
                        )}

                        <div className="mt-auto flex gap-4 pt-4">
                            <Button className="flex-1" onClick={() => onViewDetails?.(botAccount.id)}>
                                View Details
                            </Button>
                            <Button variant="outline" onClick={() => onContact?.(botAccount.id)}>
                                <Phone className="mr-2 size-4" />
                                Contact
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
