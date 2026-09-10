import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">404</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        This page could not be found.
      </p>
      <Link href="/" className="font-medium underline underline-offset-4">
        Back home
      </Link>
    </main>
  );
}
