import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled } = await draftMode();

  return (
    <>
      <Navbar />
      <main className="pt-16">{children}</main>
      <Footer />
      {isEnabled && <VisualEditing />}
    </>
  );
}
