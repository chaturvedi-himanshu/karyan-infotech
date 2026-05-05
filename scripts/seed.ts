/**
 * Loads default CMS documents into MongoDB.
 * Requires MONGODB_URI, AUTH_SECRET (for consistency; not used here), and optionally:
 * SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD — creates or updates that admin user.
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { UserModel } from "../models/User";
import { SiteSettingsModel } from "../models/SiteSettings";
import { HomeContentModel } from "../models/HomeContent";
import { ProjectPageModel } from "../models/ProjectPage";
import { BlogPostModel } from "../models/BlogPost";
import { SitePageModel } from "../models/SitePage";
import { DEFAULT_SITE_SETTINGS } from "../lib/cms/defaults/siteSettings";
import { DEFAULT_HOME_PAYLOAD } from "../lib/cms/defaults/homePayload";
import { DEFAULT_BLOG_POSTS } from "../lib/cms/defaults/blogPosts";
import { DEFAULT_SITE_PAGES } from "../lib/cms/defaults/sitePages";
import { DEFAULT_PROJECT_PAGES } from "../lib/cms/defaults/projectsSeed";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is missing in environment.");
  process.exit(1);
}

async function main() {
  await mongoose.connect(uri as string);
  console.log("Connected to MongoDB");

  await SiteSettingsModel.findOneAndUpdate(
    { key: "default" },
    {
      $set: {
        key: "default",
        nav: DEFAULT_SITE_SETTINGS.nav,
        footer: DEFAULT_SITE_SETTINGS.footer,
        projectInterestOptions: DEFAULT_SITE_SETTINGS.projectInterestOptions,
        themeColors: DEFAULT_SITE_SETTINGS.themeColors,
        pageHeader: DEFAULT_SITE_SETTINGS.pageHeader,
        enquiryFloatPromo: DEFAULT_SITE_SETTINGS.enquiryFloatPromo,
      },
    },
    { upsert: true }
  );
  console.log("Seeded SiteSettings");

  await HomeContentModel.findOneAndUpdate(
    { key: "default" },
    { $set: { key: "default", data: DEFAULT_HOME_PAYLOAD } },
    { upsert: true }
  );
  console.log("Seeded HomeContent");

  for (const p of DEFAULT_PROJECT_PAGES) {
    await ProjectPageModel.findOneAndUpdate(
      { slug: p.slug },
      { $set: { slug: p.slug, payload: p.payload } },
      { upsert: true }
    );
  }
  console.log("Seeded ProjectPage documents:", DEFAULT_PROJECT_PAGES.length);

  await BlogPostModel.deleteMany({});
  for (const post of DEFAULT_BLOG_POSTS) {
    await BlogPostModel.create({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      date: post.date,
      category: post.category,
      href: post.href,
      image: post.image,
      order: post.order ?? 0,
    });
  }
  console.log("Seeded BlogPost documents:", DEFAULT_BLOG_POSTS.length);

  for (const page of DEFAULT_SITE_PAGES) {
    await SitePageModel.findOneAndUpdate(
      { slug: page.slug },
      {
        $set: {
          slug: page.slug,
          metaTitle: page.metaTitle,
          metaDescription: page.metaDescription,
          payload: page.payload as object,
        },
      },
      { upsert: true }
    );
  }
  console.log("Seeded SitePage documents:", DEFAULT_SITE_PAGES.length);

  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const plain = process.env.SEED_ADMIN_PASSWORD;
  if (email && plain && plain.length >= 8) {
    const passwordHash = await bcrypt.hash(plain, 12);
    await UserModel.findOneAndUpdate(
      { email },
      { $set: { email, passwordHash, role: "admin" } },
      { upsert: true }
    );
    console.log("Seeded admin user:", email);
  } else {
    console.log(
      "Skipped admin user (set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD with min 8 chars to create)"
    );
  }

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
