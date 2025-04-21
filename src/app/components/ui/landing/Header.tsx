"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, User } from 'iconsax-reactjs';

import logo from '../../../../../public/images/logo.png';
import CartModal from './Modal/CartModal';

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
          fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white/70 backdrop-blur-sm 
          ${scrolled ? "shadow-sm py-1" : "py-2"}
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
        <CartModal handleClose={handleClose} animateModal={animateModal}/>
      )}
    </>
  );
};

export default Header;