import { Bricolage_Grotesque, DM_Mono, DM_Sans } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "@workspace/ui/styles/globals.css";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import AuthProvider from "@/lib/AuthProvider";
import { Toaster } from "sonner";
import TopLoader from "@/components/Loaders/TopLoader";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-primary",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-secondary",
  weight: ["300", "400", "500"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-secondary",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Organisation | TicketWaze - Create and manage events",
  description:
    "Create events in minutes, sell tickets, manage attendees, and track earnings — all in one place",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${bricolageGrotesque.variable} ${dmMono.variable} ${dmSans.className} `}
      >
        <NextIntlClientProvider>
          <AuthProvider>
            {/* <OrganisationProvider/> */}
            {children}
          </AuthProvider>
          <TopLoader />
          <Toaster richColors position="top-right" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
