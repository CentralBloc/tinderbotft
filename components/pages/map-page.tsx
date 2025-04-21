"use client"

import {useAllAccountsLocations} from "@/services/bot-account/hooks"
import dynamic from "next/dynamic"


// Dynamically import the ColoredMap component with SSR disabled
const ColoredMap = dynamic(
  () => import("@/components/cards/colorad-map-card").then((mod) => mod.ColoredMap),
  { ssr: false }
)

export default function MapPage() {
    const { data: locations, isLoading } = useAllAccountsLocations()

    return (
        <div className="mx-auto ">
            {!isLoading && (
                <ColoredMap title="" locations={locations || []} className="w-full" />
            )}
        </div>
    )
}