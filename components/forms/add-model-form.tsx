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

type ModelFormValues = z.infer<typeof modelSchema>

interface AddOrUpdateModelFormProps {
    mode: "add" | "update"
    initialData?: ModelInterface
}

export default function AddOrUpdateModelForm({ mode, initialData }: Readonly<AddOrUpdateModelFormProps>) {
    const router = useRouter()
    const addMutation = useAddModel()
    const updateMutation = useUpdateModel(initialData?.id ?? "")

    // Store the actual File object in state
    const [imageFile, setImageFile] = React.useState<File | null>(null)
    const { data: pictureData, isPending: picturePending } = usePicture(
        initialData?.image && typeof initialData.image === "string" ? initialData.image : "",
    )
    const [imagePreview, setImagePreview] = React.useState<string | null>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const form = useForm<ModelFormValues>({
        resolver: zodResolver(modelSchema),
        defaultValues: {
            name: initialData?.name ?? "",
            description: initialData?.description ?? "",
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

    const onSubmit = async (data: ModelFormValues) => {
        // Create a new FormData instance
        const formData = new FormData()
        formData.append("name", data.name)
        formData.append("description", data.description || "")

        // Only append image if there's a new file selected
        if (imageFile) {
            formData.append("image", imageFile)
            console.log("Appending image file:", imageFile)
        } else if (initialData?.image && typeof initialData.image === "string" && !imagePreview) {
            // If we're in update mode and the image was removed
            formData.append("remove_image", "true")
        }

        if (mode === "add") {
            await addMutation.mutateAsync(formData, {
                onSuccess: () => {
                    toast({ title: "Model added successfully" })
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
                    toast({ title: "Model updated successfully" })
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
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Model Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Model Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder="Description" {...field} value={field.value ?? ""} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="space-y-2">
                    <FormLabel>Model Image</FormLabel>
                    <div className="flex flex-col gap-4">
                        {imagePreview ? (
                            <div className="relative size-40 overflow-hidden rounded-md border border-border">
                                <Image src={imagePreview || "/placeholder.svg"} alt="Model preview" fill className="object-cover" />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute right-2 top-2 size-6"
                                    onClick={handleRemoveImage}
                                >
                                    <X className="size-4" />
                                </Button>
                            </div>
                        ) : (
                            <div
                                className="flex size-40 cursor-pointer items-center justify-center rounded-md border border-dashed border-border"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                                    <Upload className="size-6" />
                                    <span className="text-xs">Upload image</span>
                                </div>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageChange} />
                    </div>
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
