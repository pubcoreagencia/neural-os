import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = "https://neuralos.pub";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Neural OS | O sistema operacional da empresa",
    template: "%s | Neural OS"
  },
  description:
    "Neural OS organiza conhecimento, decisões, processos e especialistas digitais em uma única inteligência corporativa.",
  keywords: [
    "Neural OS",
    "sistema operacional empresarial",
    "gestão corporativa",
    "memória institucional",
    "governança empresarial",
    "decisões executivas"
  ],
  authors: [{ name: "PUB Holding" }],
  creator: "PUB Holding",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Neural OS",
    title: "Neural OS | O sistema operacional da empresa",
    description:
      "A empresa passa a lembrar, decidir e evoluir com uma inteligência própria."
  },
  twitter: {
    card: "summary_large_image",
    title: "Neural OS | O sistema operacional da empresa",
    description:
      "Uma nova forma de administrar empresas: memória, processos, decisões e conhecimento em um único sistema."
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#030407"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
