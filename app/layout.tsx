import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Polar Lights Imaging | Drone Photography & 3D Tours",
  description:
    "Professional drone photography, cinematic videography, and immersive Matterport 3D tours. Serving Wisconsin and Michigan's Upper Peninsula.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
