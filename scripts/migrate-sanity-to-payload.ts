/* eslint-disable no-console */
/**
 * One-time migration script: Sanity → Payload CMS
 *
 * Uses Payload REST API (dev server must be running on localhost:3000)
 * and Sanity client to migrate all content.
 *
 * Run with: npx tsx scripts/migrate-sanity-to-payload.ts
 */

import { readFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@sanity/client";

// Load .env.local
const envPath = resolve(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx);
  const value = trimmed.slice(eqIdx + 1);
  if (!process.env[key]) process.env[key] = value;
}

const PAYLOAD_URL = process.argv[2] || "http://localhost:3000";
const PAYLOAD_EMAIL = process.argv[3] || "";
const PAYLOAD_PASSWORD = process.argv[4] || "";

if (!PAYLOAD_EMAIL || !PAYLOAD_PASSWORD) {
  console.error("Usage: bunx tsx scripts/migrate-sanity-to-payload.ts <url> <email> <password>");
  console.error("  e.g.: bunx tsx scripts/migrate-sanity-to-payload.ts https://polarlightsimaging.com email password");
  process.exit(1);
}

// --- Sanity client ---
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "ravatqd0",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
});

// --- Payload REST helpers ---
let payloadToken = "";

async function payloadLogin() {
  const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: PAYLOAD_EMAIL, password: PAYLOAD_PASSWORD }),
  });
  const data = await res.json();
  if (!data.token) throw new Error("Login failed: " + JSON.stringify(data));
  payloadToken = data.token;
  console.log("   Logged into Payload admin\n");
}

function authHeaders() {
  return {
    Authorization: `JWT ${payloadToken}`,
  };
}

// --- Image helpers ---

