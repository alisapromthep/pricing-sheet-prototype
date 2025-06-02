import React from "react";
import Link from "next/link";

const Header = () => {
  return (
    <div className="p-2 md:p-8 bg-rv-navy grid md-grid-cols-4">
      <Link href="/" className="text-white self-center">
        RedHouse Vision Centre
      </Link>
      <h1 className="col-span-2 font-bold text-white text-lg md:text-2xl self-center">
        Pricing Tool
      </h1>
    </div>
  );
};

export default Header;
