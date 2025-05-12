"use client"

import React, {useState} from "react"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {toast} from "@/components/ui/use-toast"
import {useRouter} from "next/navigation"
import {routes} from "@/lib/routes"
import {Plus, Trash2, Upload, X} from "lucide-react"
import Image from "next/image"
import {ScrollArea} from "@/components/ui/scroll-area"
import {instagramModelSchema} from "@/lib/validations/instagram-modele"


type InstagramModelFormValues = z.infer<typeof instagramModelSchema>

interface ConfigModeleInstaProps {
  initialData?: {
    id?: string
    name?: string
    description?: string
    image?: string
    bio_list?: string[]
    threads_pp?: string[]
    posts?: string
    user?: string
  }
}

export default function ConfigModeleInsta({initialData}: Readonly<ConfigModeleInstaProps>) {
  const router = useRouter()

  // State for file uploads
  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(initialData?.image || null)
  const [threadsImages, setThreadsImages] = useState<{ file: File | null; preview: string }[]>(
    initialData?.threads_pp?.map((url) => ({file: null, preview: url})) || [],
  )
  const [postImageFile, setPostImageFile] = useState<File | null>(null)
  const [postImagePreview, setPostImagePreview] = useState<string | null>(initialData?.posts || null)

  // Refs for file inputs
  const mainImageInputRef = React.useRef<HTMLInputElement>(null)
  const threadsImageInputRef = React.useRef<HTMLInputElement>(null)
  const postImageInputRef = React.useRef<HTMLInputElement>(null)

  // Initialize form with default values
  const form = useForm<InstagramModelFormValues>({
    resolver: zodResolver(instagramModelSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      bio_list: initialData?.bio_list || [],
    },
    mode: "all",
  })

  // Bio list management
  const [bioInput, setBioInput] = useState<string>("")

  const addBioItem = () => {
    if (bioInput.trim()) {
      const currentBioList = form.getValues("bio_list") || []
      form.setValue("bio_list", [...currentBioList, bioInput.trim()])
      setBioInput("")
    }
  }

  const removeBioItem = (index: number) => {
    const currentBioList = form.getValues("bio_list") || []
    form.setValue(
      "bio_list",
      currentBioList.filter((_, i) => i !== index),
    )
  }

  // Image handling functions
  const handleMainImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        })
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        })
        return
      }

      setMainImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleThreadsImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const newImages = Array.from(files).map((file) => {
        if (!file.type.startsWith("image/")) {
          toast({
            title: "Invalid file type",
            description: "Please select image files only",
            variant: "destructive",
          })
          return null
        }
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Images must be less than 5MB",
            variant: "destructive",
          })
          return null
        }

        const reader = new FileReader()
        return new Promise<{ file: File; preview: string }>((resolve) => {
          reader.onloadend = () => {
            resolve({file, preview: reader.result as string})
          }
          reader.readAsDataURL(file)
        })
      })

      Promise.all(newImages.filter(Boolean) as Promise<{ file: File; preview: string }>[]).then((results) => {
        setThreadsImages((prev) => [...prev, ...results])
      })
    }

    // Reset the input to allow selecting the same files again
    if (threadsImageInputRef.current) {
      threadsImageInputRef.current.value = ""
    }
  }

  const handlePostImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        })
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        })
        return
      }

      setPostImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPostImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeMainImage = () => {
    setMainImagePreview(null)
    setMainImageFile(null)
    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = ""
    }
  }

  const removeThreadsImage = (index: number) => {
    setThreadsImages((prev) => prev.filter((_, i) => i !== index))
  }

  const removePostImage = () => {
    setPostImagePreview(null)
    setPostImageFile(null)
    if (postImageInputRef.current) {
      postImageInputRef.current.value = ""
    }
  }

  // Form submission
  const onSubmit = async (data: InstagramModelFormValues) => {
    try {
      // Create a FormData instance for file uploads
      const formData = new FormData()

      // Add basic form fields
      formData.append("name", data.name)
      if (data.description) formData.append("description", data.description)

      // Add bio_list as JSON
      if (data.bio_list && data.bio_list.length > 0) {
        formData.append("bio_list", JSON.stringify(data.bio_list))
      }

      // Add main image if available
      if (mainImageFile) {
        formData.append("image", mainImageFile)
      }

      // Add threads profile pictures
      threadsImages.forEach((image, index) => {
        if (image.file) {
          formData.append(`threads_pp`, image.file)
        } else if (image.preview && !image.preview.startsWith("data:")) {
          // If it's a URL and not a data URL, it's an existing image
          formData.append(`threads_pp_ids`, image.preview)
        }
      })

      // Add post image if available
      if (postImageFile) {
        formData.append("posts", postImageFile)
      }

      // Send the request
      const response = await fetch(initialData?.id ? `/api/models/${initialData.id}` : "/api/models", {
        method: initialData?.id ? "PUT" : "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save model")
      }

      toast({
        title: initialData?.id ? "Model updated successfully" : "Model created successfully",
      })

      router.push(routes.dashboard.model.index)
    } catch (error: any) {
      console.error("Error saving model:", error)
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: error.message || "Unknown error",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid max-w-2xl gap-6">
        <h2 className="text-2xl font-bold">Instagram Model Configuration</h2>

        {/* Name field */}
        <FormField
          control={form.control}
          name="name"
          render={({field}) => (
            <FormItem>
              <FormLabel>Model Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter model name" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        {/* Description field */}
        <FormField
          control={form.control}
          name="description"
          render={({field}) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter model description"
                  {...field}
                  value={field.value || ""}
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        {/* Bio list field */}
        <FormField
          control={form.control}
          name="bio_list"
          render={({field}) => (
            <FormItem>
              <FormLabel>Bio List</FormLabel>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add bio item"
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addBioItem()
                      }
                    }}
                  />
                  <Button type="button" onClick={addBioItem} variant="outline">
                    <Plus className="size-4"/>
                  </Button>
                </div>

                {field.value && field.value.length > 0 ? (
                  <ScrollArea className="h-[150px] rounded-md border p-2">
                    <div className="space-y-2">
                      {field.value.map((item, index) => (
                        <div key={index} className="flex items-center justify-between rounded-md border p-2">
                          <span className="text-sm">{item}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeBioItem(index)}>
                            <Trash2 className="size-4 text-destructive"/>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="rounded-md border border-dashed p-4 text-center text-muted-foreground">
                    No bio items added yet
                  </div>
                )}
              </div>
              <FormMessage/>
            </FormItem>
          )}
        />

        {/* Main profile image */}
        <div className="space-y-2">
          <FormLabel>Profile Image</FormLabel>
          <div className="flex flex-col gap-4">
            {mainImagePreview ? (
              <div className="relative size-40 overflow-hidden rounded-md border">
                <Image src={mainImagePreview || "/placeholder.svg"} alt="Profile image" fill className="object-cover"/>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2 size-6"
                  onClick={removeMainImage}
                >
                  <X className="size-4"/>
                </Button>
              </div>
            ) : (
              <div
                className="flex size-40 cursor-pointer items-center justify-center rounded-md border border-dashed"
                onClick={() => mainImageInputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <Upload className="size-6"/>
                  <span className="text-xs">Upload profile image</span>
                </div>
              </div>
            )}
            <input
              type="file"
              ref={mainImageInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleMainImageChange}
            />
          </div>
        </div>

        {/* Threads profile pictures */}
        <div className="space-y-2">
          <FormLabel>Threads Profile Pictures</FormLabel>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
              {threadsImages.map((image, index) => (
                <div key={index} className="relative size-24 overflow-hidden rounded-md border">
                  <Image
                    src={image.preview || "/placeholder.svg"}
                    alt={`Threads image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-1 top-1 size-5"
                    onClick={() => removeThreadsImage(index)}
                  >
                    <X className="size-3"/>
                  </Button>
                </div>
              ))}
              <div
                className="flex size-24 cursor-pointer items-center justify-center rounded-md border border-dashed"
                onClick={() => threadsImageInputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <Plus className="size-5"/>
                  <span className="text-center text-xs">Add image</span>
                </div>
              </div>
            </div>
            <input
              type="file"
              ref={threadsImageInputRef}
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleThreadsImageChange}
            />
          </div>
        </div>

        {/* Posts image */}
        <div className="space-y-2">
          <FormLabel>Posts Image</FormLabel>
          <div className="flex flex-col gap-4">
            {postImagePreview ? (
              <div className="relative size-40 overflow-hidden rounded-md border">
                <Image src={postImagePreview || "/placeholder.svg"} alt="Posts image" fill className="object-cover"/>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2 size-6"
                  onClick={removePostImage}
                >
                  <X className="size-4"/>
                </Button>
              </div>
            ) : (
              <div
                className="flex size-40 cursor-pointer items-center justify-center rounded-md border border-dashed"
                onClick={() => postImageInputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <Upload className="size-6"/>
                  <span className="text-xs">Upload posts image</span>
                </div>
              </div>
            )}
            <input
              type="file"
              ref={postImageInputRef}
              accept="image/*"
              className="hidden"
              onChange={handlePostImageChange}
            />
          </div>
        </div>

        {/* Submit button */}
        <Button type="submit" className="w-full md:w-auto">
          {initialData?.id ? "Update Instagram Model" : "Create Instagram Model"}
        </Button>
      </form>
    </Form>
  )
}
