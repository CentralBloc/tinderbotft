import {SwipeScheduleCard} from "@/components/cards/swipe-scheduled-card"
import {useUserAccountSwipes} from "@/services/users/hooks"
import type {SwipeAction} from "@/types"
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";

export default function SwipeActionSchedule() {
    const today = new Date()
    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
    const dayName = dayNames[today.getDay()]
    const dayNumber = today.getDate()
    const { data: swipeData, isLoading } = useUserAccountSwipes()

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!swipeData || !swipeData.length) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4 md:p-8">
                <div className="text-center">
                    <h2 className="mb-2 text-xl font-semibold">No Swipe Schedule Available</h2>
                    <p className="text-gray-500">There are no scheduled swipe actions at this time.</p>
                </div>
            </div>
        )
    }

    // Flatten the swipe actions for the carousel
    const allSwipeActions = swipeData.flatMap((item: any) =>
        item.swipe_actions.map((action: SwipeAction) => ({
            ...action,
            parentItem: item,
        })),
    )

    return (
        <main className="min-h-screen p-4 md:p-6">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex items-center gap-4">
                    <div className="flex flex-col items-center">
                        <div className="text-sm font-medium text-blue-600">{dayName}</div>
                        <div className="flex size-14 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                            {dayNumber}
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold">Today&#39;s Swipe Schedule</h1>
                </div>

                <div className="relative">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent>
                            {allSwipeActions.map((action: any) => (
                                <CarouselItem key={action.id} className="md:basis-1/2 lg:basis-1/2">
                                    <div className="p-1">
                                        <SwipeScheduleCard
                                            title={action.parentItem.title}
                                            status={action.parentItem.status}
                                            progress={action.parentItem.progress}
                                            strategy={action.parentItem.strategy}
                                            swipeAction={action}
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <div className="absolute inset-x-0 -bottom-12 flex justify-center gap-2">
                            <CarouselPrevious className="relative left-0 top-0 translate-y-0" />
                            <CarouselNext className="relative right-0 top-0 translate-y-0" />
                        </div>
                    </Carousel>
                </div>
            </div>
        </main>
    )
}
