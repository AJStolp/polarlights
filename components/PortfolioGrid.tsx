"use client";

import { useState } from "react";
import Image from "next/image";

const categories = ["All", "Aerial Photo", "Video", "3D Tours"] as const;
type Category = (typeof categories)[number];

export interface PortfolioDisplayItem {
  id: string;
  src: string;
  alt: string;
  category: string;
  location?: string;
  showTitle?: boolean;
}

export interface VirtualTourDisplayItem {
  id: string;
  title: string;
  description?: string;
  thumbnailSrc?: string;
  embedUrl?: string;
  externalLink?: string;
  location?: string;
}

interface PortfolioGridProps {
  items: PortfolioDisplayItem[];
  virtualTours?: VirtualTourDisplayItem[];
}

export default function PortfolioGrid({ items, virtualTours = [] }: PortfolioGridProps) {
  const [active, setActive] = useState<Category>("All");

  const filtered =
    active === "All"
      ? items
      : items.filter((item) => item.category === active);

  const show3DTours = active === "3D Tours" || active === "All";

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              active === cat
                ? "bg-accent text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Portfolio grid (hidden when only 3D Tours selected) */}
      {active !== "3D Tours" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {item.showTitle !== false && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {item.showTitle !== false && item.alt && (
                  <p className="text-white font-medium text-sm">{item.alt}</p>
                )}
                {item.showTitle !== false && item.location && (
                  <p className="text-white/70 text-xs mt-0.5">{item.location}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Virtual tours section */}
      {show3DTours && virtualTours.length > 0 && (
        <div className={active !== "3D Tours" ? "mt-16" : ""}>
          {active === "All" && (
            <h3 className="text-2xl font-bold text-gray-900 mb-6">3D Virtual Tours</h3>
          )}
          <div className="space-y-12">
            {virtualTours.map((tour) => (
              <div
                key={tour.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
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
                {!tour.embedUrl && tour.thumbnailSrc && (
                  <div className="relative w-full aspect-video">
                    <Image
                      src={tour.thumbnailSrc}
                      alt={tour.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
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
            ))}
          </div>
        </div>
      )}

      {active !== "3D Tours" && filtered.length === 0 && (
        <p className="text-center text-gray-400 py-12">
          No items in this category yet.
        </p>
      )}

      {active === "3D Tours" && virtualTours.length === 0 && (
        <p className="text-center text-gray-400 py-12">
          No 3D tours available yet.
        </p>
      )}
    </div>
  );
}
