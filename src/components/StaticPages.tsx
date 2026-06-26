/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Mail, Phone, MapPin, ShieldAlert, FileText, CheckCircle2 } from "lucide-react";

interface StaticPageProps {
  pageId: string;
  onBack: () => void;
}

export function StaticPages({ pageId, onBack }: StaticPageProps) {
  const renderContent = () => {
    switch (pageId) {
      case "about":
        return (
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6 font-sans">About QuizRank India</h1>
            <p className="text-slate-600 leading-relaxed mb-4">
              <strong>QuizRank India</strong> is the country's premium online mock exam portal and daily competitive exam quiz companion. Our platform serves over 2.5 million aspiring civil servants, railway engineers, bankers, and state staff recruits by providing highly realistic, syllabus-aligned subject assessments and full-length exam series.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Our core vision is to democratize high-yield test preparation. Built by a senior council of former state examiners, subject specialists, and AI researchers, QuizRank India combines rigorous academic design with responsive gamified technology. Aspirants can test their vocabulary in English, participate in full-script Hindi grammar tests, and get instant, detailed, step-by-step explanations for every solution.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <h3 className="font-semibold text-slate-800 text-lg mb-2">98.5% Satisfaction</h3>
                <p className="text-slate-500 text-sm">Verified satisfaction rate amongst central tier-1 and state board selected aspirants.</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <h3 className="font-semibold text-slate-800 text-lg mb-2">Instant Explanations</h3>
                <p className="text-slate-500 text-sm">Every single mock question is backed by a professional, step-by-step teaching blueprint.</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <h3 className="font-semibold text-slate-800 text-lg mb-2">Gemini AI Engine</h3>
                <p className="text-slate-500 text-sm">Our system automatically tracks latest official syllabi and updates model questions instantly.</p>
              </div>
            </div>
          </div>
        );
      case "contact":
        return (
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6 font-sans">Contact & Help Center</h1>
            <p className="text-slate-600 leading-relaxed mb-8">
              Have questions about exam eligibility, result analytics, or custom mock papers? Get in touch with our Support team. We respond to all queries within 24 working hours.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Email Correspondence</h3>
                    <p className="text-slate-500 text-sm">support@quizrankindia.in</p>
                    <p className="text-slate-400 text-xs mt-1">Send us ticket queries or feedback anytime.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Phone Support</h3>
                    <p className="text-slate-500 text-sm">+91 9876543210</p>
                    <p className="text-slate-400 text-xs mt-1">Available Monday to Saturday (9:00 AM - 6:00 PM IST)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Corporate Headquarters</h3>
                    <p className="text-slate-500 text-sm">Connaught Place, Block-G, Ground Floor, New Delhi, India - 110001</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-4 text-lg">Send Instant Message</h3>
                <form onSubmit={(e) => { e.preventDefault(); alert("Message received! We will get back to you shortly."); }} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">YOUR NAME</label>
                    <input required type="text" placeholder="e.g. Amit Singh" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">EMAIL ADDRESS</label>
                    <input required type="email" placeholder="amit@gmail.com" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">MESSAGE</label>
                    <textarea required rows={3} placeholder="Write your message here..." className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl text-sm transition-colors cursor-pointer shadow-sm">
                    Submit Query
                  </button>
                </form>
              </div>
            </div>
          </div>
        );
      case "privacy":
        return (
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6 font-sans">Privacy Policy</h1>
            <p className="text-slate-500 text-xs mb-6">Last Updated: June 25, 2026</p>
            <p className="text-slate-600 leading-relaxed mb-4">
              At QuizRank India, we prioritize the privacy and security of our online users and test aspirants. This policy outlines how we gather, protect, and handle data when you utilize our exam preparations, mock tests, and AI auto quiz generator modules.
            </p>
            <h3 className="font-bold text-slate-800 text-lg mt-6 mb-2">1. Information We Collect</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              We collect user-provided details like names, emails, state selection preferences, and quiz attempt parameters to accurately compile national rank predictions, score cards, and issue certificates. No sensitive payment processing or credential data is cached on our server-side environments.
            </p>
            <h3 className="font-bold text-slate-800 text-lg mt-6 mb-2">2. How We Secure Your Data</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Your registered scores and bookmarks are stored in restricted-access JSON structures on secured sandbox containers. We restrict direct browser access to API keys (such as the Gemini API) by proxying all generation pipelines strictly through our backend Express routes.
            </p>
            <h3 className="font-bold text-slate-800 text-lg mt-6 mb-2">3. Cookies & Ads</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              We participate in the Google Adsense program and third-party advertising exchanges. These systems use standard browser cookies to serve contextually relevant mock preparation banners. You can clear or toggle your cookie preferences inside your standard browser settings.
            </p>
          </div>
        );
      case "disclaimer":
        return (
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6 font-sans">Disclaimer & Academic Integrity</h1>
            <div className="flex gap-4 items-start p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 mb-6">
              <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold">Notice of Non-Affiliation</h4>
                <p className="text-xs text-amber-700 mt-1">QuizRank India is an independent educational preparatory resource. It is NOT affiliated with, sponsored by, or endorsed by the Union Public Service Commission (UPSC), Staff Selection Commission (SSC), Railway Recruitment Boards (RRB), or any state/central government recruitment department.</p>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed mb-4">
              All question papers, mock keys, syllabus guides, and estimated cutoffs are drafted purely for teaching and diagnostic examination purposes. While our senior developers and AI models make absolute efforts to match the official exam guidelines, we do not guarantee the occurrence of identical questions in actual examination papers.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Government vacancies and notifications change frequently. Aspirants are advised to regularly double-check information on the official portals (e.g. ssc.gov.in, upsc.gov.in) before acting on schedule expectations or form submission deadlines.
            </p>
          </div>
        );
      case "terms":
        return (
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6 font-sans">Terms & Conditions</h1>
            <p className="text-slate-600 leading-relaxed mb-4">
              Welcome to QuizRank India. By logging into our portal, solving quizzes, viewing blog notifications, and subscribing to our automated email updates, you agree to comply with our Terms of Use.
            </p>
            <h3 className="font-bold text-slate-800 text-lg mt-6 mb-2">1. Intellectual Property</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              All visual assets, question structures, custom explanations, and the automated quiz generation framework are the exclusive property of QuizRank India. Reselling, unauthorized scraping, or commercial broadcasting of our quiz libraries is strictly prohibited under Indian Copywrite Acts.
            </p>
            <h3 className="font-bold text-slate-800 text-lg mt-6 mb-2">2. Code of Conduct</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Aspirants are welcome to bookmark, download simulated PDFs, and share scoreboards with peers. Any attempts to manipulate the leaderboards via automated network scripts, cheat sheets, or injection scripts will result in immediate bans from national rankings.
            </p>
          </div>
        );
      case "dmca":
        return (
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6 font-sans">DMCA Policy</h1>
            <p className="text-slate-600 leading-relaxed mb-4">
              QuizRank India respects the intellectual property rights of educators, publishers, and textbook content writers. If you identify any study materials, mock questions, or diagrammatic explanations on our platform that infringe upon copyright laws, please send a structured DMCA takedown notice.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Your takedown report must include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 text-sm mb-6">
              <li>A physical or digital signature of the copyright owner or authorized representative.</li>
              <li>Precise URLs on QuizRank India where the copyrighted questions reside.</li>
              <li>Sufficient proof of copyright holding (original publisher records or ISBN numbers).</li>
              <li>Your contact info (name, official email address, and mailing address).</li>
            </ul>
            <p className="text-slate-600">Please route your complaints to: <strong>dmca@quizrankindia.in</strong></p>
          </div>
        );
      case "editorial":
        return (
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6 font-sans">Editorial Policy</h1>
            <p className="text-slate-600 leading-relaxed mb-4">
              Accuracy is our absolute standard. Because a single mark can alter an aspirant's eligibility, QuizRank India follows strict editorial steps:
            </p>
            <div className="space-y-4 my-6">
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-800">Multi-Tier Review</h4>
                  <p className="text-sm text-slate-500">Every mock question and key is reviewed by both an educational AI validator and an expert subject developer.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-800">Correction Workflow</h4>
                  <p className="text-sm text-slate-500">Aspirants can flag answers in the feedback analysis. Once verified, corrections are live within 12 hours.</p>
                </div>
              </div>
            </div>
          </div>
        );
      case "fact-check":
        return (
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6 font-sans">Fact-Checking Policy</h1>
            <p className="text-slate-600 leading-relaxed mb-4">
              At QuizRank India, we are committed to maintaining the highest academic integrity. All our study materials, syllabus summaries, recruitment notifications, and exam keys are fact-checked against official announcements and government gazettes.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Our specialized Academic Verification Unit regularly cross-references mock questions with board keys from SSC, UPSC, and RRB to ensure that exam patterns, weightage, and negative marking constraints are perfectly updated and authentic.
            </p>
          </div>
        );
      case "cookie":
        return (
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6 font-sans">Cookie Policy</h1>
            <p className="text-slate-600 leading-relaxed mb-4">
              This website uses cookies to enhance user experience, save user preferences, and display personalized exam advertisements through Google AdSense.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Cookies are small data files placed on your browser. By continuing to use our Government Jobs Quiz Platform, you agree to our use of essential cookies. You may disable cookies at any time through your browser's security preferences.
            </p>
          </div>
        );
      case "faq":
        return (
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6 font-sans">Frequently Asked Questions (FAQ)</h1>
            <div className="space-y-6 mt-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="font-bold text-slate-800 text-sm">Q: Are the mock tests on QuizRank India completely free?</h4>
                <p className="text-xs text-slate-600 mt-1">A: Yes! All our general mock tests, daily current affairs quizzes, and subject-wise practice sets are 100% free for all aspirants.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="font-bold text-slate-800 text-sm">Q: Does this platform support negative marking?</h4>
                <p className="text-xs text-slate-600 mt-1">A: Yes, you can enable negative marking (0.25 points penalty) in the instructions modal before starting any live mock quiz.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="font-bold text-slate-800 text-sm">Q: How does the AI generator work?</h4>
                <p className="text-xs text-slate-600 mt-1">A: Our platform has an integrated Gemini AI engine that automatically builds new mock sets based on current exam trends when requested by moderators.</p>
              </div>
            </div>
          </div>
        );
      case "help-center":
        return (
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6 font-sans">Help Center & Support</h1>
            <p className="text-slate-600 leading-relaxed mb-4">
              Need assistance with our Government Jobs Quiz Platform? We are here to guide you. Feel free to browse through our resources or submit a support ticket.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100">
                <h3 className="font-bold text-blue-800 text-sm mb-2">Technical Support</h3>
                <p className="text-slate-600 text-xs">For interface problems, rendering bugs on mobile devices, or score reporting discrepancies, contact support@quizrankindia.in.</p>
              </div>
              <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100">
                <h3 className="font-bold text-purple-800 text-sm mb-2">Exam Content Queries</h3>
                <p className="text-slate-600 text-xs">If you notice any typo, factual error, or confusing explanation in any of our mock tests, use the 'Flag Answer' feature or email us directly.</p>
              </div>
            </div>
          </div>
        );
      default:
        return <p className="text-slate-600">Page content is being loaded...</p>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button
        onClick={onBack}
        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
      >
        &larr; Back to Home
      </button>
      <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-xl shadow-slate-100/50">
        {renderContent()}
      </div>
    </div>
  );
}
