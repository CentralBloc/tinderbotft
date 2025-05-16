import Image from "next/image"
import {Heart, MoreHorizontal} from "lucide-react"
import {formatDistanceToNow} from "@/lib/utils"
import {Button} from "@/components/ui/button"

interface PostReplyProps {
  username: string
  profilePicture: string
  text: string
  timestamp: number
  likeCount: number
}

export function PostReply({username, profilePicture, text, timestamp, likeCount}: PostReplyProps) {
  const timeAgo = formatDistanceToNow(timestamp)

  return (
    <div className="flex items-start space-x-2">
      <div className="relative size-8 shrink-0 overflow-hidden rounded-full">
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
            <span className="text-sm font-medium">{username}</span>
            <span className="text-xs text-gray-500">·</span>
            <span className="text-xs text-gray-500">{timeAgo}</span>
          </div>
          <Button variant="ghost" size="icon" className="size-6 text-gray-500 hover:text-white">
            <MoreHorizontal className="size-4"/>
          </Button>
        </div>

        <p className="mt-1 text-sm">{text}</p>

        <div className="mt-2 flex">
          <Button variant="ghost" size="icon" className="size-7 rounded-full text-gray-500 hover:text-white">
            <Heart className="size-4"/>
            {likeCount > 0 && <span className="ml-1 text-xs">{likeCount}</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}
