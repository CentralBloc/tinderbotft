"use client"

import {useEffect, useRef} from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {MapPin} from "lucide-react"

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

export function MapCard({ latitude, longitude, title = "Location", zoom = 13, className = "" }: Readonly<MapCardProps>) {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<L.Map | null>(null)

    useEffect(() => {
        if (!mapRef.current) return

        if (!mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapRef.current).setView([latitude, longitude], zoom)

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(mapInstanceRef.current)
        } else {
            mapInstanceRef.current.setView([latitude, longitude], zoom)
        }

        const marker = L.marker([latitude, longitude], { icon }).addTo(mapInstanceRef.current)
        const sanitizedTitle = title.replace(/[<>]/g, '')
        marker.bindPopup(
            L.Util.template(
                '<b>{title}</b><br>Lat: {lat}<br>Lng: {lng}',
                {
                    title: sanitizedTitle,
                    lat: Number(latitude).toFixed(6),
                    lng: Number(longitude).toFixed(6)
                }
            )
        ).openPopup()

        setTimeout(() => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.invalidateSize()
            }
        }, 100)

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
                </div>
            </CardHeader>
            <CardContent>
                <div ref={mapRef} className="h-[250px] w-full rounded-md border" style={{ zIndex: 0 }} />
            </CardContent>
        </Card>
    )
}