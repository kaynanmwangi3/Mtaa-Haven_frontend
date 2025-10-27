import React from "react";
import {
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaDribbble,
  FaHome,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer-section bg-[#0e0e0e] text-white px-8 py-16">
      <div className=" mx-auto grid md:grid-cols-4 gap-10 border-t border-gray-700 pt-10">
        {/* Logo + Description */}
        <div>
          <h2 className="text-3xl font-serif mb-4 tracking-wide">MTAA HAVEN</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Be the first to know about exclusive offers, seasonal discounts, and
            expert laundry tips. Sign up today for a fresher tomorrow!
          </p>

          <div className="flex space-x-4">
            <a href="#" className="social-icon">
              <FaInstagram />
            </a>
            <a href="#" className="social-icon">
              <FaLinkedin />
            </a>
            <a href="#" className="social-icon">
              <FaTiktok />
            </a>
            <a href="#" className="social-icon">
              <FaDribbble />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-serif mb-6">QUICK LINKS</h3>
          <ul className="space-y-3">
            {["Home", "About Us", "Our Rooms", "Blogs"].map((item, i) => (
              <li key={i}>
                <a href="#" className="footer-link">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Our Service */}
        <div>
          <h3 className="text-xl font-serif mb-6">OUR SERVICE</h3>
          <ul className="space-y-3">
            {["Contact Us", "Gallery", "Hotel Amenities", "Licensing"].map(
              (item, i) => (
                <li key={i}>
                  <a href="#" className="footer-link">
                    {item}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="text-xl font-serif mb-6">CONTACT US</h3>
          <ul className="space-y-5 text-gray-300 text-sm">
            <li className="flex items-start space-x-4">
              <span className="icon-circle">
                <FaHome />
              </span>
              <p>4517 Washington Ave. Manchester, Kentucky 39495.</p>
            </li>
            <li className="flex items-center space-x-4">
              <span className="icon-circle">
                <FaPhone />
              </span>
              <p>(406) 555-0120</p>
            </li>
            <li className="flex items-center space-x-4">
              <span className="icon-circle">
                <FaEnvelope />
              </span>
              <p>support@nexoy.com</p>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