function sanityImageUrl(ref: string): string {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "ravatqd0";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const parts = ref.replace("image-", "").split("-");
  const ext = parts.pop();
  const dimensions = parts.pop();
  const id = parts.join("-");
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${ext}`;
}

function filenameFromRef(ref: string): string {
  const parts = ref.replace("image-", "").split("-");
  const ext = parts.pop();
  const dimensions = parts.pop();
  const id = parts.join("-");
  return `${id}-${dimensions}.${ext}`;
}

function mimeFromRef(ref: string): string {
  const ext = ref.split("-").pop();
  const map: Record<string, string> = {
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
    webp: "image/webp", gif: "image/gif", svg: "image/svg+xml",
  };
  return map[ext || "jpg"] || "image/jpeg";
}

// --- Main migration ---

async function migrate() {
  console.log("=== Sanity → Payload Migration ===\n");

  await payloadLogin();

  const imageMap = new Map<string, number>();

  // --- Step 1: Fetch all Sanity content ---
  console.log("1. Fetching all content from Sanity...\n");

  const portfolioItems = await sanityClient.fetch(
    `*[_type == "portfolioItem"] | order(order asc, _createdAt desc)`
  );
  console.log(`   Found ${portfolioItems.length} portfolio items`);

  const virtualTours = await sanityClient.fetch(
    `*[_type == "virtualTour"] | order(order asc, _createdAt desc)`
  );
  console.log(`   Found ${virtualTours.length} virtual tours`);

  const homePage = await sanityClient.fetch(`*[_type == "homePage"][0]`);
  const servicesPage = await sanityClient.fetch(`*[_type == "servicesPage"][0]`);
  const aboutPage = await sanityClient.fetch(`*[_type == "aboutPage"][0]`);
  const contactPage = await sanityClient.fetch(`*[_type == "contactPage"][0]`);
  console.log("   Fetched all 4 page globals\n");

  // --- Collect image refs ---
  const imageRefs = new Set<string>();

  function collectImageRef(imageField: { asset?: { _ref?: string } } | null | undefined) {
    if (imageField?.asset?._ref) imageRefs.add(imageField.asset._ref);
  }

  for (const item of portfolioItems) collectImageRef(item.image);
  for (const tour of virtualTours) collectImageRef(tour.thumbnail);
  collectImageRef(homePage?.heroImage);
  collectImageRef(aboutPage?.storyImage);
  if (servicesPage?.services) {
    for (const service of servicesPage.services) collectImageRef(service.image);
  }

  console.log(`2. Migrating ${imageRefs.size} images...\n`);

  // --- Step 2: Download and upload images ---
  for (const ref of imageRefs) {
    try {
      const url = sanityImageUrl(ref);
      const filename = filenameFromRef(ref);
      const mimetype = mimeFromRef(ref);

      console.log(`   Downloading: ${filename}`);
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`   ✗ Failed to download ${filename}: ${response.status}`);
        continue;
      }

      const blob = await response.blob();

      const altText = filename.split(".")[0].replace(/-/g, " ");
      const formData = new FormData();
      formData.append("file", blob, filename);
      formData.append("_payload", JSON.stringify({ alt: altText }));

      const uploadRes = await fetch(`${PAYLOAD_URL}/api/media`, {
        method: "POST",
        headers: authHeaders(),
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (uploadData.doc?.id) {
        imageMap.set(ref, uploadData.doc.id);
        console.log(`   ✓ Uploaded → media ID ${uploadData.doc.id}`);
      } else {
        console.error(`   ✗ Upload failed:`, JSON.stringify(uploadData).slice(0, 200));
      }
    } catch (err) {
      console.error(`   ✗ Error migrating image ${ref}:`, err);
    }
  }

  function getMediaId(imageField: { asset?: { _ref?: string } } | null | undefined): number | undefined {
    const ref = imageField?.asset?._ref;
    return ref ? imageMap.get(ref) : undefined;
  }

  // --- Step 3: Migrate globals ---
  console.log("\n3. Migrating page globals...\n");

  if (homePage) {
    const res = await fetch(`${PAYLOAD_URL}/api/globals/home-page`, {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({
        heroHeadline: homePage.heroHeadline || "",
        heroAccent: homePage.heroAccent || "",
        heroDescription: homePage.heroDescription || "",
        heroImage: getMediaId(homePage.heroImage),
        servicesHeading: homePage.servicesHeading || "",
        servicesDescription: homePage.servicesDescription || "",
        featuredHeading: homePage.featuredHeading || "",
        featuredDescription: homePage.featuredDescription || "",
        ctaHeading: homePage.ctaHeading || "",
        ctaDescription: homePage.ctaDescription || "",
      }),
    });
    console.log(`   ${res.ok ? "✓" : "✗"} Home Page (${res.status})`);
  }

  if (servicesPage) {
    const services = (servicesPage.services || []).map(
      (s: { title?: string; subtitle?: string; description?: string; features?: string[]; image?: { asset?: { _ref?: string } }; imageSize?: string }) => ({
        title: s.title || "",
        subtitle: s.subtitle || "",
        description: s.description || "",
        features: (s.features || []).map((f: string) => ({ feature: f })),
        image: getMediaId(s.image),
        imageSize: s.imageSize || "full",
      })
    );

    const res = await fetch(`${PAYLOAD_URL}/api/globals/services-page`, {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({
        heading: servicesPage.heading || "",
        description: servicesPage.description || "",
        services,
        ctaHeading: servicesPage.ctaHeading || "",
        ctaDescription: servicesPage.ctaDescription || "",
      }),
    });
    console.log(`   ${res.ok ? "✓" : "✗"} Services Page (${res.status})`);
  }

  if (aboutPage) {
    const res = await fetch(`${PAYLOAD_URL}/api/globals/about-page`, {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({
        heading: aboutPage.heading || "",
        subtitle: aboutPage.subtitle || "",
        storyHeading: aboutPage.storyHeading || "",
        storyImage: getMediaId(aboutPage.storyImage),
        storyParagraphs: (aboutPage.storyParagraphs || []).map((p: string) => ({ text: p })),
        stats: (aboutPage.stats || []).map((s: { value?: string; label?: string }) => ({
          value: s.value || "",
          label: s.label || "",
        })),
        serviceAreaHeading: aboutPage.serviceAreaHeading || "",
        serviceAreaDescription: aboutPage.serviceAreaDescription || "",
        serviceAreas: (aboutPage.serviceAreas || []).map((a: string) => ({ area: a })),
        ctaHeading: aboutPage.ctaHeading || "",
        ctaDescription: aboutPage.ctaDescription || "",
      }),
    });
    console.log(`   ${res.ok ? "✓" : "✗"} About Page (${res.status})`);
  }

  if (contactPage) {
    const res = await fetch(`${PAYLOAD_URL}/api/globals/contact-page`, {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({
        heading: contactPage.heading || "",
        description: contactPage.description || "",
        email: contactPage.email || "",
        serviceAreaDescription: contactPage.serviceAreaDescription || "",
      }),
    });
    console.log(`   ${res.ok ? "✓" : "✗"} Contact Page (${res.status})`);
  }

  // --- Step 4: Migrate collections ---
  console.log("\n4. Migrating portfolio items...\n");

  for (const item of portfolioItems) {
    try {
      const res = await fetch(`${PAYLOAD_URL}/api/portfolio-items`, {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          title: item.title || "",
          image: getMediaId(item.image),
          category: item.category || undefined,
          location: item.location || "",
          description: item.description || "",
          featured: item.featured || false,
          order: item.order || 0,
        }),
      });
      console.log(`   ${res.ok ? "✓" : "✗"} ${item.title || "Untitled"} (${res.status})`);
    } catch (err) {
      console.error(`   ✗ ${item.title}:`, err);
    }
  }

  console.log("\n5. Migrating virtual tours...\n");

  for (const tour of virtualTours) {
    try {
      const res = await fetch(`${PAYLOAD_URL}/api/virtual-tours`, {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          title: tour.title || "Untitled Tour",
          description: tour.description || "",
          thumbnail: getMediaId(tour.thumbnail),
          embedUrl: tour.embedUrl || "",
          externalLink: tour.externalLink || "",
          location: tour.location || "",
          order: tour.order || 0,
        }),
      });
      console.log(`   ${res.ok ? "✓" : "✗"} ${tour.title || "Untitled"} (${res.status})`);
    } catch (err) {
      console.error(`   ✗ ${tour.title}:`, err);
    }
  }

  console.log("\n=== Migration complete! ===");
  console.log(`   Images: ${imageMap.size}`);
  console.log(`   Portfolio items: ${portfolioItems.length}`);
  console.log(`   Virtual tours: ${virtualTours.length}`);
  console.log(`   Globals: 4 (home, services, about, contact)\n`);

  process.exit(0);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
