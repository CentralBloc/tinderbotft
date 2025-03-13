"use client"

import {useCallback, useState} from "react"
import {useDropzone} from "react-dropzone"
import {Button} from "@/components/ui/button"
import {Upload, X} from "lucide-react"
import Image from "next/image"
import {cn} from "@/lib/utils"

interface ImageUploaderProps {
    value: any[]
    onChange: (files: any[]) => void
    maxFiles?: number
    acceptedFileTypes?: string
}

export function ImageUploader({
                                  value = [],
                                  onChange,
                                  maxFiles = 5,
                                  acceptedFileTypes = "image/*",
                              }: Readonly<ImageUploaderProps>) {
    const [files, setFiles] = useState<any[]>(value || [])

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const newFiles = acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                }),
            )

            const updatedFiles = [...files, ...newFiles].slice(0, maxFiles)
            setFiles(updatedFiles)
            onChange(updatedFiles)
        },
        [files, maxFiles, onChange],
    )

    const removeFile = (index: number) => {
        const updatedFiles = [...files]
        updatedFiles.splice(index, 1)
        setFiles(updatedFiles)
        onChange(updatedFiles)
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            [acceptedFileTypes]: [],
        },
        maxFiles: maxFiles - files.length,
        disabled: files.length >= maxFiles,
    })

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                    isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50",
                    files.length >= maxFiles && "opacity-50 cursor-not-allowed",
                )}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-2">
                    <Upload className="size-8 text-gray-400" />
                    <p className="text-sm text-gray-600">
                        {isDragActive
                            ? "Drop the files here..."
                            : files.length >= maxFiles
                                ? `Maximum ${maxFiles} files reached`
                                : `Drag & drop files here, or click to select files`}
                    </p>
                    <p className="text-xs text-gray-500">
                        {acceptedFileTypes === "image/*" ? "JPG, PNG, GIF up to 10MB" : "MP4, MOV up to 50MB"}
                    </p>
                </div>
            </div>

            {files.length > 0 && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {files.map((file, index) => (
                        <div key={index} className="group relative overflow-hidden rounded-md border">
                            {file.type?.includes("image") || file.preview ? (
                                <div className="relative aspect-square">
                                    <Image
                                        src={file.preview || URL.createObjectURL(file)}
                                        alt={`Preview ${index}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="flex aspect-square items-center justify-center bg-gray-100">
                                    <span className="text-xs text-gray-500">{file.name || "Video file"}</span>
                                </div>
                            )}
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute right-1 top-1 size-6 opacity-0 transition-opacity group-hover:opacity-100"
                                onClick={() => removeFile(index)}
                            >
                                <X className="size-3" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
