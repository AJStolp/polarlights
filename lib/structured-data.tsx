const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://polarlightsimaging.com";

export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: "Polar Lights Imaging",
    description:
      "Professional drone photography, cinematic videography, and immersive Matterport 3D tours. Serving Wisconsin and Michigan's Upper Peninsula.",
    url: SITE_URL,
    email: "polarlightsimaging@gmail.com",
    areaServed: [
      { "@type": "State", name: "Wisconsin" },
      { "@type": "AdministrativeArea", name: "Michigan Upper Peninsula" },
    ],
    serviceType: [
      "Drone Photography",
      "Aerial Videography",
      "Matterport 3D Virtual Tours",
      "Real Estate Photography",
      "Interior & Exterior Photography",
    ],
    sameAs: [
      "https://instagram.com/polarlightsimaging",
      "https://tiktok.com/@polar_lights_imaging",
      "https://facebook.com/polarlightsimaging",
    ],
    priceRange: "$$",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Polar Lights Imaging",
    url: SITE_URL,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ServiceJsonLd({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "LocalBusiness",
      name: "Polar Lights Imaging",
      url: SITE_URL,
    },
    areaServed: [
      { "@type": "State", name: "Wisconsin" },
      { "@type": "AdministrativeArea", name: "Michigan Upper Peninsula" },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
