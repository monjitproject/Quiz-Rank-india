/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { 
  Timer, Bookmark, CheckCircle, AlertTriangle, ChevronRight, 
  ChevronLeft, Award, Download, Share2, ArrowRight, ShieldCheck, 
  Sparkles, Languages, RefreshCw, XCircle, Trophy, HelpCircle
} from "lucide-react";
import { Quiz, Question, Result } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface QuizEngineProps {
  quiz: Quiz;
  userName: string;
  onFinished: (result: Result) => void;
  onBack: () => void;
}

// Pre-defined high-fidelity Hindi translations for seeded English questions
const questionTranslations: Record<string, { text: string; options: string[]; explanation: string }> = {
  // SSC GD Questions
  "q-ssc-gd-1": {
    text: "निम्नलिखित में से भारत का सबसे ऊँचा बाँध कौन सा है?",
    options: ["टिहरी बाँध", "भाखड़ा नांगल बाँध", "हीराकुंड बाँध", "नागार्जुन सागर बाँध"],
    explanation: "उत्तराखंड में भागीरथी नदी पर स्थित टिहरी बाँध 260.5 मीटर की ऊँचाई के साथ भारत का सबसे ऊँचा बाँध है।"
  },
  "q-ssc-gd-2": {
    text: "लक्षद्वीप की राजधानी क्या है?",
    options: ["कवरत्ती", "पोर्ट ब्लेयर", "सिलवासा", "दमन"],
    explanation: "कवरत्ती भारत में लक्षद्वीप संघ राज्य क्षेत्र की राजधानी और मुख्यालय है।"
  },
  "q-ssc-gd-3": {
    text: "किसी भारतीय राज्य की पहली महिला राज्यपाल कौन थीं?",
    options: ["सरोजिनी नायडू", "सुचेता कृपलानी", "इन्दिरा गांधी", "प्रतिभा पाटिल"],
    explanation: "सरोजिनी नायडू को 1947 से 1949 तक संयुक्त प्रांत (अब उत्तर प्रदेश) की राज्यपाल नियुक्त किया गया था, जिससे वह भारत में इस पद को संभालने वाली पहली महिला बनीं।"
  },
  "q-ssc-gd-4": {
    text: "भारतीय संविधान का कौन सा अनुच्छेद शिक्षा के अधिकार की गारंटी देता है?",
    options: ["अनुच्छेद 21A", "अनुच्छेद 19", "अनुच्छेद 32", "अनुच्छेद 45"],
    explanation: "86वें संविधान संशोधन अधिनियम 2002 द्वारा 6 से 14 वर्ष की आयु के बच्चों के लिए शिक्षा के अधिकार को मौलिक अधिकार बनाने के लिए अनुच्छेद 21A जोड़ा गया था।"
  },
  "q-ssc-gd-5": {
    text: "यदि कोई धनराशि साधारण ब्याज पर 5 वर्षों में दोगुनी हो जाती है, तो प्रति वर्ष ब्याज की दर क्या है?",
    options: ["20%", "10%", "15%", "25%"],
    explanation: "साधारण ब्याज (SI) = P। दोगुनी होने पर, SI = P। इस प्रकार P = (P * R * 5) / 100 => 5R = 100 => R = 20%।"
  },
  // SSC CGL Questions
  "q-ssc-cgl-1": {
    text: "भारतीय राष्ट्रीय कांग्रेस के 1907 के सूरत अधिवेशन की अध्यक्षता किसने की थी जहाँ कांग्रेस गरम दल और नरम दल में विभाजित हो गई थी?",
    options: ["रासबिहारी घोष", "दादाभाई नौरोजी", "गोपाल कृष्ण गोखले", "बाल गंगाधर तिलक"],
    explanation: "डॉ. रासबिहारी घोष ने 1907 के सूरत अधिवेशन की अध्यक्षता की थी, जिसमें वैचारिक मतभेदों के कारण कांग्रेस गरम दल और नरम दल में विभाजित हो गई थी।"
  },
  "q-ssc-cgl-2": {
    text: "A और B की वर्तमान आयु का अनुपात 4:5 है। 5 वर्ष बाद यह अनुपात 5:6 हो जाता है। A की वर्तमान आयु क्या है?",
    options: ["20 वर्ष", "25 वर्ष", "30 वर्ष", "15 वर्ष"],
    explanation: "मान लीजिए आयु 4x और 5x है। (4x+5)/(5x+5) = 5/6 => 24x + 30 = 25x + 25 => x = 5। A की आयु = 4 * 5 = 20 वर्ष।"
  },
  "q-ssc-cgl-3": {
    text: "भारत के किस राज्य की तटरेखा सबसे लंबी है?",
    options: ["गुजरात", "आंध्र प्रदेश", "तमिलनाडु", "महाराष्ट्र"],
    explanation: "गुजरात की मुख्य भूमि की तटरेखा भारत में सबसे लंबी है, जो लगभग 1,600 किमी तक फैली हुई है, इसके बाद आंध्र प्रदेश का स्थान है।"
  },
  "q-ssc-cgl-4": {
    text: "बेकिंग सोडा का रासायनिक नाम क्या है?",
    options: ["सोडियम बाइकार्बोनेट", "सोडियम कार्बोनेट", "कैल्शियम कार्बोनेट", "सोडियम क्लोराइड"],
    explanation: "बेकिंग सोडा सोडियम बाइकार्बोनेट (NaHCO3) है, जबकि सोडियम कार्बोनेट (Na2CO3) धावन सोडा (washing soda) है।"
  },
  "q-ssc-cgl-5": {
    text: "एक कूट भाषा में, 'ROSE' को 'TQUG' लिखा जाता है। 'BISCUIT' को क्या लिखा जाएगा?",
    options: ["DKUEWKV", "DKVEXKW", "DKUEWJV", "CKTDVJS"],
    explanation: "प्रत्येक अक्षर को +2 स्थान आगे बढ़ाया गया है (R->T, O->Q, S->U, E->G)। उसी प्रकार, B->D, I->K, S->U, C->E, U->W, I->K, T->V।"
  },
  // RRB Group D Questions
  "q-rrb-1": {
    text: "निम्नलिखित में से कौन सी एक अदिश राशि (scalar quantity) है?",
    options: ["द्रव्यमान (Mass)", "वेग (Velocity)", "त्वरण (Acceleration)", "बल (Force)"],
    explanation: "द्रव्यमान में केवल परिमाण होता है और कोई विशिष्ट दिशा नहीं होती है, जो इसे एक अदिश राशि बनाता है। वेग, त्वरण और बल सदिश राशियां हैं।"
  },
  "q-rrb-2": {
    text: "शक्ति (Power) की SI इकाई क्या है?",
    options: ["वाट (Watt)", "जूल (Joule)", "न्यूटन (Newton)", "पास्कल (Pascal)"],
    explanation: "शक्ति की SI इकाई वाट (W) है, जो प्रति सेकंड खर्च की गई एक जूल ऊर्जा को दर्शाती है।"
  }
};

