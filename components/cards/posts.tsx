"use client"

import {useState} from "react"
import Image from "next/image"
import {Heart, MessageCircle, MoreHorizontal, Repeat, Send, X} from "lucide-react"
import {formatDistanceToNow} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Textarea} from "@/components/ui/textarea"
import {PostReply} from "@/components/cards/post-reply";


interface PostProps {
  username: string
  profilePicture: string
  caption: string
  timestamp: number
  likeCount: number
  replyCount: number
  repostCount: number
  replies?: any[]
}

export function Post({
                       username,
                       profilePicture,
                       caption,
                       timestamp,
                       likeCount,
                       replyCount,
                       repostCount,
                       replies = [],
                     }: PostProps) {
  const timeAgo = formatDistanceToNow(timestamp)
  const [isReplying, setIsReplying] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [localReplies, setLocalReplies] = useState(replies)
  const [localReplyCount, setLocalReplyCount] = useState(replyCount)

  const handleReply = () => {
    if (replyText.trim()) {
      const newReply = {
        id: Date.now(),
        username,
        profilePicture,
        text: replyText,
        timestamp: Math.floor(Date.now() / 1000),
        likeCount: 0,
      }

      setLocalReplies([newReply, ...localReplies])
      setLocalReplyCount((prev) => prev + 1)
      setReplyText("")
      setIsReplying(false)
    }
  }

  return (
    <div className="py-4">
      <div className="flex items-start space-x-3">
        <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
          <Image
            src={profilePicture || "/placeholder.svg"}
            alt={`${username}'s profile picture`}
            fill
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <span className="font-medium">{username}</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-500">{timeAgo}</span>
            </div>
            <Button variant="ghost" size="icon" className="size-8 text-gray-500 hover:text-white">
              <MoreHorizontal className="size-5"/>
            </Button>
          </div>

          <p className="mt-1">{caption}</p>

          <div className="mt-3 flex space-x-4">
            <Button variant="ghost" size="icon" className="size-9 rounded-full text-gray-500 hover:text-white">
              <Heart className="size-5"/>
              {likeCount > 0 && <span className="ml-1">{likeCount}</span>}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 rounded-full text-gray-500 hover:text-white"
              onClick={() => setIsReplying(!isReplying)}
            >
              <MessageCircle className="size-5"/>
              {localReplyCount > 0 && <span className="ml-1">{localReplyCount}</span>}
            </Button>
            <Button variant="ghost" size="icon" className="size-9 rounded-full text-gray-500 hover:text-white">
              <Repeat className="size-5"/>
              {repostCount > 0 && <span className="ml-1">{repostCount}</span>}
            </Button>
            <Button variant="ghost" size="icon" className="size-9 rounded-full text-gray-500 hover:text-white">
              <Send className="size-5"/>
            </Button>
          </div>

          {isReplying && (
            <div className="mt-3 rounded-lg border border-gray-800 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Reply to @{username}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 text-gray-500 hover:text-white"
                  onClick={() => setIsReplying(false)}
                >
                  <X className="size-4"/>
                </Button>
              </div>
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply..."
                className="mb-2 border-gray-800 bg-transparent focus-visible:ring-gray-500"
                rows={2}
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  className="bg-white text-black hover:bg-gray-200"
                  onClick={handleReply}
                  disabled={!replyText.trim()}
                >
                  Reply
                </Button>
              </div>
            </div>
          )}

          {localReplies.length > 0 && (
            <div className="mt-3 space-y-3 border-l border-gray-800 pl-3">
              {localReplies.map((reply) => (
                <PostReply
                  key={reply.id}
                  username={reply.username}
                  profilePicture={reply.profilePicture}
                  text={reply.text}
                  timestamp={reply.timestamp}
                  likeCount={reply.likeCount}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
