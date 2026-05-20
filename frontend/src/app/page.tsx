import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-indigo-50 to-white">
      <div className="max-w-lg text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white text-2xl font-bold mb-2">
          W
        </div>
        <h1 className="text-4xl font-bold text-gray-900">DClaw Wiki</h1>
        <p className="text-lg text-gray-500">
          Your team&apos;s internal knowledge base. Create, organize, and find information instantly.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/wiki">
            <Button size="lg">Browse Wiki</Button>
          </Link>
          <Link href="/wiki/new">
            <Button size="lg" variant="outline">
              Create Page
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