// UI Element Translations Map
const uiTranslations: Record<string, string> = {
  "Easy Level": "आसान स्तर",
  "Medium Level": "मध्यम स्तर",
  "Hard Level": "कठिन स्तर",
  "Easy": "आसान",
  "Medium": "मध्यम",
  "Hard": "कठिन",
  "TOTAL QUESTIONS": "कुल प्रश्न",
  "TIME ALLOTTED": "निर्धारित समय",
  "Questions": "प्रश्न",
  "Minutes": "मिनट",
  "Official Instructions & Marking Scheme:": "आधिकारिक निर्देश और अंकन योजना:",
  "Each correct response rewards": "प्रत्येक सही उत्तर के लिए",
  "points": "अंक दिए जाते हैं",
  "You can bookmark and skip questions during live practice.": "आप अभ्यास के दौरान प्रश्नों को बुकमार्क और छोड़ सकते हैं।",
  "Enable negative marking (0.25 point penalty for wrong answers):": "ऋणात्मक अंकन सक्षम करें (गलत उत्तर के लिए 0.25 अंक की कटौती):",
  "Back to Portal": "पोर्टल पर वापस जाएं",
  "Start Live Quiz": "लाइव क्विज़ शुरू करें",
  "Loading Exam Questions...": "परीक्षा के प्रश्न लोड हो रहे हैं...",
  "No Questions Found": "कोई प्रश्न नहीं मिला",
  "Questions for this quiz are not configured yet.": "इस क्विज़ के लिए प्रश्न अभी उपलब्ध नहीं हैं।",
  "Go Back": "वापस जाएं",
  "Performance Summary": "प्रदर्शन का सारांश",
  "Practice Complete! Here are your estimated rankings & analytics": "अभ्यास पूरा हुआ! यहाँ आपकी अनुमानित राष्ट्रीय रैंक और विश्लेषण है",
  "Score Obtained": "प्राप्त अंक",
  "Accuracy": "सटीकता",
  "Predicted Rank": "अनुमानित रैंक",
  "Percentile": "प्रतिशतक",
  "Response Breakdown:": "उत्तरों का विवरण:",
  "Correct": "सही",
  "Wrong": "गलत",
  "Skipped": "छोड़े गए",
  "Total practice time taken:": "लिया गया कुल अभ्यास समय:",
  "Negative marking applied:": "ऋणात्मक अंकन लागू:",
  "Yes (0.25 point penalty)": "हाँ (0.25 अंक की कटौती)",
  "No (Disabled)": "नहीं (अक्षम)",
  "Share Score": "स्कोर साझा करें",
  "Download PDF Report": "PDF रिपोर्ट डाउनलोड करें",
  "Return to Portal": "पोर्टल पर वापस जाएं",
  "Question & Solution Key Analysis:": "प्रश्न और उत्तर कुंजी विश्लेषण:",
  "Incorrect": "गलत",
  "✓ Correct Key": "✓ सही उत्तर",
  "✗ Your Answer": "✗ आपका उत्तर",
  "EXPLANATORY ANALYSIS": "व्याख्यात्मक विश्लेषण",
  "QUESTION": "प्रश्न",
  "OF": "में से",
  "Previous": "पिछला",
  "Skip Question": "प्रश्न छोड़ें",
  "Next": "अगला",
  "Submit Exam": "परीक्षा जमा करें",
  "Exam Navigation Console": "परीक्षा नेविगेशन कंसोल",
  "Answered Mock Questions": "उत्तर दिए गए प्रश्न",
  "Bookmarked for Review": "समीक्षा के लिए बुकमार्क",
  "Skipped Assessment Questions": "छोड़े गए मूल्यांकन प्रश्न",
  "Unvisited": "नहीं देखे गए",
  "Submitting Exam...": "परीक्षा सबमिट हो रही है...",
  "Instant Review & Finish": "तुरंत समीक्षा और समाप्त करें",
  "Congratulations! You Passed! 🎉": "बधाई हो! आप उत्तीर्ण हुए! 🎉",
  "Excellent job! You performed exceptionally well in this mock exam. Keep up the great work!": "उत्कृष्ट कार्य! आपने इस मॉक परीक्षा में असाधारण प्रदर्शन किया। शानदार अभ्यास जारी रखें!",
  "Keep Practicing! You can do it! 💪": "अभ्यास जारी रखें! आप सफल होंगे! 💪",
  "Don't worry! Every mistake is a learning opportunity. Review the solution keys below and try again to master this syllabus.": "चिंता न करें! हर गलती सीखने का एक सुनहरा अवसर है। नीचे दी गई समाधान कुंजी की समीक्षा करें और फिर से प्रयास करें।"
};

// Falling Confetti Animation for Winners (score >= 60%)
function ConfettiEffect() {
  const colors = [
    "#f43f5e", "#3b82f6", "#10b981", "#eab308", 
    "#a855f7", "#ec4899", "#14b8a6", "#f97316"
  ];
  
  const fallingParticles = Array.from({ length: 80 });
  const leftBurstParticles = Array.from({ length: 40 });
  const rightBurstParticles = Array.from({ length: 40 });

  useEffect(() => {
    // 1. Initial vibrant center burst
    confetti({
      particleCount: 140,
      spread: 80,
      origin: { y: 0.6 },
      colors: colors
    });

    // 2. Side-canon bursts after tiny delays
    const timer1 = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: colors
      });
    }, 250);

    const timer2 = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: colors
      });
    }, 450);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50 min-h-screen">
      {/* 1. Classic Falling Confetti with diverse shapes and sways */}
      {fallingParticles.map((_, i) => {
        const size = Math.random() * 10 + 6;
        const color = colors[i % colors.length];
        const left = Math.random() * 100; // %
        const duration = Math.random() * 3.5 + 2.5; // seconds
        const delay = Math.random() * 2.5; // seconds
        const isCircle = Math.random() > 0.5;
        const isTriangle = !isCircle && Math.random() > 0.5;

        return (
          <motion.div
            key={`fall-${i}`}
            initial={{ y: -40, x: 0, opacity: 1, rotate: 0, scale: 0.5 }}
            animate={{
              y: "110vh",
              x: [0, Math.sin(i) * 30, Math.sin(i + 1) * -30, Math.sin(i) * 30],
              rotate: [0, 180, 360, 540],
              opacity: [1, 1, 0.9, 0],
              scale: [0.5, 1, 1, 0.8]
            }}
            transition={{
              duration: duration,
              delay: delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: "absolute",
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              clipPath: isTriangle ? "polygon(50% 0%, 0% 100%, 100% 100%)" : undefined,
              borderRadius: isCircle ? "50%" : "3px"
            }}
          />
        );
      })}

      {/* 2. Left Corner Burst */}
      {leftBurstParticles.map((_, i) => {
        const size = Math.random() * 8 + 5;
        const color = colors[i % colors.length];
        const angle = (Math.random() * 45 + 15) * (Math.PI / 180); // 15 to 60 degrees
        const distance = Math.random() * 350 + 150; // pixels
        const targetX = Math.cos(angle) * distance;
        const targetY = -Math.sin(angle) * distance;
        const duration = Math.random() * 1.5 + 1.2;

        return (
          <motion.div
            key={`lburst-${i}`}
            initial={{ x: 0, y: "100vh", opacity: 1, rotate: 0, scale: 0.2 }}
            animate={{
              x: targetX,
              y: `calc(100vh + ${targetY}px)`,
              rotate: Math.random() * 720,
              opacity: [1, 0.8, 0],
              scale: [0.2, 1.2, 0.8]
            }}
            transition={{
              duration: duration,
              ease: "easeOut",
              delay: Math.random() * 0.4
            }}
            style={{
              position: "absolute",
              left: "0px",
              bottom: "0px",
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              borderRadius: Math.random() > 0.5 ? "50%" : "2px"
            }}
          />
        );
      })}

      {/* 3. Right Corner Burst */}
      {rightBurstParticles.map((_, i) => {
        const size = Math.random() * 8 + 5;
        const color = colors[i % colors.length];
        const angle = (Math.random() * 45 + 15) * (Math.PI / 180); // 15 to 60 degrees
        const distance = Math.random() * 350 + 150; // pixels
        const targetX = -Math.cos(angle) * distance;
        const targetY = -Math.sin(angle) * distance;
        const duration = Math.random() * 1.5 + 1.2;

        return (
          <motion.div
            key={`rburst-${i}`}
            initial={{ x: 0, y: "100vh", opacity: 1, rotate: 0, scale: 0.2 }}
            animate={{
              x: targetX,
              y: `calc(100vh + ${targetY}px)`,
              rotate: Math.random() * -720,
              opacity: [1, 0.8, 0],
              scale: [0.2, 1.2, 0.8]
            }}
            transition={{
              duration: duration,
              ease: "easeOut",
              delay: Math.random() * 0.4
            }}
            style={{
              position: "absolute",
              right: "0px",
              bottom: "0px",
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              borderRadius: Math.random() > 0.5 ? "50%" : "2px"
            }}
          />
        );
      })}
    </div>
  );
}

