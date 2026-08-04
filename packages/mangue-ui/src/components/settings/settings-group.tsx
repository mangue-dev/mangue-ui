"use client"

import * as React from "react"
import type { LucideIcon } from "lucide-react"

import { cn } from "../../lib/utils"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
  type FieldOrientation,
} from "../ui/field"
import { HelpHint } from "../ui/help-hint"

/**
 * The settings grammar.
 *
 * Primitives alone don't make a settings screen: two authors given a `Switch`
 * and a `Select` will lay them out differently, and a settings screen made of
 * several differently-laid-out tabs is unreadable no matter how good each
 * control is. This is the missing layer — three levels, each of them MARKED:
 *
 *     Page title       text-2xl font-display        "Settings"
 *     └─ Group (card)  text-sm font-medium + icon   "Appearance"
 *        └─ Row        label left · control right, hairline between two
 *
 * A row is key/value BY DEFAULT, not key/value always: a 500-character textarea,
 * a 2FA enrolment QR code, a CSV dropzone go `orientation="vertical"`. The rule
 * is to drop the control below the label only when it plainly does not fit at
 * the end of the line.
 *
 * Every string is a prop — the library ships no i18n.
 */

/**
 * The DOM id of a settings card, from the id you gave it in the layout's
 * `sections` catalogue. Prefixed, so a section id can be a plain word ("cadence")
 * without colliding with anything else on the page.
 */
export function settingsSectionAnchor(id: string): string {
  return `settings-section-${id}`
}

