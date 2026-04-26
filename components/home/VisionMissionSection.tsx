import Image from "next/image";
import { Eye, Target, Compass } from "lucide-react";
import SiteBrandLogo from "@/components/layout/SiteBrandLogo";

const cards = [
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "We are dedicated to fulfilling all of our commitments and building value for our stakeholders with integrity, transparency, and pride.",
  },
  {
    icon: Target,
    title: "Our Mission",
    description:
      "Our goal is to become the most recognized and respected brand in real estate by creating value that lasts for generations.",
  },
  {
    icon: Compass,
    title: "Our Values",
    description:
      "Integrating technology, process orientation, customer satisfaction, and an unwavering commitment to integrity and quality.",
  },
];

export default function VisionMissionSection() {
  return (
    <section className="py-20 bg-[#f8f5f0] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Cards */}
          <div className="order-2 lg:order-1 space-y-6">
            <div className="mb-8">
              <div className="mb-5 flex justify-start">
                <SiteBrandLogo
                  variant="onLight"
                  asLink={false}
                  className="h-10 w-auto max-w-[200px] sm:h-11"
                />
              </div>
              <p className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest mb-3">
                What Drives Us
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] leading-tight">
                Vision, Mission & Values
              </h2>
              <div className="w-14 h-1 bg-[#c9a84c] mt-4" />
            </div>

            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="flex gap-5 p-6 bg-white shadow-sm rounded-sm hover:shadow-md transition-shadow border-l-4 border-[#c9a84c]"
                >
                  <div className="w-12 h-12 bg-[#1a1a2e] rounded-sm flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#c9a84c]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1a1a2e] mb-2">
                      {card.title}
                    </h3>
                    <p className="text-sm text-[#7a7a7a] leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative h-[460px] rounded-sm overflow-hidden shadow-2xl">
              <Image
                src="/images/our-vision.webp"
                alt="Our Vision - Karyan Infratech"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 bg-[#c9a84c] text-white p-6 shadow-xl rounded-sm">
              <div className="text-3xl font-bold font-serif">280</div>
              <div className="text-xs uppercase tracking-widest mt-1 text-white/80">
                Acres Land Bank
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
