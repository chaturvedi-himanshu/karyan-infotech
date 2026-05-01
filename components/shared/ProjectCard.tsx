import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  href: string;
  type: string;
  location: string;
  status: string;
  featured?: boolean;
}

export default function ProjectCard({
  title,
  description,
  image,
  href,
  type,
  location,
  status,
}: ProjectCardProps) {
  return (
    <Link
      href={href}
      className="block group bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: "220px" }}>
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className="text-xs font-bold uppercase px-2 py-1 text-white"
            style={{ background: "#F7B90F" }}
          >
            {type}
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="bg-theme-bg/85 px-2 py-1 text-xs font-semibold uppercase text-theme-on-bg">
            {status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-xs mb-1" style={{ color: "#F7B90F" }}>
          📍 {location}
        </p>
        <h3
          className="font-bold text-base mb-2 group-hover:text-[#F7B90F] transition-colors"
          style={{ color: "#292929" }}
        >
          {title}
        </h3>
        <p className="text-sm leading-relaxed line-clamp-3" style={{ color: "#5e646a" }}>
          {description}
        </p>
      </div>
    </Link>
  );
}
