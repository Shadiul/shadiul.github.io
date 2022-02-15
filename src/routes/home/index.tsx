import React from "react";
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
    </div>
  );
};

export default Homepage;
