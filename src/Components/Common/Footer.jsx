import React from "react";
import { FaTags, FaTruck, FaMoneyBillWave, FaRegCreditCard } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className=" rounded-t-1xl bg-gradient-to-b from-slate-800 to-slate-900 text-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Top: brand + 3 columns */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-teal-500/90">
                <FaTags className="text-white" />
              </span>
              <span className="text-xl font-semibold text-white">Pure Wear</span>
            </div>
            <p className="text-sm text-slate-300/80">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-3 text-lg font-semibold text-white">Categories</h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link to="/category/kids" className="text-white">Kids</Link></li>
              <li><Link to="/category/women" className="text-white">Women</Link></li>
              <li><Link to="/category/men" className="text-white">Mens</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2 text-slate-300">
              <li><a href="#" className="text-white">Login</a></li>
              <li><a href="#" className="text-white">Register</a></li>
            </ul>
          </div>

          {/* Get in Touch */}
          <div>
            <h4 className="mb-3 text-lg font-semibold text-white">Get in Touch</h4>
            <ul className="space-y-2 text-slate-300">
              <li>+91-70XXXXXXXX</li>
              <li><a href="mailto:info@example.com" className="text-white">info@example.com</a></li>
            </ul>
          </div>
        </div>

        {/* Feature bar */}
        <div className="my-10 border-t border-slate-700/60" />
        <div className="grid gap-6 pb-8 sm:grid-cols-3">
          <div className="flex items-center justify-center gap-3 text-slate-300">
            <FaTruck className="text-xl" />
            <span>Free Delivery</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-slate-300">
            <FaMoneyBillWave className="text-xl" />
            <span>Money Back Guarantee</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-slate-300">
            <FaRegCreditCard className="text-xl" />
            <span>Secure Payment</span>
          </div>
        </div>
        <div className="border-t border-slate-700/60" />

        {/* Bottom copyright */}
        <div className="py-6 text-center text-sm text-slate-400">
          © {year} All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
