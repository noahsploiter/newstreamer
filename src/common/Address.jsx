import React from "react";
import { CiWarning } from "react-icons/ci";
import { FaTelegram } from "react-icons/fa";

const Address = () => {
  const handleTelegramClick = () => {
    window.open("https://t.me/habeshanxsupportbot", "_blank");
  };
  return (
    <div>
      <div className="mt-2 p-3">
        <div className="flex items-center gap-1">
          <h1 className="font-bold text-red-500 underline">ማሳሰቢያ</h1>
          <CiWarning className="text-red-500 text-xl" />
        </div>
        <p className="mt-2 text-white mb-[100px]">
          ማንኛውም አይነት አስተያየት ካሎት እባኮን ያስቀምጡልን እንዲሁም{" "}
          <span className="text-red-500 font-bold">የሀበሻ ቪዲዮዎች</span> ካሎት ይላኩልን{" "}
          <span className="text-red-500 font-bold">ማስጠንቀቂያ</span> ለጊዜው ማንኛውንም
          ቪዲዮ በገንዘብ <span className="text-red-500 font-bold">የማንገዛ</span> መሆኑን
          እናሳወቃለን አብራችሁን መስራት ለምትፈልጉ ሰዋች በ ኢትዮጲያም ሆነ ከ ሀገር ውጭ ያላቹ ሰዎች በዚሁ ያሳውቁን
        </p>
      </div>
      {/* Telegram Icon */}
      <div
        className="fixed bottom-[90px]  right-5 cursor-pointer bg-blue-500 rounded-full p-3 shadow-lg"
        onClick={handleTelegramClick}
      >
        <FaTelegram className="text-white text-xl " />
      </div>
    </div>
  );
};

export default Address;
