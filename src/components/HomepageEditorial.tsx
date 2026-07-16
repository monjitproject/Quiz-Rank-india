/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  BookOpen, Award, CheckCircle2, ShieldCheck, Compass, HelpCircle, 
  Sparkles, Zap, Users, ArrowRight, BookMarked, Target, FileText, Calendar, ChevronDown, ChevronUp
} from "lucide-react";

interface NavigationProps {
  onSelectCategory: (catId: string | null) => void;
}

interface FullNavigationProps {
  onSelectCategory: (catId: string | null) => void;
  onNavigate: (view: string, arg?: any) => void;
}

const handleScrollToQuizzes = () => {
  const element = document.getElementById("active-quizzes-section");
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

/* =========================================================
   1. HERO INTRODUCTION (approx. 500 words)
   ========================================================= */
export function HeroIntroduction({ onSelectCategory }: NavigationProps) {
  const handleCategoryClick = (catId: string) => {
    onSelectCategory(catId);
    handleScrollToQuizzes();
  };

  return (
    <section className="max-w-7xl mx-auto px-4 mt-6">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/40 p-8 md:p-12 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50/30 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="space-y-4 max-w-4xl">
          <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100 inline-block">
            Educational Publisher Overview
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            Welcome to JobsNews Online: Your Ultimate Gateway to Indian Government Exam Success
          </h2>
          <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm md:text-base text-slate-600 leading-relaxed">
          <div className="space-y-4">
            <p>
              In the highly competitive landscape of Indian public sector recruitments, finding an authentic, comprehensive, and scientifically structured educational resource is a formidable challenge. <strong>JobsNews Online</strong> (operating at <a href="/" className="text-blue-600 hover:underline font-semibold">jobsnews.online</a>) has emerged as India's premier online learning portal, specifically designed to bridge the gap between aspirational study and actual selection. Our platform is meticulously crafted to support millions of young minds across India who prepare relentlessly for various Central and State Government examinations. Whether you are aiming for prestigious administrative roles, security positions, banking desks, or technical railways departments, JobsNews Online delivers premium educational resources, interactive mock exams, and real-time current affairs analyses directly to your device.
            </p>
            <p>
              Our comprehensive platform is built for candidates of all academic backgrounds. We understand that government exam preparation is not merely about passive textbook reading; it requires a structured, active engagement with the syllabus. By providing high-fidelity <button onClick={() => handleCategoryClick("current-affairs")} className="text-blue-600 hover:underline font-semibold text-left">Current Affairs quizzes</button> and full-length subject practice tests, we help students build cognitive agility. Regular mock examinations serve as diagnostic checkpoints, allowing candidates to identify their weak spots, improve mathematical calculation speeds, and refine logical reasoning strategies.
            </p>
          </div>
          <div className="space-y-4">
            <p>
              Why does daily quiz practice matter? Scientific research in cognitive psychology repeatedly proves that "active recall" and "spaced repetition" are the most effective methods for long-term memory retention. Passive reading of bulky textbooks gives a false illusion of competence, whereas testing forces the brain to retrieve stored facts, thereby solidifying memory pathways. On JobsNews Online, practicing daily quizzes simulates real exam pressure, acclimating your mind to the stress of the ticking clock and the penalty of negative marking.
            </p>
            <p>
              Regular, consistent practice dramatically improves an aspirant's exam performance by honing their speed-accuracy ratio. In national competitive exams like <button onClick={() => handleCategoryClick("ssc")} className="text-blue-600 hover:underline font-semibold text-left">SSC CGL</button>, <button onClick={() => handleCategoryClick("railway")} className="text-blue-600 hover:underline font-semibold text-left">RRB NTPC</button>, and <button onClick={() => handleCategoryClick("banking")} className="text-blue-600 hover:underline font-semibold text-left">IBPS PO</button>, you are required to answer complex questions in less than a minute. Our platform helps you master this time allocation. By integrating real-time notifications, detailed syllabus-oriented guidelines, and interactive peer-evaluated leaderboards, we keep your motivation fueled and your study habits structured for continuous excellence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   2. ABOUT OUR PLATFORM (approx. 600 words) &
   3. GOVT EXAM PREPARATION GUIDE (approx. 650 words)
   ========================================================= */
export function AboutAndExamGuide({ onSelectCategory }: NavigationProps) {
  const handleCategoryClick = (catId: string) => {
    onSelectCategory(catId);
    handleScrollToQuizzes();
  };

  return (
    <div className="space-y-16">
      {/* About Our Platform */}
      <section className="bg-slate-50 py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100 inline-block">
                Our Mission & Philosophy
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                About Our Platform: Demolishing Barriers to Educational Excellence
              </h2>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                At JobsNews Online, we firmly believe that high-quality, exam-aligned educational resources should not be a luxury restricted to those attending expensive coaching institutions in major metropolitan hubs. Our mission is to democratize education.
              </p>
              <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4">
                <Award className="w-10 h-10 text-indigo-600 shrink-0 mt-1" />
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Empowering Remote India</h4>
                  <p className="text-slate-500 text-xs mt-1">
                    Providing identical study opportunities to students from small towns and remote villages, enabling equal-footing competition on the national stage.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6 text-slate-600 text-sm md:text-base leading-relaxed">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Our Educational Purpose and Learning Philosophy
              </h3>
              <p>
                The fundamental core of JobsNews Online lies in systematic cognitive conditioning. We do not just aggregate random questions; we design target-oriented learning pathways. Our educational framework is modeled after the latest National Education Policy (NEP) suggestions, emphasizing formative evaluation and concept clarity over rote memorization. We have observed that many candidates memorize vast amounts of facts but struggle when applying those concepts under the stress of a competitive test. Our learning philosophy bridges this gap.
              </p>
              <p>
                Our government exam preparation approach is holistic. We integrate static study material—comprising general science, history, geography, and indian polity—with live dynamic updates, ensuring that you never study outdated concepts. When a major policy change occurs or a new bilateral treaty is signed, our system reflects these developments within hours through curated current affairs drills. This ensures that your preparation is always sharp, relevant, and synchronized with the latest official syllabus structures.
              </p>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight pt-4">
                How Our Premium Educational Material is Authored
              </h3>
              <p>
                What makes JobsNews Online distinct is our uncompromising stand on educational accuracy and source verification. Every quiz, practice set, and explanation key available on our platform is authored by a dedicated panel of subject matter experts, veteran competitive exam educators, and academic researchers. We do not scrape unverified internet forums; instead, we compile our databases directly from standard reference textbooks, official government portals (such as the Press Information Bureau, Ministry websites, and standard gazettes), and actual previous-year examination papers (PYQs).
              </p>
              <p>
                Each draft question undergoes a rigorous, multi-tiered peer review process. First, our content editors verify the logical consistency of the question stem and the clarity of the four multiple-choice options. Next, our technical quality assurance team checks the analytical accuracy of the mathematical formulas, English grammatical rules, or historical dates. Finally, a detailed pedagogical explanation is added, outlining not only why the correct option is right, but also detailing the specific traps hidden in the incorrect distractors. This robust editorial process guarantees that students receive pristine, reliable, and errata-free mock series.
              </p>
              <p>
                Furthermore, we constantly audit our platform to adapt to changing patterns. If a particular exam conducting board introduces changes in its marking scheme or sectional time limits, our engine is instantly calibrated to mirror those changes. This relentless dedication to content excellence and currency ensures that JobsNews Online is a highly trusted portal for serious aspirants.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Government Exam Preparation Guide */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100 inline-block">
              Syllabus-Aligned Preparation Guides
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Comprehensive Strategy Guide for Major Indian Government Exams
            </h2>
            <p className="text-slate-500 text-xs md:text-sm">
              Navigating the vast ocean of government examination syllabi can be overwhelming. Here is a curated, expert-devised strategic guide to help you conquer each category systematically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* SSC Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-sm">
                SSC
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                Staff Selection Commission (SSC CGL, CHSL, GD, CPO)
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                SSC examinations test raw speed and cognitive agility. To ace these, candidates must master quantitative aptitude (with special focus on mental mathematics and Vedic shortcuts), logical deduction, general English language proficiency, and static general awareness. Practice at least two mock tests daily on our platform to build a strong momentum and minimize error rates.
              </p>
              <button onClick={() => handleCategoryClick("ssc")} className="text-blue-600 font-extrabold text-[11px] inline-flex items-center gap-1 hover:underline text-left">
                Explore SSC Series <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Railway Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm">
                RRB
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                Railway Recruitment Board (NTPC, Group D, ALP, JE)
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Railway exams strongly emphasize General Science (Physics, Chemistry, and Biology based on NCERT syllabus standards) alongside basic mathematical skills and mental ability. Because lakhs of candidates compete for these positions, scoring high in the Science and GK sections is crucial. Utilize our dedicated Science drills to solidifying your fundamentals.
              </p>
              <button onClick={() => handleCategoryClick("railway")} className="text-indigo-600 font-extrabold text-[11px] inline-flex items-center gap-1 hover:underline text-left">
                Explore RRB Series <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Banking Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600 font-black text-sm">
                IBPS
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                Banking Sector (IBPS PO, SBI Clerk, RBI Grade B)
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Banking examinations are notoriously famous for their strict sectional time limits and dynamic difficulty. Focus should be strictly on high-level Data Interpretation (DI), complex Analytical Puzzles, English Reading Comprehension, and Financial-Economic Awareness. Regular timed practice on our mock engine is vital for learning how to skip trap questions.
              </p>
              <button onClick={() => handleCategoryClick("banking")} className="text-violet-600 font-extrabold text-[11px] inline-flex items-center gap-1 hover:underline text-left">
                Explore Banking Series <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Defence & Police Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 font-black text-sm">
                DEF
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                Defence & State Police (NDA, CDS, Police Constable, SI)
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Defence examinations require a blend of physical fitness and robust academic readiness. For the cognitive portion, prioritize general science, current affairs, map-based geography, indian polity, and basic math. State police recruitments also heavily test Hindi Grammar (हिंदी व्याकरण) or local state GK.
              </p>
              <button onClick={() => handleCategoryClick("defence")} className="text-red-600 font-extrabold text-[11px] inline-flex items-center gap-1 hover:underline text-left">
                Explore Defence Series <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Teaching & State PSC Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-black text-sm">
                TET
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                Teaching & State PSC Exams (CTET, State TETs, State PCS)
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Teaching aspirants must build high conceptual clarity in Child Development and Pedagogy (CDP) and subject-specific teaching methods. For State PSC candidates, mastering the detailed administrative structure, historical movements, geography, and socio-economic indicators of their respective state is the decisive key.
              </p>
              <button onClick={() => handleCategoryClick("teaching")} className="text-emerald-600 font-extrabold text-[11px] inline-flex items-center gap-1 hover:underline text-left">
                Explore Teaching Series <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Current Affairs & GK Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 font-black text-sm">
                CA
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                Current Affairs & Static General Knowledge (GK)
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                The absolute backbone of every competitive test. Current affairs questions cover latest government welfare schemes, defense exercises, awards, scientific milestones (such as ISRO launches), and sports achievements. Static GK cements your scores with questions on the Indian Constitution, rivers, historical battles, and economic policies.
              </p>
              <button onClick={() => handleCategoryClick("current-affairs")} className="text-amber-600 font-extrabold text-[11px] inline-flex items-center gap-1 hover:underline text-left">
                Explore Current Affairs <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   4. WHY DAILY PRACTICE MATTERS (approx. 400 words) &
   5. HOW TO USE THIS WEBSITE (approx. 350 words)
   ========================================================= */
export function PracticeAndHowToUse() {
  return (
    <section className="bg-slate-900 text-slate-300 py-16 border-y border-slate-950">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Why Daily Practice Column */}
        <div className="lg:col-span-6 space-y-6">
          <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest bg-blue-950/60 px-3.5 py-1.5 rounded-full border border-blue-900 inline-block">
            Cognitive Science & Active Learning
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
            The Science of Active Recall: Why Daily Practice is the Key to Cracking Government Exams
          </h2>
          <div className="h-1 w-16 bg-blue-500 rounded-full"></div>
          
          <div className="space-y-4 text-xs md:text-sm text-slate-400 leading-relaxed font-medium">
            <p>
              Cracking a prestigious government job exam is not just about intelligence; it is about cognitive speed, muscle memory, and exam endurance. Thousands of candidates read the same recommended books for hours, yet many fail on the big day. The differentiator is the method of study. Passive reading (re-reading highlighting pens or scrolling through social video summaries) is a low-effort cognitive activity that results in poor long-term retention. 
            </p>
            <p>
              In contrast, <strong>Active Recall</strong>—forcing your brain to actively retrieve information from memory to answer a question—creates highly robust neural pathways. When you encounter a question in a practice quiz, your brain goes through an effortful search. Whether you answer correctly or make an error, the subsequent check cements that factual node deep in your memory. This is why daily mock practice is an indispensable component of successful studies.
            </p>
            <p>
              Furthermore, regular self-assessment helps you manage exam anxiety. Test panic often leads to silly mistakes and misread questions. By exposing yourself to a simulated test environment daily on <a href="/" className="text-blue-400 hover:underline">JobsNews Online</a>—complete with precise timers and standardized negative marking metrics—you build a natural immunity to exam-day stress. You learn to handle difficult sections, build critical time-management skills, and learn when to skip complex questions to avoid score penalties. Consistency in practice guarantees a steady progression in your performance graph.
            </p>
          </div>
        </div>

        {/* How To Use Column */}
        <div className="lg:col-span-6 space-y-6">
          <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest bg-indigo-950/60 px-3.5 py-1.5 rounded-full border border-indigo-900 inline-block">
            Step-by-Step Training Manual
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
            How to Use JobsNews Online to Maximize Your Performance Scores
          </h2>
          <div className="h-1 w-16 bg-indigo-500 rounded-full"></div>

          <div className="space-y-4 font-sans">
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-medium">
              Our educational platform is engineered to be highly intuitive, maximizing your productivity without steep learning curves. Follow these five systematic steps to optimize your preparation strategy:
            </p>

            <div className="space-y-3.5">
              <div className="flex gap-3.5 items-start">
                <div className="w-7 h-7 rounded-full bg-blue-950 border border-blue-800 text-blue-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">Select Your Prep Preference</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5 font-medium">
                    Input your name in the personalization banner to customize your tracking index. Navigate to the top categories list to select your targeted exam board like SSC, Railway, or State PSC.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="w-7 h-7 rounded-full bg-blue-950 border border-blue-800 text-blue-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">Launch the Interactive Mock Series</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5 font-medium">
                    Browse our database of over 500+ syllabus-aligned interactive quizzes. Select a topic, read the time parameters and guidelines, and click the start button to launch the live quiz engine.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="w-7 h-7 rounded-full bg-blue-950 border border-blue-800 text-blue-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">Practice with Negative Marking Activated</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5 font-medium">
                    Solve the questions under exam conditions. Pay close attention to the countdown clock and use tactical strategies to avoid taking uncalculated guesses that incur negative marks.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="w-7 h-7 rounded-full bg-blue-950 border border-blue-800 text-blue-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">Deconstruct Step-by-Step Solutions</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5 font-medium">
                    Never leave a mock test after just seeing the score! Access the post-exam detailed reports, read our meticulously written textbook-style explanations, and learn the correct logical steps.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="w-7 h-7 rounded-full bg-blue-950 border border-blue-800 text-blue-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  5
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">Monitor Your Metrics via Student Dashboard</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5 font-medium">
                    Regularly open your personalized tracking dashboard to analyze accuracy rates, historic score improvements, and leaderboard rankings. Continually adjust your studies to address weak links.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

/* =========================================================
   6. WHY CHOOSE JOBSNEWS ONLINE (approx. 350 words) &
   7. EDITORIAL COMMITMENT (approx. 350 words)
   ========================================================= */
export function WhyChooseAndEditorialCommitment() {
  return (
    <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start py-8">
      
      {/* Why Choose JobsNews Online */}
      <div className="space-y-6 bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-sm">
        <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100 inline-block">
          Distinctive Features & Value
        </span>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
          Why Choose JobsNews Online: Elevating Your Competitiveness Above the Rest
        </h2>
        <div className="h-1 w-16 bg-emerald-600 rounded-full"></div>

        <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-medium">
          While there are several online preparation channels, JobsNews Online is unique in its design and editorial values. We don't distract you with heavy advertisement banners, flashing clickbaits, or unsolicited courses. Our portal provides a completely free, distraction-free environment solely focused on maximizing your learning potential.
        </p>

        <ul className="space-y-3 text-slate-600 text-xs font-bold">
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <span>Modern distraction-free interface engineered for deep cognitive focus.</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <span>Free educational materials, syllabus guides, and comprehensive test series.</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <span>Daily verified current affairs quizzes mapped with official PIB notifications.</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <span>Comprehensive coverage across more than 20 national & state recruitment boards.</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <span>Advanced simulated test environment featuring negative marking metrics.</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <span>In-depth analytical dashboards charting accuracy, speed, and percentiles.</span>
          </li>
        </ul>
      </div>

      {/* Editorial Commitment */}
      <div className="space-y-6 bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-sm">
        <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100 inline-block">
          Journalistic & Academic Integrity
        </span>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
          Our Editorial Commitment: Uncompromising Standards of Integrity and Trust
        </h2>
        <div className="h-1 w-16 bg-blue-600 rounded-full"></div>

        <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-medium">
          At JobsNews Online, we understand that a single incorrect fact or a wrong answer key in a mock test can cost an aspirant their dream career. Therefore, we uphold the most rigorous standards of editorial integrity, content verification, and pedagogical excellence.
        </p>

        <div className="space-y-4">
          <div className="flex gap-3 items-start">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-slate-900">Official Government Notifications</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5 font-medium">
                All current affairs data, job alerts, and notices are verified against official government gazettes, Press Information Bureau (PIB) press releases, and departmental notifications.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-slate-900">Multi-Layer Quality Auditing</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5 font-medium">
                Every multiple-choice option, question stem, and explanation key undergoes a strict cross-verification audit by secondary subject experts to eliminate typing errors and erroneous logic.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-slate-900">Last Updated Integrity Labels</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5 font-medium">
                We are deeply transparent about our content freshness. Every database update is logged with precise timestamps, and old test papers are periodically audited to align with latest patterns.
              </p>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}

/* =========================================================
   8. FREQUENTLY ASKED QUESTIONS (approx. 700 words)
   ========================================================= */
export function FrequentlyAskedQuestions() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqData = [
    {
      q: "Is JobsNews Online completely free to use?",
      a: "Yes. JobsNews Online is a public-benefit educational portal dedicated to providing high-quality government exam preparation materials completely free of cost. All our interactive mock tests, category drills, daily current affairs updates, and strategy guides can be accessed without any subscription charges or hidden fees."
    },
    {
      q: "How often are the mock tests and current affairs quizzes updated?",
      a: "Our educational content team works round-the-clock. Current affairs quizzes and national event bulletins are updated daily. General knowledge, science, and reasoning mock series are audited and enhanced weekly to stay perfectly synced with active trends of the central and state exam boards."
    },
    {
      q: "Which specific government examinations does JobsNews Online cover?",
      a: "Our databases cover a wide range of examinations. We provide dedicated practice modules and previous year questions (PYQs) for SSC (CGL, CHSL, GD Constable, CPO, MTS), Railways (RRB NTPC, Group D, ALP, JE), Banking (IBPS PO/Clerk, SBI PO/Clerk, RBI), Defence (NDA, CDS, AFCAT), State Police recruitments, Teaching Eligibilities (CTET, State TETs), and State PSC examinations."
    },
    {
      q: "Can beginners with no prior preparation use this platform?",
      a: "Absolutely! JobsNews Online is built with a dual-learning approach. Even if you are an absolute beginner, our detailed pedagogical explanations that follow every question act as a self-explanatory guide. You can attempt a quiz, analyze the answers, read the step-by-step logic, and build your fundamentals incrementally."
    },
    {
      q: "How is the performance score and percentile calculated?",
      a: "Our interactive engine uses a simulated board grading system. When you submit a quiz, you receive positive marks (+1 or +2) for every correct answer, while negative marking (typically -0.25 or -0.50) is applied to incorrect attempts, depending on the chosen exam pattern. Your overall percentile compares your scores and speed parameters with thousands of other real candidates to chart your ranking on our Leaderboard."
    },
    {
      q: "How does JobsNews Online ensure the accuracy of its questions and answer keys?",
      a: "We have an uncompromising commitment to accuracy. Every question is crafted directly from standard academic resources (like NCERT, standard reference books) and verified government portals (PIB, ministry gazettes). Our content panel performs multi-tier academic peer audits on all answer keys and explanations to ensure zero errors."
    },
    {
      q: "Is there support for regional languages on JobsNews Online?",
      a: "Yes. Understanding the diverse linguistic background of Indian aspirants, our platform provides comprehensive bilingual support, particularly in English and Hindi. Many of our main mock tests, general knowledge drills, and grammar sections are available in both languages, reflecting the actual language choices in official exam portals."
    },
    {
      q: "What is the role of the daily current affairs pipeline?",
      a: "Current affairs make up nearly 25-40% of the scoring weight in modern government exams. Our dynamic scheduler tracks national notifications, bills, indices, sports, and international relations daily. It compiles these events into small, bite-sized practice questions, enabling students to stay updated without having to read massive newspapers for hours."
    },
    {
      q: "Does JobsNews Online provide official notification alerts?",
      a: "Yes. Our Jobs News notice board is constantly updated with official notifications from recruitment boards. We post verified updates regarding new job advertisements, eligibility criteria, admit card releases, official answer keys, and merit list results, helping you stay ahead without visiting multiple unverified sites."
    },
    {
      q: "How can I track my performance over multiple quiz attempts?",
      a: "Once you take a quiz on our platform, your results are securely stored in your browser's persistent memory and synced with your student dashboard. You can navigate to the 'Dashboard' tab anytime to review your complete attempts history, average score, accuracy metrics, and visual performance improvements over time."
    },
    {
      q: "Are the mock tests designed on the latest syllabus patterns?",
      a: "Yes. We pride ourselves on keeping our questions modern. Every time an exam body (like the SSC or IBPS) introduces an update to its exam pattern or syllabus weightage, our specialist panel immediately revises the corresponding mock sets on our platform to ensure your practice remains relevant."
    },
    {
      q: "How does the negative marking simulator work on this platform?",
      a: "Our simulated player replicates the exact penalty ratios of actual competitive tests. If a test has a negative marking of 0.25, every wrong attempt deducts 0.25 marks from your total correct score, while skipped questions incur no penalty. This prepares you mentally to make strategic choices and avoid uncalculated guessing in the actual exam."
    }
  ];

  return (
    <section className="bg-slate-50 py-16 border-y border-slate-100">
      <div className="max-w-4xl mx-auto px-4 space-y-12">
        
        <div className="text-center space-y-4">
          <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100 inline-block">
            Candidate Help Center
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions (FAQ) – Clear Answers for Aspiring Candidates
          </h2>
          <p className="text-slate-500 text-xs md:text-sm">
            Have questions about how our platform operates, question accuracy, or how we can help you ace your exam? Read our comprehensive FAQ block.
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((item, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:border-slate-200"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left px-6 py-5 flex justify-between items-center gap-4 text-slate-800 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                <h3 className="font-extrabold text-xs md:text-sm font-sans flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                  {item.q}
                </h3>
                {openFaq === idx ? (
                  <ChevronUp className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                )}
              </button>
              
              {openFaq === idx && (
                <div className="px-6 pb-6 pt-1 text-slate-500 text-[11px] md:text-xs leading-relaxed border-t border-slate-50 font-medium">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* =========================================================
   9. CALL TO ACTION (approx. 200 words) & Legal references
   ========================================================= */
export function CallToActionAndDisclaimer({ onSelectCategory, onNavigate }: FullNavigationProps) {
  const handleCategoryClick = (catId: string) => {
    onSelectCategory(catId);
    handleScrollToQuizzes();
  };

  const handleNavigateStatic = (pageId: string) => {
    onNavigate("static-page", pageId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-12">
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-900 text-white rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl shadow-slate-950/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none"></div>
          
          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <span className="text-[9px] font-black tracking-widest text-blue-300 uppercase bg-blue-950/60 border border-blue-800 px-3 py-1.5 rounded-full inline-block">
              Take the First Step Today
            </span>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight leading-tight font-sans">
              Start Your Journey Towards a Distinguished Government Career Today
            </h2>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-medium">
              Every single government exam topper started exactly where you are standing right now. Success is not built in a day; it is forged through relentless, consistent daily practice. Empower yourself with India’s most trusted free educational portal. Select an exam category, practice daily mock tests, analyze detailed explanations, and witness your scores soar.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button
                onClick={() => handleCategoryClick("current-affairs")}
                className="bg-white text-indigo-900 hover:bg-slate-100 text-xs font-black px-6 py-3.5 rounded-full transition-all active:scale-95 shadow-lg shadow-slate-900/40 cursor-pointer"
              >
                Attempt Daily Current Affairs
              </button>
              <button
                onClick={handleScrollToQuizzes}
                className="bg-indigo-600/30 hover:bg-indigo-600/50 text-white text-xs font-black px-6 py-3.5 rounded-full border border-indigo-500/40 transition-all active:scale-95 cursor-pointer"
              >
                Browse 500+ Mock Quizzes
              </button>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-6 text-[10px] text-slate-400 pt-6 border-t border-slate-800/60 font-semibold">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Fully Free & Compliant
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Verified Official Sources
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Last Updated: July 2026
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EEAT TRUST SIGNALS & FOOTER INTERNAL LINKS */}
      <section className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-[10px] space-y-4 font-semibold">
        <div className="h-px bg-slate-100 max-w-4xl mx-auto"></div>
        <p className="max-w-4xl mx-auto leading-relaxed">
          <strong>Educational Disclaimer:</strong> JobsNews Online (<a href="/" className="hover:text-slate-600 underline">jobsnews.online</a>) is a purely independent educational publishing portal. We are not affiliated, associated, authorized, endorsed by, or in any way officially connected with the Staff Selection Commission (SSC), Railway Recruitment Board (RRB), Union Public Service Commission (UPSC), Institute of Banking Personnel Selection (IBPS), or any other Indian government body. Our study materials and mock tests are designed for practice purposes only. For official announcements, please consult government websites like <a href="https://ssc.gov.in" target="_blank" rel="noreferrer" className="hover:text-slate-600 underline">ssc.gov.in</a>, <a href="https://www.rrcb.gov.in" target="_blank" rel="noreferrer" className="hover:text-slate-600 underline">rrcb.gov.in</a>, or <a href="https://ibps.in" target="_blank" rel="noreferrer" className="hover:text-slate-600 underline">ibps.in</a>.
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-slate-400">
          <button onClick={() => handleNavigateStatic("about")} className="hover:text-slate-600 underline cursor-pointer">About Platform</button>
          <span>•</span>
          <button onClick={() => handleNavigateStatic("privacy")} className="hover:text-slate-600 underline cursor-pointer">Privacy Policy</button>
          <span>•</span>
          <button onClick={() => handleNavigateStatic("terms")} className="hover:text-slate-600 underline cursor-pointer">Terms & Conditions</button>
          <span>•</span>
          <button onClick={() => handleNavigateStatic("disclaimer")} className="hover:text-slate-600 underline cursor-pointer">Legal Disclaimer</button>
          <span>•</span>
          <button onClick={() => handleNavigateStatic("contact")} className="hover:text-slate-600 underline cursor-pointer">Contact Us</button>
        </div>
      </section>
    </div>
  );
}
