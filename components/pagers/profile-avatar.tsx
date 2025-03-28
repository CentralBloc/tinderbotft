"use client"

import type React from "react"
import {useEffect, useRef, useState} from "react"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Camera, Loader2} from "lucide-react"
import {useToast} from "@/components/ui/use-toast"
import {useUpdateProfilePicture} from "@/services/users/hooks"
import {usePicture} from "@/services/pictures/hooks"
import {UserInterface} from "@/types";

type ProfileAvatarProps = {
  user: UserInterface,
  planType?: string
}

export function ProfileAvatar({ user, planType = "Pro Plan" }: ProfileAvatarProps) {
  const initialAvatar = user?.email ? `https://api.dicebear.com/7.x/lorelei/svg?seed=${user.email}` : null
  const [avatarSrc, setAvatarSrc] = useState<string | null>(initialAvatar)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { mutateAsync: updateProfilePicture, isPending: updatePending } = useUpdateProfilePicture()
  const { data: pictureData, isPending: picturePending } = usePicture(
    typeof user?.profile_picture === "string" ? user.profile_picture : ""
  )
  useEffect(() => {
    if (pictureData?.link) {
      setAvatarSrc(pictureData.link)
    }
  }, [pictureData])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file type", description: "Please select an image file", variant: "destructive" })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Image must be less than 5MB", variant: "destructive" })
      return
    }

    try {
      const previewUrl = URL.createObjectURL(file)
      setAvatarSrc(previewUrl)

      // Log file details before sending
      console.log("File selected:", {
        name: file.name,
        type: file.type,
        size: file.size,
      })

      // Directly pass the file to the mutation
      const response = await updateProfilePicture(file)

      if (response?.profile_picture) {
        console.log("Profile picture updated:", response.profile_picture)
      }

      toast({ title: "Avatar updated", description: "Your profile picture has been updated successfully" })
    } catch (error: any) {
      console.error("Error uploading avatar:", error)
      toast({
        title: "Upload failed",
        description: error.response?.data?.error || "An error occurred while uploading your avatar",
        variant: "destructive",
      })

      setAvatarSrc(initialAvatar)
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
      <Card>
        <CardContent className="flex flex-col items-center p-6">
          <div className="relative my-6">
            <Avatar className="size-32 border-4 border-muted">
              <AvatarImage src={avatarSrc || ""} alt={user?.username || "User avatar"} />
              <AvatarFallback className="text-3xl">{user?.username?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>

            <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full border shadow-sm"
                onClick={handleAvatarClick}
                disabled={updatePending}
            >
              <span className="sr-only">Change avatar</span>
              {updatePending ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
            </Button>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                aria-label="Upload profile picture"
            />
          </div>
          <h3 className="text-xl font-medium">{user?.username}</h3>
           <p className="text-sm text-muted-foreground">
             Member since {user?.created_at
               ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
               : ""}
           </p>
          <Badge className="mt-4 bg-emerald-900 text-emerald-300 hover:bg-emerald-900">{planType}</Badge>
        </CardContent>
      </Card>
  )
}
