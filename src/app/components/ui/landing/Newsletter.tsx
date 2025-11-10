"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/app/contexts/AuthContext";

const Newsletter: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "already-subscribed"
  >("idle");
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  // Check subscription status when user logs in
  useEffect(() => {
    const checkSubscription = async () => {
      if (isAuthenticated && user?.email) {
        setIsCheckingSubscription(true);
        try {
          const response = await fetch(`/api/newsletter?userId=${user.id}`);
          const data = await response.json();

          if (data.isSubscribed) {
            setStatus("already-subscribed");
          } else {
            setEmail(user.email); // Prefill email for non-subscribed users
          }
        } catch (error) {
          console.error("Error checking subscription:", error);
          setEmail(user.email); // Still prefill email on error
        } finally {
          setIsCheckingSubscription(false);
        }
      } else if (!isAuthenticated) {
        // Clear email when user logs out
        setEmail("");
        setStatus("idle");
      }
    };

    checkSubscription();
  }, [isAuthenticated, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "sending") return;

    setStatus("sending");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          userId: isAuthenticated && user ? user.id : null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("sent");
        setTimeout(() => {
          setStatus("already-subscribed");
          if (!isAuthenticated) {
            setEmail("");
          }
        }, 2000);
      } else {
        console.error("Subscription failed:", data.error);
        setStatus("idle");
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      setStatus("idle");
    }
  };

  return (
    <div className="bg-white py-16">
      <div className="w-[80%] mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#3474c0] to-[#4f8bd6] rounded-2xl p-8 md:p-12 text-center text-white"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              {status === "already-subscribed"
                ? "You're already subscribed!"
                : "Get 15% off your first order"}
            </h2>
          </motion.div>
          <motion.div variants={itemVariants}>
            <p className="mb-8 text-blue-100 max-w-2xl mx-auto">
              {status === "already-subscribed"
                ? "Thanks for being part of the Shopssentials family! You'll be the first to know about new arrivals and exclusive deals."
                : "Join thousands of shop owners who trust Shopssentials for their retail needs. Be the first to know about new arrivals, exclusive deals, and expert tips."}
            </p>
          </motion.div>

          {status === "already-subscribed" ? (
            <div className="max-w-md mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-white font-medium truncate md:whitespace-normal md:overflow-visible">
                  {isAuthenticated
                    ? `Subscribed with ${user?.email}`
                    : "Successfully subscribed!"}
                </p>
              </div>
            </div>
          ) : (
            <motion.div variants={itemVariants}>
              <form
                className="max-w-md mx-auto flex flex-col sm:flex-row gap-3"
                onSubmit={handleSubmit}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    isAuthenticated && user
                      ? "Your email is pre-filled"
                      : "Enter your email address"
                  }
                  className="block md:flex-1 px-4 py-3 rounded-lg text-[#1A1D23] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white border-2 border-white text-white"
                  disabled={status === "sending" || isCheckingSubscription}
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-[#3474c0] rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-300 disabled:opacity-50"
                  disabled={
                    status === "sending" || isCheckingSubscription || !email
                  }
                >
                  {isCheckingSubscription
                    ? "Checking..."
                    : status === "sending"
                    ? "Subscribing..."
                    : status === "sent"
                    ? "Subscribed!"
                    : "Subscribe"}
                </button>
              </form>
            </motion.div>
          )}

          {status === "sent" && (
            <motion.div variants={itemVariants}>
              <p className="mt-4 text-blue-100">
                Welcome to the Shopssentials family! Check your email for your
                discount code.
              </p>
            </motion.div>
          )}

          {isAuthenticated && status !== "already-subscribed" && (
            <motion.div variants={itemVariants}>
              <p className="mt-4 text-blue-100 text-sm">
                You&apos;re logged in as {user?.email}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Newsletter;
