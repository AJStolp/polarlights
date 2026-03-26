import type { Metadata } from "next";
import PortfolioGrid from "@/components/PortfolioGrid";
import type { PortfolioDisplayItem } from "@/components/PortfolioGrid";
import { getPortfolioItems } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";

export const metadata: Metadata = {
  title: "Portfolio | Polar Lights Imaging",
  description:
    "Browse our portfolio of aerial drone photography, cinematic video, and Matterport 3D virtual tours.",
};

const placeholderItems: PortfolioDisplayItem[] = [
  { id: "p1", src: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=600&fit=crop", alt: "Aerial landscape over fields", category: "Aerial Photo", location: "Waupaca, WI" },
  { id: "p2", src: "https://images.unsplash.com/photo-1506947411487-a56738571f73?w=800&h=600&fit=crop", alt: "Sunset drone shot", category: "Aerial Photo", location: "Pembine, WI" },
  { id: "p3", src: "https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=800&h=600&fit=crop", alt: "Forest aerial view", category: "Aerial Photo", location: "Porcupine Mountains, MI" },
  { id: "p4", src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop", alt: "City skyline aerial", category: "Video", location: "Menominee, MI" },
  { id: "p5", src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop", alt: "Rural landscape aerial", category: "Aerial Photo", location: "New London, WI" },
  { id: "p6", src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop", alt: "Mountain aerial view", category: "Aerial Photo", location: "Houghton, MI" },
  { id: "p7", src: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop", alt: "Interior 3D tour", category: "3D Tours", location: "Kimberly, WI" },
  { id: "p8", src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop", alt: "Real estate property", category: "3D Tours", location: "Waupaca, WI" },
  { id: "p9", src: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&h=600&fit=crop", alt: "Property exterior", category: "Aerial Photo", location: "Holy Hill, WI" },
  { id: "p10", src: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&h=600&fit=crop", alt: "Nature aerial", category: "Video", location: "Michigamme, MI" },
  { id: "p11", src: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop", alt: "Real estate interior", category: "3D Tours", location: "Menominee, MI" },
  { id: "p12", src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop", alt: "Valley landscape", category: "Aerial Photo", location: "Kitch-iti-kipi, MI" },
];

export default async function PortfolioPage() {
  let items: PortfolioDisplayItem[];

  try {
    const sanityItems = await getPortfolioItems();
    const mapped = sanityItems
      .filter((item) => item.image)
      .map((item) => ({
        id: item._id,
        src: urlFor(item.image!).width(800).height(600).url(),
        alt: item.title || "",
        category: item.category || "Aerial Photo",
        location: item.location,
      }));
    items = mapped.length > 0 ? mapped : placeholderItems;
  } catch {
    items = placeholderItems;
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
          <PortfolioGrid items={items} />
        </div>
      </section>
    </>
  );
}
