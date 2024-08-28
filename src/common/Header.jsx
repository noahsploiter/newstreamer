import React from "react";
import { MdNoAdultContent } from "react-icons/md";

const Header = () => {
  return (
    <div className="text-xl text-white font-bold text-center mt-1">
      <a href="/" className="flex justify-center items-center font-bold">
        Habeshan<span className="text-red-500">X</span>
      </a>
    </div>
  );
};

export default Header;
