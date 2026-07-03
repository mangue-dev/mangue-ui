"use client"

import * as React from "react"
import { Upload } from "lucide-react"
import { toast } from "sonner"

import { Button } from "./button"
import { cn } from "../../lib/utils"

type ButtonProps = React.ComponentProps<typeof Button>

export interface ImportJsonButtonProps
  extends Omit<ButtonProps, "onClick" | "type" | "asChild" | "onLoad" | "onError"> {
  onLoad: (data: unknown, file: File) => void | Promise<void>
  onError?: (error: Error, file: File) => void
  label?: React.ReactNode
  accept?: string
  errorToastMessage?: string
}

export function ImportJsonButton({
  onLoad,
  onError,
  label = "Import JSON",
  accept = "application/json,.json",
  errorToastMessage = "Invalid JSON file",
  variant = "outline",
  size = "sm",
  className,
  children,
  disabled,
  ...props
}: ImportJsonButtonProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return

    try {
      setIsLoading(true)
      const text = await file.text()
      const data = JSON.parse(text) as unknown
      await onLoad(data, file)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      if (onError) {
        onError(error, file)
      } else {
        toast.error(errorToastMessage, { description: error.message })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={cn("gap-1.5", className)}
        onClick={() => inputRef.current?.click()}
        disabled={disabled || isLoading}
        {...props}
      >
        <Upload className="h-3.5 w-3.5" />
        {children ?? label}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
        aria-hidden="true"
        tabIndex={-1}
      />
    </>
  )
}
