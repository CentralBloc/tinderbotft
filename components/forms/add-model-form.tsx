"use client"

import React, {useEffect} from "react"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import type * as z from "zod"
import {modelSchema} from "@/lib/validations/model"
import {useAddModel, useUpdateModel} from "@/services/models/hooks"
import {toast} from "@/components/ui/use-toast"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import type {ModelInterface} from "@/types"
import {useRouter} from "next/navigation"
import {routes} from "@/lib/routes"
import {Upload, X} from "lucide-react"
import Image from "next/image"
import {usePicture} from "@/services/pictures/hooks"
import {Textarea} from "@/components/ui/textarea"

type ModelFormValues = z.infer<typeof modelSchema>

interface AddOrUpdateModelFormProps {
  mode: "add" | "update"
  initialData?: ModelInterface
}

export default function AddOrUpdateModelForm({mode, initialData}: Readonly<AddOrUpdateModelFormProps>) {
  const router = useRouter()
  const addMutation = useAddModel()
  const updateMutation = useUpdateModel(initialData?.id ?? "")

  // Store the actual File object in state
  const [imageFile, setImageFile] = React.useState<File | null>(null)
  const [postListFile, setPostListFile] = React.useState<File | null>(null)
  const [threadsFiles, setThreadsFiles] = React.useState<File[]>([])
  const [postListPreview, setPostListPreview] = React.useState<string | null>(null)
  const [threadsPreview, setThreadsPreview] = React.useState<string[]>([])
  const postListFileInputRef = React.useRef<HTMLInputElement>(null)
  const threadsFileInputRef = React.useRef<HTMLInputElement>(null)
  const {data: pictureData, isPending: picturePending} = usePicture(
    initialData?.image && typeof initialData.image === "string" ? initialData.image : "",
  )
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const form = useForm<ModelFormValues>({
    resolver: zodResolver(modelSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      bio_list_text: initialData?.bio_list ? initialData.bio_list.join("\n") : "",
    },
    mode: "all",
  })

  // Log form values on change for debugging
  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log("Form values changed:", value)
    })
    return () => subscription.unsubscribe()
  }, [form])

  // Add this useEffect to update imagePreview when pictureData changes
  useEffect(() => {
    if (pictureData?.link) {
      setImagePreview(pictureData.link)
    }
  }, [pictureData])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      // Store the file in state
      setImageFile(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setImageFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handlePostListChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "File must be less than 10MB",
          variant: "destructive",
        })
        return
      }
      // Store the file in state
      setPostListFile(file)

      // Only create preview for image files
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPostListPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        // For non-image files, just show the file name
        setPostListPreview(null)
      }
    }
  }

  const handleThreadsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const newFiles: File[] = []
      const newPreviews: string[] = []

      // Convert FileList to array and process each file
      Array.from(files).forEach((file) => {
        if (!file.type.startsWith("image/")) {
          toast({
            title: "Invalid file type",
            description: "Please select image files only",
            variant: "destructive",
          })
          return
        }
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Images must be less than 5MB",
            variant: "destructive",
          })
          return
        }

        newFiles.push(file)

        const reader = new FileReader()
        reader.onloadend = () => {
          newPreviews.push(reader.result as string)
          if (newPreviews.length === newFiles.length) {
            setThreadsPreview([...threadsPreview, ...newPreviews])
          }
        }
        reader.readAsDataURL(file)
      })

      setThreadsFiles((prev) => [...prev, ...newFiles])
    }
  }

  const handleRemovePostList = () => {
    setPostListPreview(null)
    setPostListFile(null)
    if (postListFileInputRef.current) {
      postListFileInputRef.current.value = ""
    }
  }

  const handleRemoveThread = (index: number) => {
    const newThreadsFiles = [...threadsFiles]
    newThreadsFiles.splice(index, 1)
    setThreadsFiles(newThreadsFiles)

    const newThreadsPreview = [...threadsPreview]
    newThreadsPreview.splice(index, 1)
    setThreadsPreview(newThreadsPreview)
  }

  const onSubmit = async (data: ModelFormValues) => {
    // Create a new FormData instance
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("description", data.description || "")

    // Parse bio_list_text into an array and convert to JSON string
    if (data.bio_list_text) {
      const bioArray = data.bio_list_text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)

      // Convert the array to a JSON string
      formData.append("bio_list", JSON.stringify(bioArray))
    }

    // Only append image if there's a new file selected
    if (imageFile) {
      formData.append("image", imageFile)
    } else if (initialData?.image && typeof initialData.image === "string" && !imagePreview) {
      // If we're in update mode and the image was removed
      formData.append("remove_image", "true")
    }

    // Handle post_list file (renamed from posts to match backend)
    if (postListFile) {
      formData.append("post_list", postListFile)
    } else if (initialData?.posts && !postListPreview) {
      formData.append("remove_post_list", "true")
    }

    // Handle threads_pp files
    if (threadsFiles.length > 0) {
      threadsFiles.forEach((file) => {
        formData.append("threads_pp", file)
      })
    }

    // Rest of the submission logic remains the same
    if (mode === "add") {
      await addMutation.mutateAsync(formData, {
        onSuccess: () => {
          toast({title: "Model added successfully"})
          router.push(routes.dashboard.model.index)
        },
        onError: (error: any) => {
          console.error("Error adding model:", error)
          toast({
            variant: "destructive",
            title: "An error occurred",
            description: error.response?.data?.error || error.message || "Unknown error",
          })
        },
      })
    } else {
      await updateMutation.mutateAsync(formData, {
        onSuccess: () => {
          toast({title: "Model updated successfully"})
          router.push(routes.dashboard.model.index)
        },
        onError: (error: any) => {
          console.error("Error updating model:", error)
          toast({
            variant: "destructive",
            title: "An error occurred",
            description: error.response?.data?.error || error.message || "Unknown error",
          })
        },
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid max-w-2xl gap-4 md:gap-7">
        <FormField
          control={form.control}
          name="name"
          render={({field}) => (
            <FormItem>
              <FormLabel>Model Name</FormLabel>
              <FormControl>
                <Input placeholder="Model Name" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({field}) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Description" {...field} value={field.value ?? ""}/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <FormLabel>Model Image</FormLabel>
          <div className="flex flex-col gap-4">
            {imagePreview ? (
              <div className="relative size-40 overflow-hidden rounded-md border border-border">
                <Image src={imagePreview || "/placeholder.svg"} alt="Model preview" fill className="object-cover"/>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2 size-6"
                  onClick={handleRemoveImage}
                >
                  <X className="size-4"/>
                </Button>
              </div>
            ) : (
              <div
                className="flex size-40 cursor-pointer items-center justify-center rounded-md border border-dashed border-border"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <Upload className="size-6"/>
                  <span className="text-xs">Upload image</span>
                </div>
              </div>
            )}
            <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageChange}/>
          </div>
        </div>
        <FormField
          control={form.control}
          name="bio_list_text"
          render={({field}) => (
            <FormItem>
              <FormLabel>Bio List</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter bio items (one per line)" className="min-h-[120px] resize-y" {...field} />
              </FormControl>
              <FormMessage/>
              <p className="text-xs text-muted-foreground">Enter each bio item on a new line</p>
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Post List File</FormLabel>
          <div className="flex flex-col gap-4">
            {postListFile ? (
              <div className="relative flex h-20 items-center rounded-md border border-border p-2">
                <div className="flex-1 truncate">
                  <p className="font-medium">{postListFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(postListFile.size / 1024).toFixed(2)} KB • {postListFile.type || "Unknown type"}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="ml-2 size-6"
                  onClick={handleRemovePostList}
                >
                  <X className="size-4"/>
                </Button>
              </div>
            ) : (
              <div
                className="flex h-20 cursor-pointer items-center justify-center rounded-md border border-dashed border-border"
                onClick={() => postListFileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <Upload className="size-6"/>
                  <span className="text-xs">Upload file</span>
                </div>
              </div>
            )}
            <input type="file" ref={postListFileInputRef} className="hidden" onChange={handlePostListChange}/>
          </div>
        </div>

        <div className="space-y-2">
          <FormLabel>Thread Profile Pictures</FormLabel>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
            {threadsPreview.map((preview, index) => (
              <div key={index} className="relative size-24 overflow-hidden rounded-md border border-border">
                <Image
                  src={preview || "/placeholder.svg"}
                  alt={`Thread preview ${index}`}
                  fill
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-1 top-1 size-5"
                  onClick={() => handleRemoveThread(index)}
                >
                  <X className="size-3"/>
                </Button>
              </div>
            ))}
            <div
              className="flex size-24 cursor-pointer items-center justify-center rounded-md border border-dashed border-border"
              onClick={() => threadsFileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-1 text-muted-foreground">
                <Upload className="size-4"/>
                <span className="text-xs">Add</span>
              </div>
            </div>
          </div>
          <input
            type="file"
            ref={threadsFileInputRef}
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleThreadsChange}
          />
        </div>
        <Button type="submit" disabled={addMutation.isPending || updateMutation.isPending}>
          {addMutation.isPending || updateMutation.isPending
            ? "Processing..."
            : mode === "add"
              ? "Add Model"
              : "Update Model"}
        </Button>
      </form>
    </Form>
  )
}
