import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Collections from "@/components/Collections";
import FeaturedFleet from "@/components/FeaturedFleet";
import WhyChooseUs from "@/components/WhyChooseUs";
import Counter from "@/components/Counter";
import Footer from "@/components/Footer";

const page = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Collections />
      <FeaturedFleet />
      <WhyChooseUs />
      <Counter />
      <Footer />
    </div>
  );
};

export default page;
