/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import Visa from "./assests/visa.png";
import MasterCard from "./assests/mastercard.png";
import PayPal from "./assests/paypal.png";
import ApplePay from "./assests/applepay.png";
import GooglePay from "./assests/googlepay.png";
import { ChevronDown, ChevronUp } from "lucide-react";

const Footer = () => {
  // For mobile accordion functionality
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Footer sections
  const sections = [
    {
      id: "company",
      title: "COMPANY",
      links: [
        { label: "About", url: "#" },
        { label: "Features", url: "#" },
        { label: "Works", url: "#" },
        { label: "Career", url: "#" },
      ],
    },
    {
      id: "help",
      title: "HELP",
      links: [
        { label: "Customer Support", url: "#" },
        { label: "Delivery Details", url: "#" },
        { label: "Terms & Conditions", url: "#" },
        { label: "Privacy Policy", url: "#" },
      ],
    },
    {
      id: "faq",
      title: "FAQ",
      links: [
        { label: "Account", url: "#" },
        { label: "Manage Deliveries", url: "#" },
        { label: "Orders", url: "#" },
        { label: "Payments", url: "#" },
      ],
    },
    {
      id: "resources",
      title: "RESOURCES",
      links: [
        { label: "Free eBooks", url: "#" },
        { label: "Development Tutorial", url: "#" },
        { label: "How to - Blog", url: "#" },
        { label: "Youtube Playlist", url: "#" },
      ],
    },
  ];

  // Social media icons
  const socialIcons = [
    {
      id: "twitter",
      path: "M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z",
    },
    {
      id: "facebook",
      path: "M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.53 17.5 2.04 12 2.04Z",
    },
    {
      id: "instagram",
      path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    },
    {
      id: "github",
      path: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z",
    },
  ];

  // Payment icons
  const paymentIcons = [
    { id: "visa", src: Visa, alt: "Visa" },
    { id: "mastercard", src: MasterCard, alt: "Mastercard" },
    { id: "paypal", src: PayPal, alt: "PayPal" },
    { id: "applepay", src: ApplePay, alt: "ApplePay" },
    { id: "googlepay", src: GooglePay, alt: "GooglePay" },
  ];

  return (
    <footer className="bg-gray-100 py-8 sm:py-10 px-4 sm:px-6 md:px-8 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 lg:col-span-1">
            <h2 className="font-plak text-2xl sm:text-3xl font-bold mb-4">
              ATTIRE
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              We have clothes that suits your style and which you're proud to
              wear. From women to men.
            </p>
            <div className="flex space-x-4">
              {socialIcons.map((icon) => (
                <a
                  key={icon.id}
                  href="#"
                  className="bg-white p-2 rounded-full border border-gray-300 flex items-center justify-center w-8 h-8 hover:bg-gray-50 transition-colors"
                  aria-label={icon.id}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill="currentColor"
                  >
                    <path d={icon.path}></path>
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Mobile Accordion for Footer Links */}
          <div className="col-span-1 sm:hidden space-y-4">
            {sections.map((section) => (
              <div key={section.id} className="border-b pb-2">
                <button
                  className="flex justify-between items-center w-full py-2"
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={expandedSection === section.id}
                >
                  <h3 className="text-md font-medium">{section.title}</h3>
                  {expandedSection === section.id ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
                {expandedSection === section.id && (
                  <ul className="space-y-2 py-2">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.url}
                          className="text-gray-500 hover:text-gray-800 text-sm"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Footer Links */}
          {sections.map((section) => (
            <div key={section.id} className="hidden sm:block col-span-1">
              <h3 className="text-lg font-medium mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.url}
                      className="text-gray-500 hover:text-gray-800 text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-200 mt-8 sm:mt-10 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-xs sm:text-sm mb-4 md:mb-0">
            ATTIRE © 2025. All Rights Reserved
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {paymentIcons.map((icon) => (
              <img
                key={icon.id}
                src={icon.src}
                alt={icon.alt}
                className="h-5 sm:h-6"
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
