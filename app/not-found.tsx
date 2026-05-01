import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-theme-bg px-4">
      <div className="text-center max-w-lg">
        <div className="text-[#c9a84c] text-9xl font-bold font-serif opacity-20 select-none">
          404
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mt-4 mb-4">
          Page Not Found
        </h1>
        <div className="w-14 h-1 bg-[#c9a84c] mx-auto mb-6" />
        <p className="text-gray-400 leading-relaxed mb-10">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let us help you find what you need.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#c9a84c] text-white px-8 py-3.5 font-semibold uppercase tracking-wider text-sm hover:bg-[#b8943d] transition-colors rounded-sm"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-3.5 font-semibold uppercase tracking-wider text-sm hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors rounded-sm"
          >
            <Search className="w-4 h-4" />
            View Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
