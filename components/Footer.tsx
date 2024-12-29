import React from "react";

const Footer = () => {
  return (
    <footer className="border-t bg-white/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl  py-8 ">
        <p className="text-sm text-gray-600 text-center">
          © {new Date().getFullYear()} AstroScope. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
