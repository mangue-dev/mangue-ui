"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

/**
 * `Field` — the form LAYOUT primitive (shadcn/ui).
 *
 * The library shipped excellent controls (Switch, Select, Input, Checkbox…) and
 * no grammar to lay them out. Every consumer therefore wrote its own `flex`, and
 * different authors wrote different ones: switch on the left here, on the right
 * there, label above the field elsewhere. `Field` is the missing piece — it says
 * where the key goes and where the value goes, once.
 *
 * `orientation="responsive"` is the settings-screen default: key on the left,
 * value on the right, stacking below `@md`. It reads a CONTAINER query, not the
 * viewport — so a field laid out inside a narrow panel stacks even on a wide
 * screen. That query lives on `FieldGroup`, which every responsive `Field` must
 * therefore sit under.
 *
 * For a ready-made settings screen built on top of this, see
 * `components/settings/` (`SettingsGroup`, `SettingsRow`, `SettingsLayout`).
 */

const fieldVariants = cva(
  "group/field flex w-full gap-2 data-[invalid=true]:text-destructive",
  {
    variants: {
      orientation: {
        vertical: "flex-col items-stretch",
        horizontal: "flex-row items-center justify-between",
        responsive:
          "flex-col items-stretch @md/field-group:flex-row @md/field-group:items-center @md/field-group:justify-between",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
)

export type FieldOrientation = NonNullable<
  VariantProps<typeof fieldVariants>["orientation"]
>

/** A group of fields. Carries the container query `responsive` lives on. */
function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn("@container/field-group flex flex-col", className)}
      {...props}
    />
  )
}

/** One field: its content (label + description) on one side, its control on the other. */
function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
}

/** The left column: label, title, description. Shrinks; never overflows. */
function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn("flex min-w-0 flex-1 flex-col gap-0.5", className)}
      {...props}
    />
  )
}

/** A clickable label bound to a control through `htmlFor`. */
function FieldLabel({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="field-label"
      className={cn(
        "flex w-fit items-center gap-1.5 text-sm leading-snug font-medium text-foreground",
        "group-data-[disabled=true]/field:opacity-50",
        "has-[+*]:cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

/** The heading of a field with no single control to point at — not a `<label>`. */
function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-title"
      className={cn(
        "flex w-fit items-center gap-1.5 text-sm leading-snug font-medium text-foreground",
        className
      )}
      {...props}
    />
  )
}

/** The hint under the label: what the setting does, in one sentence. */
function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "text-xs leading-relaxed font-normal text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

/** A field's error message. */
function FieldError({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-error"
      role="alert"
      className={cn("text-sm text-destructive", className)}
      {...props}
    />
  )
}

/** A hairline between two fields — not the full `Separator`. */
function FieldSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-separator"
      role="separator"
      className={cn("h-px w-full bg-border", className)}
      {...props}
    />
  )
}

/** A named subset of fields (`<fieldset>` + its legend). */
function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn("flex min-w-0 flex-col gap-3", className)}
      {...props}
    />
  )
}

function FieldLegend({ className, ...props }: React.ComponentProps<"legend">) {
  return (
    <legend
      data-slot="field-legend"
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  )
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
  fieldVariants,
}
