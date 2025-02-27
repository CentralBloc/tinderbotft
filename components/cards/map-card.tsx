"use client"

import {useEffect, useRef} from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {MapPin} from "lucide-react"

// Fix for default marker icon in Leaflet
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
})

interface MapCardProps {
    latitude: number
    longitude: number
    title?: string
    zoom?: number
    className?: string
}

export function MapCard({ latitude, longitude, title = "Location", zoom = 13, className = "" }: MapCardProps) {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<L.Map | null>(null)

    useEffect(() => {
        if (!mapRef.current) return

        // Initialize map only if it doesn't exist yet
        if (!mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapRef.current).setView([latitude, longitude], zoom)

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(mapInstanceRef.current)
        } else {
            // If map already exists, just update the view
            mapInstanceRef.current.setView([latitude, longitude], zoom)
        }

        // Add marker
        const marker = L.marker([latitude, longitude], { icon }).addTo(mapInstanceRef.current)
        marker.bindPopup(`<b>${title}</b><br>Lat: ${latitude.toFixed(6)}<br>Lng: ${longitude.toFixed(6)}`).openPopup()

        // Trigger a resize event after the map is initialized to ensure it renders correctly
        setTimeout(() => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.invalidateSize()
            }
        }, 100)

        // Cleanup function
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove()
                mapInstanceRef.current = null
            }
        }
    }, [latitude, longitude, zoom, title])

    return (
        <Card className={className}>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="size-5 text-primary" />
                        {title}
                    </CardTitle>
                    <Badge variant="outline" className="font-mono text-xs">
                        {latitude.toFixed(6)}, {longitude.toFixed(6)}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div ref={mapRef} className="h-[250px] w-full rounded-md border" style={{ zIndex: 0 }} />
            </CardContent>
        </Card>
    )
}
