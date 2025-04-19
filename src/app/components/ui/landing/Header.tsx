"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, User, CloseCircle } from 'iconsax-reactjs';

import logo from '../../../../../public/images/logo.png';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [animateModal, setAnimateModal] = useState(false);

  // Logic to handle cartModal
  const handleOpen = () => {
    setShowModal(true);
    setTimeout(() => setAnimateModal(true), 10);
  };

  const handleClose = () => {
    setAnimateModal(false);
    setTimeout(() => setShowModal(false), 300);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Header */}
      <div
        className={`
          fixed top-0 left-0 w-full z-50 transition-all duration-300 
          ${scrolled ? "backdrop-blur-sm bg-white/70 shadow-sm py-1" : "bg-transparent py-2"}
        `}
      >
        <div className='w-[80%] mx-auto flex justify-between items-center transition-all duration-300'>
          <div className="w-[100px] sm:w-[80px]">
            <Image width={100} height={100} src={logo.src} alt="Shopssentials logo" className="" />
          </div>
          <div className='flex items-center gap-4 mr-4'>
            <User size="24" color="#3474c0" className='hover:cursor-pointer hover:scale-105 duration-300' />
            <ShoppingCart size="24" color="#3474c0" 
              onClick={handleOpen} // Open cart modal on click
              className='hover:cursor-pointer hover:scale-105 duration-300' />
          </div>
        </div>
      </div>

      {/* Sidebar Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex font-poppins">
          {/* Overlay */}
          <div
            className={`fixed inset-0 transition-opacity duration-300 ${
              animateModal
                ? "bg-[#D5E8FA]/30 backdrop-blur-sm"
                : "bg-transparent backdrop-blur-0"
            }`}
            onClick={handleClose}
          ></div>

          {/* Sidebar */}
          <div
            className={`fixed right-0 top-0 h-full bg-white w-[200px] md:w-[300px] shadow-lg p-6 overflow-y-auto z-10 transform transition-transform duration-300 ease-in-out ${
              animateModal ? "translate-x-0 opacity-100" : "translate-x-full"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Cart
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-800"
              >
                <CloseCircle color="#000" size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;