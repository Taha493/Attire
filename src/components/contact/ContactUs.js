/* eslint-disable jsx-a11y/anchor-is-valid */
// src/components/contact/ContactUs.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { toast } from "react-hot-toast";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // This would be a real API call in production
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      // const data = await response.json();

      toast.success("Message sent successfully! We'll get back to you soon.");

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-sm mb-6">
          <Link to="/" className="text-gray-500 hover:text-black">
            Home
          </Link>
          <ChevronRight size={14} className="mx-2 text-gray-400" />
          <span className="font-medium">Contact Us</span>
        </div>

        <h1 className="font-plak text-3xl sm:text-4xl font-bold mb-8 text-center">
          GET IN TOUCH
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Form */}
          <div className="bg-gray-50 rounded-lg p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium mb-1"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-full font-medium flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} className="mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-bold mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 flex">
                <div className="bg-black rounded-full p-3 text-white mr-4">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="font-medium">Our Location</h3>
                  <p className="text-gray-600 mt-1">
                    123 Fashion Street, New York, NY 10001, United States
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 flex">
                <div className="bg-black rounded-full p-3 text-white mr-4">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="font-medium">Phone Number</h3>
                  <p className="text-gray-600 mt-1">+1 (555) 123-4567</p>
                  <p className="text-gray-600">+1 (555) 765-4321 (Support)</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 flex">
                <div className="bg-black rounded-full p-3 text-white mr-4">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="font-medium">Email Address</h3>
                  <p className="text-gray-600 mt-1">info@attire.com</p>
                  <p className="text-gray-600">support@attire.com</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 flex">
                <div className="bg-black rounded-full p-3 text-white mr-4">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="font-medium">Working Hours</h3>
                  <p className="text-gray-600 mt-1">
                    Monday - Friday: 9:00 AM - 6:00 PM
                  </p>
                  <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                  <p className="text-gray-600">Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-8">
              <h3 className="font-medium mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-white p-2 rounded-full border border-gray-300 flex items-center justify-center w-10 h-10 hover:bg-gray-50 transition-colors"
                  aria-label="Facebook"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                  >
                    <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-white p-2 rounded-full border border-gray-300 flex items-center justify-center w-10 h-10 hover:bg-gray-50 transition-colors"
                  aria-label="Twitter"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                  >
                    <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-white p-2 rounded-full border border-gray-300 flex items-center justify-center w-10 h-10 hover:bg-gray-50 transition-colors"
                  aria-label="Instagram"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-white p-2 rounded-full border border-gray-300 flex items-center justify-center w-10 h-10 hover:bg-gray-50 transition-colors"
                  aria-label="Pinterest"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                  >
                    <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="bg-gray-100 rounded-lg overflow-hidden h-64 sm:h-96 mb-12">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-73.9922293!3d40.741490799999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b30d7105%3A0x2a2d39d9983fa9ac!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1650562830045!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Store Location"
          ></iframe>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="font-plak text-2xl sm:text-3xl font-bold mb-8 text-center">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-medium text-lg mb-2">
                What are your shipping options?
              </h3>
              <p className="text-gray-600">
                We offer standard shipping (5-7 business days), express shipping
                (2-3 business days), and overnight shipping options. Shipping
                costs vary based on location and selected method.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-medium text-lg mb-2">
                How can I return an item?
              </h3>
              <p className="text-gray-600">
                Returns are accepted within 30 days of purchase. Items must be
                unworn, unwashed, and with original tags attached. You can
                initiate a return through your account dashboard or by
                contacting our customer service team.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-medium text-lg mb-2">
                Do you offer international shipping?
              </h3>
              <p className="text-gray-600">
                Yes, we ship to over 50 countries worldwide. International
                shipping typically takes 7-14 business days, depending on the
                destination. Please note that additional customs fees may apply.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-medium text-lg mb-2">
                How can I track my order?
              </h3>
              <p className="text-gray-600">
                Once your order ships, you'll receive a confirmation email with
                tracking information. You can also view order status and
                tracking details in your account dashboard under "Order
                History."
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-gray-900 text-white rounded-lg p-8 text-center">
          <h2 className="font-plak text-2xl sm:text-3xl font-bold mb-2">
            JOIN OUR NEWSLETTER
          </h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive updates on new arrivals,
            special offers, and exclusive promotions.
          </p>
          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-l-full text-black focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-black px-6 py-3 rounded-r-full hover:bg-gray-800 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