// HighScoreCelebration: Premium celebratory animation with floating golden trophies, shimmering stars, and grand bursts!
function HighScoreCelebration() {
  const colors = [
    "#f43f5e", "#3b82f6", "#10b981", "#eab308", 
    "#a855f7", "#ec4899", "#14b8a6", "#f97316"
  ];
  
  const particles = Array.from({ length: 110 });
  const stars = Array.from({ length: 15 });
  const floatingTrophies = Array.from({ length: 6 });

  useEffect(() => {
    // 1. Double massive corner bursts immediately
    confetti({
      particleCount: 100,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.8 },
      colors: colors
    });
    confetti({
      particleCount: 100,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.8 },
      colors: colors
    });

    // 2. High-intensity center burst slightly later
    const centerTimer = setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#f59e0b", "#fbbf24", "#34d399", "#60a5fa", "#ec4899"] // Premium gold and pastel mix
      });
    }, 300);

    // 3. Continuous mini side fountains for 4 seconds
    const end = Date.now() + 4000;
    const intervalId = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(intervalId);
        return;
      }
      confetti({
        particleCount: 30,
        angle: Math.random() > 0.5 ? 60 : 120,
        spread: 45,
        origin: { x: Math.random() > 0.5 ? 0 : 1, y: 0.75 },
        colors: ["#fbbf24", "#f59e0b", "#fef3c7"] // Golden fountain
      });
    }, 250);

    return () => {
      clearTimeout(centerTimer);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50 min-h-screen">
      {/* Heavy falling confetti */}
      {particles.map((_, i) => {
        const size = Math.random() * 10 + 6;
        const color = colors[i % colors.length];
        const left = Math.random() * 100;
        const duration = Math.random() * 3.5 + 2.0;
        const delay = Math.random() * 2.5;
        const isCircle = Math.random() > 0.4;

        return (
          <motion.div
            key={`hs-p-${i}`}
            initial={{ y: -50, x: 0, opacity: 1, rotate: 0, scale: 0.4 }}
            animate={{
              y: "115vh",
              x: [0, Math.sin(i) * 35, Math.sin(i + 1) * -35, Math.sin(i) * 35],
              rotate: [0, 360, 720],
              opacity: [1, 1, 0.9, 0],
              scale: [0.4, 1.2, 1, 0.6]
            }}
            transition={{
              duration: duration,
              delay: delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: "absolute",
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              borderRadius: isCircle ? "50%" : "2px"
            }}
          />
        );
      })}

      {/* Bursting golden stars */}
      {stars.map((_, i) => {
        const left = 15 + Math.random() * 70; // 15% to 85%
        const top = 15 + Math.random() * 60;  // 15% to 75%
        const delay = Math.random() * 2.0;

        return (
          <motion.div
            key={`hs-star-${i}`}
            initial={{ scale: 0, opacity: 0, rotate: 0 }}
            animate={{
              scale: [0, 1.4, 0],
              opacity: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2.2,
              delay: delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute"
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            <Sparkles className="w-6 h-6 text-amber-400 fill-amber-300 filter drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]" />
          </motion.div>
        );
      })}

      {/* Floating golden mini trophies */}
      {floatingTrophies.map((_, i) => {
        const left = 5 + Math.random() * 90;
        const delay = i * 1.8;

        return (
          <motion.div
            key={`hs-float-trophy-${i}`}
            initial={{ y: "105vh", opacity: 0, scale: 0.6, rotate: -15 }}
            animate={{
              y: "-10vh",
              opacity: [0, 0.9, 0.9, 0],
              scale: [0.6, 1.1, 1.1, 0.7],
              rotate: [-15, 15, -15, 15],
            }}
            transition={{
              duration: 7.5,
              delay: delay,
              repeat: Infinity,
              ease: "easeOut"
            }}
            className="absolute bg-amber-50 border border-amber-200/50 p-2 rounded-2xl shadow-lg shadow-amber-500/10 flex items-center justify-center"
            style={{ left: `${left}%` }}
          >
            <Trophy className="w-5 h-5 text-amber-500 fill-amber-100" />
          </motion.div>
        );
      })}
    </div>
  );
}

// Empathetic, supportive, comforting & motivational ambient feedback animations for lower scores (accuracy < 60%)
function EmpatheticSupportEffect() {
  const bubbles = Array.from({ length: 16 });
  const warmthParticles = Array.from({ length: 24 });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50 min-h-screen">
      {/* Rising warm orange, yellow, and soft indigo calming wisdom circles */}
      {bubbles.map((_, i) => {
        const left = 5 + Math.random() * 90; // 5% to 95%
        const size = Math.random() * 12 + 6;
        const delay = Math.random() * 3.5;
        const duration = Math.random() * 5.5 + 4.0;
        const colors = ["rgba(251,146,60,0.14)", "rgba(129,140,248,0.14)", "rgba(253,224,71,0.14)", "rgba(45,212,191,0.14)"];
        const color = colors[i % colors.length];

        return (
          <motion.div
            key={`wisdom-bubble-${i}`}
            initial={{ y: "105vh", opacity: 0, scale: 0.5 }}
            animate={{
              y: "-10vh",
              opacity: [0, 0.7, 0.7, 0],
              scale: [0.5, 1.2, 1.2, 0.6],
              x: [0, Math.sin(i) * 20, Math.sin(i + 1) * -20, Math.sin(i) * 10]
            }}
            transition={{
              duration: duration,
              delay: delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute rounded-full filter blur-[1px] border border-white/10"
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              boxShadow: "0 0 10px rgba(255,255,255,0.3)"
            }}
          />
        );
      })}

      {/* Glowing heart and spark particles representing supportive warmth */}
      {warmthParticles.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 4.0;
        const size = Math.random() * 4 + 2;

        return (
          <motion.div
            key={`warmth-p-${i}`}
            initial={{ y: "110vh", opacity: 0 }}
            animate={{
              y: "5vh",
              opacity: [0, 0.8, 0],
              x: [0, Math.cos(i) * 30, Math.cos(i + 1) * -30]
            }}
            transition={{
              duration: Math.random() * 4.5 + 3.5,
              delay: delay,
              repeat: Infinity,
              ease: "easeOut"
            }}
            className="absolute rounded-full bg-amber-400/20"
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              boxShadow: "0 0 6px rgba(251,191,36,0.3)"
            }}
          />
        );
      })}

      {/* Drifting warm empathetic encouraging quote banners */}
      {Array.from({ length: 6 }).map((_, i) => {
        const left = 8 + Math.random() * 60; // keep inside screen bounds safely
        const delay = i * 2.8;
        const text = [
          "कोशिश करते रहें, मंज़िल दूर नहीं! 🎯", 
          "हर गलत उत्तर सीखने की सीढ़ी है! 📚", 
          "निरंतर अभ्यास ही सफलता का मूल मंत्र है! ⚡",
          "आप में बेहतर करने की पूरी क्षमता है! 💪",
          "एक बार और जोश के साथ अभ्यास करें! 🌟",
          "We believe in you! Keep moving forward! ❤️"
        ][i % 6];

        return (
          <motion.div
            key={`empathy-quote-${i}`}
            initial={{ y: "90vh", opacity: 0, scale: 0.8 }}
            animate={{
              y: "10vh",
              opacity: [0, 0.9, 0.9, 0],
              scale: [0.8, 1, 1, 0.85]
            }}
            transition={{
              duration: 10,
              delay: delay,
              repeat: Infinity,
              ease: "easeOut"
            }}
            className="absolute text-[11px] font-black text-slate-600 bg-amber-50/95 border border-amber-200/60 shadow-lg shadow-amber-500/5 px-4 py-2.5 rounded-2xl whitespace-nowrap z-40 flex items-center gap-1.5"
            style={{ left: `${left}%` }}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>{text}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

const difficultyStyles = {
  Easy: {
    badgeBg: "bg-emerald-50 border-emerald-100 text-emerald-600",
    text: "text-emerald-600",
    bg: "bg-emerald-50",
    hoverBg: "hover:bg-emerald-50",
    border: "border-emerald-200",
    ring: "ring-emerald-500",
    focusBorder: "border-emerald-500",
    primaryButton: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/10",
    progressBar: "bg-gradient-to-r from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/5 border-emerald-500/20",
    activeNav: "border-emerald-600 bg-emerald-50 text-emerald-700 ring-emerald-600",
    accentBg: "bg-emerald-50/40 border-emerald-100",
    accentText: "text-emerald-700",
    pulseColor: "#10b981",
  },
  Medium: {
    badgeBg: "bg-amber-50 border-amber-100 text-amber-600",
    text: "text-amber-600",
    bg: "bg-amber-50",
    hoverBg: "hover:bg-amber-50",
    border: "border-amber-200",
    ring: "ring-amber-500",
    focusBorder: "border-amber-500",
    primaryButton: "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/10",
    progressBar: "bg-gradient-to-r from-amber-500 to-orange-500",
    glow: "shadow-amber-500/5 border-amber-500/20",
    activeNav: "border-amber-500 bg-amber-50 text-amber-700 ring-amber-500",
    accentBg: "bg-amber-50/40 border-amber-100",
    accentText: "text-amber-700",
    pulseColor: "#f59e0b",
  },
  Hard: {
    badgeBg: "bg-rose-50 border-rose-100 text-rose-600",
    text: "text-rose-600",
    bg: "bg-rose-50",
    hoverBg: "hover:bg-rose-50",
    border: "border-rose-200",
    ring: "ring-rose-500",
    focusBorder: "border-rose-500",
    primaryButton: "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/10",
    progressBar: "bg-gradient-to-r from-rose-500 to-pink-600",
    glow: "shadow-rose-500/5 border-rose-500/20",
    activeNav: "border-rose-600 bg-rose-50 text-rose-700 ring-rose-600",
    accentBg: "bg-rose-50/40 border-rose-100",
    accentText: "text-rose-700",
    pulseColor: "#f43f5e",
  },
};

export function QuizEngine({ quiz, userName, onFinished, onBack }: QuizEngineProps) {
  const styles = difficultyStyles[quiz.difficulty as keyof typeof difficultyStyles] || difficultyStyles.Medium;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [negativeMarking, setNegativeMarking] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(quiz.durationMinutes * 60);
  const [quizStarted, setQuizStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  
  // Hindi bilingual toggle state. Defaulting to true (Full Hindi)
  const [isHindi, setIsHindi] = useState(true);

  // Timer interval reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper function to fetch or look up localized content
  const t = (text: string) => {
    if (!isHindi) return text;
    return uiTranslations[text] || text;
  };

  const getTranslatedQuestion = (q: Question) => {
    if (isHindi && questionTranslations[q.id]) {
      return {
        ...q,
        text: questionTranslations[q.id].text,
        options: questionTranslations[q.id].options,
        explanation: questionTranslations[q.id].explanation
      };
    }
    return q;
  };

  // Fetch questions from server
  useEffect(() => {
    setLoading(true);
    fetch(`/api/quizzes/${quiz.id}/questions`)
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load questions:", err);
        setLoading(false);
      });
  }, [quiz.id]);

  // Start timer when quiz begins
  useEffect(() => {
    if (quizStarted && !submitted && secondsRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizStarted, submitted]);

  const handleStart = () => {
    setQuizStarted(true);
    setSecondsRemaining(quiz.durationMinutes * 60);
  };

  const handleSelectOption = (optionIndex: number) => {
    if (submitted) return;
    const currentQuestion = questions[currentIdx];
    
    // Lock selection once they click an answer
    if (userAnswers[currentQuestion.id] !== undefined) return;

    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }));
  };

  const handleToggleBookmark = () => {
    const qId = questions[currentIdx].id;
    setBookmarkedIds(prev => 
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    );
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    const currentQuestion = questions[currentIdx];
    if (userAnswers[currentQuestion.id] === undefined) {
      setUserAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: -1 // Special skip value
      }));
    }
    handleNext();
  };

  const handleSubmit = async () => {
    if (submitted) return;
    setSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const timeSpent = (quiz.durationMinutes * 60) - secondsRemaining;

    try {
      const res = await fetch(`/api/quizzes/${quiz.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "current-user",
          userName: userName || "Guest",
          userAnswers,
          negativeMarking,
          timeSpentSeconds: timeSpent
        })
      });
      
      const resultData = await res.json();
      setResult(resultData);
      setSubmitted(true);
      onFinished(resultData);
    } catch (err) {
      console.warn("Server submission failed or offline. Generating local results offline...", err);
      
      // Local calculation as offline fallback
      let correctAnswersCount = 0;
      let wrongAnswersCount = 0;
      let skippedCount = 0;
      let totalScore = 0;
      let totalPointsMax = 0;

      questions.forEach((question) => {
        const pts = question.points || 10;
        totalPointsMax += pts;
        const userAnswer = userAnswers[question.id];
        
        if (userAnswer === undefined || userAnswer === null || userAnswer === -1) {
          skippedCount++;
        } else if (userAnswer === question.correctOptionIndex) {
          correctAnswersCount++;
          totalScore += pts;
        } else {
          wrongAnswersCount++;
          if (negativeMarking) {
            totalScore -= Math.round(pts * 0.25);
          }
        }
      });

      const accuracy = questions.length > 0 
        ? Math.round((correctAnswersCount / (questions.length - (skippedCount === questions.length ? 0 : skippedCount) || 1)) * 100) 
        : 100;

      const attempts = (quiz.attemptsCount || 20) + 1;
      const predictedPercentile = Math.max(50, Math.min(99.8, parseFloat((80 + (correctAnswersCount / (questions.length || 1)) * 19.8).toFixed(1))));
      const rankPredicted = Math.max(1, Math.round((1 - (predictedPercentile / 100)) * attempts * 2.5));

      const offlineResult: Result = {
        id: "res-offline-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
        userId: "current-user",
        quizId: quiz.id,
        quizTitle: quiz.title,
        score: Math.max(0, totalScore),
        totalPoints: totalPointsMax,
        correctAnswersCount,
        wrongAnswersCount,
        skippedCount,
        accuracy,
        timeSpentSeconds: timeSpent,
        rankPredicted,
        percentile: predictedPercentile,
        createdAt: new Date().toISOString()
      };

      setResult(offlineResult);
      setSubmitted(true);
      onFinished(offlineResult);

      // Show offline alert/banner
      alert(
        isHindi 
          ? "⚠️ आप ऑफ़लाइन हैं! आपके परिणाम का विश्लेषण स्थानीय रूप से किया गया है और डैशबोर्ड पर सहेज लिया गया है।" 
          : "⚠️ You are offline! Your results have been analyzed locally and saved to your dashboard."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleShareResult = () => {
    const shareText = `🎯 I scored ${result?.score}/${result?.totalPoints} with ${result?.accuracy}% accuracy in "${quiz.title}" on QuizRank India! National predicted rank: #${result?.rankPredicted}. Try it now!`;
    navigator.clipboard.writeText(shareText);
    alert(isHindi ? "स्कोर को क्लिपबोर्ड पर कॉपी किया गया!" : "Shareable text copied to clipboard!");
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  const handleRestart = () => {
    setUserAnswers({});
    setBookmarkedIds([]);
    setSecondsRemaining(quiz.durationMinutes * 60);
    setCurrentIdx(0);
    setSubmitted(false);
    setResult(null);
    setQuizStarted(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold font-mono tracking-wide">{t("Loading Exam Questions...")}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-20 max-w-md mx-auto px-4">
        <AlertTriangle className="w-14 h-14 text-amber-500 mx-auto mb-4 animate-bounce" />
        <h3 className="text-xl font-black text-slate-800">{t("No Questions Found")}</h3>
        <p className="text-slate-400 mt-2 text-xs leading-relaxed">{t("Questions for this quiz are not configured yet.")}</p>
        <button onClick={onBack} className="mt-6 w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer">
          {t("Go Back")}
        </button>
      </div>
    );
  }

  // Lobby view before starting
  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white rounded-3xl p-6 md:p-8 border-t-4 border-l border-r border-b border-slate-100 shadow-xl transition-all duration-500 ease-in-out relative overflow-hidden ${
            quiz.difficulty === "Easy" ? "border-t-emerald-500 shadow-emerald-500/5" :
            quiz.difficulty === "Medium" ? "border-t-amber-500 shadow-amber-500/5" :
            "border-t-rose-500 shadow-rose-500/5"
          }`}
        >
          {/* Language Toggle in Lobby */}
          <div className="absolute top-6 right-6 z-10">
            <button
              onClick={() => setIsHindi(!isHindi)}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-[11px] px-3 py-1.5 rounded-xl border border-slate-200/50 cursor-pointer transition-colors"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-600" />
              {isHindi ? "English में देखें" : "हिन्दी में पढ़ें"}
            </button>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <span className={`px-3 py-1 text-xs font-bold rounded-full border transition-all duration-500 ${styles.badgeBg}`}>
              {t(quiz.difficulty)} {t("Level")}
            </span>
            <span className="text-xs font-semibold font-mono text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              {isHindi ? "हिन्दी संस्करण" : `${quiz.language} Version`}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 tracking-tight leading-snug">{isHindi ? (quiz.title.includes("हिंदी व्याकरण") || quiz.title.includes("संविधान") || quiz.title.includes("समसामयिकी") ? quiz.title : `${quiz.title} (मॉक टेस्ट)`) : quiz.title}</h1>
          <p className="text-slate-400 mb-6 text-xs leading-relaxed">{isHindi && quiz.id === "quiz-ssc-gd-constable" ? "सामान्य ज्ञान, इतिहास और प्रारंभिक गणित का विशेष राष्ट्रीय स्तर परीक्षा कूट अभ्यास मॉडल।" : quiz.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t("TOTAL QUESTIONS")}</span>
              <span className="text-lg font-black text-slate-800">{questions.length} {t("Questions")}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t("TIME ALLOTTED")}</span>
              <span className="text-lg font-black text-slate-800">{quiz.durationMinutes} {t("Minutes")}</span>
            </div>
          </div>

          {/* Exam rules */}
          <div className="space-y-4 mb-8">
            <h3 className="font-extrabold text-slate-800 text-xs tracking-wider uppercase">{t("Official Instructions & Marking Scheme:")}</h3>
            <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 text-slate-600 text-xs space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t("Each correct response rewards")} <strong>+10 {t("points")}</strong>.</span>
              </div>
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>{t("You can bookmark and skip questions during live practice.")}</span>
              </div>
              <div className="flex items-center gap-3 justify-between pt-1 border-t border-indigo-100/50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="leading-relaxed">{t("Enable negative marking (0.25 point penalty for wrong answers):")}</span>
                </div>
                <button
                  onClick={() => setNegativeMarking(!negativeMarking)}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${negativeMarking ? "bg-indigo-600" : "bg-slate-200"}`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${negativeMarking ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onBack}
              className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-3.5 rounded-2xl text-xs transition-colors cursor-pointer border border-slate-200"
            >
              {t("Back to Portal")}
            </button>
            <button
              onClick={handleStart}
              className={`flex-1 font-bold py-3.5 rounded-2xl text-xs transition-all duration-500 cursor-pointer shadow-md ${styles.primaryButton}`}
            >
              {t("Start Live Quiz")}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Submitted & Results view
  if (submitted && result) {
    const passingThreshold = questions.length * 0.6; // 60% passing mark
    const isWin = result.correctAnswersCount >= passingThreshold;

    const scrollToSolution = (qIndex: number) => {
      const element = document.getElementById(`solution-q-${qIndex}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    };

    return (
      <div className="max-w-4xl mx-auto px-4 py-8 relative">
        {/* Render Celebratory or Empathetic animations based on score performance */}
        {result.accuracy >= 80 ? (
          <HighScoreCelebration />
        ) : result.accuracy >= 60 ? (
          <ConfettiEffect />
        ) : (
          <EmpatheticSupportEffect />
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-2xl shadow-slate-100/50 mb-8 relative z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="text-center mb-8">
            {result.accuracy >= 80 ? (
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ 
                  scale: 1, 
                  rotate: 0
                }}
                transition={{ type: "spring", stiffness: 260, damping: 15 }}
                className="w-20 h-20 bg-amber-50 border-2 border-amber-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-500/10"
              >
                <motion.div
                  animate={{ 
                    y: [0, -8, 0],
                    rotate: [0, -8, 8, -8, 0]
                  }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Trophy className="w-11 h-11 text-amber-500 fill-amber-100" />
                </motion.div>
              </motion.div>
            ) : isWin ? (
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ 
                  scale: 1, 
                  rotate: 0
                }}
                transition={{ type: "spring", stiffness: 260, damping: 15 }}
                className="w-20 h-20 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/10"
              >
                <motion.div
                  animate={{ 
                    y: [0, -6, 0]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Award className="w-10 h-10 text-emerald-600" />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ 
                  scale: 1, 
                  x: [0, -5, 5, -5, 5, -3, 3, 0]
                }}
                transition={{ 
                  scale: { type: "spring", stiffness: 280, damping: 18 },
                  x: { duration: 0.6, delay: 0.2, ease: "easeInOut" }
                }}
                className="w-20 h-20 bg-amber-50/50 border border-amber-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/10"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="w-10 h-10 text-amber-500 fill-amber-50 animate-pulse" />
                </motion.div>
              </motion.div>
            )}

            <h1 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight leading-snug">
              {result.accuracy >= 80 
                ? (isHindi ? "शानदार! आपने अधिकारी-स्तरीय अंक प्राप्त किए! 🏆" : "Phenomenal! Top Officer Rank Mastered! 🏆")
                : isWin 
                ? t("Congratulations! You Passed! 🎉") 
                : (isHindi ? "मजबूत प्रयास! अभ्यास जारी रखें! 🌱" : "Noble Effort! We Believe in You! 🌱")
              }
            </h1>
            <p className="text-slate-500 text-xs mt-2 max-w-lg mx-auto leading-relaxed">
              {result.accuracy >= 80
                ? (isHindi 
                    ? "शानदार कूट-स्तर तैयारी! आपके प्रदर्शन ने शीर्ष तोप-सूची में आने का प्रमाण दिया है। इसी तरह आगे बढ़ें!" 
                    : "Outstanding conceptual depth! You have executed this practice set with master-tier accuracy and speed. Sky-high potential!")
                : isWin 
                ? t("Excellent job! You performed exceptionally well in this mock exam. Keep up the great work!")
                : (isHindi 
                    ? "निराश न हों! हर गलती हमें मजबूत बनाती है। नीचे दी गई 'व्याख्यात्मक विश्लेषण' का उपयोग कर कमजोर कड़ियों को सुधारें और फिर से चुनौती लें!" 
                    : "Do not be discouraged! Gaps identified are simply future milestones waiting to be crossed. Review the answers below to secure full marks on your next attempt!")
              }
            </p>
          </div>

          {/* Visual Performance Summary Card */}
          <div className="bg-slate-50 rounded-3xl p-5 md:p-6 border border-slate-100 shadow-inner mb-8 space-y-6">
            <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
              <span>{isHindi ? "विजुअल प्रदर्शन सारांश" : "Visual Performance Summary"}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              
              {/* Radial Accuracy Indicator (5 cols on md) */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200/40 shadow-xs relative">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  {/* Decorative background pulse */}
                  <div className={`absolute inset-2 rounded-full opacity-10 animate-pulse ${
                    result.accuracy >= 80 ? "bg-amber-500" : result.accuracy >= 60 ? "bg-emerald-500" : "bg-indigo-500"
                  }`} />
                  
                  {/* Animated SVG Donut */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle 
                      cx="60" 
                      cy="60" 
                      r="50" 
                      fill="none" 
                      stroke="#f1f5f9" 
                      strokeWidth="8"
                    />
                    <motion.circle 
                      cx="60" 
                      cy="60" 
                      r="50" 
                      fill="none" 
                      stroke={
                        result.accuracy >= 80 ? "#f59e0b" : 
                        result.accuracy >= 60 ? "#10b981" : "#4f46e5"
                      } 
                      strokeWidth="9"
                      strokeDasharray={2 * Math.PI * 50}
                      initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 50 - (result.accuracy / 100) * (2 * Math.PI * 50) }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  {/* Score & Label */}
                  <div className="absolute flex flex-col items-center text-center">
                    <span className="text-3xl font-black text-slate-800 tracking-tight">{result.accuracy}%</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isHindi ? "सटीकता" : "Accuracy"}</span>
                  </div>
                </div>

                {/* Accuracy feedback tag */}
                <span className={`mt-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  result.accuracy >= 80 ? "bg-amber-50 text-amber-600 border border-amber-100" :
                  result.accuracy >= 60 ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                  "bg-indigo-50 text-indigo-600 border border-indigo-100"
                }`}>
                  {result.accuracy >= 80 ? (isHindi ? "उत्कृष्ट प्रदर्शन (Elite)" : "Elite Rank") :
                   result.accuracy >= 60 ? (isHindi ? "संतुष्ट (Qualified)" : "Qualified") :
                   (isHindi ? "अभ्यास निरंतर जारी रखें" : "Developing")}
                </span>
              </div>

              {/* Interactive Question Navigation Map (7 cols on md) */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-3 p-4 bg-white rounded-2xl border border-slate-200/40 shadow-xs">
                <div>
                  <h4 className="font-extrabold text-slate-700 text-xs tracking-wide uppercase mb-1">
                    {isHindi ? "प्रश्न प्रतिक्रिया चार्ट (क्लिक करें):" : "Interactive Response Navigator:"}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {isHindi ? "किसी भी बबल पर क्लिक करें और सीधे विस्तृत समाधान विश्लेषण पर कूदें।" : "Click any question bubble below to instantly jump down to its specific solution key analysis."}
                  </p>
                </div>

                {/* List of Bubbles */}
                <div className="grid grid-cols-5 gap-2 pt-1">
                  {questions.map((q, idx) => {
                    const ansIdx = userAnswers[q.id];
                    const isCorrect = ansIdx === q.correctOptionIndex;
                    const isSkipped = ansIdx === undefined || ansIdx === null || ansIdx === -1;
                    
                    let bgClass = "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100/70 shadow-rose-500/5";
                    let icon = <XCircle className="w-3.5 h-3.5 shrink-0" />;
                    if (isCorrect) {
                      bgClass = "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100/70 shadow-emerald-500/5";
                      icon = <CheckCircle className="w-3.5 h-3.5 shrink-0" />;
                    } else if (isSkipped) {
                      bgClass = "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 shadow-slate-500/5";
                      icon = <HelpCircle className="w-3.5 h-3.5 shrink-0" />;
                    }

                    return (
                      <button
                        key={`map-${q.id}`}
                        onClick={() => scrollToSolution(idx)}
                        className={`p-2 rounded-xl border text-xs font-black flex items-center justify-center gap-1 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm ${bgClass}`}
                        title={isCorrect ? "Correct" : isSkipped ? "Skipped" : "Incorrect"}
                      >
                        <span className="font-mono text-[10px]">Q{idx + 1}</span>
                        {icon}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-4 text-[9px] font-bold text-slate-400 font-mono pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> {t("Correct")}</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> {t("Wrong")}</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400" /> {t("Skipped")}</span>
                </div>
              </div>

            </div>

            {/* Personalized Empathetic Guidance & Revision Blueprint Card */}
            <div className={`p-4 md:p-5 rounded-2xl border transition-all duration-500 ${
              result.accuracy >= 80 ? "bg-amber-50/50 border-amber-100 text-slate-700" :
              result.accuracy >= 60 ? "bg-emerald-50/50 border-emerald-100 text-slate-700" :
              "bg-indigo-50/50 border-indigo-100 text-slate-700"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1 rounded-lg bg-white/80 border border-inherit shadow-xs">
                  {result.accuracy >= 80 ? (
                    <Trophy className="w-4 h-4 text-amber-500" />
                  ) : result.accuracy >= 60 ? (
                    <Award className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-indigo-500 animate-spin" style={{ animationDuration: '6s' }} />
                  )}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {isHindi ? "एआई मेंटर विश्लेषण और परामर्श" : "Empathetic Mentorship Insights"}
                </span>
              </div>
              
              <h4 className="text-sm font-black text-slate-800 mb-1">
                {result.accuracy >= 80 ? (
                  isHindi ? "उत्कृष्ट! अधिकारी रैंक योग्यता अर्जित की 🏆" : "Excellent! Officer Rank Clarity Achieved! 🏆"
                ) : result.accuracy >= 60 ? (
                  isHindi ? "सफल! मानक कट-ऑफ पास किया 🎖️" : "Qualified! Secure Clearance Level 🎖️"
                ) : (
                  isHindi ? "मजबूत कदम! तैयारी की यात्रा अभी शुरू हुई है 🌱" : "Syllabus Explorer! Preparation Journey is Active 🌱"
                )}
              </h4>

              <p className="text-xs leading-relaxed font-semibold text-slate-600">
                {result.accuracy >= 80 ? (
                  isHindi 
                    ? "असाधारण प्रदर्शन! आपकी वैचारिक समझ और सटीकता सर्वोच्च स्तर पर है। आपने इस मॉक टेस्ट में उत्कृष्ट अंक हासिल किए हैं। इस निरंतरता को बनाए रखें और अपनी गति सुधारने पर काम करें।" 
                    : "Outstanding attempt! Your core clarity and choice precision are highly mature. You've conquered this practice set with topper-tier performance. Focus on keeping up this high-yield accuracy across all subjects."
                ) : result.accuracy >= 60 ? (
                  isHindi 
                    ? "बधाई हो! आपने परीक्षा के सामान्य कट-ऑफ को सफलतापूर्वक पार कर लिया है। आपके पास एक बहुत मजबूत आधार है। इस स्कोर को 90%+ सटीकता में बदलने के लिए उन 1-2 अवधारणाओं को नीचे विस्तार से पढ़ें जिन्हें आपने गलत किया।" 
                    : "Excellent attempt! You have comfortably cleared the standard competitive mock cut-off. To elevate your rank into the top 5% bracket, scroll below to carefully review explanations of the few questions that slipped through."
                ) : (
                  isHindi 
                    ? "चिंता न करें! तैयारी का हर मॉक टेस्ट हमें एक नया अवसर देता है। आपके कई प्रयास बेहद करीब थे। यह असफलता नहीं बल्कि एक रोडमैप है कि आपको कौन से टॉपिक दोबारा संशोधित करने हैं। नीचे दी गई 'व्याख्यात्मक विश्लेषण' का अध्ययन करें और पूरे जोश के साथ फिर प्रयास करें!" 
                    : "Every master starts exactly here. Preparation is an organic journey, and identifying gaps is the absolute superpower of mock tests. The topics you missed represent the immediate blueprint of your next breakthrough. Read the detailed explanatory keys below to patch these gaps, and jump back in for a rematch!"
                )}
              </p>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 text-center shadow-xs">
              <span className="block text-[9px] font-extrabold text-blue-500 uppercase tracking-wider mb-1">{t("Score Obtained")}</span>
              <span className="text-2xl font-black text-slate-800">{result.score} / {result.totalPoints}</span>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 text-center shadow-xs">
              <span className="block text-[9px] font-extrabold text-purple-500 uppercase tracking-wider mb-1">{t("Accuracy")}</span>
              <span className="text-2xl font-black text-slate-800">{result.accuracy}%</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100 text-center shadow-xs">
              <span className="block text-[9px] font-extrabold text-emerald-500 uppercase tracking-wider mb-1">{t("Predicted Rank")}</span>
              <span className="text-2xl font-black text-slate-800">#{result.rankPredicted}</span>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100 text-center shadow-xs">
              <span className="block text-[9px] font-extrabold text-amber-500 uppercase tracking-wider mb-1">{t("Percentile")}</span>
              <span className="text-2xl font-black text-slate-800">{result.percentile}%ile</span>
            </div>
          </div>

          {/* Detailed analysis of answers */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100/80 mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
              <h3 className="font-extrabold text-slate-800 text-xs tracking-wider uppercase">{t("Response Breakdown:")}</h3>
              <div className="flex gap-2.5 text-[10px] font-bold font-mono">
                <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">{t("Correct")}: {result.correctAnswersCount}</span>
                <span className="text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md">{t("Wrong")}: {result.wrongAnswersCount}</span>
                <span className="text-slate-600 bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded-md">{t("Skipped")}: {result.skippedCount}</span>
              </div>
            </div>
            
            <div className="text-[11px] text-slate-500 space-y-1.5 pt-2 border-t border-slate-200/50">
              <p>⏱️ {t("Total practice time taken:")} <strong className="text-slate-800">{formatTime(result.timeSpentSeconds)}</strong></p>
              <p>🎯 {t("Negative marking applied:")} <strong className="text-slate-800">{negativeMarking ? t("Yes (0.25 point penalty)") : t("No (Disabled)")}</strong></p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3.5">
            <button
              onClick={handleShareResult}
              className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-extrabold py-3 px-3 rounded-xl text-xs transition-colors cursor-pointer border border-slate-200"
            >
              <Share2 className="w-4 h-4 text-slate-500" /> {t("Share Score")}
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-extrabold py-3 px-3 rounded-xl text-xs transition-colors cursor-pointer border border-slate-200"
            >
              <Download className="w-4 h-4 text-slate-500" /> {t("Download PDF Report")}
            </button>
            <button
              onClick={handleRestart}
              className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-extrabold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-emerald-500/10 hover:-translate-y-0.5"
            >
              <RefreshCw className="w-4 h-4 animate-spin" style={{ animationDuration: "3.5s" }} /> {isHindi ? "पुनः प्रयास करें" : "Practice Again"}
            </button>
            <button
              onClick={onBack}
              className="flex-1 min-w-[150px] inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-extrabold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-md hover:-translate-y-0.5"
            >
              {t("Return to Portal")} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Detailed Solutions Key */}
        <h2 className="text-lg font-black text-slate-900 mb-4 tracking-tight">{t("Question & Solution Key Analysis:")}</h2>
        <div className="space-y-6">
          {questions.map((q, qIndex) => {
            const answerIndex = userAnswers[q.id];
            const isCorrect = answerIndex === q.correctOptionIndex;
            const isSkipped = answerIndex === undefined || answerIndex === null || answerIndex === -1;
            const transQ = getTranslatedQuestion(q);
            
            return (
              <div key={q.id} id={`solution-q-${qIndex}`} className={`p-6 rounded-3xl bg-white border scroll-mt-6 ${
                isSkipped ? "border-slate-200 shadow-sm" : isCorrect ? "border-emerald-200 shadow-emerald-50/10 shadow-lg" : "border-rose-200 shadow-rose-50/10 shadow-lg"
              } space-y-4`}>
                <div className="flex justify-between items-start gap-4">
                  <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">{t("QUESTION")} {qIndex + 1}</span>
                  <span className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                    isSkipped ? "bg-slate-100 text-slate-500" :
                    isCorrect ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                  }`}>
                    {isSkipped ? t("Skipped") : isCorrect ? t("Correct") : t("Incorrect")}
                  </span>
                </div>
                
                <h4 className="text-sm md:text-base font-bold text-slate-800 leading-relaxed">{transQ.text}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {transQ.options.map((opt, oIndex) => {
                    const isCorrectOption = oIndex === q.correctOptionIndex;
                    const isSelectedOption = oIndex === answerIndex;
                    
                    let optClass = "border-slate-100 bg-slate-50 text-slate-600";
                    if (isCorrectOption) {
                      optClass = "border-emerald-200 bg-emerald-50/70 text-emerald-800 font-bold";
                    } else if (isSelectedOption && !isCorrect) {
                      optClass = "border-rose-200 bg-rose-50 text-rose-800 font-bold";
                    }
                    
                    return (
                      <div key={oIndex} className={`p-3.5 rounded-xl border text-xs flex justify-between items-center ${optClass}`}>
                        <span className="font-medium">{opt}</span>
                        {isCorrectOption && <span className="text-emerald-600 font-extrabold text-[10px] shrink-0 ml-2">✓ {t("✓ Correct Key")}</span>}
                        {isSelectedOption && !isCorrect && <span className="text-rose-600 font-extrabold text-[10px] shrink-0 ml-2">✗ {t("✗ Your Answer")}</span>}
                      </div>
                    );
                  })}
                </div>
                
                {/* Explanation text */}
                <div className="mt-4 p-4 rounded-2xl bg-blue-50/30 border border-blue-100/50">
                  <div className="flex items-center gap-1.5 text-blue-700 font-extrabold text-xs mb-1.5 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 shrink-0" /> {t("EXPLANATORY ANALYSIS")}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{transQ.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active quiz playing interface
  const rawQuestion = questions[currentIdx];
  const currentQuestion = getTranslatedQuestion(rawQuestion);
  const totalQuestions = questions.length;
  const progressPercent = Math.round(((currentIdx + 1) / totalQuestions) * 100);
  const isAnswered = userAnswers[rawQuestion.id] !== undefined;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 relative">

      {/* Smooth animated progress bar at the top of the screen */}
      <div className="mb-6 bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-slate-100/80 shadow-sm shadow-slate-100/20">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
          <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: styles.pulseColor }} />
            {t("Practice Progress")}
          </span>
          <span className="font-mono text-slate-700 font-extrabold">{progressPercent}% ({currentIdx + 1}/{totalQuestions} {t("Questions")})</span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
          <motion.div
            className={`h-full ${styles.progressBar}`}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
          />
        </div>
      </div>
      
      {/* Quiz Top Action Row with Language Toggle & Back Button */}
      <div className="flex items-center justify-between gap-4 mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100/80 shadow-xs">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-800 font-bold text-xs cursor-pointer transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> {t("Back to Portal")}
        </button>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono hidden sm:inline">
            Active Practice Session
          </span>
          {/* Real-time language switch during the quiz! */}
          <button
            onClick={() => setIsHindi(!isHindi)}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 font-extrabold text-[11px] px-3.5 py-1.5 rounded-xl border border-slate-200 cursor-pointer shadow-xs transition-colors"
          >
            <Languages className="w-3.5 h-3.5 text-indigo-600" />
            {isHindi ? "English में देखें" : "हिन्दी में पढ़ें"}
          </button>
        </div>
      </div>

      {/* Dynamic Difficulty Status Indicator Bar */}
      <div className={`mb-6 p-4 rounded-3xl border transition-all duration-500 ease-in-out flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${styles.accentBg}`}>
        <div className="flex items-center gap-3">
          <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: styles.pulseColor }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: styles.pulseColor }} />
          </span>
          <div>
            <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm flex flex-wrap items-center gap-1.5">
              <span>{isHindi ? "सक्रिय अभ्यास कठिनाई:" : "Active Practice Difficulty:"}</span>
              <span className={`text-xs sm:text-sm font-black transition-colors duration-500 uppercase tracking-wide ${styles.text}`}>
                {t(quiz.difficulty)} {t("Level")}
              </span>
            </h3>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-0.5">
              {quiz.difficulty === "Easy" && (isHindi ? "बुनियादी स्तर की जांच: इस सेट में सीधे और उच्च सफलता वाले प्रश्न शामिल हैं।" : "Foundational Evaluation: This set contains clear, highly approachable syllabus questions.")}
              {quiz.difficulty === "Medium" && (isHindi ? "मानक परीक्षा पैटर्न: वास्तविक राज्य और राष्ट्रीय परीक्षाओं के कठिनाई स्तर के अनुरूप।" : "Standard Exam Pattern: Perfectly calibrated to the standard of state and local board mock levels.")}
              {quiz.difficulty === "Hard" && (isHindi ? "उच्च-स्तरीय चुनौती: कट-ऑफ टॉपर्स के लिए कठिन वैचारिक और गणनात्मक प्रश्न।" : "High-Tier Challenge: Complex analytical and high-yield questions for serious aspirants.")}
            </p>
          </div>
        </div>
        
        {/* Visual Level Meters */}
        <div className="flex items-center gap-1 bg-white/70 p-1.5 rounded-xl border border-slate-200/40 shrink-0 self-start sm:self-auto">
          <div className={`w-8 h-2 rounded-lg transition-all duration-500 ${
            quiz.difficulty === "Easy" ? "bg-emerald-500" :
            quiz.difficulty === "Medium" ? "bg-amber-500" : "bg-rose-500"
          }`} />
          <div className={`w-8 h-2 rounded-lg transition-all duration-500 ${
            quiz.difficulty === "Easy" ? "bg-slate-200" :
            quiz.difficulty === "Medium" ? "bg-amber-500" : "bg-rose-500"
          }`} />
          <div className={`w-8 h-2 rounded-lg transition-all duration-500 ${
            quiz.difficulty === "Easy" ? "bg-slate-200" :
            quiz.difficulty === "Medium" ? "bg-slate-200" : "bg-rose-500"
          }`} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Question panel (left, col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-100/50 space-y-6">
            
            {/* Top Info Bar */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-400">
                {t("QUESTION")} {currentIdx + 1} {t("OF")} {totalQuestions}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-500 font-mono flex items-center gap-1.5">
                  <Timer className={`w-4 h-4 animate-pulse transition-colors duration-500 ${styles.text}`} /> {formatTime(secondsRemaining)}
                </span>
                <button
                  onClick={handleToggleBookmark}
                  className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                    bookmarkedIds.includes(rawQuestion.id) 
                      ? "bg-amber-50 text-amber-500 border border-amber-200" 
                      : "bg-slate-50 text-slate-400 hover:text-slate-600 border border-slate-200"
                  }`}
                  title="Bookmark Question"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
              <motion.div 
                className={`h-full ${styles.progressBar}`} 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ type: "spring", stiffness: 80, damping: 15 }}
              />
            </div>

            {/* Question Text with Animated Entrance */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIdx}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="pt-2"
              >
                <h2 className="text-base md:text-lg font-bold text-slate-800 leading-relaxed">
                  {currentQuestion.text}
                </h2>
              </motion.div>
            </AnimatePresence>

            {/* Multiple choice options */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((option, oIdx) => {
                const isSelected = userAnswers[rawQuestion.id] === oIdx;
                const isCorrectOption = oIdx === rawQuestion.correctOptionIndex;

                return (
                  <motion.button
                    key={`${currentIdx}-${oIdx}`}
                    onClick={() => handleSelectOption(oIdx)}
                    whileHover={{ scale: isAnswered ? 1 : 1.006 }}
                    whileTap={{ scale: isAnswered ? 1 : 0.994 }}
                    animate={
                      isAnswered && isSelected
                        ? isCorrectOption
                          ? { 
                              scale: [1, 1.05, 0.98, 1.02, 1], 
                              borderColor: ["#e2e8f0", "#10b981", "#10b981"],
                              backgroundColor: ["#ffffff", "#d1fae5", "#f0fdf4"],
                              boxShadow: ["0px 0px 0px rgba(16,185,129,0)", "0px 0px 15px rgba(16,185,129,0.3)", "0px 0px 2px rgba(16,185,129,0.1)"]
                            }
                          : { 
                              x: [0, -10, 10, -8, 8, -5, 5, 0], 
                              borderColor: ["#e2e8f0", "#ef4444", "#ef4444"],
                              backgroundColor: ["#ffffff", "#fee2e2", "#fef2f2"],
                              scale: [1, 0.98, 1.01, 1]
                            }
                        : isAnswered && oIdx === rawQuestion.correctOptionIndex
                        ? { 
                            scale: [1, 1.03, 1], 
                            borderColor: ["#e2e8f0", "#10b981", "#10b981"],
                            backgroundColor: ["#ffffff", "#f0fdf4", "#f0fdf4"]
                          }
                        : {}
                    }
                    transition={{
                      type: "tween",
                      ease: "easeInOut",
                      duration: 0.5,
                      scale: { type: "keyframes", duration: 0.5 },
                      x: { type: "keyframes", duration: 0.5 },
                      borderColor: { duration: 0.3 },
                      backgroundColor: { duration: 0.3 }
                    }}
                    className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${
                      isSelected 
                        ? isCorrectOption
                          ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-extrabold ring-2 ring-emerald-500 shadow-xs" 
                          : "border-rose-500 bg-rose-50 text-rose-800 font-extrabold ring-2 ring-rose-500 shadow-xs"
                        : isAnswered && oIdx === rawQuestion.correctOptionIndex
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-extrabold ring-2 ring-emerald-500/60 shadow-xs"
                        : `border-slate-100 hover:shadow-md hover:shadow-slate-100/50 text-slate-600 transition-all duration-300 ${
                            quiz.difficulty === "Easy" ? "hover:border-emerald-500 hover:bg-emerald-50/45" :
                            quiz.difficulty === "Medium" ? "hover:border-amber-500 hover:bg-amber-50/45" :
                            "hover:border-rose-500 hover:bg-rose-50/45"
                          }`
                    }`}
                  >
                    <div className="flex items-center gap-3 pr-2">
                      <span className={`w-6.5 h-6.5 shrink-0 rounded-full flex items-center justify-center border text-[11px] font-black ${
                        isSelected 
                          ? isCorrectOption
                            ? "bg-emerald-600 border-emerald-600 text-white" 
                            : "bg-rose-600 border-rose-600 text-white"
                          : isAnswered && oIdx === rawQuestion.correctOptionIndex
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-slate-200 text-slate-400 bg-white"
                      }`}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="font-medium leading-relaxed">{option}</span>
                    </div>

                    {isAnswered && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                        className="shrink-0 pl-1"
                      >
                        {isSelected && isCorrectOption && (
                          <span className="text-emerald-600 text-xs font-black flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" /> {t("✓ Correct Key")}
                          </span>
                        )}
                        {isSelected && !isCorrectOption && (
                          <span className="text-rose-600 text-xs font-black flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> {t("✗ Your Answer")}
                          </span>
                        )}
                        {!isSelected && oIdx === rawQuestion.correctOptionIndex && (
                          <span className="text-emerald-600 text-xs font-black flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" /> {t("✓ Correct Key")}
                          </span>
                        )}
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Instant educational explanation card once answered */}
            {isAnswered && userAnswers[rawQuestion.id] !== -1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-2xl border text-slate-700 text-xs space-y-1.5 transition-all duration-500 ease-in-out ${styles.accentBg}`}
              >
                <div className={`flex items-center gap-1.5 font-extrabold uppercase tracking-wider text-[10px] transition-colors duration-500 ${styles.accentText}`}>
                  <ShieldCheck className="w-4 h-4 shrink-0" /> {t("EXPLANATORY ANALYSIS")}
                </div>
                <p className="leading-relaxed font-medium">
                  {currentQuestion.explanation}
                </p>
              </motion.div>
            )}

            {/* Footer Controls */}
            <div className="flex gap-3 justify-between pt-4 border-t border-slate-100">
              <button
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className={`inline-flex items-center gap-1 text-xs font-bold py-2.5 px-4 rounded-xl border transition-colors ${
                  currentIdx === 0 
                    ? "border-slate-100 text-slate-300 bg-slate-50 cursor-not-allowed" 
                    : "border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
                }`}
              >
                <ChevronLeft className="w-4 h-4" /> {t("Previous")}
              </button>

              <button
                onClick={handleSkip}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-3 py-2 cursor-pointer transition-colors"
              >
                {t("Skip Question")}
              </button>

              {currentIdx < totalQuestions - 1 ? (
                <button
                  onClick={handleNext}
                  className={`inline-flex items-center gap-1 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all duration-500 cursor-pointer ${styles.primaryButton}`}
                >
                  {t("Next")} <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className={`inline-flex items-center gap-1 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all duration-500 cursor-pointer shadow-sm ${styles.primaryButton}`}
                >
                  {submitting ? t("Submitting Exam...") : t("Submit Exam")}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Grid Jump navigation panel (right, col-span-1) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-100/50 space-y-6">
            <h3 className="font-extrabold text-slate-800 text-xs tracking-wider uppercase border-b border-slate-100 pb-3">
              {t("Exam Navigation Console")}
            </h3>

            {/* Jump grid */}
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, index) => {
                const answer = userAnswers[q.id];
                const isQAnswered = answer !== undefined && answer !== null && answer !== -1;
                const isQSkipped = answer === -1;
                const isQBookmarked = bookmarkedIds.includes(q.id);
                const isCurrent = index === currentIdx;

                let btnClass = "border-slate-100 bg-slate-50 text-slate-400";
                if (isCurrent) {
                  btnClass = `font-black ring-1 transition-all duration-500 ${styles.activeNav}`;
                } else if (isQBookmarked) {
                  btnClass = "border-amber-300 bg-amber-50 text-amber-700 font-bold";
                } else if (isQAnswered) {
                  btnClass = "border-emerald-200 bg-emerald-50 text-emerald-700 font-bold";
                } else if (isQSkipped) {
                  btnClass = "border-rose-200 bg-rose-50 text-rose-700 font-bold";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(index)}
                    className={`h-10 rounded-xl border text-xs flex items-center justify-center transition-all cursor-pointer ${btnClass}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            {/* Indicator definitions */}
            <div className="space-y-2 pt-3 border-t border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-emerald-50 border border-emerald-200" />
                <span className="text-slate-500 text-[9px]">{t("Answered Mock Questions")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-amber-50 border border-amber-300" />
                <span className="text-slate-500 text-[9px]">{t("Bookmarked for Review")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-rose-50 border border-rose-200" />
                <span className="text-slate-500 text-[9px]">{t("Skipped Assessment Questions")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-slate-50 border border-slate-200" />
                <span className="text-slate-500 text-[9px]">{t("Unvisited")}</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`w-full font-extrabold py-3 rounded-2xl text-[10px] uppercase tracking-wider transition-all duration-500 cursor-pointer mt-2 ${styles.primaryButton}`}
            >
              {submitting ? t("Submitting Exam...") : t("Instant Review & Finish")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
