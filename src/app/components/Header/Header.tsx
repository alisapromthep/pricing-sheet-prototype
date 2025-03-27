import React from "react";
import NavBar from "../NavBar/NavBar";

const Header = () => {
  return (
    <div className="bg-rv-navy h-32 grid grid-cols-4">
      <h2 className="text-white self-center">RedHouse Vision Centre</h2>
      <h1 className="col-span-2 font-bold text-white text-lg self-center">
        Hoya Pricing Tool
      </h1>
      <NavBar />
    </div>
  );
};

export default Header;
