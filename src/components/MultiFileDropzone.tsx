"use client"

import { formatFileSize } from "@/lib/utils"
import { FileIcon, UploadCloudIcon } from "lucide-react"
import * as React from "react"
import { useCallback } from "react"
import { DropzoneOptions, useDropzone } from "react-dropzone"
import { twMerge } from "tailwind-merge"

const variants = {
  base: "relative rounded-md p-4 w-full flex justify-center items-center flex-col cursor-pointer border border-dashed border-zinc-300  transition-colors duration-200 ease-in-out bg-zinc-100",
  active: "border-2",
  disabled:
    "bg-gray-700 border-white/20 cursor-default pointer-events-none bg-opacity-30",
  accept: "border border-blue-500 bg-blue-500 bg-opacity-10",
  reject: "border border-red-700 bg-red-700 bg-opacity-10",
}

type InputProps = {
  className?: string
  value?: File[]
  onChange?: (acceptedFiles: File[]) => void | Promise<void>
  onFilesAdded?: (addedFiles: File[]) => void | Promise<void>
  disabled?: boolean
  dropzoneOptions?: Omit<DropzoneOptions, "disabled">
}

const ERROR_MESSAGES = {
  fileTooLarge(maxSize: number) {
    return `The file is too large. Max size is ${formatFileSize(maxSize)}.`
  },
  fileInvalidType() {
    return "Invalid file type."
  },
  tooManyFiles(maxFiles: number) {
    return `You can only add ${maxFiles} file(s).`
  },
  fileNotSupported() {
    return "The file is not supported."
  },
}

const MultiFileDropzone = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { dropzoneOptions, value, className, disabled, onFilesAdded, onChange },
    ref,
  ) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
      if (acceptedFiles) {
        void onFilesAdded?.(acceptedFiles)
        void onChange?.(acceptedFiles)
      }
    }, [])
    if (dropzoneOptions?.maxFiles && value?.length) {
      disabled = disabled ?? value.length >= dropzoneOptions.maxFiles
    }
    // dropzone configuration
    const {
      getRootProps,
      getInputProps,
      fileRejections,
      isFocused,
      isDragAccept,
      isDragReject,
    } = useDropzone({
      disabled,
      onDrop,
      ...dropzoneOptions,
    })

    // styling
    const dropZoneClassName = React.useMemo(
      () =>
        twMerge(
          variants.base,
          isFocused && variants.active,
          disabled && variants.disabled,
          (isDragReject ?? fileRejections[0]) && variants.reject,
          isDragAccept && variants.accept,
          className,
        ).trim(),
      [
        isFocused,
        fileRejections,
        isDragAccept,
        isDragReject,
        disabled,
        className,
      ],
    )

    // error validation messages
    const errorMessage = React.useMemo(() => {
      if (fileRejections[0]) {
        const { errors } = fileRejections[0]
        if (errors[0]?.code === "file-too-large") {
          return ERROR_MESSAGES.fileTooLarge(dropzoneOptions?.maxSize ?? 0)
        } else if (errors[0]?.code === "file-invalid-type") {
          return ERROR_MESSAGES.fileInvalidType()
        } else if (errors[0]?.code === "too-many-files") {
          return ERROR_MESSAGES.tooManyFiles(dropzoneOptions?.maxFiles ?? 0)
        } else {
          return ERROR_MESSAGES.fileNotSupported()
        }
      }
      return undefined
    }, [fileRejections, dropzoneOptions])

    return (
      <div>
        <div className="flex flex-col gap-2">
          <div>
            {/* Main File Input */}
            <div
              {...getRootProps({
                className: dropZoneClassName,
              })}
            >
              <input ref={ref} {...getInputProps()} />
              <div className="flex flex-col items-center justify-center text-xs text-zinc-900">
                <UploadCloudIcon className="mb-1 h-7 w-7" />
                <div className="text-zinc-900">
                  Arrossega i deixa anar o fes clic per pujar fitxers
                </div>
              </div>
            </div>

            {/* Error Text */}
            <div className="mt-1 text-xs text-red-500">{errorMessage}</div>
          </div>

          {/* Selected Files */}
          {value?.map((file, i) => (
            <div
              key={i}
              className="flex h-fit max-h-36 w-full flex-col justify-center rounded border border-solid border-zinc-300 px-4 py-2"
            >
              <div className="flex items-center gap-2 text-zinc-900">
                <FileIcon size="30" className="shrink-0" />
                <div className="min-w-0 text-sm">
                  <div className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                    {file.name}
                  </div>
                  <div className="text-xs text-zinc-900">
                    {formatFileSize(file.size)}
                  </div>
                </div>
                <div className="grow" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
)
MultiFileDropzone.displayName = "MultiFileDropzone"

export { MultiFileDropzone }
