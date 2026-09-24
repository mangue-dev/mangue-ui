"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "./button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu"

type SplitButtonVariant = "default" | "outline" | "ghost" | "destructive"
type SplitButtonSize = "sm" | "default" | "lg"

/** The chevron trigger is a square icon-button matching the action's height. */
const TRIGGER_SIZE: Record<SplitButtonSize, "icon-sm" | "icon" | "icon-lg"> = {
  sm: "icon-sm",
  default: "icon",
  lg: "icon-lg",
}

/** Divider tinted per variant. Only the RIGHT border is colored (the button's
 *  base already draws a 1px transparent border on all sides) so a solid-fill
 *  action doesn't get outlined on every edge — just the seam with the chevron. */
const DIVIDER: Record<SplitButtonVariant, string> = {
  default: "border-r-primary-foreground/20",
  destructive: "border-r-destructive-border",
  outline: "border-r-border",
  ghost: "border-r-border",
}

export interface SplitButtonProps
  extends Omit<
    React.ComponentProps<typeof Button>,
    "size" | "variant" | "asChild"
  > {
  variant?: SplitButtonVariant
  size?: SplitButtonSize
  /** Dropdown items, rendered inside the menu's `DropdownMenuContent`. */
  menu: React.ReactNode
  /** Accessible label for the chevron trigger. */
  menuLabel?: string
  /** Alignment of the dropdown relative to the trigger (default "end"). */
  menuAlign?: "start" | "center" | "end"
  /** Extra props forwarded to `DropdownMenuContent`. */
  menuContentProps?: React.ComponentProps<typeof DropdownMenuContent>
  /** Controlled open state for the dropdown. */
  menuOpen?: boolean
  onMenuOpenChange?: (open: boolean) => void
  /** className for the outer wrapper. */
  className?: string
  /** className for the primary action button. */
  actionClassName?: string
  /** className for the chevron trigger button. */
  triggerClassName?: string
}

/**
 * A split button: a primary action fused with a dropdown. Clicking the left
 * side runs the action; the right chevron opens `menu`. Both halves share the
 * same `variant`/`size` and read as a single pill.
 *
 *   <SplitButton onClick={run} menu={<><DropdownMenuItem>…</DropdownMenuItem></>}>
 *     <Play /> Run
 *   </SplitButton>
 */
export function SplitButton({
  variant = "default",
  size = "default",
  menu,
  menuLabel = "More options",
  menuAlign = "end",
  menuContentProps,
  menuOpen,
  onMenuOpenChange,
  className,
  actionClassName,
  triggerClassName,
  disabled,
  children,
  ...actionProps
}: SplitButtonProps) {
  return (
    <div data-slot="split-button" className={cn("inline-flex", className)}>
      <Button
        variant={variant}
        size={size}
        disabled={disabled}
        className={cn("rounded-r-none", DIVIDER[variant], actionClassName)}
        {...actionProps}
      >
        {children}
      </Button>
      <DropdownMenu open={menuOpen} onOpenChange={onMenuOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            size={TRIGGER_SIZE[size]}
            disabled={disabled}
            aria-label={menuLabel}
            className={cn(
              "rounded-l-none border-l-0",
              triggerClassName
            )}
          >
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={menuAlign} {...menuContentProps}>
          {menu}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
