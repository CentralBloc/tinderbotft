"use client"

import {useRef} from "react"
import {ChevronLeft, ChevronRight} from "lucide-react"
import {cn} from "@/lib/utils"
import type {SwipesInterface} from "@/types"
import {SwipeCard} from "./swipe-details-card"

interface SwipesCarouselProps {
    swipes: SwipesInterface[]
    onEdit?: (id: string) => void
    onDelete?: (id: string) => void
    className?: string
}

export function SwipesCarousel({ swipes, onEdit, onDelete, className }: SwipesCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current
            const scrollAmount = container.clientWidth * 0.8
            container.scrollBy({ left: -scrollAmount, behavior: "smooth" })
        }
    }

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current
            const scrollAmount = container.clientWidth * 0.8
            container.scrollBy({ left: scrollAmount, behavior: "smooth" })
        }
    }

    if (swipes.length === 0) {
        return <div className="rounded-lg bg-gray-800 p-6 text-center text-gray-400">No recent swipes available</div>
    }

    return (
        <div className={cn("relative w-full", className)}>
            {/* Left scroll button */}
            <button
                onClick={scrollLeft}
                className="absolute -left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/70"
                aria-label="Scroll left"
            >
                <ChevronLeft className="size-4" />
            </button>

            {/* Scrollable container */}
            <div
                ref={scrollContainerRef}
                className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto py-1"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {swipes.map((swipe) => (
                    <div key={swipe.id} className="w-[300px] flex-none snap-start">
                        <SwipeCard
                            swipe={swipe}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            className="transition-transform hover:scale-[1.02]"
                        />
                    </div>
                ))}
            </div>

            {/* Right scroll button */}
            <button
                onClick={scrollRight}
                className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/70"
                aria-label="Scroll right"
            >
                <ChevronRight className="size-4" />
            </button>

            <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </div>
    )
}
