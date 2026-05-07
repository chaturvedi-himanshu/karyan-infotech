import "dotenv/config";
import mongoose from "mongoose";
import { LeadSubmissionModel } from "../models/LeadSubmission";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is missing in environment.");
  process.exit(1);
}

async function main() {
  const mongoUri = uri;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing in environment.");
  }
  await mongoose.connect(mongoUri);
  const before = await LeadSubmissionModel.countDocuments();
  const result = await LeadSubmissionModel.deleteMany({});
  const after = await LeadSubmissionModel.countDocuments();
  console.log(`Leads before: ${before}`);
  console.log(`Deleted: ${result.deletedCount ?? 0}`);
  console.log(`Leads after: ${after}`);
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error("Failed to clear lead collection:", error);
  process.exit(1);
});
