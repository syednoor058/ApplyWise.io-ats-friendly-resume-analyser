import Footer from "@/components/ui/Footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <div className="p-4">
        <Footer />
      </div>
    </>
  );
}
