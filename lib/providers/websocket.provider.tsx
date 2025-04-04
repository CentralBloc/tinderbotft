"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type WebSocketStatus = "connecting" | "connected" | "disconnected" | "error"

interface WebSocketContextType {
    connect: (url: string) => void
    disconnect: () => void
    send: (data: any) => void
    status: WebSocketStatus
    lastMessage: any | null
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

export function WebSocketProvider({ children }: { children: ReactNode }) {
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [status, setStatus] = useState<WebSocketStatus>("disconnected")
    const [lastMessage, setLastMessage] = useState<any | null>(null)

    const connect = (url: string) => {
        if (socket) {
            socket.close()
        }

        try {
            setStatus("connecting")
            const newSocket = new WebSocket(url)

            newSocket.onopen = () => {
                setStatus("connected")
            }

            newSocket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data)
                    setLastMessage(data)
                } catch (e) {
                    console.error("Failed to parse WebSocket message:", e)
                    setLastMessage(event.data)
                }
            }

            newSocket.onclose = () => {
                setStatus("disconnected")
            }

            newSocket.onerror = () => {
                setStatus("error")
            }

            setSocket(newSocket)
        } catch (e) {
            console.error("WebSocket connection error:", e)
            setStatus("error")
        }
    }

    const disconnect = () => {
        if (socket) {
            socket.close()
            setSocket(null)
            setStatus("disconnected")
        }
    }

    const send = (data: any) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(typeof data === "string" ? data : JSON.stringify(data))
        } else {
            console.error("WebSocket is not connected")
        }
    }

    // Clean up on unmount
    useEffect(() => {
        return () => {
            if (socket) {
                socket.close()
            }
        }
    }, [socket])

    return (
        <WebSocketContext.Provider value={{ connect, disconnect, send, status, lastMessage }}>
    {children}
    </WebSocketContext.Provider>
)
}

export function useWebSocket() {
    const context = useContext(WebSocketContext)
    if (context === undefined) {
        throw new Error("useWebSocket must be used within a WebSocketProvider")
    }
    return context
}

