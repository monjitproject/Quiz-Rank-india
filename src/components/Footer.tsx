/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Globe, 
  HelpCircle, 
  Send, 
  Award, 
  FileText, 
  Sparkles, 
  ArrowRight,
  GraduationCap,
  Info
} from "lucide-react";
import { motion } from "motion/react";

interface FooterProps {
  onNavigateStatic: (pageId: string) => void;
}

export function Footer({ onNavigateStatic }: FooterProps) {
  // Scroll Entrance Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // easeOutQuint
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  // Badge animation variants
  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12
      }
    }
  };

  // Card Animation Constants for hover states
  const cardHoverStyle = {
    y: -8,
    boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25), 0 0 20px 2px rgba(99, 102, 241, 0.15)",
    borderColor: "rgba(99, 102, 241, 0.4)",
    backgroundColor: "rgba(15, 23, 42, 0.6)"
  };

  // Navigation Items
  const navItems = [
    {
      id: "about",
      label: "About Us",
      description: "Our Vision & Mission",
      icon: Award,
      bgColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      hoverBg: "from-blue-600/20 to-indigo-600/10",
      aria: "Learn more About Us"
    },
    {
      id: "contact",
      label: "Contact Us",
      description: "Get in Touch 24/7",
      icon: Send,
      bgColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      hoverBg: "from-emerald-600/20 to-teal-600/10",
      aria: "Contact Support and Queries"
    },
    {
      id: "privacy",
      label: "Privacy Policy",
      description: "Data Security Guards",
      icon: ShieldCheck,
      bgColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      hoverBg: "from-purple-600/20 to-indigo-600/10",
      aria: "View our Privacy Policy"
    },
    {
      id: "disclaimer",
      label: "Disclaimer",
      description: "Official Source Guide",
      icon: FileText,
      bgColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      hoverBg: "from-amber-600/20 to-orange-600/10",
      aria: "View Site Disclaimer"
    },
    {
      id: "terms",
      label: "Terms & Conditions",
      description: "User Agreement Rules",
      icon: CheckCircle2,
      bgColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      hoverBg: "from-rose-600/20 to-pink-600/10",
      aria: "View Terms and Conditions"
    }
  ];

  return (
    <footer id="premium-applet-footer" className="w-full mt-24 relative overflow-hidden bg-slate-950 font-sans pb-16">
      {/* Mesh Glowing Ambient Gradients (SaaS visual design) */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Primary Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Redesigned Centered Card Footer */}
        <motion.div
          id="centered-footer-card"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/80 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-12 md:p-16 shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative overflow-hidden"
        >
          {/* Card Border Soft Highlight */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-slate-700/40 to-transparent pointer-events-none" />

          {/* ==========================================
              SECTION 1: Animated Logo & Website Branding
              ========================================== */}
          <motion.div variants={childVariants} className="flex flex-col items-center justify-center text-center space-y-4">
            {/* Logo Wrapper (Floating Animation) */}
            <motion.div
              id="footer-floating-logo"
              animate={{ y: [0, -6, 0] }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut"
              }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-indigo-500/10 border border-indigo-500/30 hover:scale-105 transition-transform duration-300"
            >
              JN
            </motion.div>

            {/* Title & Subtitle */}
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-1.5">
                JobsNews <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Online</span>
              </h2>
              
              {/* Subtitle with shimmer effect */}
              <div className="inline-block relative">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] bg-gradient-to-r from-blue-400 via-indigo-200 to-purple-400 bg-clip-text text-transparent animate-pulse">
                  Trusted Educational Hub
                </span>
              </div>
            </div>
          </motion.div>

          {/* ==========================================
              SECTION 2: Centered Educational Description
              ========================================== */}
          <motion.div variants={childVariants} className="max-w-2xl mx-auto text-center mt-6">
            <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed font-medium">
              JobsNews Online is a trusted educational platform helping students prepare for Government Jobs, Competitive Exams, Current Affairs, GK, Mock Tests, Study Material and Career Guidance. Our dedicated faculty crafts each quiz to perfectly align with current examination standards.
            </p>
          </motion.div>

          {/* ==========================================
              SECTION 3: Animated Divider (Expanding)
              ========================================== */}
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="w-full max-w-3xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent my-10 origin-center"
          />

          {/* ==========================================
              SECTION 4: Premium Navigation Cards
              ========================================== */}
          <motion.div variants={childVariants} className="w-full max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => onNavigateStatic(item.id)}
                    aria-label={item.aria}
                    whileHover={cardHoverStyle}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="group flex flex-col items-center p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  >
                    {/* Icon Container with Pastel Soft Background */}
                    <motion.div
                      whileHover={{ 
                        scale: 1.08, 
                        rotate: 6,
                        boxShadow: "0 0 15px rgba(59, 130, 246, 0.4)"
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className={`w-10 h-10 rounded-xl ${item.bgColor} border flex items-center justify-center mb-3 transition-colors`}
                    >
                      <IconComponent className="w-5 h-5 transition-all group-hover:stroke-[2.5]" />
                    </motion.div>

                    {/* Navigation Link Label with Underline and Letter Spacing Animation */}
                    <span className="font-bold text-slate-200 text-xs sm:text-sm tracking-tight relative pb-0.5 group-hover:text-white transition-all duration-300 group-hover:tracking-wide">
                      {item.label}
                      <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-blue-500 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1 font-medium group-hover:text-slate-400 transition-colors">
                      {item.description}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>



          {/* ==========================================
              SECTION 5: E-E-A-T Compliance & Policy Links
              ========================================== */}
          <motion.div 
            variants={childVariants} 
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-slate-800/80 pt-8 mt-10 text-xs font-bold text-slate-400"
          >
            <button onClick={() => onNavigateStatic("editorial")} className="hover:text-blue-400 transition-colors cursor-pointer">Editorial Policy</button>
            <span className="text-slate-800 hidden sm:inline">•</span>
            <button onClick={() => onNavigateStatic("fact-check")} className="hover:text-blue-400 transition-colors cursor-pointer">Fact-Checking Policy</button>
            <span className="text-slate-800 hidden sm:inline">•</span>
            <button onClick={() => onNavigateStatic("corrections")} className="hover:text-blue-400 transition-colors cursor-pointer">Corrections Policy</button>
            <span className="text-slate-800 hidden sm:inline">•</span>
            <button onClick={() => onNavigateStatic("dmca")} className="hover:text-blue-400 transition-colors cursor-pointer">DMCA Compliance</button>
            <span className="text-slate-800 hidden sm:inline">•</span>
            <button onClick={() => onNavigateStatic("cookie")} className="hover:text-blue-400 transition-colors cursor-pointer">Cookie Preferences</button>
          </motion.div>

          {/* ==========================================
              SECTION 6: Copyright & Independent Badges
              ========================================= */}
          <motion.div variants={childVariants} className="w-full pt-6 space-y-6">
            {/* Final Legal Footprint */}
            <div className="space-y-1 text-center">
              <p className="text-[11px] text-slate-500 font-bold tracking-wider uppercase">
                © 2026 JobsNews Online. All Rights Reserved.
              </p>
              <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wide">
                Built with Honor for Future Officers
              </p>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </footer>
  );
}
