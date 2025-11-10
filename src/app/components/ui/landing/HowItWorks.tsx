import React from "react";

const steps = [
  {
    id: 1,
    title: "Browse",
    desc: "Discover curated shop essentials across all categories to build your retail space.",
    icon: "🔍",
  },
  {
    id: 2,
    title: "Order",
    desc: "Quick and secure checkout with flexible payment options for your business.",
    icon: "🛒",
  },
  {
    id: 3,
    title: "Delivery",
    desc: "Fast nationwide shipping with tracking to get your shop up and running quickly.",
    icon: "🚚",
  },
];

const HowItWorks: React.FC = () => {
  return (
    <div className="bg-[#F9FAFB] py-20">
      <div className="w-full md:w-[80%] md:mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-[#1A1D23]">
            How It Works
          </h2>
          <p className="text-gray-500">
            Simple steps to get your shop essentials delivered
          </p>
        </div>

        <div className="relative flex md:grid md:grid-cols-3 gap-8 overflow-x-auto pl-4 md:pl-0">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="relative flex-shrink-0 w-80 md:w-auto flex flex-col items-center"
            >
              {/* Blue Circle on top */}
              <div className="w-16 h-16 bg-[#3474c0] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-sm z-10 mb-[-52px]">
                {step.id}
              </div>

              {/* Card */}
              <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition-shadow duration-300 text-center mt-8">
                <h3 className="text-xl font-semibold mb-3 text-[#1A1D23]">
                  {step.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{step.desc}</p>
              </div>

              {/* Connector line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="block absolute top-[55%] -right-6 w-12 h-0.5 bg-[#3474c0]"></div>
              )}
            </div>
          ))}
        </div>

        {/* Scroll dots for mobile */}
        <div className="md:hidden flex justify-center mt-6">
          <div className="flex space-x-2">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-gray-400 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
