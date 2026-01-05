import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Bits&Bytes - Teen-Built Tech Showcase",
  description:
    "Explore 15+ projects built by teen developers at Bits&Bytes. From web apps to AI tools, see what India's boldest builders club has shipped.",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