/** The card: header (icon, title, hint, master control), body, footer. */
function SettingsGroup({
  icon: Icon,
  title,
  description,
  help,
  helpLabel,
  action,
  footer,
  tone = "default",
  variant = "rows",
  sectionId,
  className,
  children,
}: {
  icon?: LucideIcon
  title: React.ReactNode
  /** The subtitle. Give every group one: without it the title floats alone
   *  beside its icon chip, and the reader has to open the group to learn what
   *  it holds. */
  description?: React.ReactNode
  /** Long prose, taken out of the page and put behind an ⓘ. */
  help?: React.ReactNode
  /** Accessible name of the ⓘ trigger (default: "Learn more"). */
  helpLabel?: string
  /** A control to the right of the title — a group's master switch. */
  action?: React.ReactNode
  /** Card footer: the "Save" button of a group that submits. */
  footer?: React.ReactNode
  tone?: "default" | "destructive"
  /** `rows`: `SettingsRow`s separated by a hairline. `block`: free content. */
  variant?: "rows" | "block"
  /**
   * Its entry in the layout's `sections` catalogue. That is what makes the card
   * reachable by name — from the sidebar filter, or from your command palette
   * via `SettingsLayout`'s `focusSection`: the screen scrolls to it and rings it
   * for the length of a glance.
   */
  sectionId?: string
  className?: string
  children?: React.ReactNode
}) {
  const destructive = tone === "destructive"
  // `Children.toArray` drops `false` / `null`: without it a body made only of
  // conditional rows (`{enabled && <Row/>}`) still reads as truthy, and the card
  // draws an empty bordered strip under its header.
  const hasBody = React.Children.toArray(children).length > 0
  return (
    <section
      data-slot="settings-group"
      id={sectionId ? settingsSectionAnchor(sectionId) : undefined}
      className={cn(
        // The ring drawn by `[data-settings-focus]` follows the card's radius,
        // and `scroll-mt` keeps a scrolled-to card clear of the sticky header.
        "scroll-mt-6",
        "rounded-xl border bg-card text-card-foreground",
        destructive ? "border-destructive/30" : "border-border",
        className
      )}
    >
      {/* With no hint the title stands alone: top-aligning it would offset it
          from its icon chip for nothing. */}
      <header
        className={cn(
          "flex justify-between gap-4 p-4",
          description ? "items-start" : "items-center"
        )}
      >
        <div
          className={cn(
            "flex min-w-0 gap-3",
            description ? "items-start" : "items-center"
          )}
        >
          {Icon && (
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-lg",
                description && "mt-0.5",
                destructive
                  ? "bg-destructive/10 text-destructive"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Icon className="size-4" />
            </span>
          )}
          <div className="flex min-w-0 flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <h2
                className={cn(
                  "text-sm font-medium",
                  destructive && "text-destructive"
                )}
              >
                {title}
              </h2>
              {help && <HelpHint label={helpLabel}>{help}</HelpHint>}
            </div>
            {description && (
              <p className="text-xs leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
        {action && (
          <div className="flex shrink-0 items-center gap-2.5">{action}</div>
        )}
      </header>

      {hasBody && (
        <FieldGroup
          className={cn(
            "border-t",
            destructive ? "border-destructive/30" : "border-border",
            variant === "rows" ? "divide-y divide-border px-4" : "p-4"
          )}
        >
          {children}
        </FieldGroup>
      )}

      {footer && (
        <div
          className={cn(
            "flex items-center justify-end gap-2 border-t px-4 py-3",
            destructive ? "border-destructive/30" : "border-border"
          )}
        >
          {footer}
        </div>
      )}
    </section>
  )
}

/**
 * A setting: label (+ ⓘ) and hint on the left, control on the right, expandable
 * content below. `htmlFor` makes it a real `<label>` — without it the head is a
 * title, which is the right call when the control isn't a single field (a button
 * group, a list of actions).
 */
function SettingsRow({
  label,
  hint,
  help,
  helpLabel,
  htmlFor,
  control,
  orientation = "responsive",
  className,
  children,
}: {
  label: React.ReactNode
  hint?: React.ReactNode
  help?: React.ReactNode
  helpLabel?: string
  htmlFor?: string
  control?: React.ReactNode
  orientation?: FieldOrientation
  className?: string
  children?: React.ReactNode
}) {
  const head = (
    <>
      {label}
      {help && <HelpHint label={helpLabel}>{help}</HelpHint>}
    </>
  )
  return (
    <div
      data-slot="settings-row"
      className={cn("flex flex-col gap-2.5 py-3.5", className)}
    >
      <Field orientation={orientation}>
        <FieldContent>
          {htmlFor ? (
            <FieldLabel htmlFor={htmlFor}>{head}</FieldLabel>
          ) : (
            <FieldTitle>{head}</FieldTitle>
          )}
          {hint && <FieldDescription>{hint}</FieldDescription>}
        </FieldContent>
        {control && (
          <div
            className={cn(
              "flex items-center gap-2",
              orientation === "vertical" ? "w-full" : "shrink-0"
            )}
          >
            {control}
          </div>
        )}
      </Field>
      {children}
    </div>
  )
}

/**
 * An inventory row: something that already exists (a connected account, a linked
 * repository, a member, an API key) — icon or avatar, name, state underneath,
 * action on the right.
 */
function SettingsListRow({
  icon: Icon,
  avatar,
  title,
  subtitle,
  action,
  /** A state line SAYS why an action isn't offered: truncating it defeats it. */
  truncateSubtitle = true,
  className,
}: {
  icon?: LucideIcon
  /** Wins over `icon` — pass a real avatar, a logo, a colored dot. */
  avatar?: React.ReactNode
  title: React.ReactNode
  subtitle?: React.ReactNode
  action?: React.ReactNode
  truncateSubtitle?: boolean
  className?: string
}) {
  return (
    <div
      data-slot="settings-list-row"
      className={cn("flex items-center gap-3 py-3", className)}
    >
      {avatar ??
        (Icon && (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Icon className="size-4" />
          </span>
        ))}
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{title}</div>
        {subtitle && (
          <div
            className={cn(
              "text-xs text-muted-foreground",
              truncateSubtitle && "truncate"
            )}
          >
            {subtitle}
          </div>
        )}
      </div>
      {action && (
        <div className="flex shrink-0 items-center gap-2">{action}</div>
      )}
    </div>
  )
}

/** What a group says when it has nothing to show — or nothing yet. */
function SettingsEmpty({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <p
      data-slot="settings-empty"
      className={cn("py-3.5 text-sm text-muted-foreground", className)}
    >
      {children}
    </p>
  )
}

export { SettingsEmpty, SettingsGroup, SettingsListRow, SettingsRow }
