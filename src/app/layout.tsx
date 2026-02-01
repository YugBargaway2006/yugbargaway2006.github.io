import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ParticlesBackground } from "@/components/particles-background";
import { TimeManager } from "@/components/time-manager";
// import { FluidCursor } from "@/components/effects/fluid-cursor";
import { FloatingHogwartsLetter } from "@/components/effects/floating-hogwarts-letter";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yug Bargaway | Portfolio",
  description: "Creative Technologist & Wizard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${cinzel.variable} antialiased relative`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TimeManager />
          {/* <FluidCursor /> */}
          <ParticlesBackground />
          <FloatingHogwartsLetter />
          <Navbar />
          <main className="min-h-screen pt-20 flex flex-col">
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
