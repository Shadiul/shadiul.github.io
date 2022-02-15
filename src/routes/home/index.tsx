import React from "react";
import Navbar from "../../components/Navbar";

type Props = {};

const Homepage = (props: Props) => {
  return (
    <div>
      <Navbar />
      <div className="flex px-32 py-16 gap-20">
        <div className="flex flex-col items-start">
          <h1 className="text-5xl font-bold leading-snug">
            Hi, I am Shadiul Huda,
            <br /> Frontend Developer
          </h1>
          <div className="h-10" />
          <p>
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
            sint. Velit officia consequat duis enim velit mollit. Exercitation
            veniam consequat sunt nostrud amet.
          </p>
          <div className="h-10" />
          <button className="bg-orange-600 px-5 py-2 text-xl font-medium text-white rounded-sm">
            Download Resume
          </button>
        </div>

        <div>
          <div className="h-64 w-64 rounded-full bg-gray-400"></div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
