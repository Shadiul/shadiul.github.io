import React from "react";
import { ASSETS } from "../assets/assets";

type Props = {};

const Hero = (props: Props) => {
  return (
    <div className="basic-margin">
      <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-8 md:gap-16">
        <div className="flex flex-col items-start gap-5 sm:gap-6 md:gap-7">
          <h1 className="text-center text-2xl font-bold leading-snug w-full sm:text-left md:text-4xl lg:text-5xl">
            Hi, I am Shadiul Huda,
            <br /> Frontend Developer
          </h1>
          <p className="max-w-prose text-center sm:text-left">
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
            sint. Velit officia consequat duis enim velit mollit. Exercitation
            veniam consequat sunt nostrud amet.
          </p>
        </div>

        <img
          src={ASSETS.hero}
          alt="Shadiul Huda"
          className="h-64 w-64 rounded-full bg-gray-400"
        />
      </div>

      <div className="h-5 sm:h-6 md:h-7" />
      <button className="self-center bg-orange-600 px-5 py-2 text-xl font-medium text-white rounded-sm sm:self-start">
        Download Resume
      </button>
    </div>
  );
};

export default Hero;
