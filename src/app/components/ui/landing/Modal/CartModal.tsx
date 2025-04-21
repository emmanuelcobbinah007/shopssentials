import React from 'react'
import { CloseCircle } from 'iconsax-reactjs';

interface CartModalProps {
    handleClose: () => void,
    animateModal: boolean,
}

const CartModal: React.FC<CartModalProps> = ({handleClose, animateModal}) => {
  return (
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
            className={`fixed right-0 top-0 h-full bg-white w-[250px] md:w-[400px] shadow-lg p-6 overflow-y-auto z-10 transform transition-transform duration-300 ease-in-out ${
              animateModal ? "translate-x-0 opacity-100" : "translate-x-full"
            }`}
          >
            <div className="flex justify-between items-center mb-4 w-full">
              <h2 className="text-xl font-semibold text-[#3474c0] flex-1 text-left">
                Your Cart
              </h2>
              <button
                onClick={handleClose}
                className="p-1 rounded-full hover:bg-gray-200 transition duration-200"
                aria-label="Close"
              >
                <CloseCircle color="#3474c0" size={24} />
              </button>
            </div>
          </div>
        </div>
  )
}

export default CartModal