import "dotenv/config";
import mongoose from "mongoose";
import { SiteSettingsModel } from "../models/SiteSettings";
import { DEFAULT_SITE_SETTINGS } from "../lib/cms/defaults/siteSettings";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is missing in environment.");
  }
  await mongoose.connect(uri);
  await SiteSettingsModel.findOneAndUpdate(
    { key: "default" },
    {
      $set: {
        key: "default",
        projectInterestOptions: DEFAULT_SITE_SETTINGS.projectInterestOptions,
      },
    },
    { upsert: true }
  );
  console.log(
    `Seeded ${DEFAULT_SITE_SETTINGS.projectInterestOptions.length} project interest options.`
  );
}

main()
  .catch((error) => {
    console.error("Failed to seed project interest options:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await mongoose.connection.close();
    } catch {
      // ignore close errors during local seed runs
    }
  });
