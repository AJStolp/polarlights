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

interface PortfolioGridProps {
  items: PortfolioDisplayItem[];
}

export default function PortfolioGrid({ items }: PortfolioGridProps) {
  const [active, setActive] = useState<Category>("All");

  const filtered =
    active === "All"
      ? items
      : items.filter((item) => item.category === active);

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

      {/* Grid */}
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
            {(item.showTitle !== false) && <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              {item.showTitle !== false && item.alt && <p className="text-white font-medium text-sm">{item.alt}</p>}
              {item.showTitle !== false && item.location && (
                <p className="text-white/70 text-xs mt-0.5">{item.location}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 py-12">
          No items in this category yet.
        </p>
      )}
    </div>
  );
}
