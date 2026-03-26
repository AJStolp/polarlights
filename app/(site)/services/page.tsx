import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getServicesPage } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";

export const metadata: Metadata = {
  title: "Services | Polar Lights Imaging",
  description:
    "Drone photography, cinematic aerial video, and Matterport 3D virtual tours for real estate, events, and more.",
};

const defaultServices = [
  {
    title: "Drone Photography",
    subtitle: "Aerial perspectives that captivate",
    description:
      "Our FAA-certified pilots capture stunning high-resolution aerial photographs that provide unique perspectives impossible to achieve from the ground. Perfect for real estate listings, construction progress documentation, event coverage, and landscape photography.",
    features: [
      "High-resolution aerial stills",
      "Real estate & property photography",
      "Construction & site documentation",
      "Event & landscape photography",
      "RAW files available on request",
    ],
    image:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=600&fit=crop",
    imageSize: "full" as const,
  },
  {
    title: "Cinematic Videography",
    subtitle: "Aerial stories that move",
    description:
      "From smooth cinematic flyovers to dynamic tracking shots, our aerial videography brings a professional film quality to your projects. We handle everything from flight planning to post-production editing and color grading.",
    features: [
      "4K cinematic aerial footage",
      "Professional editing & color grading",
      "Smooth tracking & reveal shots",
      "Music licensing & sound design",
      "Social media & web-optimized exports",
    ],
    image:
      "https://images.unsplash.com/photo-1506947411487-a56738571f73?w=800&h=600&fit=crop",
    imageSize: "full" as const,
  },
  {
    title: "3D Matterport Tours",
    subtitle: "Immersive virtual experiences",
    description:
      "Using Matterport technology, we create interactive 3D virtual tours that let viewers explore spaces from anywhere. Ideal for real estate, hospitality, commercial properties, and any space you want to showcase remotely.",
    features: [
      "Interactive 3D walkthrough tours",
      "Dollhouse & floor plan views",
      "Embeddable on your website",
      "Shareable links for clients",
      "Matterport hosting included",
    ],
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop",
    imageSize: "full" as const,
  },
  {
    title: "Interior & Exterior Photography",
    subtitle: "Every angle, every detail",
    description:
      "Professional ground-level photography that complements our aerial services. We capture crisp, well-lit interior and exterior photos that highlight the best features of any property or space — from wide-angle room shots to detailed architectural exteriors.",
    features: [
      "HDR interior photography",
      "Exterior & curb appeal shots",
      "Twilight & golden hour sessions",
      "Detail & feature close-ups",
      "Professionally edited & delivered",
    ],
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
    imageSize: "full" as const,
  },
];

export default async function ServicesPage() {
  let page = null;
  try {
    page = await getServicesPage();
  } catch {
    // Fall back to defaults
  }

  const interiorExterior = {
    title: "Interior & Exterior Photography",
    subtitle: "Every angle, every detail",
    description:
      "Professional ground-level photography that complements our aerial services. We capture crisp, well-lit interior and exterior photos that highlight the best features of any property or space — from wide-angle room shots to detailed architectural exteriors.",
    features: [
      "HDR interior photography",
      "Exterior & curb appeal shots",
      "Twilight & golden hour sessions",
      "Detail & feature close-ups",
      "Professionally edited & delivered",
    ],
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
    imageSize: "full" as const,
  };

  const cmsServices =
    page?.services && page.services.length > 0
      ? page.services.map((s) => ({
          title: s.title || "",
          subtitle: s.subtitle || "",
          description: s.description || "",
          features: s.features || [],
          image: s.image
            ? urlFor(s.image).width(800).height(600).url()
            : "",
          imageSize: (s.imageSize || "full") as "full" | "large" | "medium",
        }))
      : defaultServices;

  const servicesList = [...cmsServices, interiorExterior];

  return (
    <>
      {/* Header */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            {page?.heading || "Our Services"}
          </h1>
          <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
            {page?.description ||
              "Professional aerial imaging and virtual tour solutions tailored to your needs."}
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-32">
          {servicesList.map((service, i) => (
            <div
              key={i}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                i % 2 === 1 ? "lg:direction-rtl" : ""
              }`}
            >
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <p className="text-accent font-medium text-sm uppercase tracking-wider mb-2">
                  {service.subtitle}
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h2>
                <p className="text-gray-500 leading-relaxed mb-8">
                  {service.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, fi) => (
                    <li
                      key={fi}
                      className="flex items-center gap-3 text-gray-600"
                    >
                      <svg
                        className="w-5 h-5 text-accent shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="inline-flex bg-accent text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-accent-dark transition-colors"
                >
                  Get a Quote
                </Link>
              </div>
              <div
                className={`relative aspect-[4/3] rounded-2xl overflow-hidden flex items-center justify-center ${
                  i % 2 === 1 ? "lg:order-1" : ""
                }`}
              >
                {service.image && service.imageSize === "full" && (
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                )}
                {service.image && service.imageSize !== "full" && (
                  <div
                    className={`relative h-full ${
                      service.imageSize === "large" ? "w-3/4" : "w-1/2"
                    } mx-auto`}
                  >
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {page?.ctaHeading || "Not sure what you need?"}
          </h2>
          <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">
            {page?.ctaDescription ||
              "Tell us about your project and we'll recommend the best solution. Every project gets a custom quote."}
          </p>
          <Link
            href="/contact"
            className="inline-flex mt-8 bg-accent text-white text-base font-medium px-8 py-3.5 rounded-full hover:bg-accent-dark transition-colors"
          >
            Let&apos;s Talk
          </Link>
        </div>
      </section>
    </>
  );
}
