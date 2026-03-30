/* eslint-disable no-console */
/**
 * Upload images directly to Vercel Blob and create media records in Payload.
 * Bypasses Payload's upload API entirely — no sharp, no serverless limits.
 *
 * Usage: bunx tsx scripts/migrate-images-to-blob.ts <payload-url> <email> <password>
 */

import { readFileSync } from "fs";
import { resolve } from "path";
import { put } from "@vercel/blob";
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
  console.error("Usage: bunx tsx scripts/migrate-images-to-blob.ts <url> <email> <password>");
  process.exit(1);
}

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error("BLOB_READ_WRITE_TOKEN not found in .env.local");
  process.exit(1);
}

// Sanity client
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "ravatqd0",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
});

// Payload auth
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
}

function authHeaders() {
  return { Authorization: `JWT ${payloadToken}`, "Content-Type": "application/json" };
}

// Image helpers
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

function mimeFromExt(ext: string): string {
  const map: Record<string, string> = {
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
    webp: "image/webp", gif: "image/gif", tif: "image/tiff", tiff: "image/tiff",
  };
  return map[ext] || "image/jpeg";
}

async function migrate() {
  console.log("=== Image Migration (Direct to Vercel Blob) ===\n");

  await payloadLogin();
  console.log("   Logged into Payload\n");

  // First, delete all existing media records (they have no files)
  console.log("1. Cleaning up empty media records...\n");
  let page = 1;
  let deleted = 0;
  while (true) {
    const res = await fetch(`${PAYLOAD_URL}/api/media?limit=100&page=${page}`, {
      headers: authHeaders(),
    });
    const data = await res.json();
    if (!data.docs || data.docs.length === 0) break;
    for (const doc of data.docs) {
      await fetch(`${PAYLOAD_URL}/api/media/${doc.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      deleted++;
    }
    if (!data.hasNextPage) break;
    page++;
  }
  console.log(`   Deleted ${deleted} empty media records\n`);

  // Collect all image refs from Sanity
  console.log("2. Fetching image refs from Sanity...\n");
  const portfolioItems = await sanityClient.fetch(`*[_type == "portfolioItem"] | order(order asc, _createdAt desc)`);
  const virtualTours = await sanityClient.fetch(`*[_type == "virtualTour"] | order(order asc, _createdAt desc)`);
  const homePage = await sanityClient.fetch(`*[_type == "homePage"][0]`);
  const servicesPage = await sanityClient.fetch(`*[_type == "servicesPage"][0]`);
  const aboutPage = await sanityClient.fetch(`*[_type == "aboutPage"][0]`);

  const imageRefs = new Set<string>();
  function collectRef(field: { asset?: { _ref?: string } } | null | undefined) {
    if (field?.asset?._ref) imageRefs.add(field.asset._ref);
  }

  for (const item of portfolioItems) collectRef(item.image);
  for (const tour of virtualTours) collectRef(tour.thumbnail);
  collectRef(homePage?.heroImage);
  collectRef(aboutPage?.storyImage);
  if (servicesPage?.services) {
    for (const s of servicesPage.services) collectRef(s.image);
  }

  console.log(`   Found ${imageRefs.size} unique images\n`);

  // Upload each image directly to Vercel Blob, then create Payload media record
  console.log("3. Uploading images to Vercel Blob...\n");
  const imageMap = new Map<string, number>(); // sanityRef -> payloadMediaId

  for (const ref of imageRefs) {
    try {
      const url = sanityImageUrl(ref);
      const filename = filenameFromRef(ref);
      const ext = filename.split(".").pop() || "jpg";
      const contentType = mimeFromExt(ext);

      console.log(`   Downloading: ${filename}`);
      const imgRes = await fetch(url);
      if (!imgRes.ok) {
        console.error(`   ✗ Failed to download: ${imgRes.status}`);
        continue;
      }

      const buffer = Buffer.from(await imgRes.arrayBuffer());

      // Upload directly to Vercel Blob
      console.log(`   Uploading to Blob...`);
      const blob = await put(`media/${filename}`, buffer, {
        access: "public",
        contentType,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      console.log(`   ✓ Blob URL: ${blob.url}`);

      // Create media record in Payload via REST with the Blob URL
      const mediaRes = await fetch(`${PAYLOAD_URL}/api/media`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          alt: filename.split(".")[0].replace(/-/g, " "),
          url: blob.url,
          filename,
          mimeType: contentType,
          filesize: buffer.length,
          width: null,
          height: null,
        }),
      });

      const mediaData = await mediaRes.json();
      if (mediaData.doc?.id) {
        imageMap.set(ref, mediaData.doc.id);
        console.log(`   ✓ Media ID: ${mediaData.doc.id}\n`);
      } else {
        console.error(`   ✗ Failed to create media record:`, JSON.stringify(mediaData).slice(0, 200), "\n");
      }
    } catch (err) {
      console.error(`   ✗ Error: ${err}\n`);
    }
  }

  console.log(`\n4. Uploaded ${imageMap.size} images. Now updating references...\n`);

  function getMediaId(field: { asset?: { _ref?: string } } | null | undefined): number | undefined {
    const ref = field?.asset?._ref;
    return ref ? imageMap.get(ref) : undefined;
  }

  // Delete existing portfolio items (they have no images linked)
  page = 1;
  while (true) {
    const res = await fetch(`${PAYLOAD_URL}/api/portfolio-items?limit=100&page=${page}`, { headers: authHeaders() });
    const data = await res.json();
    if (!data.docs || data.docs.length === 0) break;
    for (const doc of data.docs) {
      await fetch(`${PAYLOAD_URL}/api/portfolio-items/${doc.id}`, { method: "DELETE", headers: authHeaders() });
    }
    if (!data.hasNextPage) break;
    page++;
  }

  // Delete existing virtual tours
  const toursRes = await fetch(`${PAYLOAD_URL}/api/virtual-tours?limit=100`, { headers: authHeaders() });
  const toursData = await toursRes.json();
  for (const doc of toursData.docs || []) {
    await fetch(`${PAYLOAD_URL}/api/virtual-tours/${doc.id}`, { method: "DELETE", headers: authHeaders() });
  }

  // Re-create portfolio items with image refs
  console.log("5. Re-creating portfolio items with images...\n");
  for (const item of portfolioItems) {
    const res = await fetch(`${PAYLOAD_URL}/api/portfolio-items`, {
      method: "POST",
      headers: authHeaders(),
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
  }

  // Re-create virtual tours
  console.log("\n6. Re-creating virtual tours with thumbnails...\n");
  for (const tour of virtualTours) {
    const res = await fetch(`${PAYLOAD_URL}/api/virtual-tours`, {
      method: "POST",
      headers: authHeaders(),
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
  }

  // Update globals with image refs
  console.log("\n7. Updating page globals with images...\n");

  if (homePage) {
    const res = await fetch(`${PAYLOAD_URL}/api/globals/home-page`, {
      method: "POST",
      headers: authHeaders(),
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
    console.log(`   ${res.ok ? "✓" : "✗"} Home Page`);
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
      headers: authHeaders(),
      body: JSON.stringify({
        heading: servicesPage.heading || "",
        description: servicesPage.description || "",
        services,
        ctaHeading: servicesPage.ctaHeading || "",
        ctaDescription: servicesPage.ctaDescription || "",
      }),
    });
    console.log(`   ${res.ok ? "✓" : "✗"} Services Page`);
  }

  if (aboutPage) {
    const res = await fetch(`${PAYLOAD_URL}/api/globals/about-page`, {
      method: "POST",
      headers: authHeaders(),
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
    console.log(`   ${res.ok ? "✓" : "✗"} About Page`);
  }

  console.log("\n=== Migration complete! ===");
  console.log(`   Images uploaded to Blob: ${imageMap.size}`);
  console.log(`   Portfolio items: ${portfolioItems.length}`);
  console.log(`   Virtual tours: ${virtualTours.length}\n`);

  process.exit(0);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
