import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Bits&Bytes - Frequently Asked Questions",
  description:
    "Find answers to common questions about joining Bits&Bytes, our programs, time commitments, and community. Everything you need to know about India's teen-led code club.",
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
