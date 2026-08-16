import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#050505] pt-20 pb-8 border-t border-[var(--color-border-subtle)] relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12" data-aos="fade-up">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <a href="#home" className="text-3xl font-bold text-white tracking-tight mb-6 inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              Abdullah<span className="text-emerald-500">.</span>
            </a>
            <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed max-w-sm">
              Crafting high-performance digital experiences. Open for freelance opportunities and exciting projects.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3">
            <h4 className="text-white font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'About', 'Projects', 'Skills', 'Contact'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="text-[var(--color-text-secondary)] hover:text-emerald-500 transition-colors inline-flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Column */}
          <div className="md:col-span-4">
            <h4 className="text-white font-semibold text-lg mb-6">Connect</h4>
            <ul className="space-y-4 mb-8">
              <li>
                <a href="mailto:spmalakabdullah123@gmail.com" className="text-[var(--color-text-secondary)] hover:text-emerald-500 transition-colors">
                  spmalakabdullah123@gmail.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/923465267473" className="text-[var(--color-text-secondary)] hover:text-emerald-500 transition-colors">
                  +92 346 5267473
                </a>
              </li>
            </ul>
            <div className="flex flex-wrap gap-3">
              {['GitHub', 'LinkedIn', 'Twitter'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="px-5 py-2 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all text-sm font-medium shadow-sm"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>


        {/* Copyright */}
        <div className="w-full pt-8 border-t border-[var(--color-border-subtle)] flex flex-col md:flex-row justify-between items-center gap-4 text-[var(--color-text-secondary)] text-sm">
          <p>&copy; {new Date().getFullYear()} Abdullah. All rights reserved.</p>
          <div className="flex gap-4 items-center">
            <Link to="/admin" className="hover:text-emerald-500 transition-colors font-medium">Admin Panel</Link>
            <span className="opacity-30">|</span>
            <p>Designed with <span className="text-emerald-500">&hearts;</span> & React</p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
