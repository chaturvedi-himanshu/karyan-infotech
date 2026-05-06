import "dotenv/config";
import mongoose from "mongoose";
import { HomeContentModel } from "../models/HomeContent";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is missing in environment.");
  process.exit(1);
}

const ABOUT_SECTION = {
  eyebrow: "About Karyan",
  title: "A legacy-led developer building value with discipline.",
  description:
    "Karyan Infratech builds residential and commercial destinations with a clear focus on design integrity, engineering discipline, and transparent delivery. We combine market intelligence with execution rigor so every development supports long-term value for both end users and investors.",
  logoSrc: "https://karyaninfratech.co.in/wp-content/uploads/2023/03/logo.png",
  logoAlt: "Karyan Infratech",
  points: [
    "Legacy-backed business approach",
    "Design + engineering alignment",
    "Compliance-first execution framework",
    "Structured delivery communication",
    "Strong NCR corridor presence",
    "Long-term value creation mindset",
  ],
};

async function main() {
  await mongoose.connect(uri as string);
  const doc = await HomeContentModel.findOne({ key: "default" }).lean();
  const currentData =
    doc?.data && typeof doc.data === "object" ? (doc.data as Record<string, unknown>) : {};

  await HomeContentModel.findOneAndUpdate(
    { key: "default" },
    {
      $set: {
        key: "default",
        data: {
          ...currentData,
          aboutSection: ABOUT_SECTION,
        },
      },
    },
    { upsert: true }
  );

  console.log("Seeded home about section.");
}

main()
  .catch((error) => {
    console.error("Failed to seed home about section:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
