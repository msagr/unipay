"use client";

import { Navbar } from "./components/home/Navbar";
import { Hero } from "./components/home/Hero";
import { Features } from "./components/home/Features";
import { FAQ } from "./components/home/FAQ";
import { Footer } from "./components/home/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <Hero />
          <Features />
          <div className="py-16 md:py-20 lg:py-24">
            <div className="max-w-6xl mx-auto px-4">
              <FAQ />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
