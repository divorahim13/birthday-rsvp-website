import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Mara's Birthday Weekend",
  description: "A polished birthday RSVP microsite with event details and a private RSVP log."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
