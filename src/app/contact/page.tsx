"use client";

import React, { useState } from "react";
import {
  Call,
  Location,
  Sms,
  Clock,
  Instagram,
  Facebook,
} from "iconsax-reactjs";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });

    setIsSubmitting(false);
    alert("Thank you for your message! We'll get back to you soon.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Spacer */}
      <div className="h-24"></div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#3474c0] to-[#4f8bd6] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Have questions about our products or need assistance? We&apos;re
            here to help!
          </p>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Phone */}
            <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#3474c0] rounded-full flex items-center justify-center mx-auto mb-4">
                <Call size={24} color="white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Phone
              </h3>
              <p className="text-gray-600">+233 24 123 4567</p>
              <p className="text-gray-600">+233 20 987 6543</p>
            </div>

            {/* Email */}
            <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#3474c0] rounded-full flex items-center justify-center mx-auto mb-4">
                <Sms size={24} color="white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Email
              </h3>
              <p className="text-gray-600">info@shopssentials.com</p>
              <p className="text-gray-600">support@shopssentials.com</p>
            </div>

            {/* Location */}
            <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#3474c0] rounded-full flex items-center justify-center mx-auto mb-4">
                <Location size={24} color="white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Location
              </h3>
              <p className="text-gray-600">123 Market Street</p>
              <p className="text-gray-600">Accra, Ghana</p>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#3474c0] rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock size={24} color="white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Business Hours
              </h3>
              <p className="text-gray-600">Mon - Fri: 8AM - 6PM</p>
              <p className="text-gray-600">Sat: 9AM - 4PM</p>
            </div>
          </div>

          {/* Contact Form and Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3474c0] focus:border-transparent transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3474c0] focus:border-transparent transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3474c0] focus:border-transparent transition-colors"
                      placeholder="+233 XX XXX XXXX"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3474c0] focus:border-transparent transition-colors"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Customer Support</option>
                      <option value="orders">Order Questions</option>
                      <option value="products">Product Information</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3474c0] focus:border-transparent transition-colors resize-vertical"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#3474c0] text-white py-3 px-6 rounded-lg hover:bg-[#4f8bd6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>

            {/* Map and Additional Info */}
            <div className="space-y-8">
              {/* Map Placeholder */}
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Visit Our Store
                </h3>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Location size={48} color="#9CA3AF" />
                    <p className="text-gray-500 mt-2">Interactive Map</p>
                    <p className="text-sm text-gray-400">
                      123 Market Street, Accra, Ghana
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Why Choose Us?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#3474c0] rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Expert Support
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Our team of retail experts is ready to help you find the
                        perfect solutions.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#3474c0] rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Quality Products
                      </h4>
                      <p className="text-gray-600 text-sm">
                        We offer only the highest quality retail equipment and
                        supplies.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#3474c0] rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Fast Response
                      </h4>
                      <p className="text-gray-600 text-sm">
                        We respond to all inquiries within 24 hours during
                        business days.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Follow Us
                </h3>
                <p className="text-gray-600 mb-6">
                  Stay connected and get the latest updates on new products and
                  promotions.
                </p>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="w-12 h-12 bg-[#3474c0] rounded-full flex items-center justify-center hover:bg-[#4f8bd6] transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook size={24} color="white" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-[#3474c0] rounded-full flex items-center justify-center hover:bg-[#4f8bd6] transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram size={24} color="white" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
