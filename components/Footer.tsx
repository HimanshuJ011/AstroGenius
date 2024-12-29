import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="border-t bg-white/50 backdrop-blur-sm">
      <div className=" py-8 text-center flex justify-center gap-x-8 ">
        <p className="text-sm text-gray-600 ">
          © {new Date().getFullYear()} AstroScope. All rights reserved.{" "}
        </p>
        <p className="text-sm text-gray-600">
          <Link href={"https://x.com/himanshuj144"}>Developed by : <strong>x.com/himanshuj144</strong></Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
