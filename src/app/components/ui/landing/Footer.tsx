import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 py-12 bg-[#FEFFFE]">
      <div className="w-[80%] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <Image
              src="/images/logo.png"
              alt="Shopssentials"
              width={48}
              height={48}
            />
            <div>
              <p className="text-xl font-semibold text-[#1A1D23]">
                Shopssentials
              </p>
              <p className="text-sm text-gray-500">Your No. 1 Shop Plug</p>
            </div>
          </div>

          <nav>
            <ul className="flex flex-wrap justify-center md:justify-end space-x-8 text-sm text-gray-600">
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#3474c0] transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#3474c0] transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="hover:text-[#3474c0] transition-colors"
                >
                  Help
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-[#3474c0] transition-colors"
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex flex-col items-center text-center pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-2">
            Need help? Email us at{" "}
            <a
              href="mailto:hello@shopssentials.com"
              className="text-[#3474c0] hover:underline"
            >
              hello@shopssentials.com
            </a>
          </p>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Shopssentials. All rights reserved.
          </p>
          <Link href="https://www.aurorasoftwarelabs.io/" target="_blank">
            <Image
              src="/images/AuroraLogo.png"
              alt="Aurora Software Labs"
              width={108}
              height={2}
            />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
