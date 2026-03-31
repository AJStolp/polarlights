import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://polarlightsimaging.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Polar Lights Imaging | Drone Photography & 3D Tours",
    template: "%s | Polar Lights Imaging",
  },
  description:
    "Professional drone photography, cinematic videography, and immersive Matterport 3D tours. Serving Wisconsin and Michigan's Upper Peninsula.",
  keywords: [
    "drone photography",
    "aerial photography",
    "drone videography",
    "Matterport 3D tours",
    "virtual tours",
    "real estate photography",
    "aerial video",
    "drone services",
    "Wisconsin drone photography",
    "Upper Peninsula drone",
    "property photography",
    "construction progress photos",
    "cinematic drone video",
    "3D virtual tour",
    "real estate drone",
  ],
  authors: [{ name: "Polar Lights Imaging" }],
  creator: "Polar Lights Imaging",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Polar Lights Imaging",
    title: "Polar Lights Imaging | Drone Photography & 3D Tours",
    description:
      "Professional drone photography, cinematic videography, and immersive Matterport 3D tours. Serving Wisconsin and Michigan's Upper Peninsula.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Polar Lights Imaging | Drone Photography & 3D Tours",
    description:
      "Professional drone photography, cinematic videography, and immersive Matterport 3D tours. Serving Wisconsin and Michigan's Upper Peninsula.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
