import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import ProductPreview from "@/components/landing/ProductPreview";
import Stats from "@/components/landing/Stats";
import PricingCards from "@/components/landing/PricingCards";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <ProductPreview />
        <Stats />
        <PricingCards />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
