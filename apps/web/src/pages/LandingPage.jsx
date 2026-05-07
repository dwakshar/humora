import FinalCTA from "@components/FinalCTA";
import Footer from "@components/Footer";
import HeroSection from "@components/HeroSection";
import HowItWorks from "@components/HowItWorks";
import MarqueeStrip from "@components/MarqueeStrip";
import Navbar from "@components/Navbar";
import Testimonials from "@components/Testimonials";
import VideoSection from "@components/VideoSection";
import WhyBusinesses from "@components/WhyBusinesses";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64 }}>
        <HeroSection />
        <HowItWorks />
        <WhyBusinesses />
        <VideoSection />
        <Testimonials />
        <MarqueeStrip />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
