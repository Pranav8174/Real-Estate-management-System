import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import FeaturedProperties from "@/components/FeaturedProperties";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <StatsSection />
      <FeaturedProperties />
      <CallToAction />
      <Footer />
    </div>
  );
}