import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | Bits&Bytes - Hackathons, Workshops & More",
  description:
    "Join our hackathons, workshops, and tech events. From intensive 48-hour builds to hands-on learning sessions, discover opportunities to grow as a teen developer.",
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
