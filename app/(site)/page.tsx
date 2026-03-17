import Link from "next/link";
import Image from "next/image";
import { getFeaturedItems, getHomePage } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";

const services = [
  {
    title: "Drone Photography",
    description:
      "Stunning aerial perspectives that showcase properties, landscapes, and events from breathtaking angles.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
      </svg>
    ),
  },
  {
    title: "Cinematic Video",
    description:
      "Professional aerial videography that tells compelling visual stories with smooth, cinematic footage.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    title: "3D Matterport Tours",
    description:
      "Immersive virtual experiences that let viewers explore properties and spaces as if they were there.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
  },
];

const placeholderFeatured = [
  { src: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=600&fit=crop", alt: "Aerial landscape", title: "Aerial Landscape", location: "" },
  { src: "https://images.unsplash.com/photo-1506947411487-a56738571f73?w=800&h=600&fit=crop", alt: "Drone sunset", title: "Drone Sunset", location: "" },
  { src: "https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=800&h=600&fit=crop", alt: "Aerial forest", title: "Aerial Forest", location: "" },
  { src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop", alt: "City aerial", title: "City Aerial", location: "" },
  { src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop", alt: "Rural landscape", title: "Rural Landscape", location: "" },
  { src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop", alt: "Mountain aerial", title: "Mountain Aerial", location: "" },
];

const defaultHeroImage = "https://images.unsplash.com/photo-1760638346074-e65e53d31e78?w=1920&h=1080&fit=crop";

export default async function Home() {
  let featuredWork = placeholderFeatured;
  let page = null;

  try {
    page = await getHomePage();
  } catch {
    // Fall back to defaults
  }

  try {
    const sanityFeatured = await getFeaturedItems();
    if (sanityFeatured.length > 0) {
      featuredWork = sanityFeatured
        .filter((item) => item.image)
        .map((item) => ({
          src: urlFor(item.image!).width(800).height(600).url(),
          alt: item.title || "Featured item",
          title: item.title || "Untitled",
          location: item.location || "",
        }));
    }
  } catch {
    // Fall back to placeholders
  }

  const heroImage = page?.heroImage
    ? urlFor(page.heroImage).width(1920).height(1080).url()
    : defaultHeroImage;

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt="DJI Mavic 4 Pro drone in flight over forest"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-white/30" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              {page?.heroHeadline || "Elevate Your"}
              <span className="text-accent block">
                {page?.heroAccent || "Perspective"}
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg">
              {page?.heroDescription ||
                "Professional drone photography, cinematic video, and immersive 3D tours that showcase your world from above."}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/portfolio"
                className="bg-accent text-white text-base font-medium px-8 py-3.5 rounded-full hover:bg-accent-dark transition-colors text-center"
              >
                View Our Work
              </Link>
              <Link
                href="/contact"
                className="border border-gray-300 text-gray-700 text-base font-medium px-8 py-3.5 rounded-full hover:border-accent hover:text-accent transition-colors text-center"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {page?.servicesHeading || "What We Do"}
            </h2>
            <p className="mt-4 text-gray-500 text-lg">
              {page?.servicesDescription ||
                "From aerial photography to virtual reality tours, we capture perspectives that make an impact."}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/services"
              className="text-accent font-medium hover:text-accent-dark transition-colors inline-flex items-center gap-2"
            >
              Learn more about our services
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                {page?.featuredHeading || "Featured Work"}
              </h2>
              <p className="mt-4 text-gray-500 text-lg">
                {page?.featuredDescription || "A selection of our recent projects."}
              </p>
            </div>
            <Link
              href="/portfolio"
              className="hidden sm:inline-flex text-accent font-medium hover:text-accent-dark transition-colors items-center gap-2"
            >
              View all
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredWork.map((item, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-medium text-sm">{item.title}</p>
                  {item.location && (
                    <p className="text-white/70 text-xs mt-0.5">{item.location}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link
              href="/portfolio"
              className="text-accent font-medium hover:text-accent-dark transition-colors inline-flex items-center gap-2"
            >
              View all work
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            {page?.ctaHeading || "Ready to see your world from a new angle?"}
          </h2>
          <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
            {page?.ctaDescription ||
              "Whether it's real estate, events, construction, or just capturing the beauty of a location — we'll make it look incredible."}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-accent text-white text-base font-medium px-8 py-3.5 rounded-full hover:bg-accent-dark transition-colors"
            >
              Start Your Project
            </Link>
            <Link
              href="/services"
              className="border border-gray-600 text-gray-300 text-base font-medium px-8 py-3.5 rounded-full hover:border-gray-400 hover:text-white transition-colors"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
