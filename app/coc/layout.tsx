import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code of Conduct | Bits&Bytes - Community Guidelines",
  description:
    "Our community guidelines for a safe, welcoming, and inclusive environment. Learn about our values, expectations, and how we handle violations at Bits&Bytes.",
};

export default function CodeOfConductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
