"use client";

import React, { useState } from "react";
import {
  SearchNormal1,
  MessageQuestion,
  ShoppingCart,
  Truck,
  Refresh,
  Shield,
  Headphone,
} from "iconsax-reactjs";

const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const categories = [
    { id: "all", label: "All Topics", icon: <MessageQuestion size={20} /> },
    { id: "orders", label: "Orders", icon: <ShoppingCart size={20} /> },
    { id: "shipping", label: "Shipping", icon: <Truck size={20} /> },
    { id: "returns", label: "Returns", icon: <Refresh size={20} /> },
    { id: "account", label: "Account", icon: <Shield size={20} /> },
    { id: "support", label: "Support", icon: <Headphone size={20} /> },
  ];

  const faqs = [
    {
      id: 1,
      category: "orders",
      question: "How do I place an order?",
      answer:
        "To place an order, browse our products, add items to your cart, and proceed to checkout. You'll need to provide shipping information and payment details. Orders are processed within 1-2 business days.",
    },
    {
      id: 2,
      category: "orders",
      question: "Can I modify my order after placing it?",
      answer:
        "Orders can be modified within 2 hours of placement. Please contact our customer service team immediately with your order number. Once processing begins, modifications may not be possible.",
    },
    {
      id: 3,
      category: "shipping",
      question: "What are your shipping options?",
      answer:
        "We offer standard shipping (3-5 business days), express shipping (1-2 business days), and same-day delivery in Accra. Shipping costs vary based on order weight and destination.",
    },
    {
      id: 4,
      category: "shipping",
      question: "Do you ship internationally?",
      answer:
        "Yes, we ship to most countries in West Africa and select international destinations. International shipping typically takes 7-14 business days. Contact us for specific shipping quotes.",
    },
    {
      id: 5,
      category: "returns",
      question: "What is your return policy?",
      answer:
        "We accept returns within 30 days of delivery for unused items in original packaging. Return shipping costs are covered for defective items. Custom orders are not eligible for return.",
    },
    {
      id: 6,
      category: "returns",
      question: "How do I initiate a return?",
      answer:
        "Contact our customer service team with your order number and reason for return. We'll provide a return authorization and shipping label. Returns are processed within 5-7 business days after receipt.",
    },
    {
      id: 7,
      category: "account",
      question: "How do I create an account?",
      answer:
        "Click the 'Sign Up' button in the top right corner and fill out the registration form. You'll receive a confirmation email to verify your account. Accounts allow you to track orders and save preferences.",
    },
    {
      id: 8,
      category: "account",
      question: "How do I reset my password?",
      answer:
        "Click 'Forgot Password' on the login page and enter your email address. You'll receive a password reset link. For security, reset links expire after 24 hours.",
    },
    {
      id: 9,
      category: "support",
      question: "How can I contact customer service?",
      answer:
        "You can reach us by phone at +233 24 123 4567, email at support@shopssentials.com, or through the contact form. Our support team is available Monday-Friday, 8AM-6PM GMT.",
    },
    {
      id: 10,
      category: "support",
      question: "What information should I provide when contacting support?",
      answer:
        "Please include your order number, contact information, and a detailed description of your issue. Screenshots or photos are helpful for technical problems. This helps us resolve your issue faster.",
    },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Spacer */}
      <div className="h-24"></div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#3474c0] to-[#4f8bd6] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Help Center</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Find answers to common questions or get in touch with our support
            team
          </p>
        </div>
      </section>

      {/* Search and Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <SearchNormal1
                size={20}
                color="#9CA3AF"
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
              />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3474c0] focus:border-transparent text-lg"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-colors ${
                  activeCategory === category.id
                    ? "bg-[#3474c0] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {category.icon}
                <span className="font-medium">{category.label}</span>
              </button>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>

            {filteredFAQs.length > 0 ? (
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200"
                  >
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-gray-900">
                        {faq.question}
                      </span>
                      <svg
                        className={`w-5 h-5 text-gray-500 transform transition-transform ${
                          expandedFAQ === faq.id ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageQuestion
                  size={48}
                  color="#9CA3AF"
                  className="mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or browse our categories
                  above.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                  className="bg-[#3474c0] text-white px-6 py-2 rounded-lg hover:bg-[#4f8bd6] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Help Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Quick Help Topics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#3474c0] rounded-full flex items-center justify-center mb-4">
                <ShoppingCart size={24} color="white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Getting Started
              </h3>
              <p className="text-gray-600 mb-4">
                Learn how to browse products, create an account, and place your
                first order.
              </p>
              <button className="text-[#3474c0] font-semibold hover:text-[#4f8bd6] transition-colors">
                Learn More →
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#3474c0] rounded-full flex items-center justify-center mb-4">
                <Truck size={24} color="white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Shipping & Delivery
              </h3>
              <p className="text-gray-600 mb-4">
                Understand our shipping options, delivery times, and tracking
                information.
              </p>
              <button className="text-[#3474c0] font-semibold hover:text-[#4f8bd6] transition-colors">
                Learn More →
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#3474c0] rounded-full flex items-center justify-center mb-4">
                <Refresh size={24} color="white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Returns & Exchanges
              </h3>
              <p className="text-gray-600 mb-4">
                Find out about our return policy, how to initiate returns, and
                exchange options.
              </p>
              <button className="text-[#3474c0] font-semibold hover:text-[#4f8bd6] transition-colors">
                Learn More →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Still Need Help?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Our customer support team is here to assist you with any questions
            or concerns.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="w-12 h-12 bg-[#3474c0] rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphone size={24} color="white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Phone Support
              </h3>
              <p className="text-gray-600 text-sm mb-3">Mon-Fri, 8AM-6PM GMT</p>
              <p className="font-semibold text-[#3474c0]">+233 24 123 4567</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="w-12 h-12 bg-[#3474c0] rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageQuestion size={24} color="white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Email Support
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Response within 24 hours
              </p>
              <p className="font-semibold text-[#3474c0]">
                support@shopssentials.com
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="w-12 h-12 bg-[#3474c0] rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageQuestion size={24} color="white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600 text-sm mb-3">Available 24/7</p>
              <button className="bg-[#3474c0] text-white px-4 py-2 rounded-lg hover:bg-[#4f8bd6] transition-colors text-sm font-semibold">
                Start Chat
              </button>
            </div>
          </div>

          <div className="bg-[#3474c0] text-white rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">
              Contact Our Support Team
            </h3>
            <p className="text-blue-100 mb-6">
              For urgent issues or complex inquiries, our dedicated support team
              is ready to help.
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-[#3474c0] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpPage;
