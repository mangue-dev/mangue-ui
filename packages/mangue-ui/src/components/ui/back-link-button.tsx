import * as React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "./button"
import { cn } from "../../lib/utils"

type ButtonBaseProps = Omit<
  React.ComponentProps<typeof Button>,
  "variant" | "size" | "asChild"
>

export type BackLinkButtonProps = ButtonBaseProps &
  (
    | { href: string; onClick?: never }
    | { href?: undefined; onClick: React.MouseEventHandler<HTMLButtonElement> }
  ) & {
    label?: React.ReactNode
  }

export function BackLinkButton({
  href,
  onClick,
  label = "Back",
  className,
  children,
  ...props
}: BackLinkButtonProps) {
  const content = (
    <>
      <ArrowLeft className="h-3.5 w-3.5" />
      {children ?? label}
    </>
  )

  if (href) {
    return (
      <Button
        asChild
        variant="ghost"
        size="sm"
        className={cn("gap-1.5 -ml-1", className)}
        {...props}
      >
        <Link href={href}>{content}</Link>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn("gap-1.5 -ml-1", className)}
      {...props}
    >
      {content}
    </Button>
  )
}
