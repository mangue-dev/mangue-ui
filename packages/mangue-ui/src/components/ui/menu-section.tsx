import * as React from "react"

import { DropdownMenuSeparator } from "./dropdown-menu"

export interface MenuSectionProps {
  children: React.ReactNode
  isFirst?: boolean
}

export function MenuSection({ children, isFirst = false }: MenuSectionProps) {
  return (
    <>
      {!isFirst && <DropdownMenuSeparator data-slot="menu-section-separator" />}
      {children}
    </>
  )
}
