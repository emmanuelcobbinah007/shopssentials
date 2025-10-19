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
    <div className="bg-[#F9FAFB] py-16">
      <div className="w-[80%] mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-[#1A1D23]">
            How It Works
          </h2>
          <p className="text-gray-500">
            Simple steps to get your shop essentials delivered
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition-shadow duration-300 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#3474c0] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {step.id}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#1A1D23]">
                  {step.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{step.desc}</p>
              </div>

              {/* Connector line - only show between cards on md+ screens */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-[#3474c0] transform -translate-y-1/2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
