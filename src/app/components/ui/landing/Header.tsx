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
      setScrolled(window.scrollY > 10);
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
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white/70 backdrop-blur-sm ${
          scrolled ? "shadow-sm py-1" : "py-2"
        }`}
      >
        <div className="w-[90%] max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-[90px] sm:w-[100px]">
              <Image
                width={100}
                height={100}
                src={logo.src}
                alt="Shopssentials logo"
              />
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-[#3474c0]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <User
                size="20"
                color="#3474c0"
                onClick={handleOpenUser}
                className="hover:cursor-pointer hover:scale-105 duration-300"
              />
              <ShoppingCart
                size="20"
                color="#3474c0"
                onClick={handleOpen}
                className="hover:cursor-pointer hover:scale-105 duration-300"
              />
            </div>

            {/* Mobile menu button */}
            <button
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((s) => !s)}
              className="md:hidden p-2 rounded-md bg-white/60 backdrop-blur-sm border border-gray-100 shadow-sm"
            >
              {menuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700"
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
                  className="h-6 w-6 text-gray-700"
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
        </div>

        {/* Mobile slide-down menu */}
        <div
          ref={mobileMenuRef}
          className={`md:hidden fixed inset-x-0 top-[64px] z-40 transform transition-transform duration-300 ${
            menuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-6 opacity-0 pointer-events-none"
          }`}
        >
          <div className="w-full bg-white border-t border-gray-100 shadow-lg">
            <div className="p-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-4 pt-2">
                <User size="20" color="#3474c0" onClick={handleOpenUser} />
                <ShoppingCart size="20" color="#3474c0" onClick={handleOpen} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Modal */}
      {showCartModal && (
        <CartModal handleClose={handleClose} animateModal={animateModal} />
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
