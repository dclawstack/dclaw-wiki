import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <BookOpen className="h-16 w-16 text-[#06B6D4]" />
        <h1 className="text-4xl font-bold tracking-tight text-[#06B6D4]">
          DClaw Wiki
        </h1>
        <p className="text-lg text-gray-600">
          Internal Wikipedia with AI search
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center rounded-lg bg-[#06B6D4] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-cyan-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
        >
          Open Dashboard
        </Link>
      </div>
    </main>
  );
}
