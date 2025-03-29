"use client"

import {useEffect, useState} from "react"
import {AnimatePresence, motion} from "framer-motion"

interface AdvancedLoaderProps {
    isLoading?: boolean
    text?: string
    color?: string
    bgColor?: string
}

export default function AdvancedLoader({
                                           isLoading: externalIsLoading,
                                           text = "Loading",
                                           color = "#3b82f6",
                                           bgColor = "rgba(255, 255, 255, 0.9)",
                                       }: AdvancedLoaderProps) {
    const [isLoading, setIsLoading] = useState(externalIsLoading ?? true)

    // Auto-hide after 2.5 seconds if no external control is provided
    useEffect(() => {
        if (externalIsLoading === undefined) {
            const timer = setTimeout(() => {
                setIsLoading(false)
            }, 2500)
            return () => clearTimeout(timer)
        }
    }, [externalIsLoading])

    // Update internal state when external state changes
    useEffect(() => {
        if (externalIsLoading !== undefined) {
            setIsLoading(externalIsLoading)
        }
    }, [externalIsLoading])

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.5 } }}
                    style={{ backgroundColor: bgColor }}
                >
                    <motion.div
                        className="relative size-24"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
                    >
                        {[0, 1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                className="absolute size-full"
                                initial={{ rotate: i * 90 }}
                                style={{ transformOrigin: "50% 50%" }}
                            >
                                <motion.div
                                    className="absolute size-3 rounded-full"
                                    style={{
                                        backgroundColor: color,
                                        top: "0%",
                                        left: "50%",
                                        marginLeft: "-6px",
                                        transformOrigin: "50% 50%",
                                    }}
                                    initial={{ scale: 0.6 }}
                                    animate={{ scale: [0.6, 1, 0.6] }}
                                    transition={{
                                        duration: 1,
                                        repeat: Number.POSITIVE_INFINITY,
                                        delay: i * 0.2,
                                    }}
                                />
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        className="mt-6 text-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <motion.div className="text-lg font-medium" style={{ color }}>
                            {text}
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                            >
                                ...
                            </motion.span>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

