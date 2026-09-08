import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy-session";

/**
 * Next.js 16 renamed `middleware` → `proxy`. Runs before every matched route
 * (Node.js runtime) to refresh the Supabase session and guard app routes.
 */
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all paths except static assets and image files so auth logic
     * never blocks CSS/JS/images:
     * - _next/static, _next/image
     * - favicon.ico
     * - common image extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
