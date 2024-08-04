import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaRandom, FaUser } from "react-icons/fa";
import { MdLiveTv } from "react-icons/md";

const Footer = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const getLinkClass = (path) =>
    currentPath === path ? "text-blue-500" : "text-white";

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white py-4 flex justify-around items-center">
      <Link
        to="/hero"
        className={`flex flex-col items-center ${getLinkClass("/hero")}`}
      >
        <FaHome className="text-2xl" />
        <span className="text-sm">Home</span>
      </Link>
      <Link
        to="/story"
        className={`flex flex-col items-center ${getLinkClass("/story")}`}
      >
        <MdLiveTv className="text-2xl" />
        <span className="text-sm">Story</span>
      </Link>
      <Link
        to="/profile"
        className={`flex flex-col items-center ${getLinkClass("/profile")}`}
      >
        <FaUser className="text-2xl" />
        <span className="text-sm">Profile</span>
      </Link>
    </div>
  );
};

export default Footer;
