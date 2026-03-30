import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getPayloadClient } from "@/lib/payload";
import type { Media, VirtualTour } from "@/payload-types";

export const metadata: Metadata = {
  title: "Virtual Tours | Polar Lights Imaging",
  description:
    "Explore immersive 3D Matterport virtual tours of properties and spaces captured by Polar Lights Imaging.",
};

export default async function VirtualToursPage() {
  let tours: VirtualTour[] = [];

  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "virtual-tours",
      sort: "order",
      limit: 50,
    });
    tours = result.docs as VirtualTour[];
  } catch {
    // Fall back to empty
  }

  return (
    <>
      {/* Header */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Virtual Tours
          </h1>
          <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
            Step inside and explore properties and spaces with our immersive 3D
            virtual tours.
          </p>
        </div>
      </section>

      {/* Tours */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {tours.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">
                Virtual tours coming soon. Check back later!
              </p>
              <Link
                href="/contact"
                className="inline-flex mt-6 bg-accent text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-accent-dark transition-colors"
              >
                Request a Tour
              </Link>
            </div>
          ) : (
            <div className="space-y-20">
              {tours.map((tour) => {
                const thumbnailMedia = tour.thumbnail as Media | undefined;
                const thumbnailUrl = thumbnailMedia?.sizes?.hero?.url || thumbnailMedia?.url;

                return (
                  <div
                    key={tour.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    {/* Iframe embed */}
                    {tour.embedUrl && (
                      <div className="relative w-full aspect-video">
                        <iframe
                          src={tour.embedUrl}
                          title={tour.title}
                          className="absolute inset-0 w-full h-full"
                          allowFullScreen
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Thumbnail fallback when no embed */}
                    {!tour.embedUrl && thumbnailUrl && (
                      <div className="relative w-full aspect-video">
                        <Image
                          src={thumbnailUrl}
                          alt={tour.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Info */}
                    <div className="p-6 md:p-8">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">
                            {tour.title}
                          </h2>
                          {tour.location && (
                            <p className="text-accent text-sm font-medium mt-1">
                              {tour.location}
                            </p>
                          )}
                          {tour.description && (
                            <p className="text-gray-500 mt-3 leading-relaxed max-w-2xl">
                              {tour.description}
                            </p>
                          )}
                        </div>
                        {tour.externalLink && (
                          <a
                            href={tour.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-accent text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-accent-dark transition-colors shrink-0"
                          >
                            View Full Tour
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                              />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Want a virtual tour for your space?
          </h2>
          <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">
            We create immersive 3D Matterport tours for real estate, hospitality,
            and commercial properties.
          </p>
          <Link
            href="/contact"
            className="inline-flex mt-8 bg-accent text-white text-base font-medium px-8 py-3.5 rounded-full hover:bg-accent-dark transition-colors"
          >
            Get a Quote
          </Link>
        </div>
      </section>
    </>
  );
}
