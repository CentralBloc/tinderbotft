"use client"

import {useEffect, useRef} from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"

// Define marker locations with status and image
interface MarkerLocation {
  latitude: number
  longitude: number
  title: string
  status: "active" | "expired" | "working" | "inactive" | "banned" | "shadowban" | "limited" | "completed" | "standby"
  profile_url?: string // Optional image URL
}

interface ColoredMapProps {
  title?: string
  zoom?: number
  className?: string
  locations?: MarkerLocation[]
}

export function ColoredMap({
                             title = "Location Map",
                             zoom = 5,
                             className = "",
                             locations = [],
                           }: Readonly<ColoredMapProps>) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  // Function to get color based on status
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
      case "limited":
        return "#6b21a8" // bg-purple-800
      case "completed":
        return "#92400e" // bg-amber-800
      case "standby":
        return "#0284c7" // bg-sky-800
      default:
        return "#1f2937" // bg-gray-800 as default
    }
  }

  useEffect(() => {
    if (!mapRef.current) return

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      // Center on France
      mapInstanceRef.current = L.map(mapRef.current).setView([46.603354, 1.888334], zoom)

      // Add light theme map tiles to match the screenshot
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current)
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      if (mapInstanceRef.current) {
        marker.remove()
      }
    })
    markersRef.current = []

    // Add markers for each location
    locations?.forEach((location) => {
      if (!mapInstanceRef.current) return

      // Validate coordinates and title before creating marker
      if (
        typeof location.latitude !== "number" ||
        typeof location.longitude !== "number" ||
        isNaN(location.latitude) ||
        isNaN(location.longitude) ||
        !location.title
      ) {
        console.warn(`Invalid location data for: ${location.title ?? "Unknown"}`)
        return // Skip this location
      }

      // Get color based on status
      const fillColor = getStatusColor(location.status)

      // Create marker icon based on whether there's an image or not
      let markerIcon

      if (location.profile_url) {
        // Create marker with image and colored border
        markerIcon = L.divIcon({
          html: `
      <div class="marker-container" style="border: 3px solid ${fillColor}; background-color: white;">
        <img src="${location.profile_url}" alt="${location.title}" class="marker-image" />
      </div>
    `,
          className: "image-marker",
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
        })
      } else {
        // Create standard colored pin marker
        markerIcon = L.divIcon({
          html: `
                        <svg width="36" height="48" viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 0C8.064 0 0 8.064 0 18C0 31.5 18 48 18 48C18 48 36 31.5 36 18C36 8.064 27.936 0 18 0ZM18 24.3C14.508 24.3 11.7 21.492 11.7 18C11.7 14.508 14.508 11.7 18 11.7C21.492 11.7 24.3 14.508 24.3 18C24.3 21.492 21.492 24.3 18 24.3Z" fill="${fillColor}"/>
                        </svg>
                    `,
          className: "pin-marker",
          iconSize: [36, 48],
          iconAnchor: [18, 48],
          popupAnchor: [0, -48],
        })
      }

      // Create and add marker
      const sanitizedTitle = location.title.replace(/[<>]/g, "")
      const marker = L.marker([location.latitude, location.longitude], {icon: markerIcon}).addTo(
        mapInstanceRef.current,
      )

      // Add popup with location info and status
      marker.bindPopup(`
                <div class="marker-popup">
                  <b>${sanitizedTitle}</b>
                  <p>Status: <span style="color: ${fillColor};">${location.status}</span></p>
                </div>
            `)

      markersRef.current.push(marker)
    })

    // Fit bounds to show all markers if there are any valid ones
    if (markersRef.current.length > 0 && mapInstanceRef.current) {
      try {
        const validLocations = locations.filter(
          (loc) =>
            typeof loc.latitude === "number" &&
            typeof loc.longitude === "number" &&
            !isNaN(loc.latitude) &&
            !isNaN(loc.longitude),
        )

        if (validLocations.length > 0) {
          const bounds = L.latLngBounds(validLocations.map((loc) => [loc.latitude, loc.longitude]))
          mapInstanceRef.current.fitBounds(bounds, {padding: [30, 30]})
        }
      } catch (error) {
        console.error("Error fitting bounds:", error)
      }
    }

    // Add CSS for custom markers
    const style = document.createElement("style")
    style.innerHTML = `
            .image-marker {
                background: transparent;
            }
            .pin-marker {
                background: transparent;
            }
            .marker-container {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  background-color: white;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.marker-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
            .marker-popup {
                text-align: center;
            }
        `
    document.head.appendChild(style)

    // Ensure map renders correctly
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize()
      }
    }, 100)

    return () => {
      document.head.removeChild(style)
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [locations, zoom])

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={mapRef} className="h-[500px] w-full rounded-md border" style={{zIndex: 0}}/>
      </CardContent>
    </Card>
  )
}
