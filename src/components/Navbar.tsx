import { Icon } from "@mui/material";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { PATHS } from "../constants/paths";

type Props = {};

const Navbar = (props: Props) => {
  return (
    <div className="flex justify-end px-16 py-6">
      <ul className="flex gap-4 font-medium text-xl leading-7">
        <NavLink to={PATHS.projects}>Projects</NavLink>
        <NavLink to={PATHS.blogs}>Blogs</NavLink>
        <NavLink to="#">Contact</NavLink>
      </ul>
    </div>
  );
};

export default Navbar;
