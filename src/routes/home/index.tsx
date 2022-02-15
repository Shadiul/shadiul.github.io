import React from "react";
import FeaturedWorks from "../../components/FeaturedWorks";
import Hero from "../../components/Hero";
import Navbar from "../../components/Navbar";
import RecentPosts from "../../components/RecentPosts";

type Props = {};

const Homepage = (props: Props) => {
  return (
    <div>
      <Navbar />
      <div className="h-8 sm:h-16 md:h-32" />
      <Hero />
      <div className="h-16" />
      <RecentPosts />
      <div className="h-6" />
      <FeaturedWorks />
    </div>
  );
};

export default Homepage;
