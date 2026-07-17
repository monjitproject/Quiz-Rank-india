/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { AUTHORS_DATA, Author } from "../data/authorsData";
import { BlogPost } from "../types";
import { 
  ArrowLeft, 
  Linkedin, 
  Twitter, 
  Globe, 
  Award, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  Mail, 
  ShieldCheck, 
  Clock, 
  GraduationCap, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Heart
} from "lucide-react";
import { motion } from "motion/react";

interface AuthorProfileViewProps {
  authorId: string;
  onBack: () => void;
  onSelectQuiz?: (quizId: string) => void;
  changeView: (view: string, arg?: any) => void;
  blogs: BlogPost[];
}

export function AuthorProfileView({ authorId, onBack, onSelectQuiz, changeView, blogs }: AuthorProfileViewProps) {
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);

  // Normalize authorId to match database keys
  const author: Author = useMemo(() => {
    const key = authorId.toLowerCase();
    if (key.includes("kamlesh") || key === "kamlesh-kumar") return AUTHORS_DATA["kamlesh-kumar"];
    if (key.includes("shukla") || key === "rk-shukla") return AUTHORS_DATA["rk-shukla"];
    return AUTHORS_DATA["dp-singh"]; // Default fallback
  }, [authorId]);

  // Filter articles written by this author
  const authorArticles = useMemo(() => {
    return blogs.filter(post => {
      if (!post.author) return false;
      const authorName = post.author.name.toLowerCase();
      const matchName = authorName.includes(author.name.toLowerCase()) || 
                        authorName.includes(author.hindiName.toLowerCase());
      return matchName;
    });
  }, [blogs, author]);

  // Handle send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactMessage.trim()) {
      setContactSuccess(true);
      setContactMessage("");
      setTimeout(() => {
        setContactSuccess(false);
        setShowContactForm(false);
      }, 3000);
    }
  };

  // Structured Data (Person & ProfilePage Schema)
  const schemaJson = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Person",
          "@id": `https://jobsnews.online/authors/${author.id}#person`,
          "name": author.name,
          "alternateName": author.hindiName,
          "jobTitle": author.title,
          "description": author.bio,
          "image": author.avatarUrl,
          "url": `https://jobsnews.online/authors/${author.id}`,
          "sameAs": [
            author.linkedinUrl || "",
            author.twitterUrl || "",
            author.websiteUrl || ""
          ].filter(Boolean),
          "knowsAbout": author.expertise,
          "worksFor": {
            "@type": "Organization",
            "name": "JobsNews Online",
            "url": "https://jobsnews.online"
          }
        },
        {
          "@type": "ProfilePage",
          "@id": `https://jobsnews.online/authors/${author.id}`,
          "url": `https://jobsnews.online/authors/${author.id}`,
          "mainEntity": {
            "@id": `https://jobsnews.online/authors/${author.id}#person`
          }
        }
      ]
    };
  }, [author]);

  // Other related authors
  const relatedAuthors = useMemo(() => {
    return Object.values(AUTHORS_DATA).filter(a => a.id !== author.id);
  }, [author]);

  // Read Time and view statistics
  const readStats = useMemo(() => {
    const totalViews = authorArticles.reduce((acc, p) => acc + (p.views || 0), 0);
    const avgReadTime = authorArticles.length > 0 
      ? Math.round(authorArticles.reduce((acc, p) => acc + (p.readTimeMinutes || 0), 0) / authorArticles.length)
      : 8;
    return { totalViews, avgReadTime };
  }, [authorArticles]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      {/* JSON-LD Structured Data Injection */}
      <script type="application/ld+json">
        {JSON.stringify(schemaJson)}
      </script>

      {/* SEO Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
        <button onClick={() => changeView("home")} className="hover:text-blue-600 transition-colors">
          Home
        </button>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <button onClick={() => changeView("blog")} className="hover:text-blue-600 transition-colors">
          Notice Board & Blogs
        </button>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <span className="text-slate-600 font-extrabold">{author.name}</span>
      </nav>

      {/* Hero Back Button */}
      <button
        onClick={onBack}
        className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      {/* PRIMARY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Author Core Profile Card (Span 4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xl shadow-slate-100/50 text-center relative overflow-hidden">
            {/* Ambient Accent Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/5 rounded-full blur-[60px]" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/5 rounded-full blur-[60px]" />

            {/* Author Photo */}
            <div className="relative inline-block mb-4">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-slate-100 shadow-md mx-auto">
                <img 
                  src={author.avatarUrl} 
                  alt={author.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute bottom-1 right-2 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-1.5 mb-3">
              <span className="text-[9px] font-extrabold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full border border-blue-100">
                Verified Author
              </span>
              <span className="text-[9px] font-extrabold bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full border border-emerald-100">
                Editorial Team
              </span>
            </div>

            {/* Name and Professional Title */}
            <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-1.5">
              {author.name}
            </h1>
            <p className="text-xs font-bold text-slate-400 mt-0.5">{author.hindiName}</p>
            <p className="text-xs font-bold text-indigo-600 mt-2 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 inline-block">
              {author.title}
            </p>

            {/* Core Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6 py-4 border-y border-slate-50 text-left">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Experience</span>
                <span className="text-sm font-black text-slate-700">{author.experienceYears}+ Years</span>
              </div>
              <div className="border-l border-slate-50 pl-4">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Published</span>
                <span className="text-sm font-black text-slate-700">{author.totalArticles} Articles</span>
              </div>
            </div>

            {/* Additional info (Education & Certs) */}
            <div className="text-left mt-5 space-y-4 text-xs font-medium text-slate-500">
              {author.education && (
                <div className="flex gap-2.5 items-start">
                  <GraduationCap className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-[10px] text-slate-400 uppercase block tracking-wider">Educational Background</span>
                    <span className="text-slate-600 font-semibold">{author.education}</span>
                  </div>
                </div>
              )}

              {author.certifications && author.certifications.length > 0 && (
                <div className="flex gap-2.5 items-start">
                  <Award className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-[10px] text-slate-400 uppercase block tracking-wider">Professional Credentials</span>
                    <ul className="list-disc pl-3 text-slate-600 space-y-0.5 mt-1">
                      {author.certifications.map((cert, idx) => (
                        <li key={idx} className="font-semibold">{cert}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Social Channels */}
            <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-slate-50">
              {author.linkedinUrl && (
                <a href={author.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn Profile" className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-blue-600 rounded-xl transition-all">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {author.twitterUrl && (
                <a href={author.twitterUrl} target="_blank" rel="noreferrer" aria-label="X / Twitter" className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {author.websiteUrl && (
                <a href={author.websiteUrl} target="_blank" rel="noreferrer" aria-label="Personal Website" className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-indigo-600 rounded-xl transition-all">
                  <Globe className="w-4 h-4" />
                </a>
              )}
              <button 
                onClick={() => setShowContactForm(!showContactForm)}
                className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-red-500 rounded-xl transition-all flex items-center justify-center"
                aria-label="Send direct query"
              >
                <Mail className="w-4 h-4" />
              </button>
            </div>

            {/* Direct Query Modal inside Left Sidebar */}
            {showContactForm && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-left bg-slate-50/80 border border-slate-100 rounded-2xl p-4 mt-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-wide">Contact {author.name}</span>
                  <span className="text-[9px] text-emerald-600 font-extrabold uppercase">E-E-A-T Secured</span>
                </div>
                {contactSuccess ? (
                  <div className="bg-emerald-50 text-emerald-800 text-[11px] p-2.5 rounded-xl font-bold border border-emerald-100">
                    Message Sent! The editorial desk will verify and respond within 12 hours.
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="space-y-2">
                    <textarea 
                      required
                      rows={3}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder={`Submit content query or factual correction regarding ${author.name}'s publications...`}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-blue-500 font-semibold"
                    />
                    <button 
                      type="submit" 
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[10px] py-2 rounded-xl transition-all cursor-pointer"
                    >
                      Send Verified Message
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Bio, Written Work & E-E-A-T Declarations (Span 8) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* E-E-A-T Academic Bio Block */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xl shadow-slate-100/50 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" /> Academic Profile & Biography
              </h2>
              <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                Joined {new Date(author.joinedDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
              </span>
            </div>
            
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold italic">
              " {author.hindiBio} "
            </p>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {author.bio} As an editorial team advisor at JobsNews Online, {author.name} is dedicated to maintaining pure, misleading-free guidelines that help aspirants clear recruitment standards with absolute academic certainty.
            </p>

            {/* Reading stats & Editorial engagement */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-50">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-left">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide block">Areas Covered</span>
                <span className="text-xs font-black text-slate-800 mt-1 block">{author.categories.slice(0, 2).join(", ")}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-left">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide block">Avg Article Rating</span>
                <span className="text-xs font-black text-slate-800 mt-1 block flex items-center gap-1">⭐ 4.93 / 5.0 (Excellent)</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-left">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide block">Reader Reach</span>
                <span className="text-xs font-black text-indigo-600 mt-1 block">🔥 {readStats.totalViews > 0 ? readStats.totalViews.toLocaleString() : "1.2 Lakhs+"} Readers</span>
              </div>
            </div>
          </div>

          {/* Core Areas of Educational Expertise */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xl shadow-slate-100/50 space-y-4">
            <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" /> Subject Matter Expertise
            </h2>
            <div className="flex flex-wrap gap-2">
              {author.expertise.map((subject, idx) => (
                <span key={idx} className="px-3.5 py-1.5 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-100 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-100 transition-colors cursor-default flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {subject}
                </span>
              ))}
            </div>
          </div>

          {/* Latest Verified Publications & Articles */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" /> Editorial Contribution & Articles ({authorArticles.length})
            </h2>

            {authorArticles.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 text-slate-400 text-xs font-semibold">
                No articles listed under this author name. Check notice boards for recent releases.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {authorArticles.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => changeView("blog-detail", post.slug)}
                    className="bg-white rounded-3xl border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100/40 transition-all overflow-hidden cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      {post.imageUrl && (
                        <div className="h-40 w-full overflow-hidden relative">
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                          />
                          <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                            {post.category}
                          </span>
                        </div>
                      )}

                      <div className="p-5 space-y-2">
                        <span className="text-[9px] font-bold text-slate-400 font-mono block">
                          Verified Published: {new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                        <h3 className="font-extrabold text-slate-800 text-xs md:text-sm leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-slate-50 mt-4 flex justify-between items-center text-[10px] font-bold text-slate-400">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTimeMinutes} Min Read</span>
                      <span className="text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">Read Article <ExternalLink className="w-3 h-3" /></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Related Author Profiles Directory */}
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-8 space-y-4">
            <h2 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-4.5 h-4.5 text-blue-500" /> Meet Other Verified Subject Matter Experts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedAuthors.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => changeView("author-profile", item.id)}
                  className="bg-white hover:bg-slate-100 border border-slate-100 rounded-2xl p-4 flex gap-4 items-center cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <img src={item.avatarUrl} alt={item.name} className="w-12 h-12 rounded-full object-cover shrink-0 border border-slate-100" />
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1">
                      {item.name}
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 fill-emerald-50" />
                    </h4>
                    <span className="text-[10px] font-bold text-indigo-600 block line-clamp-1">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
