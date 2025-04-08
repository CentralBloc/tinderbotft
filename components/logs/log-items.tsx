"use client"

import {useState} from "react"
import {AlertCircle, ChevronDown, ChevronUp, Heart, X} from "lucide-react"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import type {Log} from "@/types"
import Image from "next/image"

export function LogItem({ log }: Readonly<{ log: Log }>) {
  const [expanded, setExpanded] = useState(false)

  const getIcon = () => {
    switch (log.type) {
      case "error":
        return <AlertCircle className="size-4 text-red-400" />
      case "swipe":
        return (log).swipe_direction === "like" ? (
            <Heart className="size-4 text-blue-400" />
        ) : (
            <X className="size-4 text-blue-400" />
        )
      case "match":
        return <Heart className="size-4 fill-green-400 text-green-400" />
      default:
        return null
    }
  }

  const getBadgeStyles = () => {
    switch (log.type) {
      case "error":
        return "bg-red-900/30 text-red-400 border-red-800"
      case "swipe":
        return "bg-blue-900/30 text-blue-400 border-blue-800"
      case "match":
        return "bg-green-900/30 text-green-400 border-green-800"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  const getLogMessage = () => {
    switch (log.type) {
      case "error": {
        const errorLog = log
        return `${errorLog.error_type}: ${errorLog.error_message}`
      }
      case "swipe": {
        const swipeLog = log
        const action = swipeLog.swipe_direction === "like" ? "Liked" : "Passed on"
        const status = swipeLog.success ? "successfully" : "failed"
        return `${action} ${swipeLog.target_name || swipeLog.target_user_id} ${status}`
      }
      case "match": {
        const matchLog = log
        return `Matched with ${matchLog.target_name || matchLog.match_id}`
      }
      default:
        return "Unknown log type"
    }
  }

  const renderDetails = () => {
    if (!expanded) return null

    switch (log.type) {
      case "error": {
        const errorLog = log
        return (
            <div className="ml-2 mt-2 border-l border-muted pl-6">
              {errorLog.stack_trace && (
                  <div className="mb-2">
                    <div className="mb-1 text-xs text-muted-foreground">Stack Trace:</div>
                    <pre className="overflow-x-auto whitespace-pre-wrap rounded bg-muted p-2 text-xs text-muted-foreground">
                  {errorLog.stack_trace}
                </pre>
                  </div>
              )}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-muted-foreground">Account:</div>
                <div className="text-foreground">{errorLog.account}</div>
                {errorLog.session && (
                    <>
                      <div className="text-muted-foreground">Session:</div>
                      <div className="text-foreground">{errorLog.session}</div>
                    </>
                )}
              </div>
            </div>
        )
      }
      case "swipe": {
        const swipeLog = log
        return (
            <div className="ml-2 mt-2 border-l border-muted pl-6">
              <div className="mb-2 grid grid-cols-2 gap-2 text-xs">
                <div className="text-muted-foreground">Target User ID:</div>
                <div className="text-foreground">{swipeLog.target_user_id}</div>
                <div className="text-muted-foreground">Direction:</div>
                <div className="capitalize text-foreground">{swipeLog.swipe_direction}</div>
                <div className="text-muted-foreground">Success:</div>
                <div className={swipeLog.success ? "text-green-400" : "text-red-400"}>
                  {swipeLog.success ? "Yes" : "No"}
                </div>
              </div>
              {swipeLog.response_data && Object.keys(swipeLog.response_data).length > 0 && (
                  <div>
                    <div className="mb-1 text-xs text-muted-foreground">Response Data:</div>
                    <pre className="overflow-x-auto rounded bg-muted p-2 text-xs text-foreground">
                  {JSON.stringify(swipeLog.response_data, null, 2)}
                </pre>
                  </div>
              )}
            </div>
        )
      }
      case "match": {
        const matchLog = log
        return (
            <div className="ml-2 mt-2 border-l border-muted pl-6">
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-muted-foreground">Match ID:</div>
                  <div className="text-foreground">{matchLog.match_id}</div>
                  {matchLog.session && (
                      <>
                        <div className="text-muted-foreground">Session:</div>
                        <div className="text-foreground">{matchLog.session}</div>
                      </>
                  )}
                </div>

                {matchLog.target_bio && (
                    <div>
                      <div className="mb-1 text-xs text-muted-foreground">Bio:</div>
                      <div className="rounded bg-muted p-2 text-xs text-foreground">{matchLog.target_bio}</div>
                    </div>
                )}

                {matchLog.target_photos && matchLog.target_photos.length > 0 && (
                    <div>
                      <div className="mb-1 text-xs text-muted-foreground">Photos:</div>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {matchLog.target_photos.map((photo, index) => (
                            <div key={index} className="relative h-[80px] min-w-[80px] overflow-hidden rounded bg-muted">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Image
                                        src={photo || "/placeholder.svg"}
                                        alt={`Match photo ${index + 1}`}
                                        width={80}
                                        height={80}
                                        className="object-cover"
                                    />
                                </div>
                                <div className="absolute bottom-0 right-0 rounded-tl bg-background/80 px-1 text-xs text-foreground">
                                    {index + 1}
                                </div>
                            </div>
                        ))}
                      </div>
                    </div>
                )}
              </div>
            </div>
        )
      }
      default:
        return null
    }
  }

  const shouldShowExpandButton = () => {
    switch (log.type) {
      case "error":
        return true
      case "swipe":
        return true
      case "match":
        return true
      default:
        return false
    }
  }

  return (
      <div
          className={`rounded-md border p-3 transition-colors ${expanded ? "bg-muted/50" : "bg-background hover:bg-muted/20"}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            <div className="mt-1">{getIcon()}</div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={`${getBadgeStyles()} px-1.5 py-0 text-xs`}>
                  {log.type.toUpperCase()}
                </Badge>
                <span className="text-xs text-muted-foreground">{formatTime(log.created_at)}</span>
                {log.type === "swipe" && (
                    <Badge
                        variant="outline"
                        className={`
                  px-1.5 py-0 text-xs
                  ${
                            (log).swipe_direction === "like"
                                ? "border-blue-800 bg-blue-900/20 text-blue-300"
                                : "border-purple-800 bg-purple-900/20 text-purple-300"
                        }
                `}
                    >
                      {(log).swipe_direction.toUpperCase()}
                    </Badge>
                )}
                {log.type === "error" && (
                    <Badge variant="outline" className="border-red-800 bg-red-900/20 px-1.5 py-0 text-xs text-red-300">
                      {(log).error_type}
                    </Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-foreground">{getLogMessage()}</p>
            </div>
          </div>
          {shouldShowExpandButton() && (
              <Button
                  variant="ghost"
                  size="sm"
                  className="size-6 rounded-full p-0 hover:bg-muted"
                  onClick={() => setExpanded(!expanded)}
              >
                {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </Button>
          )}
        </div>

        {renderDetails()}
      </div>
  )
}
