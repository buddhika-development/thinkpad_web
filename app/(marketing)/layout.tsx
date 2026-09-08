/**
 * Marketing shell — wraps all public, unauthenticated pages
 * (landing, features, pricing, etc.). Nav + footer live here.
 */
export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return <div className="flex flex-1 flex-col">{children}</div>;
}
