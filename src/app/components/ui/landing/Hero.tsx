"use client";

import React from "react";
import { TypeAnimation } from "react-type-animation";
import Image from "next/image";
import HeroImage from "../../../../../public/images/Hero.jpg";

const Hero = () => {
    return (
        <div className="relative w-full h-[100vh]">
            {/* Background Image */}
            <Image
                src={HeroImage.src}
                alt="Hero Image"
                layout="fill"
                objectFit="cover"
                className="absolute inset-0 z-0"
            />
            {/* White Overlay */}
            <div className="absolute inset-0 bg-white opacity-35 z-10"></div>
            {/* Content */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white/100 z-10"></div>
            <div className="relative z-20 w-[90%] max-w-6xl mx-auto flex flex-col items-center justify-center h-full px-4">
                <div>
                    <p className="text-lg md:text-xl font-medium text-center">
                        Your No. 1 Shop Plug
                    </p>
                </div>
                <div>
                    <p className="text-2xl md:text-4xl font-bold text-center mt-4">
                        You name it{" "}
                        <span className="block sm:inline">
                            (
                            <TypeAnimation
                                sequence={[
                                    "Shelves",
                                    1500,
                                    "Racks",
                                    1500,
                                    "POS Receipt printer",
                                    1500,
                                    "Peg Boards",
                                    1500,
                                    "Price tag guns",
                                    1500,
                                    "Baskets",
                                    1500,
                                    "and more",
                                    1500,
                                ]}
                                wrapper="span"
                                speed={50}
                                cursor={false}
                                repeat={Infinity}
                                className="text-[#3474c0] font-bold"
                            />
                            ),
                        </span>{" "}
                        We've got it
                    </p>
                </div>
                <div className="relative mt-6 w-full max-w-lg">
                    <input
                        type="text"
                        placeholder="Search Shopssentials"
                        className="w-full px-6 py-3 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    />
                    <button
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 md:px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 duration-300 hover:cursor-pointer text-sm md:text-base"
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Hero;