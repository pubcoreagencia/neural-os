import { LandingPage } from "@/components/landing-page";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Neural OS",
    category: "Sistema operacional empresarial",
    brand: {
      "@type": "Organization",
      name: "PUB Holding"
    },
    description:
      "Uma camada executiva para organizar conhecimento, decisões e processos em uma inteligência que pertence à empresa.",
    audience: {
      "@type": "BusinessAudience",
      audienceType: "CEOs, sócios, holdings e grupos empresariais"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <LandingPage />
    </>
  );
}
