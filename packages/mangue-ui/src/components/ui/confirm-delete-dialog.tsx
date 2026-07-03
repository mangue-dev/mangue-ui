"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog"

export interface ConfirmDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: React.ReactNode
  description?: React.ReactNode
  confirmLabel?: React.ReactNode
  cancelLabel?: React.ReactNode
  onConfirm: () => void | Promise<void>
  isLoading?: boolean
  closeOnConfirm?: boolean
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  isLoading: isLoadingProp,
  closeOnConfirm = true,
}: ConfirmDeleteDialogProps) {
  const [isPending, setIsPending] = React.useState(false)
  const isLoading = isLoadingProp ?? isPending

  async function handleConfirm(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    try {
      setIsPending(true)
      await onConfirm()
      if (closeOnConfirm) onOpenChange(false)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
