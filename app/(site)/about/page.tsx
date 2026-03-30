import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getPayloadClient } from "@/lib/payload";
import type { Media } from "@/payload-types";

export const metadata: Metadata = {
  title: "About | Polar Lights Imaging",
  description:
    "Learn about Polar Lights Imaging — professional drone photography and 3D tours serving Wisconsin and Michigan's Upper Peninsula.",
};

const defaultStats = [
  { label: "Projects Completed", value: "200+" },
  { label: "Happy Clients", value: "75+" },
  { label: "Years Experience", value: "3+" },
  { label: "States Covered", value: "2" },
];

const defaultStory = [
  "Polar Lights Imaging was founded with a simple mission: to help people see their properties, events, and landscapes from a perspective they've never experienced before.",
  "What started as a passion for flying and photography has grown into a full-service aerial imaging company. We combine professional-grade drones with creative vision to deliver stunning results for every project.",
  "From sweeping aerial photography to immersive Matterport 3D tours, we bring the tools and expertise to make your project stand out. Whether you're a realtor, event planner, construction company, or just someone who wants incredible aerial shots — we've got you covered.",
];

const defaultServiceAreas = [
  "Waupaca, WI",
  "Pembine, WI",
  "Kimberly, WI",
  "New London, WI",
  "Holy Hill, WI",
  "Menominee, MI",
  "Houghton, MI",
  "Michigamme, MI",
  "Kitch-iti-kipi, MI",
  "Porcupine Mountains, MI",
];

export default async function AboutPage() {
  let page = null;
  try {
    const payload = await getPayloadClient();
    page = await payload.findGlobal({ slug: "about-page" });
  } catch {
    // Fall back to defaults
  }

  const stats: { value: string; label: string }[] =
    page?.stats && page.stats.length > 0
      ? page.stats.map((s: { value?: string | null; label?: string | null }) => ({
          value: s.value || "",
          label: s.label || "",
        }))
      : defaultStats;

  const storyParagraphs: string[] =
    page?.storyParagraphs && page.storyParagraphs.length > 0
      ? page.storyParagraphs.map((p: { text?: string | null }) => p.text || "")
      : defaultStory;

  const serviceAreas: string[] =
    page?.serviceAreas && page.serviceAreas.length > 0
      ? page.serviceAreas.map((a: { area?: string | null }) => a.area || "")
      : defaultServiceAreas;

  const storyImageMedia = page?.storyImage as Media | undefined;
  const storyImage = storyImageMedia?.sizes?.card?.url
    || storyImageMedia?.url
    || "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&h=600&fit=crop";

  return (
    <>
      {/* Header */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            {page?.heading || "About Us"}
          </h1>
          <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
            {page?.subtitle ||
              "Capturing the world from above, one flight at a time."}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src={storyImage}
                alt="Drone pilot at work"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {page?.storyHeading || "Our Story"}
              </h2>
              <div className="space-y-4 text-gray-500 leading-relaxed">
                {storyParagraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-accent">
                  {stat.value}
                </p>
                <p className="mt-2 text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {page?.serviceAreaHeading || "Service Area"}
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">
            {page?.serviceAreaDescription ||
              "We proudly serve communities across Wisconsin and Michigan's Upper Peninsula. Need coverage outside our area? Reach out — we love to travel for the right project."}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {serviceAreas.map((loc, i) => (
              <span
                key={i}
                className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full"
              >
                {loc}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            {page?.ctaHeading || "Let's work together"}
          </h2>
          <p className="mt-4 text-gray-400 text-lg">
            {page?.ctaDescription ||
              "Have a project in mind? We'd love to hear about it."}
          </p>
          <Link
            href="/contact"
            className="inline-flex mt-8 bg-accent text-white text-base font-medium px-8 py-3.5 rounded-full hover:bg-accent-dark transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}
