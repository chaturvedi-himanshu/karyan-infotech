import mongoose, { Schema, type InferSchemaType } from "mongoose";

const SitePageSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    seo: { type: Schema.Types.Mixed, required: false },
    payload: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export type SitePageDoc = InferSchemaType<typeof SitePageSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const SitePageModel =
  mongoose.models.SitePage ?? mongoose.model("SitePage", SitePageSchema);
