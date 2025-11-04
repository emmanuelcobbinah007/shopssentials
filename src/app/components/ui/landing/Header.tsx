"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { ShoppingCart, User } from "iconsax-reactjs";
import Link from "next/link";
import logo from "../../../../../public/images/logo.png";
import CartModal from "./Modal/CartModal";
import UserModal from "./Modal/UserModal";

const navLinks = [
  { id: "home", label: "Home", href: "/" },
  { id: "products", label: "Products", href: "/shop" },
  { id: "about", label: "About", href: "/about" },
  { id: "contact", label: "Contact", href: "/contact" },
];

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [animateModal, setAnimateModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [animateUserModal, setAnimateUserModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  // Logic to handle cartModal
  const handleOpen = () => {
    setShowCartModal(true);
    setTimeout(() => setAnimateModal(true), 10);
  };

  const handleClose = () => {
    setAnimateModal(false);
    setTimeout(() => setShowCartModal(false), 300);
  };

  // Logic to handle userModal
  const handleOpenUser = () => {
    setShowUserModal(true);
    setTimeout(() => setAnimateUserModal(true), 10);
  };

  const handleCloseUser = () => {
    setAnimateUserModal(false);
    setTimeout(() => setShowUserModal(false), 300);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // close mobile menu on outside click or Escape
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        menuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [menuOpen]);

  return (
    <>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "pt-2" : "pt-4"
        }`}
      >
        <div
          className={`container mx-auto transition-all duration-300 ${
            scrolled ? "max-w-4xl" : "max-w-7xl"
          }`}
        >
          <nav
            className={`flex items-center justify-between px-6 py-3 transition-all duration-300 ${
              scrolled
                ? "bg-white/80 backdrop-blur-lg rounded-full shadow-lg border border-gray-200"
                : "bg-white/20 backdrop-blur-xs shadow-sm rounded-full border border-gray-50"
            }`}
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div
                className={`transition-all duration-500 ${
                  scrolled ? "w-[70px] sm:w-[80px]" : "w-[90px] sm:w-[100px]"
                }`}
              >
                <Image
                  width={100}
                  height={100}
                  src={logo.src}
                  alt="Shopssentials logo"
                />
              </div>
            </Link>

            {/* Desktop nav */}
            <div
              className={
                scrolled
                  ? "hidden md:flex items-center gap-4 transition-all duration-500"
                  : "hidden md:flex items-center gap-6 transition-all duration-500"
              }
            >
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className={
                    scrolled
                      ? "transition-all duration-500 text-sm font-medium text-gray-700 hover:text-[#3474c0] px-2 py-1 rounded-full hover:bg-[#3474c0]/10"
                      : "transition-all duration-500 text-base font-medium text-gray-700 hover:text-[#3474c0]"
                  }
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4">
                <User
                  size={scrolled ? "18" : "20"}
                  color="#3474c0"
                  onClick={handleOpenUser}
                  className="hover:cursor-pointer hover:scale-105 duration-300 transition-all"
                />
                <ShoppingCart
                  size={scrolled ? "18" : "20"}
                  color="#3474c0"
                  onClick={handleOpen}
                  className="hover:cursor-pointer hover:scale-105 duration-300 transition-all"
                />
              </div>

              {/* Mobile menu button */}
              <button
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((s) => !s)}
                className={`md:hidden p-2 rounded-full transition-all duration-500 ${
                  scrolled
                    ? "bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm"
                    : "bg-white/60 backdrop-blur-sm border border-gray-100 shadow-sm"
                }`}
              >
                {menuOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </nav>

          {/* Mobile slide-down menu */}
          <div
            ref={mobileMenuRef}
            className={`md:hidden fixed left-1/2 transform -translate-x-1/2 z-40 transition-all duration-500 w-[80%] ${
              menuOpen
                ? "translate-y-0 opacity-100"
                : "-translate-y-6 opacity-0 pointer-events-none"
            } ${scrolled ? "top-24" : "top-[72px]"}`}
          >
            <div className="w-full bg-white border border-gray-200/50 shadow-lg rounded-2xl overflow-hidden mt-4">
              <div className="p-4 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex items-center justify-center gap-6 pt-2 border-t border-gray-100">
                  <User
                    size="20"
                    color="#3474c0"
                    onClick={() => {
                      handleOpenUser();
                      setMenuOpen(false);
                    }}
                    className="hover:cursor-pointer hover:scale-105 duration-300"
                  />
                  <ShoppingCart
                    size="20"
                    color="#3474c0"
                    onClick={() => {
                      handleOpen();
                      setMenuOpen(false);
                    }}
                    className="hover:cursor-pointer hover:scale-105 duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Modal */}
      {showCartModal && (
        <CartModal
          handleClose={handleClose}
          animateModal={animateModal}
          onOpenUserModal={handleOpenUser}
        />
      )}

      {/* User Modal */}
      {showUserModal && (
        <UserModal
          handleClose={handleCloseUser}
          animateModal={animateUserModal}
        />
      )}
    </>
  );
};

export default Header;
