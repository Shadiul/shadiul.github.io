import React from "react";
import { ASSETS } from "../assets/assets";

type Props = {};

const Footer = (props: Props) => {
  return (
    <div className="basic-margin py-4">
      <div className="flex gap-4 justify-center">
        <img src={ASSETS.icons.facebook} alt="facebook" className="h-8 w-8" />
        <img src={ASSETS.icons.github} alt="github" className="h-8 w-8" />
        <img src={ASSETS.icons.instagram} alt="instagram" className="h-8 w-8" />
        <img src={ASSETS.icons.linkedin} alt="linkedin" className="h-8 w-8" />
        <img src={ASSETS.icons.twitter} alt="twitter" className="h-8 w-8" />
        <img src={ASSETS.icons.youtube} alt="youtube" className="h-8 w-8" />
      </div>

      <div className="h-5" />

      <p className="text-xs text-center">Copyright ©2022 All rights reserved</p>
    </div>
  );
};

export default Footer;
