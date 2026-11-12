import { images, services } from "@/lib/data";
import { site } from "@/lib/site";

/** Datos estructurados (schema.org) para SEO local. */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: site.name,
    description: site.description,
    url: site.url,
    image: images.hero,
    logo: `${site.url}/images/logo-airam.png`,
    telephone: `+${site.whatsapp}`,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "12:00",
        closes: "20:00",
      },
    ],
    sameAs: Object.values(site.socials),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios de belleza",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, description: s.description },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
