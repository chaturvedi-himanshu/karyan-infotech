import mongoose, { Schema, type InferSchemaType } from "mongoose";

const ContentPageSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    body: { type: String, default: "" },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    seo: { type: Schema.Types.Mixed, required: false },
  },
  { timestamps: true }
);

export type ContentPageDoc = InferSchemaType<typeof ContentPageSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const ContentPageModel =
  mongoose.models.ContentPage ?? mongoose.model("ContentPage", ContentPageSchema);
