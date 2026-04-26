import { Eye, Target } from "lucide-react";
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
];

export default function AboutSection() {
  return (
    <section style={{ background: "#ffffff" }} className="py-16">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Section label */}
        <div className="text-center mb-6">
          <h4
            className="text-sm font-bold uppercase tracking-widest"
            style={{ color: "#655E56" }}
          >
            About us
          </h4>
        </div>

        {/* Main heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="mb-8 flex justify-center">
            <SiteBrandLogo
              variant="onLight"
              asLink={false}
              className="h-12 w-auto max-w-[240px] sm:h-14"
            />
          </div>
          <h2
            className="font-bold leading-snug"
            style={{ color: "#292929", fontSize: "clamp(20px, 2.5vw, 30px)" }}
          >
            Karyan Infratech LLP is a vision born of the Karyan Group, aimed at
            conceptualizing, executing, and delivering premier real estate
            developments across India.
          </h2>
        </div>

        {/* Vision / Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="p-8 text-center"
                style={{
                  background: "#f9f9f9",
                  border: "1px solid #eee",
                  borderTop: "3px solid #F7B90F",
                }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "#F7B90F" }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4
                  className="text-base font-bold mb-3 uppercase tracking-wide"
                  style={{ color: "#292929" }}
                >
                  {card.title}
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: "#5e646a" }}>
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
