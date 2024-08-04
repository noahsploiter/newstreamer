import React from "react";
import pic1 from "../assets/pic1.png";
import pic2 from "../assets/pic2.png";
import pic3 from "../assets/pic3.png";
import pic4 from "../assets/pic4.png";
import pic5 from "../assets/pic5.png";
import pic6 from "../assets/pic6.png";
import pic7 from "../assets/pic7.png";
import pic8 from "../assets/pic8.png";
import pic9 from "../assets/pic9.png";
import pic10 from "../assets/pic10.png";
import pic11 from "../assets/pic11.png";

// Function to select a random image
const getRandomImage = () => {
  const images = [
    pic1,
    pic2,
    pic3,
    pic4,
    pic5,
    pic6,
    pic7,
    pic8,
    pic9,
    pic10,
    pic11,
  ];
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};

const ProfilePicture = () => {
  const randomImage = getRandomImage();

  return (
    <div className="flex justify-center mb-4 border rounded-full h-[100px] w-[100px] overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105">
      <img
        src={randomImage}
        alt="Profile"
        className="h-full w-full object-cover"
      />
    </div>
  );
};

export default ProfilePicture;
