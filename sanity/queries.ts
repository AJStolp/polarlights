import { client } from "./client";

export interface PortfolioItem {
  _id: string;
  title: string;
  image: {
    asset: {
      _ref: string;
    };
    hotspot?: {
      x: number;
      y: number;
    };
  };
  category: "Aerial Photo" | "Video" | "3D Tours";
  location?: string;
  description?: string;
  featured?: boolean;
  order?: number;
}

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  return client.fetch(
    `*[_type == "portfolioItem"] | order(order asc, _createdAt desc) {
      _id,
      title,
      image,
      category,
      location,
      description,
      featured,
      order
    }`
  );
}

export async function getFeaturedItems(): Promise<PortfolioItem[]> {
  return client.fetch(
    `*[_type == "portfolioItem" && featured == true] | order(order asc, _createdAt desc) [0...6] {
      _id,
      title,
      image,
      category,
      location,
      description,
      featured,
      order
    }`
  );
}
