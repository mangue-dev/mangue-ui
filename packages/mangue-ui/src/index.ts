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
export * from "./lib/command-filter";
export * from "./lib/hooks/use-mobile";
export * from "./lib/hooks/use-scroll-fade";
export * from "./lib/hooks/use-elapsed";

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
export * from "./components/ui/category-chip";
export * from "./components/ui/category-pill";
export * from "./components/ui/checkbox";
export * from "./components/ui/collapsible";
export * from "./components/ui/color-input";
export * from "./components/ui/combobox";
export * from "./components/ui/command";
export * from "./components/ui/confirm-delete-dialog";
export * from "./components/ui/dialog";
export * from "./components/ui/dropdown-menu";
export * from "./components/ui/field";
export * from "./components/ui/help-hint";
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
export * from "./components/ui/search-menu";
export * from "./components/ui/search-select";
export * from "./components/ui/segmented-control";
export * from "./components/ui/select";
export * from "./components/ui/send-button-with-cost";
export * from "./components/ui/separator";
export * from "./components/ui/sheet";
export * from "./components/ui/side-panel";
export * from "./components/ui/skeleton";
export * from "./components/ui/slider";
export * from "./components/ui/sonner";
export * from "./components/ui/spinner";
export * from "./components/ui/split-button";
export * from "./components/ui/status-chip";
export * from "./components/ui/switch";
export * from "./components/ui/tabs";
export * from "./components/ui/textarea";
export * from "./components/ui/tooltip";
export * from "./components/ui/type-badge";
export * from "./components/ui/wizard-stepper";

// ── Settings screens ───────────────────────────────────────────────────────
// The grammar that turns primitives into a settings page: a card per group, a
// key/value row per option, one column, one tab rail. Built on `Field`.
export * from "./components/settings/settings-group";
export * from "./components/settings/settings-layout";

// ── App shell (decoupled) ──────────────────────────────────────────────────
// Two levels of navigation: the primary sidebar, always there, and a SECONDARY
// one a page mounts for itself (a list of pull requests, of settings sections).
// Mounting one rails the primary — see the README, "Double sidebar".
export * from "./components/shell/types";
export * from "./components/shell/secondary-sidebar";
export * from "./components/shell/sidebar-filter-field";
export * from "./components/shell/sidebar";
export * from "./components/shell/header";
export * from "./components/shell/command-menu";
export * from "./components/shell/search-command";
export * from "./components/shell/mobile-nav";
export * from "./components/shell/app-shell";

// ── AI ─────────────────────────────────────────────────────────────────────
// Ready-to-use agent surfaces. Every label is a prop with an English default:
// the library ships no i18n, so an app plugs its own strings straight in.
export * from "./ai/agent-beam";
export * from "./ai/agent-fab";
export * from "./ai/agent-input";
export * from "./ai/context-pill";
export * from "./ai/context-pill-row";
export * from "./ai/model-badge";
export * from "./ai/model-combobox";
export * from "./ai/model-format";
export * from "./ai/model-logo";
export * from "./ai/tool-call-list";
export * from "./ai/work-accordion";

// ── Chat ───────────────────────────────────────────────────────────────────
export * from "./chat/numo-chat";

// ── Toast (re-exported from sonner for convenience) ─────────────────────────
export { toast } from "sonner";
