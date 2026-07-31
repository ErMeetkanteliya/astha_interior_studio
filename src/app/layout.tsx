import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import connectDB from "@/lib/db";
import StudioInfo from "@/lib/models/StudioInfo";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { SmoothScroll } from "@/components/shared/SmoothScroll";
import { ScrollAnimationProvider } from "@/components/shared/ScrollAnimations";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ASTHA | Luxury Interior Studio",
  description: "Premium interior design and architecture studio specializing in custom residential, commercial, villa, and luxury renovations.",
  icons: {
    icon: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let studioData = {};
  
  try {
    await connectDB();
    const info = await StudioInfo.findOne().lean();
    if (info) {
      studioData = JSON.parse(JSON.stringify(info));
    }
  } catch (err) {
    console.error("Failed to connect or fetch studio info in layout:", err);
  }

  const companyName = (studioData as any).companyName || 'ASTHA';

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-soft-white text-deep-black">
        <SmoothScroll>
          <ScrollAnimationProvider>
            {/* Pass logo & companyName if available */}
            <Navbar companyName={companyName} />
            
            {/* Page Content */}
            <main className="flex-1 flex flex-col pt-[76px]">
              {children}
            </main>
            
            {/* Footer */}
            <Footer studioInfo={studioData} />
          </ScrollAnimationProvider>
        </SmoothScroll>
        
        <Toaster position="top-right" richColors theme="light" />
      </body>
    </html>
  );
}
