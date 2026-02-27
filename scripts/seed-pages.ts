/* eslint-disable no-console */
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "ravatqd0",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const documents = [
  {
    _id: "homePage",
    _type: "homePage",
    heroHeadline: "Elevate Your",
    heroAccent: "Perspective",
    heroDescription:
      "Professional drone photography, cinematic video, and immersive 3D tours that showcase your world from above.",
    servicesHeading: "What We Do",
    servicesDescription:
      "From aerial photography to virtual reality tours, we capture perspectives that make an impact.",
    featuredHeading: "Featured Work",
    featuredDescription: "A selection of our recent projects.",
    ctaHeading: "Ready to see your world from a new angle?",
    ctaDescription:
      "Whether it's real estate, events, construction, or just capturing the beauty of a location — we'll make it look incredible.",
  },
  {
    _id: "servicesPage",
    _type: "servicesPage",
    heading: "Our Services",
    description:
      "Professional aerial imaging and virtual tour solutions tailored to your needs.",
    services: [
      {
        _key: "drone-photo",
        _type: "object",
        title: "Drone Photography",
        subtitle: "Aerial perspectives that captivate",
        description:
          "Our FAA-certified pilots capture stunning high-resolution aerial photographs that provide unique perspectives impossible to achieve from the ground. Perfect for real estate listings, construction progress documentation, event coverage, and landscape photography.",
        features: [
          "High-resolution aerial stills",
          "Real estate & property photography",
          "Construction & site documentation",
          "Event & landscape photography",
          "RAW files available on request",
        ],
      },
      {
        _key: "cinematic-video",
        _type: "object",
        title: "Cinematic Videography",
        subtitle: "Aerial stories that move",
        description:
          "From smooth cinematic flyovers to dynamic tracking shots, our aerial videography brings a professional film quality to your projects. We handle everything from flight planning to post-production editing and color grading.",
        features: [
          "4K cinematic aerial footage",
          "Professional editing & color grading",
          "Smooth tracking & reveal shots",
          "Music licensing & sound design",
          "Social media & web-optimized exports",
        ],
      },
      {
        _key: "matterport",
        _type: "object",
        title: "3D Matterport Tours",
        subtitle: "Immersive virtual experiences",
        description:
          "Using Matterport technology, we create interactive 3D virtual tours that let viewers explore spaces from anywhere. Ideal for real estate, hospitality, commercial properties, and any space you want to showcase remotely.",
        features: [
          "Interactive 3D walkthrough tours",
          "Dollhouse & floor plan views",
          "Embeddable on your website",
          "Shareable links for clients",
          "Matterport hosting included",
        ],
      },
    ],
    ctaHeading: "Not sure what you need?",
    ctaDescription:
      "Tell us about your project and we'll recommend the best solution. Every project gets a custom quote.",
  },
  {
    _id: "aboutPage",
    _type: "aboutPage",
    heading: "About Us",
    subtitle: "Capturing the world from above, one flight at a time.",
    storyHeading: "Our Story",
    storyParagraphs: [
      "Polar Lights Imaging was founded with a simple mission: to help people see their properties, events, and landscapes from a perspective they've never experienced before.",
      "What started as a passion for flying and photography has grown into a full-service aerial imaging company. We combine professional-grade drones with creative vision to deliver stunning results for every project.",
      "From sweeping aerial photography to immersive Matterport 3D tours, we bring the tools and expertise to make your project stand out. Whether you're a realtor, event planner, construction company, or just someone who wants incredible aerial shots — we've got you covered.",
    ],
    stats: [
      { _key: "projects", value: "200+", label: "Projects Completed" },
      { _key: "clients", value: "75+", label: "Happy Clients" },
      { _key: "years", value: "3+", label: "Years Experience" },
      { _key: "states", value: "2", label: "States Covered" },
    ],
    serviceAreaHeading: "Service Area",
    serviceAreaDescription:
      "We proudly serve communities across Wisconsin and Michigan's Upper Peninsula. Need coverage outside our area? Reach out — we love to travel for the right project.",
    serviceAreas: [
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
    ],
    ctaHeading: "Let's work together",
    ctaDescription: "Have a project in mind? We'd love to hear about it.",
  },
  {
    _id: "contactPage",
    _type: "contactPage",
    heading: "Get in Touch",
    description:
      "Ready to start your project? Drop us a message and we'll get back to you within 24 hours.",
    email: "polarlightsimaging@gmail.com",
    serviceAreaDescription:
      "Based in Wisconsin, serving communities across Wisconsin and Michigan's Upper Peninsula. Available for travel beyond our core area for the right project.",
  },
];

async function seed() {
  console.log("Seeding page documents...\n");

  for (const doc of documents) {
    try {
      await client.createOrReplace(doc);
      console.log(`  ✓ ${doc._type}`);
    } catch (err) {
      console.error(`  ✗ ${doc._type}:`, err);
    }
  }

  console.log("\nDone! All page content is now in Sanity.");
}

seed();
