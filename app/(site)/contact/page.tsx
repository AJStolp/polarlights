import type { Metadata } from "next";
import { getContactPage } from "@/sanity/queries";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact | Polar Lights Imaging",
  description:
    "Get in touch with Polar Lights Imaging for drone photography, aerial video, and 3D Matterport tour services.",
};

export default async function ContactPage() {
  let page = null;
  try {
    page = await getContactPage();
  } catch {
    // Fall back to defaults
  }

  return (
    <>
      {/* Header */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            {page?.heading || "Get in Touch"}
          </h1>
          <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
            {page?.description ||
              "Ready to start your project? Drop us a message and we'll get back to you within 24 hours."}
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ContactForm
            email={page?.email || "polarlightsimaging@gmail.com"}
            serviceAreaDescription={
              page?.serviceAreaDescription ||
              "Based in Wisconsin, serving communities across Wisconsin and Michigan's Upper Peninsula. Available for travel beyond our core area for the right project."
            }
          />
        </div>
      </section>
    </>
  );
}
