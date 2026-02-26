export const metadata = {
  title: "Polar Lights Imaging | Studio",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ height: "100vh" }}>
      {children}
    </div>
  );
}
