import AboutHero from "@/components/about/AboutHero";
import BehindWheel from "@/components/about/BehindWheel";
import CTA from "@/components/about/CTA";
import OurStory from "@/components/about/OurStory";
import Standards from "@/components/about/Standards";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const page = () => {
  return (
    <>
      <Navbar />
      <AboutHero />
      <OurStory />
      <Standards />
      <BehindWheel />
      <CTA />
      <Footer />
    </>
  );
};

export default page;
