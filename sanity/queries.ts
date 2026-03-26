import { sanityFetch } from "./fetch";

// --- Portfolio ---

export interface PortfolioItem {
  _id: string;
  title?: string;
  image?: {
    asset: {
      _ref: string;
    };
    hotspot?: {
      x: number;
      y: number;
    };
  };
  category?: "Aerial Photo" | "Video" | "3D Tours";
  location?: string;
  description?: string;
  featured?: boolean;
  order?: number;
}

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  return sanityFetch<PortfolioItem[]>({
    query: `*[_type == "portfolioItem"] | order(order asc, _createdAt desc) {
      _id, title, image, category, location, description, featured, order
    }`,
  });
}

export async function getFeaturedItems(): Promise<PortfolioItem[]> {
  return sanityFetch<PortfolioItem[]>({
    query: `*[_type == "portfolioItem" && featured == true] | order(order asc, _createdAt desc) [0...6] {
      _id, title, image, category, location, description, featured, order
    }`,
  });
}

// --- Virtual Tours ---

export interface VirtualTour {
  _id: string;
  title: string;
  description?: string;
  thumbnail?: {
    asset: {
      _ref: string;
    };
    hotspot?: {
      x: number;
      y: number;
    };
  };
  embedUrl?: string;
  externalLink?: string;
  location?: string;
  order?: number;
}

export async function getVirtualTours(): Promise<VirtualTour[]> {
  return sanityFetch<VirtualTour[]>({
    query: `*[_type == "virtualTour"] | order(order asc, _createdAt desc) {
      _id, title, description, thumbnail, embedUrl, externalLink, location, order
    }`,
  });
}

// --- Page Singletons ---

export interface HomePageData {
  heroHeadline?: string;
  heroAccent?: string;
  heroDescription?: string;
  heroImage?: { asset: { _ref: string } };
  servicesHeading?: string;
  servicesDescription?: string;
  featuredHeading?: string;
  featuredDescription?: string;
  ctaHeading?: string;
  ctaDescription?: string;
}

export async function getHomePage(): Promise<HomePageData | null> {
  return sanityFetch<HomePageData | null>({
    query: `*[_type == "homePage"][0]`,
  });
}

export interface ServiceItem {
  _key: string;
  title?: string;
  subtitle?: string;
  description?: string;
  features?: string[];
  image?: { asset: { _ref: string } };
  imageSize?: "full" | "large" | "medium";
}

export interface ServicesPageData {
  heading?: string;
  description?: string;
  services?: ServiceItem[];
  ctaHeading?: string;
  ctaDescription?: string;
}

export async function getServicesPage(): Promise<ServicesPageData | null> {
  return sanityFetch<ServicesPageData | null>({
    query: `*[_type == "servicesPage"][0]`,
  });
}

export interface AboutPageData {
  heading?: string;
  subtitle?: string;
  storyHeading?: string;
  storyImage?: { asset: { _ref: string } };
  storyParagraphs?: string[];
  stats?: { _key: string; value?: string; label?: string }[];
  serviceAreaHeading?: string;
  serviceAreaDescription?: string;
  serviceAreas?: string[];
  ctaHeading?: string;
  ctaDescription?: string;
}

export async function getAboutPage(): Promise<AboutPageData | null> {
  return sanityFetch<AboutPageData | null>({
    query: `*[_type == "aboutPage"][0]`,
  });
}

export interface ContactPageData {
  heading?: string;
  description?: string;
  email?: string;
  serviceAreaDescription?: string;
}

export async function getContactPage(): Promise<ContactPageData | null> {
  return sanityFetch<ContactPageData | null>({
    query: `*[_type == "contactPage"][0]`,
  });
}
