import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { stripHtml } from "@/lib/html/stripHtml";

interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  href: string;
  image: string;
}

export default function BlogCard({ title, excerpt, date, category, href, image }: BlogCardProps) {
  const plainExcerpt = stripHtml(excerpt);
  return (
    <article className="group bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: "200px" }}>
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3">
          <span
            className="text-xs font-bold uppercase px-2.5 py-1 text-white"
            style={{ background: "#F7B90F" }}
          >
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-1.5 text-xs mb-2" style={{ color: "#999" }}>
          <Calendar className="w-3.5 h-3.5" />
          {date}
        </div>
        <h3 className="font-bold text-base mb-2 leading-snug line-clamp-2 group-hover:text-[#F7B90F] transition-colors" style={{ color: "#292929" }}>
          <Link href={href}>{title}</Link>
        </h3>
        <p className="text-sm leading-relaxed line-clamp-3 mb-4" style={{ color: "#5e646a" }}>
          {plainExcerpt}
        </p>
        <Link
          href={href}
          className="text-xs font-bold uppercase tracking-wider hover:opacity-80 transition-opacity"
          style={{ color: "#F7B90F" }}
        >
          Read More →
        </Link>
      </div>
    </article>
  );
}
