import type { Metadata } from "next";
import PortfolioGrid from "@/components/PortfolioGrid";
import type { PortfolioDisplayItem, VirtualTourDisplayItem } from "@/components/PortfolioGrid";
import { getPayloadClient } from "@/lib/payload";
import type { Media, VirtualTour } from "@/payload-types";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Browse our portfolio of aerial drone photography, cinematic video, and Matterport 3D virtual tours.",
  openGraph: {
    title: "Portfolio — Polar Lights Imaging",
    description:
      "Browse our portfolio of aerial drone photography, cinematic video, and Matterport 3D virtual tours.",
    url: "/portfolio",
  },
  alternates: { canonical: "/portfolio" },
};

const placeholderItems: PortfolioDisplayItem[] = [
  { id: "p1", src: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=600&fit=crop", alt: "Aerial landscape over fields", category: "Aerial Photo", location: "Waupaca, WI" },
  { id: "p2", src: "https://images.unsplash.com/photo-1506947411487-a56738571f73?w=800&h=600&fit=crop", alt: "Sunset drone shot", category: "Aerial Photo", location: "Pembine, WI" },
  { id: "p3", src: "https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=800&h=600&fit=crop", alt: "Forest aerial view", category: "Aerial Photo", location: "Porcupine Mountains, MI" },
  { id: "p4", src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop", alt: "City skyline aerial", category: "Video", location: "Menominee, MI" },
  { id: "p5", src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop", alt: "Rural landscape aerial", category: "Aerial Photo", location: "New London, WI" },
  { id: "p6", src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop", alt: "Mountain aerial view", category: "Aerial Photo", location: "Houghton, MI" },
];

export default async function PortfolioPage() {
  let items: PortfolioDisplayItem[];
  let virtualTours: VirtualTourDisplayItem[] = [];

  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "portfolio-items",
      sort: "order",
      limit: 100,
    });
    const mapped = result.docs
      .filter((item) => item.image)
      .map((item) => {
        const imageMedia = item.image as Media;
        const showTitle = (item as Record<string, unknown>).showTitle as boolean | undefined;
        return {
          id: String(item.id),
          src: imageMedia?.sizes?.card?.url || imageMedia?.url || "",
          alt: item.title || "",
          category: (item.category || "Aerial Photo") as "Aerial Photo" | "Video" | "3D Tours",
          location: item.location || undefined,
          showTitle: showTitle || false,
        };
      });
    items = mapped.length > 0 ? mapped : placeholderItems;
  } catch {
    items = placeholderItems;
  }

  try {
    const payload = await getPayloadClient();
    const toursResult = await payload.find({
      collection: "virtual-tours",
      sort: "order",
      limit: 50,
    });
    virtualTours = (toursResult.docs as VirtualTour[]).map((tour) => {
      const thumbnailMedia = tour.thumbnail as Media | undefined;
      return {
        id: String(tour.id),
        title: tour.title,
        description: tour.description || undefined,
        thumbnailSrc: thumbnailMedia?.url || undefined,
        embedUrl: tour.embedUrl || undefined,
        externalLink: tour.externalLink || undefined,
        location: tour.location || undefined,
      };
    });
  } catch {
    // No tours
  }

  return (
    <>
      {/* Header */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Our Work
          </h1>
          <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
            Browse our latest projects across aerial photography, video, and 3D
            virtual tours.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <PortfolioGrid items={items} virtualTours={virtualTours} />
        </div>
      </section>
    </>
  );
}
