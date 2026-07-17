/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, Calendar, User, Clock, CheckCircle2, ShieldCheck, 
  HelpCircle, ChevronDown, ChevronUp, BookOpen, Star, 
  ExternalLink, Award, Sparkles, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Category, Quiz } from "../types";
import { getEditorialCategory, EditorialCategoryData } from "../data/categoryEditorialData";
import { MockTestExplorer } from "./MockTestExplorer";

interface CategoryPublisherPageProps {
  category: string;
  categories: Category[];
  onSelectCategory: (catId: string | null) => void;
  onSelectQuiz: (quizId: string) => void;
  quizzes: Quiz[];
  blogs: any[];
  changeView: (view: string, arg?: any) => void;
}

export function CategoryPublisherPage({
  category,
  categories,
  onSelectCategory,
  onSelectQuiz,
  quizzes,
  blogs,
  changeView
}: CategoryPublisherPageProps) {
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);
  const editorial: EditorialCategoryData = getEditorialCategory(category);
  const matchedCategoryObj = categories.find(c => c.id === category);

  // Scroll to top on category change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setExpandedFaqIndex(null);
  }, [category]);

  // Dynamic SEO and Structured Data injection
  useEffect(() => {
    if (!editorial) return;

    // 1. Title & Meta Description
    document.title = editorial.seoTitle;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", editorial.metaDescription);

    // 2. Canonical Link
    const canonicalUrl = `https://jobsnews.online/category/${category}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    // 3. Open Graph Tags
    const ogTags = {
      "og:title": editorial.seoTitle,
      "og:description": editorial.metaDescription,
      "og:url": canonicalUrl,
      "og:type": "website",
      "og:site_name": "JobsNews Online",
      "og:image": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600"
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });

    // 4. Twitter Card Tags
    const twitterTags = {
      "twitter:card": "summary_large_image",
      "twitter:title": editorial.seoTitle,
      "twitter:description": editorial.metaDescription,
      "twitter:image": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600"
    };

    Object.entries(twitterTags).forEach(([name, content]) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });

    // 5. Schema JSON-LD Injection
    const schemaId = "category-structured-data";
    let schemaScript = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (!schemaScript) {
      schemaScript = document.createElement("script");
      schemaScript.id = schemaId;
      schemaScript.type = "application/ld+json";
      document.head.appendChild(schemaScript);
    }

    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "JobsNews Online",
      "url": "https://jobsnews.online",
      "logo": "https://jobsnews.online/logo.png",
      "sameAs": []
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://jobsnews.online"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": matchedCategoryObj?.name || editorial.name,
          "item": canonicalUrl
        }
      ]
    };

    const webpageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      "url": canonicalUrl,
      "name": editorial.seoTitle,
      "description": editorial.metaDescription,
      "publisher": { "@id": "https://jobsnews.online/#organization" },
      "inLanguage": "en-US"
    };

    const collectionSchema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${canonicalUrl}#collection`,
      "url": canonicalUrl,
      "name": `${editorial.name} Preparation Portal`,
      "description": editorial.metaDescription,
      "publisher": { "@id": "https://jobsnews.online/#organization" }
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": editorial.faqs.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    };

    // Bundle all schemas together
    schemaScript.textContent = JSON.stringify([
      organizationSchema,
      breadcrumbSchema,
      webpageSchema,
      collectionSchema,
      faqSchema
    ]);

    // Cleanup on unmount
    return () => {
      schemaScript?.remove();
    };
  }, [category, editorial]);

  const toggleFaq = (index: number) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };

  return (
    <div className="bg-slate-50/50 min-h-screen">
      {/* 1. HERO BANNER & BREADCRUMB */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 md:py-20 space-y-6">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
            <button 
              onClick={() => onSelectCategory(null)}
              className="hover:text-white hover:underline transition-all cursor-pointer"
            >
              Home
            </button>
            <span className="text-slate-600">/</span>
            <span className="text-indigo-400 capitalize">Categories</span>
            <span className="text-slate-600">/</span>
            <span className="text-white font-bold">{matchedCategoryObj?.name || editorial.name}</span>
          </nav>

          {/* Title H1 */}
          <div className="space-y-4 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-[10px] font-extrabold uppercase tracking-widest animate-pulse">
              <Sparkles className="w-3.5 h-3.5" /> Premium Publisher Portal
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
              {editorial.seoTitle}
            </h1>
            
            <p className="text-slate-300 text-sm md:text-base leading-relaxed font-medium">
              {editorial.metaDescription}
            </p>
          </div>

          {/* E-E-A-T AUTHOR & TIMESTAMP BAR */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-6 border-t border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center gap-3 bg-slate-900/40 p-2.5 pr-4 rounded-2xl border border-slate-800">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white text-sm border-2 border-indigo-400">
                {editorial.authorName.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <span className="block text-white font-bold text-xs">{editorial.authorName}</span>
                <span className="block text-slate-500 text-[10px]">{editorial.authorRole}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px]">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Last Updated: <strong className="text-slate-200">{editorial.lastUpdated}</strong></span>
            </div>

            <div className="flex items-center gap-2 text-emerald-400 font-bold bg-emerald-500/5 border border-emerald-500/10 px-3 py-1.5 rounded-xl">
              <ShieldCheck className="w-4.5 h-4.5" />
              <span>Editorial Integrity Verified</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-blue-400 font-bold bg-blue-500/5 border border-blue-500/10 px-3 py-1.5 rounded-xl">
              <Award className="w-4.5 h-4.5" />
              <span>Helpful Content Compliant</span>
            </div>
          </div>

        </div>
      </div>

      {/* CORE CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: PRIMARY ARTICLES */}
        <div className="lg:col-span-8 space-y-12">

          {/* 1. CATEGORY INTRODUCTION */}
          <section className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 space-y-4 shadow-sm hover:shadow-md transition-all">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans border-b border-slate-100 pb-3 flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 text-indigo-600" /> Comprehensive Introduction & Learning Scope
            </h2>
            <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-4 font-medium whitespace-pre-line">
              {editorial.introduction}
            </div>
          </section>

          {/* 2. WHY THIS CATEGORY MATTERS */}
          <section className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 space-y-4 shadow-sm hover:shadow-md transition-all">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans border-b border-slate-100 pb-3 flex items-center gap-2.5">
              <Award className="w-6 h-6 text-blue-600" /> Exam Weightage & Strategic Value
            </h2>
            <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-4 font-medium whitespace-pre-line">
              {editorial.whyMatters}
            </div>
          </section>

          {/* 3. COMPLETE PREPARATION GUIDE */}
          <section className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 space-y-4 shadow-sm hover:shadow-md transition-all">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans border-b border-slate-100 pb-3 flex items-center gap-2.5">
              <Clock className="w-6 h-6 text-emerald-600" /> Step-by-Step Study Guide & Preparation Protocol
            </h2>
            <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-4 font-medium whitespace-pre-line">
              {editorial.prepGuide}
            </div>
          </section>

          {/* 4 & 5. FEATURED RESOURCES & EXISTING CARDS COMPONENT */}
          <section id="category-practice-grid" className="scroll-mt-24 space-y-6">
            <div className="bg-indigo-600 text-white rounded-3xl p-6 sm:p-8 space-y-3 shadow-xl shadow-indigo-600/5">
              <span className="text-[10px] font-extrabold uppercase bg-white/10 px-3 py-1 rounded-full text-indigo-200 tracking-wider">
                Section 4: Practice Modules
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Featured Resources & Mock Test Series
              </h2>
              <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed font-medium">
                {editorial.featuredResourcesIntro}
              </p>
            </div>

            {/* Existing Cards Section: Maintain completely unchanged UI/Features */}
            <div className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-6 shadow-sm">
              <MockTestExplorer
                categories={categories}
                selectedCategory={category}
                onSelectCategory={onSelectCategory}
                onSelectQuiz={onSelectQuiz}
                quizzes={quizzes}
              />
            </div>
          </section>

          {/* 6. LEARNING TIPS */}
          <section className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 space-y-4 shadow-sm hover:shadow-md transition-all">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans border-b border-slate-100 pb-3 flex items-center gap-2.5">
              <CheckCircle2 className="w-6 h-6 text-teal-600" /> Expert Tips for Perfect Score & High Percentile
            </h2>
            <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-4 font-medium whitespace-pre-line">
              {editorial.learningTips}
            </div>
          </section>

          {/* 7. FREQUENTLY ASKED QUESTIONS */}
          <section className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-md transition-all">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
                Frequently Asked Questions (FAQ)
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Authoritative answers to the most common queries regarding {matchedCategoryObj?.name || editorial.name} exams.
              </p>
            </div>

            <div className="space-y-3">
              {editorial.faqs.map((faq, index) => {
                const isExpanded = expandedFaqIndex === index;
                return (
                  <div 
                    key={index} 
                    className="border border-slate-100 rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full text-left p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors flex justify-between items-center gap-4 cursor-pointer"
                    >
                      <span className="font-extrabold text-slate-800 text-xs sm:text-sm flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" /> {faq.q}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4.5 h-4.5 text-slate-400 shrink-0" /> : <ChevronDown className="w-4.5 h-4.5 text-slate-400 shrink-0" />}
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="p-4 border-t border-slate-50 text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AUTHOR BIO CARD */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-2">
              Meet Your Instructor
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-white text-base">
                  {editorial.authorName.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{editorial.authorName}</h4>
                  <span className="text-[11px] text-indigo-600 font-semibold block">{editorial.authorRole}</span>
                </div>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">
                {editorial.authorBio}
              </p>
            </div>
          </div>

          {/* 8. RELATED CATEGORIES */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-2">
              Recommended Categories
            </h3>
            <div className="space-y-2">
              {editorial.relatedCategories.map((rel, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const cleanPath = rel.path.replace("/category/", "");
                    onSelectCategory(cleanPath);
                  }}
                  className="w-full text-left p-3 rounded-xl border border-slate-50 hover:border-slate-200 hover:bg-slate-50/50 transition-all font-semibold text-xs text-slate-700 flex items-center justify-between group cursor-pointer"
                >
                  <span className="group-hover:text-indigo-600 transition-colors">{rel.name}</span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              ))}
            </div>
          </div>

          {/* 9. EDITORIAL NOTE */}
          <div className="bg-gradient-to-b from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-lg space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <h3 className="text-xs font-black uppercase tracking-wider">
                Editorial & Fact-Check Note
              </h3>
            </div>
            
            <div className="text-slate-400 text-[11px] leading-relaxed space-y-3 font-medium">
              <p>
                JobsNews Online operates as a premium educational publisher and curriculum resource developer. Every practice mock, article, and reference syllabus is compiled by experienced educational strategists and verified against official board notifications.
              </p>
              <p>
                Our materials are formulated exclusively for practice, review, and exam simulation. For official registration, application submissions, and board decisions, always consult:
              </p>
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                {editorial.officialReferences.map((ref, idx) => (
                  <span key={idx} className="block text-[10px] text-indigo-300 font-bold hover:underline truncate">
                    {ref}
                  </span>
                ))}
              </div>
              <p className="text-[9px] text-slate-500 pt-2 italic">
                Our materials are updated in real-time as soon as new official notifications are published.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
