import React from "react";
import { Link } from "react-scroll";

const Navbar = () => {
  return (
    <nav className=" border absolute top-2 left-1/2 transform -translate-x-1/2 border-indigo-200 w-full lg:max-w-5xl mx-auto  max-w-[350px] md:max-w-3xl bg-white/50 backdrop-blur- shadow-md rounded-2xl px-4 py-2">
      <div className="flex justify-between items-center">
        <span className="text-black font-bold text-lg ">AstroGenius</span>
        <Link to="birthForm" smooth={true} >
          <button className="bg-indigo-500 text-gray-200 hover:bg-white hover:text-black font-medium py-2 px-4 rounded-full border transition-colors duration-200">
            Get Started
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
