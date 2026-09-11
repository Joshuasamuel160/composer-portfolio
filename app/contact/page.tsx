import type { Metadata } from "next";
import { getContactInfo } from "@/lib/sanity/fetch";
import { ContactClient } from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact & Representation | Joshua Samuel",
  description:
    "Direct contact details, agency representation, and official links for composer and music producer Joshua Samuel.",
};

export default async function ContactPage() {
  const contactInfo = await getContactInfo();

  return <ContactClient contactInfo={contactInfo} />;
}
