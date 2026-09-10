/**
 * Marketing shell — wraps public landing page.
 * Provides flexible screen scrolling for mobile while maintaining a full-height shell for desktop.
 */
export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="min-h-screen w-screen overflow-x-hidden overflow-y-auto flex flex-col bg-background text-foreground selection:bg-accent/20">
      {children}
    </div>
  );
}
