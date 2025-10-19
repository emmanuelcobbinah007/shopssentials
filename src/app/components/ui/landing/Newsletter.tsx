"use client";
import React, { useState } from "react";

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("sending");
    // Simulate API call
    setTimeout(() => {
      setStatus("sent");
      setTimeout(() => {
        setStatus("idle");
        setEmail("");
      }, 2000);
    }, 800);
  };

  return (
    <div className="bg-white py-16">
      <div className="w-[80%] mx-auto">
        <div className="bg-gradient-to-r from-[#3474c0] to-[#4f8bd6] rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Get 15% off your first order
          </h2>
          <p className="mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of shop owners who trust Shopssentials for their
            retail needs. Be the first to know about new arrivals, exclusive
            deals, and expert tips.
          </p>

          <form
            className="max-w-md mx-auto flex flex-col sm:flex-row gap-3"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="block md:flex-1 px-4 py-3 rounded-lg text-[#1A1D23] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white border-2 border-white text-white"
              disabled={status === "sending"}
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-[#3474c0] rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-300 disabled:opacity-50"
              disabled={status === "sending"}
            >
              {status === "sending"
                ? "Joining..."
                : status === "sent"
                ? "Thanks!"
                : "Subscribe"}
            </button>
          </form>

          {status === "sent" && (
            <p className="mt-4 text-blue-100">
              Welcome to the Shopssentials family! Check your email for your
              discount code.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
