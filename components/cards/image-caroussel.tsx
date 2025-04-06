"use client"

import {useEffect, useState} from "react"
import Image from "next/image"
import {ChevronLeft, ChevronRight} from "lucide-react"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"

interface ProfileImageCarouselProps {
    images: string[]
    alt: string
    className?: string
    showIndicators?: boolean
    showControls?: boolean
    autoPlay?: boolean
    interval?: number
}

export function ProfileImageCarousel({
                                         images,
                                         alt,
                                         className,
                                         showIndicators = true,
                                         showControls = true,
                                         autoPlay = false,
                                         interval = 5000,
                                     }: ProfileImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        if (!autoPlay) return

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
        }, interval)

        return () => clearInterval(timer)
    }, [autoPlay, interval, images.length])

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
    }

    const goToSlide = (index: number) => {
        setCurrentIndex(index)
    }

    // If no images or only one image, display a placeholder or the single image
    if (!images.length) {
        return (
            <div className={cn("relative w-full h-full", className)}>
                <Image src="/placeholder.svg?height=800&width=600" alt={alt} fill className="object-cover" priority />
            </div>
        )
    }

    if (images.length === 1) {
        return (
            <div className={cn("relative w-full h-full", className)}>
                <Image src={images[0] || "/placeholder.svg"} alt={alt} fill className="object-cover" priority />
            </div>
        )
    }

    return (
        <div className={cn("relative w-full h-full overflow-hidden", className)}>
            {/* Images */}
            <div className="relative size-full">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={cn(
                            "absolute inset-0 transition-opacity duration-500",
                            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0",
                        )}
                    >
                        <Image
                            src={image || "/placeholder.svg"}
                            alt={`${alt} - image ${index + 1}`}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                    </div>
                ))}
            </div>

            {/* Controls */}
            {showControls && (
                <>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-1 text-white backdrop-blur-sm hover:bg-black/50"
                        onClick={goToPrevious}
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="size-6" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-1 text-white backdrop-blur-sm hover:bg-black/50"
                        onClick={goToNext}
                        aria-label="Next image"
                    >
                        <ChevronRight className="size-6" />
                    </Button>
                </>
            )}

            {/* Indicators */}
            {showIndicators && (
                <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            className={cn(
                                "h-2 w-2 rounded-full transition-all",
                                index === currentIndex ? "bg-white w-4" : "bg-white/50 hover:bg-white/80",
                            )}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
