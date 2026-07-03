/**
 * mangue-ui — public entry point.
 *
 * Import the design tokens once in your app's CSS (see README):
 *     @import "mangue-ui/tokens.css";
 *
 * Then import components from the package root:
 *     import { Button, Sidebar, CommandMenu, NumoChat } from "mangue-ui";
 */

// ── Utilities ──────────────────────────────────────────────────────────────
export { cn } from "./lib/utils";
export * from "./lib/motion";
export * from "./lib/hooks/use-mobile";

// ── Theme ──────────────────────────────────────────────────────────────────
export * from "./components/theme-provider";

// ── Primitives (shadcn / radix-nova) ───────────────────────────────────────
export * from "./components/ui/accordion";
export * from "./components/ui/alert";
export * from "./components/ui/alert-dialog";
export * from "./components/ui/avatar";
export * from "./components/ui/back-link-button";
export * from "./components/ui/badge";
export * from "./components/ui/button";
export * from "./components/ui/button-group";
export * from "./components/ui/card";
export * from "./components/ui/carousel";
export * from "./components/ui/category-pill";
export * from "./components/ui/checkbox";
export * from "./components/ui/collapsible";
export * from "./components/ui/color-input";
export * from "./components/ui/command";
export * from "./components/ui/confirm-delete-dialog";
export * from "./components/ui/dialog";
export * from "./components/ui/dropdown-menu";
export * from "./components/ui/horizontal-scroller";
export * from "./components/ui/hover-card";
export * from "./components/ui/icon-button";
export * from "./components/ui/import-json-button";
export * from "./components/ui/input";
export * from "./components/ui/input-group";
export * from "./components/ui/kbd";
export * from "./components/ui/menu-section";
export * from "./components/ui/popover";
export * from "./components/ui/progress";
export * from "./components/ui/prompt-input";
export * from "./components/ui/scroll-area";
export * from "./components/ui/segmented-control";
export * from "./components/ui/select";
export * from "./components/ui/send-button-with-cost";
export * from "./components/ui/separator";
export * from "./components/ui/sheet";
export * from "./components/ui/skeleton";
export * from "./components/ui/slider";
export * from "./components/ui/sonner";
export * from "./components/ui/spinner";
export * from "./components/ui/status-chip";
export * from "./components/ui/switch";
export * from "./components/ui/tabs";
export * from "./components/ui/textarea";
export * from "./components/ui/tooltip";
export * from "./components/ui/type-badge";
export * from "./components/ui/wizard-stepper";

// ── App shell (decoupled) ──────────────────────────────────────────────────
export * from "./components/shell/types";
export * from "./components/shell/sidebar";
export * from "./components/shell/header";
export * from "./components/shell/command-menu";
export * from "./components/shell/mobile-nav";
export * from "./components/shell/app-shell";

// ── Chat ───────────────────────────────────────────────────────────────────
export * from "./chat/numo-chat";

// ── Toast (re-exported from sonner for convenience) ─────────────────────────
export { toast } from "sonner";
