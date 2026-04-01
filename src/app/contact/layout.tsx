import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with SMarDevs to discuss your nearshore staffing needs. Hire pre-vetted LATAM engineers, schedule a consultation, or request a talent proposal.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
