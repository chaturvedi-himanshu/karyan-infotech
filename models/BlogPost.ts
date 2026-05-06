import mongoose, { Schema, type InferSchemaType } from "mongoose";

const BlogPostSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    body: { type: String },
    date: { type: String, required: true },
    category: { type: String, required: true },
    href: { type: String, required: true },
    image: { type: String, required: true },
    order: { type: Number, default: 0 },
    seo: { type: Schema.Types.Mixed, required: false },
  },
  { timestamps: true }
);

export type BlogPostDoc = InferSchemaType<typeof BlogPostSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const BlogPostModel =
  mongoose.models.BlogPost ?? mongoose.model("BlogPost", BlogPostSchema);
