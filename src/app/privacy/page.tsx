"use client";

import React, { useState } from "react";
import {
  Shield,
  Eye,
  Lock,
  User,
  Data,
  Setting,
  Sms,
  Calendar,
} from "iconsax-reactjs";

const PrivacyPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  const sections = [
    {
      id: "overview",
      title: "Privacy Policy Overview",
      icon: <Shield size={24} color="#3474c0" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            At Shopssentials, we are committed to protecting your privacy and
            ensuring the security of your personal information. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your
            information when you visit our website or use our services.
          </p>
          <p className="text-gray-600 leading-relaxed">
            By using our website or services, you agree to the collection and
            use of information in accordance with this policy. If you do not
            agree with our policies and practices, please do not use our
            services.
          </p>
        </div>
      ),
    },
    {
      id: "collected",
      title: "Information We Collect",
      icon: <Data size={24} color="#3474c0" />,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Personal Information
            </h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Name, email address, and contact information</li>
              <li>Billing and shipping addresses</li>
              <li>
                Payment information (processed securely by third-party
                providers)
              </li>
              <li>Account credentials and preferences</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Usage Information
            </h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>IP address and location data</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent on our site</li>
              <li>Device information and screen resolution</li>
              <li>Referral sources</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "usage",
      title: "How We Use Your Information",
      icon: <Eye size={24} color="#3474c0" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            We use the information we collect for various purposes:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>
              <strong>Order Processing:</strong> To process and fulfill your
              orders, including payment processing and shipping
            </li>
            <li>
              <strong>Account Management:</strong> To create and manage your
              account, preferences, and order history
            </li>
            <li>
              <strong>Customer Service:</strong> To respond to your inquiries,
              provide support, and resolve issues
            </li>
            <li>
              <strong>Communication:</strong> To send order confirmations,
              shipping updates, and important service announcements
            </li>
            <li>
              <strong>Website Improvement:</strong> To analyze usage patterns
              and improve our website functionality
            </li>
            <li>
              <strong>Marketing:</strong> To send promotional offers and product
              recommendations (with your consent)
            </li>
            <li>
              <strong>Legal Compliance:</strong> To comply with legal
              obligations and protect our rights
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "sharing",
      title: "Information Sharing and Disclosure",
      icon: <User size={24} color="#3474c0" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            We do not sell, trade, or rent your personal information to third
            parties. We may share your information only in the following
            circumstances:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>
              <strong>Service Providers:</strong> With trusted third-party
              service providers who assist in our operations (payment
              processors, shipping companies, etc.)
            </li>
            <li>
              <strong>Legal Requirements:</strong> When required by law, court
              order, or government regulation
            </li>
            <li>
              <strong>Business Protection:</strong> To protect our rights,
              property, or safety, or that of our customers
            </li>
            <li>
              <strong>Business Transfers:</strong> In connection with a merger,
              acquisition, or sale of assets
            </li>
            <li>
              <strong>Consent:</strong> With your explicit consent for specific
              purposes
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "security",
      title: "Data Security",
      icon: <Lock size={24} color="#3474c0" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            We implement appropriate technical and organizational security
            measures to protect your personal information against unauthorized
            access, alteration, disclosure, or destruction. These measures
            include:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>SSL/TLS encryption for data transmission</li>
            <li>Secure payment processing through certified providers</li>
            <li>Regular security audits and updates</li>
            <li>Access controls and employee training</li>
            <li>Secure data storage and backup systems</li>
          </ul>
          <p className="text-gray-600 leading-relaxed">
            However, no method of transmission over the internet or electronic
            storage is 100% secure. While we strive to protect your information,
            we cannot guarantee absolute security.
          </p>
        </div>
      ),
    },
    {
      id: "cookies",
      title: "Cookies and Tracking Technologies",
      icon: <Setting size={24} color="#3474c0" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            We use cookies and similar technologies to enhance your browsing
            experience, analyze site traffic, and personalize content.
          </p>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Types of Cookies We Use:
            </h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>
                <strong>Essential Cookies:</strong> Required for website
                functionality
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Help us understand how
                visitors use our site
              </li>
              <li>
                <strong>Marketing Cookies:</strong> Used to deliver relevant
                advertisements
              </li>
              <li>
                <strong>Preference Cookies:</strong> Remember your settings and
                preferences
              </li>
            </ul>
          </div>
          <p className="text-gray-600 leading-relaxed">
            You can control cookie settings through your browser preferences.
            However, disabling certain cookies may affect website functionality.
          </p>
        </div>
      ),
    },
    {
      id: "rights",
      title: "Your Rights and Choices",
      icon: <User size={24} color="#3474c0" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            You have certain rights regarding your personal information:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>
              <strong>Access:</strong> Request a copy of the personal
              information we hold about you
            </li>
            <li>
              <strong>Correction:</strong> Request correction of inaccurate or
              incomplete information
            </li>
            <li>
              <strong>Deletion:</strong> Request deletion of your personal
              information (subject to legal requirements)
            </li>
            <li>
              <strong>Portability:</strong> Request transfer of your data in a
              structured format
            </li>
            <li>
              <strong>Opt-out:</strong> Unsubscribe from marketing
              communications at any time
            </li>
            <li>
              <strong>Restriction:</strong> Request limitation of how we process
              your information
            </li>
          </ul>
          <p className="text-gray-600 leading-relaxed">
            To exercise these rights, please contact us using the information
            provided below.
          </p>
        </div>
      ),
    },
    {
      id: "contact",
      title: "Contact Us About Privacy",
      icon: <Sms size={24} color="#3474c0" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            If you have any questions about this Privacy Policy or our privacy
            practices, please contact us:
          </p>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                <p className="text-gray-600">privacy@shopssentials.com</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Phone</h4>
                <p className="text-gray-600">+233 24 123 4567</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Address</h4>
                <p className="text-gray-600">
                  123 Market Street
                  <br />
                  Accra, Ghana
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Response Time
                </h4>
                <p className="text-gray-600">Within 30 days</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "updates",
      title: "Updates to This Policy",
      icon: <Calendar size={24} color="#3474c0" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            We may update this Privacy Policy from time to time to reflect
            changes in our practices or legal requirements. When we make
            material changes, we will notify you by:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Email notification to registered users</li>
            <li>Prominent notice on our website</li>
            <li>Update of the &quot;Last Updated&quot; date below</li>
          </ul>
          <p className="text-gray-600 leading-relaxed">
            Your continued use of our services after any changes indicates your
            acceptance of the updated policy.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <p className="text-blue-800 font-semibold">
              Last Updated: October 19, 2025
            </p>
          </div>
        </div>
      ),
    },
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
              <Shield size={32} color="white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and
            protect your personal information.
          </p>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Table of Contents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() =>
                    document
                      .getElementById(section.id)
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  {section.icon}
                  <span className="text-gray-700 font-medium">
                    {section.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Policy Content */}
          <div className="space-y-6">
            {sections.map((section) => (
              <div
                key={section.id}
                id={section.id}
                className="bg-white rounded-lg shadow-sm"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {section.icon}
                    <h3 className="text-xl font-semibold text-gray-900">
                      {section.title}
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform ${
                      activeSection === section.id ? "rotate-180" : ""
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
                {activeSection === section.id && (
                  <div className="px-6 pb-6">{section.content}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Questions About Your Privacy?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Our privacy team is here to help you understand and exercise your
            rights.
          </p>

          <div className="bg-gradient-to-r from-[#3474c0] to-[#4f8bd6] text-white rounded-lg p-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sms size={24} />
              <h3 className="text-2xl font-bold">Contact Our Privacy Team</h3>
            </div>
            <p className="text-blue-100 mb-6">
              For privacy-related inquiries, data requests, or concerns about
              your personal information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:privacy@shopssentials.com"
                className="bg-white text-[#3474c0] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Email Privacy Team
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#3474c0] transition-colors"
              >
                General Contact
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;
