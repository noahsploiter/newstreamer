import React from "react";
import { MdNoAdultContent } from "react-icons/md";

const Header = () => {
  return (
    <div className="text-xl text-white font-bold text-center mt-1">
      <a href="/" className="flex justify-center items-center">
        Wesi<span className="">b</span>
        <MdNoAdultContent className="ml-1 text-red-500" />
      </a>
    </div>
  );
};

export default Header;
