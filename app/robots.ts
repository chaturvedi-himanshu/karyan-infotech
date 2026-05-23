import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/siteUrl";

/**
 * Paths that should never be crawled or indexed by any bot.
 * - `/admin` and any sub-path: protected admin UI (also gated by middleware)
 * - `/api`: backend route handlers
 * - `/thank-you`: post-submission confirmation, not useful in search
 */
const DISALLOWED_PATHS = ["/admin", "/admin/", "/api/", "/thank-you"];

/**
 * Major AI / LLM crawlers are explicitly listed (with the same allow-all rule
 * as default bots) so that "we welcome AI training & retrieval" is documented
 * and unambiguous in robots.txt — and so any future tightening only needs an
 * edit here.
 *
 * Sources: each vendor's published crawler docs.
 */
const AI_USER_AGENTS = [
  "GPTBot", // OpenAI training crawler
  "ChatGPT-User", // OpenAI ChatGPT browse-on-demand
  "OAI-SearchBot", // OpenAI search index
  "ClaudeBot", // Anthropic
  "anthropic-ai", // Anthropic legacy UA
  "Claude-Web", // Anthropic
  "Google-Extended", // Google Gemini / Vertex training opt-in
  "PerplexityBot", // Perplexity
  "Perplexity-User", // Perplexity on-demand
  "Applebot-Extended", // Apple Intelligence training
  "CCBot", // Common Crawl (used by many LLMs)
  "Bytespider", // ByteDance
  "DuckAssistBot", // DuckDuckGo AI
  "Amazonbot", // Amazon (incl. Alexa AI)
  "YouBot", // You.com
  "cohere-ai", // Cohere
  "Meta-ExternalAgent", // Meta AI agents
  "FacebookBot", // Meta crawl
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
      {
        userAgent: AI_USER_AGENTS,
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
