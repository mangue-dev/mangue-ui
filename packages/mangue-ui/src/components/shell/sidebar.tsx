"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { cn } from "../../lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import type { LinkComponent, NavItem, NavSection } from "./types";

export interface SidebarProps {
  sections: NavSection[];
  /** Marks the active item by its `key`. */
  activeKey?: string;
  /** Logo / brand area (top). Hidden when collapsed. */
  header?: React.ReactNode;
  /** User menu / actions area (bottom). */
  footer?: React.ReactNode;
  collapsible?: boolean;
  /** Controlled collapsed state. */
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Pass Next.js's <Link> for client-side nav; falls back to <a>. */
  linkComponent?: LinkComponent;
  className?: string;
}

const EXPANDED_WIDTH = 256;
const COLLAPSED_WIDTH = 56;

export function Sidebar({
  sections,
  activeKey,
  header,
  footer,
  collapsible = true,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  linkComponent,
  className,
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = React.useState(defaultCollapsed);
  const collapsed = collapsedProp ?? internalCollapsed;
  const reduceMotion = useReducedMotion();

  const setCollapsed = (next: boolean) => {
    if (collapsedProp === undefined) setInternalCollapsed(next);
    onCollapsedChange?.(next);
  };

  return (
    <motion.aside
      data-collapsed={collapsed}
      initial={false}
      animate={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
      transition={
        reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 34 }
      }
      className={cn(
        "flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
        className,
      )}
    >
      {/* Header / logo + collapse toggle */}
      <div
        className={cn(
          "flex h-[60px] items-center gap-2 px-3",
          collapsed && "justify-center px-0",
        )}
      >
        {header ? (
          <div className={cn("min-w-0 flex-1", collapsed && "hidden")}>{header}</div>
        ) : null}
        {collapsible ? (
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            {collapsed ? (
              <PanelLeftOpen className="h-[18px] w-[18px]" />
            ) : (
              <PanelLeftClose className="h-[18px] w-[18px]" />
            )}
          </button>
        ) : null}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-x-hidden overflow-y-auto px-2 py-2">
        {sections.map((section, index) => (
          <div key={section.key ?? index} className={cn(index > 0 && "mt-4")}>
            {section.label && !collapsed ? (
              <div className="px-2.5 pt-1 pb-1 text-[11px] font-medium tracking-wide text-sidebar-foreground/45">
                {section.label}
              </div>
            ) : null}
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <li key={item.key}>
                  <SidebarRow
                    item={item}
                    collapsed={collapsed}
                    active={item.active ?? item.key === activeKey}
                    linkComponent={linkComponent}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer / user */}
      {footer ? (
        <div
          className={cn(
            "border-t border-sidebar-border p-2",
            collapsed && "flex justify-center",
          )}
        >
          {footer}
        </div>
      ) : null}
    </motion.aside>
  );
}

interface SidebarRowProps {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
  linkComponent?: LinkComponent;
}

function SidebarRow({ item, collapsed, active, linkComponent: Link }: SidebarRowProps) {
  const Icon = item.icon;

  const rowClass = cn(
    "group relative flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium transition-colors",
    collapsed && "justify-center px-0",
    active
      ? "bg-sidebar-accent text-sidebar-accent-foreground"
      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
    item.disabled && "pointer-events-none opacity-50",
  );

  const inner = (
    <>
      {Icon ? <Icon className="h-[18px] w-[18px] shrink-0" /> : null}
      {!collapsed ? <span className="truncate">{item.label}</span> : null}
      {!collapsed && item.badge != null ? (
        <span className="ml-auto flex items-center">{item.badge}</span>
      ) : null}
    </>
  );

  let row: React.ReactNode;
  if (item.href && Link) {
    row = (
      <Link href={item.href} className={rowClass} aria-current={active ? "page" : undefined}>
        {inner}
      </Link>
    );
  } else if (item.href) {
    row = (
      <a href={item.href} className={rowClass} aria-current={active ? "page" : undefined}>
        {inner}
      </a>
    );
  } else {
    row = (
      <button
        type="button"
        onClick={item.onClick}
        disabled={item.disabled}
        className={cn(rowClass, "w-full text-left")}
      >
        {inner}
      </button>
    );
  }

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{row}</TooltipTrigger>
        <TooltipContent side="right">{item.tooltip ?? item.label}</TooltipContent>
      </Tooltip>
    );
  }

  return row;
}
