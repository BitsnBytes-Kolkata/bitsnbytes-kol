import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events - Hackathons, Workshops & Tech Meetups for Students",
  description:
    "Join Bits&Bytes hackathons, coding workshops & tech events in India. From 48-hour hackathons to hands-on AI/ML workshops. Open to all high school students. Free events!",
  keywords: [
    "teen hackathons india",
    "coding workshops for students",
    "tech events lucknow",
    "high school hackathon india",
    "free coding events",
    "student tech meetups",
  ],
  alternates: {
    canonical: "https://gobitsnbytes.org/events",
  },
  openGraph: {
    title: "Events - Hackathons & Workshops | Bits&Bytes",
    description: "Join our hackathons, coding workshops & tech events. Free for all high school students in India.",
    url: "https://gobitsnbytes.org/events",
    type: "website",
  },
};

// Events structured data for Google rich results
const eventsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Bits&Bytes Events",
  description: "Hackathons, workshops, and tech events for teen developers in India",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Event",
        name: "Scrapyard Lucknow 2025",
        description: "Our flagship hackathon - 48 hours of building, learning, and shipping. Open to all high school students across India.",
        startDate: "2025-03-01",
        endDate: "2025-03-02",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          name: "Lucknow",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Lucknow",
            addressRegion: "Uttar Pradesh",
            addressCountry: "IN",
          },
        },
        organizer: {
          "@type": "Organization",
          name: "Bits&Bytes",
          url: "https://gobitsnbytes.org",
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
        },
        audience: {
          "@type": "Audience",
          audienceType: "High School Students",
        },
      },
    },
  ],
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsJsonLd) }}
      />
      {children}
    </>
  );
}
