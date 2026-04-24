import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Impact - 1500+ Students, 130+ Projects Shipped",
  description:
    "See Bits&Bytes impact: 1500+ active student members, 100+ schools represented, 130+ shipped projects. Discover how we're empowering teen developers across India.",
  keywords: [
    "bits and bytes impact",
    "teen coding statistics",
    "student developer community",
    "youth tech impact india",
    "coding club achievements",
  ],
  alternates: {
    canonical: "https://gobitsnbytes.org/impact",
  },
  openGraph: {
    title: "Our Impact - 1500+ Students Building the Future | Bits&Bytes",
    description: "1500+ active members, 130+ shipped projects, 100+ schools. See how Bits&Bytes is empowering teen developers.",
    url: "https://gobitsnbytes.org/impact",
    type: "website",
  },
};

export default function ImpactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

