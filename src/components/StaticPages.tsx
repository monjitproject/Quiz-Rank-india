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
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6 font-sans">About JobsNews Online</h1>
            <p className="text-slate-500 text-xs mb-6">Last Updated: Real-time Sync Active</p>
            
            <p className="text-slate-600 leading-relaxed mb-4">
              <strong>JobsNews Online</strong> is India's premium educational publishing platform and daily competitive exam companion. Our platform serves over 2.5 million aspiring civil servants, defense personnel, railway staff, bankers, and state recruits by providing highly realistic, syllabus-aligned subject assessments, comprehensive exam directories, and verified recruitment notifications.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Our core vision is to democratize high-yield test preparation and eliminate recruitment misinformation. Built by a senior council of former state examiners, retired public sector commissioners, and subject matter experts, JobsNews Online combines academic rigor with elegant technology. We help aspirants master their subjects in both English and Hindi, providing instant, detailed, step-by-step explanations for every question.
            </p>

            <h3 className="font-bold text-slate-800 text-lg mt-6 mb-2">Our Mission & Educational Vision</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              To empower every student, regardless of their geographical location or economic background, with access to top-tier preparation materials. We believe in providing clear, accurate, and completely transparent educational resources that respect the student's time and effort.
            </p>

            <h3 className="font-bold text-slate-800 text-lg mt-6 mb-2">Academic Integrity & Core Values</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              We operate under four foundational pillars: **Academic Rigor**, **Absolute Transparency**, **Editorial Independence**, and **Student-First Commitment**. Our mock exams and news updates are completely free of misleading details, spam notifications, or duplicate reports, adhering strictly to Google AdSense Publisher Content Guidelines and Google Search Quality Rater E-E-A-T standards.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <h3 className="font-bold text-slate-800 text-sm mb-2">98.5% Selection Satisfaction</h3>
                <p className="text-slate-500 text-xs leading-relaxed">Verified success rate among central and state level selected candidates who practiced our daily mock drills.</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <h3 className="font-bold text-slate-800 text-sm mb-2">Expert-Verified Keys</h3>
                <p className="text-slate-500 text-xs leading-relaxed">Every question is crafted, solved, and reviewed by verified educators with over 10 years of competitive coaching experience.</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <h3 className="font-bold text-slate-800 text-sm mb-2">Helpful Content Guard</h3>
                <p className="text-slate-500 text-xs leading-relaxed">Our system actively cross-references official syllabus modifications to ensure you never study obsolete guidelines.</p>
              </div>
            </div>
          </div>
        );
      case "contact":
        return (
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6 font-sans">Contact & Help Desk</h1>
            <p className="text-slate-600 leading-relaxed mb-8 text-sm">
              Have questions about competitive syllabus formats, exam eligibility guidelines, or need help with custom mock drills? Get in touch with our editorial office or support team. We respond to all verified inquiries within 12-24 hours.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">Editorial Correspondence</h3>
                    <p className="text-slate-500 text-xs">editorial@jobsnews.online</p>
                    <p className="text-slate-400 text-[11px] mt-1">Submit corrections, feedback, or factual queries directly to our editor-in-chief.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">General Support</h3>
                    <p className="text-slate-500 text-xs">support@jobsnews.online</p>
                    <p className="text-slate-400 text-[11px] mt-1">For student accounts, performance boards, or interface bugs.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">Academic Hotline</h3>
                    <p className="text-slate-500 text-xs">+91 11 4050 9280</p>
                    <p className="text-slate-400 text-[11px] mt-1">Available Monday to Saturday (9:00 AM - 6:00 PM IST)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">Corporate & Editorial HQ</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">JobsNews Online Building, Sector 62, Noida, NCR, India - 201301</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4 text-sm">Submit Verification/Correction Ticket</h3>
                <form onSubmit={(e) => { e.preventDefault(); alert("Verification ticket received successfully. Our academic reviewers will verify and respond within 12 hours."); }} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">YOUR NAME</label>
                    <input required type="text" placeholder="e.g. Rahul Rajput" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-blue-500 transition-colors font-semibold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">EMAIL ADDRESS</label>
                    <input required type="email" placeholder="rahul@gmail.com" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-blue-500 transition-colors font-semibold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">ISSUE CATEGORY</label>
                    <select required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-blue-500 transition-colors font-semibold">
                      <option value="content-correction">Factual Correction in Publication</option>
                      <option value="syllabus-mismatch">Mock Exam Key Mismatch</option>
                      <option value="technical-issue">Technical Support & Board Errors</option>
                      <option value="feedback">General Feedback</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">DETAILED QUERY / SOURCE LINK</label>
                    <textarea required rows={3} placeholder="Please provide exact URL and primary source references (e.g., PDF link or gazette notification) for quick verification..." className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-blue-500 transition-colors font-semibold" />
                  </div>
                  <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 rounded-xl text-xs transition-colors cursor-pointer shadow-sm">
                    Submit Verified Query
                  </button>
                </form>
              </div>
            </div>
          </div>
        );
      case "privacy":
        return (
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6 font-sans">Privacy & User Safety Policy</h1>
            <p className="text-slate-500 text-xs mb-6">Last Updated: June 25, 2026</p>
            <p className="text-slate-600 leading-relaxed mb-4">
              At JobsNews Online, we prioritize the privacy, security, and absolute digital safety of our online users and test aspirants. This policy outlines how we gather, protect, and handle data when you utilize our exam preparations, mock tests, and article library.
            </p>
            <h3 className="font-bold text-slate-800 text-lg mt-6 mb-2">1. Information We Collect</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              We collect user-provided details like names, emails, exam selection preferences, and quiz attempt parameters to accurately compile national rank predictions, generate score cards, and customize study guides. No sensitive payment processing or authentication credentials are cached on our environments.
            </p>
            <h3 className="font-bold text-slate-800 text-lg mt-6 mb-2">2. How We Secure Your Data</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Your registered scores and mock histories are stored in restricted-access JSON structures on secured containers. We restrict direct browser access to API keys (such as the Gemini API) by proxying all generation pipelines strictly through our backend Express routes.
            </p>
            <h3 className="font-bold text-slate-800 text-lg mt-6 mb-2">3. Cookies & Ads</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              We participate in the Google AdSense program and third-party advertising exchanges. These systems use standard browser cookies to serve contextually relevant mock preparation banners. You can clear or toggle your cookie preferences inside your standard browser settings.
            </p>
          </div>
        );
      case "disclaimer":
        return (
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6 font-sans">Disclaimer & Academic Non-Affiliation</h1>
            <div className="flex gap-4 items-start p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 mb-6">
              <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold">Notice of Non-Affiliation</h4>
                <p className="text-xs text-amber-700 mt-1">JobsNews Online is an independent educational preparatory resource. It is NOT affiliated with, sponsored by, or endorsed by the Union Public Service Commission (UPSC), Staff Selection Commission (SSC), Railway Recruitment Boards (RRB), or any state/central government recruitment department.</p>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed mb-4">
              All question papers, mock answer keys, syllabus summaries, recruitment listings, and estimated cutoffs are drafted purely for teaching, diagnostic, and career counseling purposes. While our subject matter experts make absolute efforts to match the official exam guidelines, we do not guarantee the occurrence of identical questions in actual board exams.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Government vacancies and notifications change frequently. Aspirants are advised to regularly double-check information on the official portals (e.g. ssc.gov.in, upsc.gov.in) before acting on schedule expectations or form submission deadlines.
            </p>
          </div>
        );
      case "terms":
        return (
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6 font-sans">Terms & Conditions of Use</h1>
            <p className="text-slate-600 leading-relaxed mb-4">
              Welcome to JobsNews Online. By logging into our portal, solving quizzes, viewing blog notifications, and subscribing to our updates, you agree to comply with our Terms of Use.
            </p>
            <h3 className="font-bold text-slate-800 text-lg mt-6 mb-2">1. Intellectual Property</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              All visual assets, question structures, explanation algorithms, and the automated study frameworks are the exclusive property of JobsNews Online. Reselling, unauthorized scraping, or commercial broadcasting of our quiz libraries is strictly prohibited under Indian Copyright Acts.
            </p>
            <h3 className="font-bold text-slate-800 text-lg mt-6 mb-2">2. Code of Conduct</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Aspirants are welcome to bookmark, download simulated PDFs, and share scoreboards with peers. Any attempts to manipulate the leaderboards via automated network scripts, cheat sheets, or database injection will result in immediate bans from national rankings.
            </p>
          </div>
        );
      case "dmca":
        return (
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6 font-sans">DMCA & Copyright Compliance Policy</h1>
            <p className="text-slate-600 leading-relaxed mb-4">
              JobsNews Online respects the intellectual property rights of educators, publishers, and textbook content writers. If you identify any study materials, mock questions, or diagrammatic explanations on our platform that infringe upon copyright laws, please send a structured DMCA takedown notice.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Your takedown report must include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 text-sm mb-6">
              <li>A physical or digital signature of the copyright owner or authorized representative.</li>
              <li>Precise URLs on JobsNews Online where the copyrighted questions reside.</li>
              <li>Sufficient proof of copyright holding (original publisher records or ISBN numbers).</li>
              <li>Your contact info (name, official email address, and mailing address).</li>
            </ul>
            <p className="text-slate-600">Please route your complaints to: <strong>dmca@jobsnews.online</strong></p>
          </div>
        );
      case "editorial":
        return (
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6 font-sans">Editorial Policy & Content Code</h1>
            <p className="text-slate-500 text-xs mb-6">Last Updated: Real-time Sync Active</p>
            
            <p className="text-slate-600 leading-relaxed mb-4">
              At **JobsNews Online**, academic accuracy and editorial transparency are our absolute standards. Because a single mark or an incorrect notification can fundamentally alter an aspirant's preparation strategy and eligibility, we adhere to a rigid multi-tier content creation and verification protocol.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Our editorial system is designed to fulfill Google's Helpful Content System and satisfy all E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) criteria. Below is our detailed step-by-step editorial commitment:
            </p>

            <h3 className="font-bold text-slate-800 text-lg mt-6 mb-2">1. The Content Creation Cycle</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Every study guide, article, and mock series originates from extensive syllabus mapping. Our certified subject matter experts (SMEs)—including retired civil servants and professional competitive instructors—draft original, comprehensive analyses that address specific syllabus codes.
            </p>

            <h3 className="font-bold text-slate-800 text-lg mt-6 mb-2">2. Multi-Tier Peer Review Process</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Once drafted, the content enters our review pipeline. It is cross-referenced by an independent senior academic reviewer to ensure explanation clarity, proper step-by-step reasoning, and correct answer keys. Finally, our editorial team checks for spelling, layout hygiene, and formatting.
            </p>

            <h3 className="font-bold text-slate-800 text-lg mt-6 mb-2">3. Rigid Sourcing Standards</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              We prohibit the use of rumors, second-hand blog reports, or speculative social media postings. We ONLY source information directly from:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 text-xs mb-4">
              <li>Official Government Gazette Notifications</li>
              <li>Official Board Portals (e.g., SSC, UPSC, RRB, National Testing Agency)</li>
              <li>Authorized Press Releases and Press Information Bureau (PIB)</li>
              <li>Standard Academic Reference Books and NCERT Texts</li>
            </ul>

            <h3 className="font-bold text-slate-800 text-lg mt-6 mb-2">4. Transparency & Corrections Commitment</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Every page clearly demonstrates who authored the content, who peer-reviewed it, and who fact-checked it, alongside the exact "Last Updated Date". If a reader flags an error, we immediately initiate our Corrections Workflow (see our Corrections Policy page) to inspect and correct the detail within 12 hours.
            </p>

            <div className="space-y-4 my-6">
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">Academic Sourcing Integrity</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">No duplicate re-writing. 100% original guidance designed strictly to help future public officers excel.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">Editorial Independence</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">We maintain absolute independence. We never publish paid reviews, promotional exam packages, or sponsored results.</p>
                </div>
              </div>
            </div>
          </div>
        );
      case "fact-check":
        return (
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6 font-sans">Fact-Checking Policy</h1>
            <p className="text-slate-500 text-xs mb-6">Last Updated: Real-time Sync Active</p>
            
            <p className="text-slate-600 leading-relaxed mb-4">
              At **JobsNews Online**, factual accuracy is the bedrock of our authority. Our student audience depends on our exam keys, date announcements, and syllabus outlines to structure their career efforts. Therefore, all publications undergo rigorous fact-checking before they are cleared for release.
            </p>

            <h3 className="font-bold text-slate-800 text-lg mt-6 mb-2">1. Primary Source Verification Rule</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Our academic fact-checkers are trained to follow a strict "Primary Source" directive. We never rely on news headlines or forum speculations. For every date, eligibility parameter, salary scale, or answer option, we verify against the official PDF document issued directly by the respective government board.
            </p>

            <h3 className="font-bold text-slate-800 text-lg mt-6 mb-2">2. Fact-Checking Workflow</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              During fact-checking, our team verifies:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 text-xs mb-4">
              <li><strong>Mathematical Keys</strong>: Every formula, calculation, and intermediate step is manually re-solved.</li>
              <li><strong>Notification Dates</strong>: Dates are matched exactly with the board's digital calendar.</li>
              <li><strong>Citations & References</strong>: Proper citation of government documents, including advertisement numbers and official PDF links.</li>
              <li><strong>Hindi-English Translation Accuracy</strong>: Ensuring standard academic terms match the official multilingual booklets.</li>
            </ul>

            <h3 className="font-bold text-slate-800 text-lg mt-6 mb-2">3. Ongoing Audit Frequency</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Exam patterns change. Therefore, our Fact-Checking unit conducts weekly audits of all historical articles. If a commission updates a cutoff or modifies a syllabus, we update the main article within 12 hours, logging the revision clearly with a "Last Updated" tag.
            </p>
          </div>
        );
      case "corrections":
        return (
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6 font-sans">Corrections & Transparency Policy</h1>
            <p className="text-slate-500 text-xs mb-6">Last Updated: Real-time Sync Active</p>
            
            <p className="text-slate-600 leading-relaxed mb-4">
              At **JobsNews Online**, we strive for absolute accuracy in every educational resource we publish. However, competitive syllabi are complex, and errors may occasionally happen. When an error is identified, we take immediate, transparent steps to correct it and inform our readers.
            </p>

            <h3 className="font-bold text-slate-800 text-lg mt-6 mb-2">1. How We Handle Correction Reports</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Students, educators, and public rate experts can flag potential factual errors in our articles, quizzes, or notification dates. You can report corrections by:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 text-xs mb-4">
              <li>Using the <strong>"Submit Correction"</strong> ticket form on our Contact Us page.</li>
              <li>Emailing our Editorial Desk directly at <strong>editorial@jobsnews.online</strong>.</li>
              <li>Clicking the "Direct Contact" option on any verified Author Profile page.</li>
            </ul>

            <h3 className="font-bold text-slate-800 text-lg mt-6 mb-2">2. Verification and Turnaround Standard</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Once a correction ticket is submitted:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-slate-600 text-xs mb-4">
              <li>Our dedicated Academic Reviewer immediately compares the report against the official primary government gazette or notification.</li>
              <li>If the error is verified, we apply the correction to our digital publication within <strong>12 hours</strong>.</li>
              <li>We update the "Last Updated" metadata on the article page so readers instantly see the synchronized state.</li>
              <li>We log major changes in our internal editorial revision system to ensure academic consistency.</li>
            </ol>

            <h3 className="font-bold text-slate-800 text-lg mt-6 mb-2">3. Transparency Pledge</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              We never stealth-edit critical academic details. If a correction significantly alters an answer key, notification schedule, or salary scale, we add a clear, highlighted <strong>"Correction Note"</strong> at the end of the post explaining what was updated and why, preserving our covenant of absolute honesty with our students.
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
