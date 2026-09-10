/**
 * Public surface of the `settings` feature (theme + writing-canvas style,
 * with Supabase profile sync). Import only from here.
 */
export { CanvasStyleSelector } from "./components/CanvasStyleSelector";
export { SettingsSyncProvider } from "./components/SettingsSyncProvider";
export { ThemeSelector } from "./components/ThemeSelector";
export { ThemeToggle } from "./components/ThemeToggle";
export { useCanvasStyle } from "./hooks/useCanvasStyle";
export { useTheme } from "./hooks/useTheme";
export type { CanvasStyle } from "./lib/canvas";
export { THEME_STORAGE_KEY } from "./lib/theme";
