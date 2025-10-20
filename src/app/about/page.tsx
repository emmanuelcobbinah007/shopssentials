"use client";

import React from "react";
import {
  ShoppingBag,
  Heart,
  Award,
  People,
  Flag,
  TrendUp,
  Shield,
  Star,
} from "iconsax-reactjs";

const AboutPage: React.FC = () => {
  const values = [
    {
      icon: <Shield size={32} color="#3474c0" />,
      title: "Quality First",
      description:
        "We source and provide only the highest quality retail equipment and supplies to ensure your business success.",
    },
    {
      icon: <Heart size={32} color="#3474c0" />,
      title: "Customer Focused",
      description:
        "Your success is our success. We're committed to providing exceptional service and support to every customer.",
    },
    {
      icon: <People size={32} color="#3474c0" />,
      title: "Expert Team",
      description:
        "Our experienced team of retail specialists brings years of industry knowledge to help you make informed decisions.",
    },
    {
      icon: <TrendUp size={32} color="#3474c0" />,
      title: "Innovation",
      description:
        "We stay ahead of retail trends and technology to offer you the latest solutions for your business needs.",
    },
  ];

  const stats = [
    { number: "500+", label: "Happy Customers" },
    { number: "1000+", label: "Products Delivered" },
    { number: "5+", label: "Years Experience" },
    { number: "24/7", label: "Support Available" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Spacer */}
      <div className="h-24"></div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#3474c0] to-[#4f8bd6] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <ShoppingBag size={32} color="white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About Shopssentials
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Your trusted partner in retail excellence. We provide quality
            equipment and supplies to help your business thrive in today's
            competitive market.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#3474c0] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in 2019, Shopssentials began with a simple mission: to
                  make quality retail equipment accessible to businesses of all
                  sizes across Ghana and West Africa. We recognized that many
                  retailers struggled to find reliable suppliers for essential
                  store equipment.
                </p>
                <p>
                  What started as a small operation in Accra has grown into
                  Ghana's leading provider of retail solutions. We've helped
                  hundreds of businesses - from corner stores to large
                  supermarkets - optimize their operations and improve customer
                  experiences.
                </p>
                <p>
                  Today, we continue to expand our product range and services,
                  always maintaining our commitment to quality, reliability, and
                  exceptional customer service. Our "No. 1 Shop Plug" reputation
                  is built on trust, expertise, and genuine care for our
                  customers' success.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-[#3474c0] to-[#4f8bd6] rounded-2xl p-8 flex items-center justify-center">
                <div className="text-center text-white">
                  <Award size={64} className="mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Trusted Partner</h3>
                  <p className="text-blue-100">Since 2019</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#3474c0] rounded-full flex items-center justify-center mx-auto mb-6">
                <Flag size={32} color="white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To empower retail businesses across Ghana and West Africa with
                high-quality equipment, expert guidance, and exceptional service
                that drives growth and customer satisfaction.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#3474c0] rounded-full flex items-center justify-center mx-auto mb-6">
                <Star size={32} color="white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To be the leading provider of retail solutions in West Africa,
                recognized for our commitment to quality, innovation, and
                customer success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive retail solutions to meet all your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#3474c0] rounded-lg flex items-center justify-center mb-4">
                <ShoppingBag size={24} color="white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Shelving & Storage
              </h3>
              <p className="text-gray-600">
                Heavy-duty shelving units, storage racks, and display systems
                designed for retail environments.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#3474c0] rounded-lg flex items-center justify-center mb-4">
                <Flag size={24} color="white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                POS Systems
              </h3>
              <p className="text-gray-600">
                Complete point-of-sale solutions including cash registers,
                receipt printers, and barcode scanners.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#3474c0] rounded-lg flex items-center justify-center mb-4">
                <People size={24} color="white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Display Solutions
              </h3>
              <p className="text-gray-600">
                Eye-catching display stands, peg boards, and merchandising
                solutions to showcase your products.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#3474c0] rounded-lg flex items-center justify-center mb-4">
                <People size={24} color="white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Accessories
              </h3>
              <p className="text-gray-600">
                Essential retail accessories including shopping baskets, price
                tags, and store supplies.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#3474c0] rounded-lg flex items-center justify-center mb-4">
                <Shield size={24} color="white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Expert Consultation
              </h3>
              <p className="text-gray-600">
                Professional advice and store layout planning to optimize your
                retail space and operations.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#3474c0] rounded-lg flex items-center justify-center mb-4">
                <TrendUp size={24} color="white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                After-Sales Support
              </h3>
              <p className="text-gray-600">
                Comprehensive warranty coverage, maintenance services, and
                ongoing technical support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="flex gap-6 p-6 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">{value.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Shopssentials?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              What sets us apart from other retail suppliers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#3474c0] rounded-full flex items-center justify-center mx-auto mb-6">
                <Award size={32} color="white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Quality Guarantee
              </h3>
              <p className="text-gray-600">
                Every product comes with our quality guarantee and comprehensive
                warranty coverage.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#3474c0] rounded-full flex items-center justify-center mx-auto mb-6">
                <People size={32} color="white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Local Expertise
              </h3>
              <p className="text-gray-600">
                Deep understanding of the Ghanaian and West African retail
                market and business needs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#3474c0] rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart size={32} color="white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Customer First
              </h3>
              <p className="text-gray-600">
                Your satisfaction and success drive everything we do. We're here
                to support your business growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#3474c0] to-[#4f8bd6] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Retail Space?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Let's discuss how we can help you create the perfect retail
            environment for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/shop"
              className="bg-white text-[#3474c0] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Products
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#3474c0] transition-colors"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
