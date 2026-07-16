import CarsCTA from "@/components/cars/CarsCTA";
// import CarsFilters from "@/components/cars/CarsFilters";
import CarsGrid from "@/components/cars/CarsGrid";
import CarsHero from "@/components/cars/CarsHero";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

const page = () => {
  return (
    <>
      <Navbar />
      <CarsHero />
      {/* <CarsFilters /> */}
      <CarsGrid />
      <CarsCTA />
      <Footer />
    </>
  );
};

export default page;
