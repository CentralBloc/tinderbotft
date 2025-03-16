"use client"

import {ColoredMap} from "@/components/cards/colorad-map-card";
import {useAllAccountsLocations} from "../../services/bot-account/hooks";

export default function MapPage() {
    // Status types for the legend
    const { data: locations, isLoading } = useAllAccountsLocations();

    // Function to get color based on status (same as in the map component)
    const getStatusColor = (status = "") => {
        switch (status.toLowerCase()) {
            case "active":
                return "#15803d" // bg-green-800
            case "expired":
                return "#1f2937" // bg-gray-800
            case "working":
                return "#1e40af" // bg-blue-800
            case "inactive":
                return "#111827" // bg-dark
            case "banned":
                return "#991b1b" // bg-red-800
            case "shadowban":
                return "#9a3412" // bg-orange-800
            case "paused":
                return "#6b21a8" // bg-purple-800
            case "completed":
                return "#92400e" // bg-amber-800
            default:
                return "#1f2937" // bg-gray-800 as default
        }
    }

    return (
        <div className="mx-auto max-w-6xl p-4">
            <ColoredMap title="" locations={locations || []} className="w-full" />
        </div>
    )
}

