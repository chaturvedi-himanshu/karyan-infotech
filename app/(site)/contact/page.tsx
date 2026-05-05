import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import { getSitePage, getSiteSettings } from "@/lib/cms/getters";
import ContactPageContent, {
  type ContactPayload,
} from "@/components/site/ContactPageContent";

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getSitePage("contact");
  if (!doc) return { title: "Contact" };
  return { title: doc.metaTitle, description: doc.metaDescription };
}

export default async function ContactPage() {
  const [doc, site] = await Promise.all([getSitePage("contact"), getSiteSettings()]);
  if (!doc) notFound();
  const payload = doc.payload as ContactPayload;
  const contactItems = (payload.contactItems ?? []).map((item) =>
    item.icon === "Phone"
      ? { ...item, value: site.nav.topBar.phone, href: site.nav.topBar.phoneHref }
      : item
  );
  const mergedPayload: ContactPayload = { ...payload, contactItems };
  return (
    <>
      <PageHeader
        title={payload.headerHeading || doc.metaTitle}
        subheading={payload.headerSubheading}
        bgImage={payload.headerBgImage}
        breadcrumbs={[{ label: "Contact" }]}
      />
      <ContactPageContent payload={mergedPayload} />
    </>
  );
}
