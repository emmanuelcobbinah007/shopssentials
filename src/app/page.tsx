import React from "react";
import { Poppins } from "next/font/google";

import HomePageContent from "./components/ui/landing/HomePageContent";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const page = () => {
  return (
    <div
      className={`${poppins.variable} font-poppins text-[#1A1D23] bg-[#FEFFFE]`}
    >
      <HomePageContent />
    </div>
  );
};

export default page;
