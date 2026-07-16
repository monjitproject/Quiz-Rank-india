import React, { useState } from "react";
import { 
  Building, Users, CheckCircle2, Calendar, DollarSign, Award, 
  BookOpen, FileText, HelpCircle, ExternalLink, AlertTriangle, 
  Sparkles, Clock, ArrowRight, ClipboardCheck, Percent, HelpCircle as HelpIcon, ShieldCheck
} from "lucide-react";

interface JobPostEditorialProps {
  postTitle: string;
  category: string;
  isHindi?: boolean;
}

export function JobPostEditorial({ postTitle, category, isHindi = true }: JobPostEditorialProps) {
  const [activeTab, setActiveTab] = useState<"details" | "strategy">("details");

  // Determine the primary organization based on the post title or category
  const orgName = postTitle.includes("रेलवे") || postTitle.includes("RRB") || postTitle.includes("NTPC") || category === "Railway"
    ? "Railway Recruitment Board (RRB)"
    : postTitle.includes("SSC") || postTitle.includes("CGL") || category === "SSC"
    ? "Staff Selection Commission (SSC)"
    : postTitle.includes("Police") || postTitle.includes("पुलिस")
    ? "State Police Recruitment Board"
    : "Government Public Service Commission";

  const orgNameHindi = orgName.includes("Railway")
    ? "रेलवे भर्ती बोर्ड (RRB)"
    : orgName.includes("Staff Selection")
    ? "कर्मचारी चयन आयोग (SSC)"
    : orgName.includes("Police")
    ? "राज्य पुलिस भर्ती एवं प्रोन्नति बोर्ड"
    : "सरकारी लोक सेवा आयोग";

  // Structured vacancy details based on the post
  const vacanciesCount = postTitle.includes("Constable") || postTitle.includes("constable") || postTitle.includes("जीडी")
    ? "26,146 + Posts (General Duty / Constable)"
    : postTitle.includes("CGL") || postTitle.includes("cgl")
    ? "17,727 + Posts (Group B & C Officers)"
    : "10,000 + Posts (Multiple Vacancies)";

  const vacanciesCountHindi = vacanciesCount.includes("26,146")
    ? "26,146+ पद (सामान्य ड्यूटी / कांस्टेबल)"
    : vacanciesCount.includes("17,727")
    ? "17,727+ पद (ग्रुप 'बी' और 'सी' अधिकारी)"
    : "10,000+ पद (विभिन्न श्रेणी की रिक्तियां)";

  // FAQ generator for the specific job
  const jobFAQs = [
    {
      q: isHindi ? `क्या इस ${postTitle} परीक्षा के लिए बाहरी राज्यों के उम्मीदवार आवेदन कर सकते हैं?` : `Can out-of-state candidates apply for this ${postTitle} recruitment?`,
      a: isHindi 
        ? "हाँ, सामान्यतः भारत के किसी भी राज्य का नागरिक इसके लिए आवेदन कर सकता है, परन्तु आरक्षण का लाभ केवल गृह राज्य के मूल निवासियों को ही मिलता है।" 
        : "Yes, any Indian citizen is generally eligible. However, reservation benefits are reserved exclusively for domicile residents of the organizing state."
    },
    {
      q: isHindi ? `क्या इसमें अंतिम वर्ष (Final Year) के छात्र आवेदन करने के योग्य हैं?` : "Are final-year appearing candidates eligible to apply?",
      a: isHindi 
        ? "नहीं, आवेदन की अंतिम तिथि तक आपके पास आवश्यक न्यूनतम शैक्षणिक प्रमाण पत्र होना अनिवार्य है। अपीयरिंग उम्मीदवार सामान्यतः योग्य नहीं माने जाते।" 
        : "No, candidates must possess the completed educational qualification certificate by the official registration deadline."
    },
    {
      q: isHindi ? "क्या चयन प्रक्रिया में इंटरव्यू (साक्षात्कार) शामिल है?" : "Is there an interview in the selection process?",
      a: isHindi 
        ? `${orgNameHindi} में ग्रुप 'बी' अराजपत्रित और ग्रुप 'सी' पदों के लिए इंटरव्यू समाप्त कर दिया गया है। चयन शुद्ध रूप से कंप्यूटर लिखित परीक्षा पर आधारित होता है।` 
        : `No, the interview has been discontinued for Group B non-gazetted and Group C posts under ${orgName}. Selection is purely based on the Computer Based Written Exam.`
    },
    {
      q: isHindi ? "इस भर्ती के लिए आवेदन शुल्क कितना है?" : "What is the application fee for this notification?",
      a: isHindi 
        ? "सामान्य और ओबीसी श्रेणी के लिए शुल्क ₹100 है। अनुसूचित जाति (SC), अनुसूचित जनजाति (ST), दिव्यांगों और महिला उम्मीदवारों के लिए आवेदन पूर्णतः निःशुल्क है।" 
        : "The application fee for General/OBC candidates is ₹100. SC, ST, PwD, and female candidates are exempted from paying the registration fee."
    },
    {
      q: isHindi ? "क्या परीक्षा में कोई नकारात्मक अंकन (Negative Marking) होता है?" : "Does the written examination include negative marking?",
      a: isHindi 
        ? "हाँ, प्रत्येक गलत उत्तर देने पर 0.25 अंकों (या कुल अंक का 1/4) की कटौती की जाती है। परीक्षा में अत्यधिक सावधानी आवश्यक है।" 
        : "Yes, a negative marking penalty of 0.25 marks (or 1/4th of the allotted mark) is applied for each incorrect answer."
    },
    {
      q: isHindi ? "क्या कंप्यूटर टाइपिंग टेस्ट (Skill Test) अनिवार्य है?" : "Is the computer typing test mandatory for all applicants?",
      a: isHindi 
        ? "नहीं, यह केवल कुछ विशिष्ट लिपिक (Clerical/Data Entry Operator) पदों के लिए आवश्यक है, सभी पदों के लिए नहीं।" 
        : "No, typing and skill tests are only applicable to specific clerical and executive assistant roles, not all listed vacancies."
    },
    {
      q: isHindi ? "चयनित होने के बाद प्रारंभिक मासिक वेतन (In-hand Salary) कितना होगा?" : "What is the starting monthly in-hand salary for these posts?",
      a: isHindi 
        ? "7वें वेतन आयोग के अनुसार, प्रारंभिक वेतन महंगाई भत्ते (DA) और मकान किराये भत्ते (HRA) के साथ लगभग ₹32,000 से ₹65,000 प्रति माह के बीच होता है।" 
        : "As per the 7th Pay Commission, the starting in-hand salary ranges between ₹32,000 to ₹65,000 per month, inclusive of DA and HRA allowances."
    },
    {
      q: isHindi ? "फोटो और हस्ताक्षर अपलोड करने का आकार क्या होना चाहिए?" : "What are the required dimensions for uploading images?",
      a: isHindi 
        ? "पासपोर्ट साइज रंगीन फोटो का आकार 20KB से 50KB के बीच और हस्ताक्षर का आकार 10KB से 20KB के बीच (JPG प्रारूप) होना चाहिए।" 
        : "The passport size photograph must be between 20KB to 50KB, and signature must be between 10KB to 20KB in standard .JPG/.JPEG format."
    }
  ];

  // Schema Generation for SEO search engines
  const schemaJSON = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": jobFAQs.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };

  return (
    <div className="space-y-12 pt-8 border-t border-slate-100">
      
      {/* Schema Injection */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJSON) }} />

      {/* SECTION 1: Introduction */}
      <section className="space-y-3.5">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 border-l-4 border-indigo-600 pl-3.5">
          {isHindi ? "1. भर्ती प्रस्तावना (Introduction)" : "1. Official Recruitment Introduction"}
        </h2>
        <p className="text-slate-600 text-xs md:text-sm leading-relaxed whitespace-pre-line font-medium">
          {isHindi ? (
            `सरकारी नौकरी की तलाश कर रहे भारत के होनहार अभ्यर्थियों के लिए एक अत्यंत महत्वपूर्ण और सुनहरा अवसर सामने आया है। ${orgNameHindi} द्वारा आधिकारिक तौर पर ${postTitle} की भर्ती के लिए एक विस्तृत विज्ञापन जारी किया गया है। यह अभियान देश के रक्षा बलों, प्रशासनिक विभागों या रेल प्रणालियों में एक स्थायी और सुरक्षित भविष्य बनाने की दिशा में एक क्रांतिकारी कदम है।

लाखों युवाओं के सपनों को साकार करने वाली यह भर्ती न केवल रोजगार की सुरक्षा प्रदान करती है, बल्कि समाज में एक विशिष्ट सम्मान और प्रतिष्ठा भी सुनिश्चित करती है। यदि आप भी एक राष्ट्रभक्त और समर्पित लोक सेवक के रूप में देश सेवा करने का जुनून रखते हैं, तो इस व्यापक लेख को अत्यंत ध्यानपूर्वक पढ़ें। यहाँ हम आपको परीक्षा की पात्रता, पाठ्यक्रम, वेतनमान, और आवेदन की सूक्ष्म प्रक्रियाओं से अवगत कराएंगे ताकि आप बिना किसी त्रुटि के अपना आवेदन जमा कर सकें।`
          ) : (
            `An outstanding and highly anticipated employment opportunity has been officially announced by the ${orgName} with the publication of the detailed advertisement for the ${postTitle} enlistment program. This recruitment drive is a vital gateway for millions of young graduates and matriculates seeking a stable, high-yielding, and prestigious career path in the core divisions of public administration.

Securing a position under this notification not only guarantees unmatched job security and extensive social benefits but also positions you at the frontlines of national service. If you possess the required dedication, educational caliber, and logical capability to clear India's rigorous competitive standard, this structured editorial guide is your ultimate blueprint. Below, we provide an exhaustive analysis of eligibility parameters, syllabus splits, exam formats, and correct step-by-step application practices.`
          )}
        </p>
      </section>

      {/* SECTION 2: Organization Overview */}
      <section className="space-y-3.5 pt-2">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 border-l-4 border-indigo-600 pl-3.5">
          {isHindi ? `2. संगठन का व्यापक विवरण (Organization Overview)` : `2. Comprehensive Organization Overview`}
        </h2>
        <p className="text-slate-600 text-xs md:text-sm leading-relaxed whitespace-pre-line font-medium">
          {isHindi ? (
            `यह भर्ती प्रक्रिया ${orgNameHindi} की प्रत्यक्ष देखरेख में आयोजित की जा रही है। यह संगठन भारत सरकार के अधीन एक स्वायत्त और प्रतिष्ठित संस्था है, जिसका गठन पारदर्शी, निष्पक्ष और योग्यता-आधारित चयन प्रक्रियाओं को सुनिश्चित करने के लिए किया गया है। पिछले कई दशकों से इस संगठन ने भारतीय रेलवे, सशस्त्र बलों और नागरिक विभागों में करोड़ों योग्य कर्मियों की नियुक्तियाँ की हैं।

इस संगठन की कार्यप्रणाली पूर्णतः डिजिटल और त्रिस्तरीय सुरक्षा प्रणालियों से सुरक्षित है। परीक्षा का संचालन देश के अत्याधुनिक कंप्यूटर केंद्रों (Computer Based Test centers) में अत्याधुनिक सॉफ्टवेयर की सहायता से किया जाता है। भर्ती का मुख्य उद्देश्य देश के प्रशासनिक ढांचे को सुदृढ़, युवा और कुशल बनाना है। इसलिए, चयन में पूरी पारदर्शिता बरती जाती है और किसी भी प्रकार के अनुचित साधनों के प्रयोग को रोकने के लिए कठोर नियम लागू किए गए हैं।`
          ) : (
            `The entire recruitment cycle is being managed under the direct authority of the ${orgName}. Over the past several decades, this premium statutory board has earned nationwide recognition for executing some of the largest, most transparent, and merit-based competitive examinations globally. 

Maintaining a robust digital infrastructure, the board is committed to selecting highly logical, physically agile, and morally sound candidates for various public sector administrative, technical, and security roles. Utilizing advanced algorithmic evaluations, continuous live video surveillance at online test hubs, and automated secure answer key processing, the organization guarantees an absolutely fair and corruption-free selection environment.`
          )}
        </p>
      </section>

      {/* SECTION 3: Vacancy Details */}
      <section className="space-y-4 pt-2">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 border-l-4 border-indigo-600 pl-3.5">
          {isHindi ? "3. रिक्तियों का संरचित विवरण (Vacancy Details)" : "3. Structured Vacancy Breakdowns"}
        </h2>
        <p className="text-slate-500 text-xs font-medium">
          {isHindi 
            ? "आधिकारिक नोटिफिकेशन के अनुसार रिक्तियों का श्रेणीवार और पदवार विवरण नीचे दी गई तालिका में स्पष्ट किया गया है:" 
            : "The category-wise and department-wise vacancy split has been carefully tabulated below for clarity:"
          }
        </p>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-xs">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-3 md:p-4 font-black text-slate-800 uppercase tracking-wider">{isHindi ? "पद का नाम (Post Name)" : "Post Name"}</th>
                <th className="p-3 md:p-4 font-black text-slate-800 uppercase tracking-wider">{isHindi ? "विभाग (Department)" : "Department / Org"}</th>
                <th className="p-3 md:p-4 font-black text-slate-800 uppercase tracking-wider">{isHindi ? "कुल रिक्तियां" : "Total Seats"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              <tr className="hover:bg-slate-50/50 transition-colors font-semibold text-slate-600">
                <td className="p-3 md:p-4 text-slate-800 font-extrabold">{isHindi ? "अराजपत्रित श्रेणी अधिकारी / कांस्टेबल" : "Non-Gazetted / Constable"}</td>
                <td className="p-3 md:p-4">{orgNameHindi}</td>
                <td className="p-3 md:p-4 text-indigo-600 font-black">{vacanciesCountHindi}</td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors font-semibold text-slate-600">
                <td className="p-3 md:p-4 text-slate-800 font-extrabold">{isHindi ? "सुरक्षा गार्ड एवं विशेष बल" : "Technical & Support Staff"}</td>
                <td className="p-3 md:p-4">{isHindi ? "राष्ट्रीय रक्षा मंत्रालय" : "Ministry of Home / Railways"}</td>
                <td className="p-3 md:p-4 text-indigo-600 font-black">{isHindi ? "4,500 से अधिक पद" : "4,500+ Seats"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTIONS 4, 5, 6: Eligibility, Qualification, Age Limit */}
      <section className="space-y-6 pt-2">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 border-l-4 border-indigo-600 pl-3.5">
          {isHindi ? "4, 5, 6. पात्रता मानदंड, शैक्षणिक योग्यता एवं आयु सीमा" : "4, 5, 6. Eligibility, Qualifications & Age Bounds"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-white border border-slate-100 rounded-3xl space-y-3 shadow-xs">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl inline-block"><ClipboardCheck className="w-5 h-5" /></span>
            <h4 className="font-extrabold text-sm text-slate-800">{isHindi ? "राष्ट्रीयता एवं पात्रता" : "Nationality & Domicile"}</h4>
            <p className="text-slate-500 text-[11px] leading-relaxed font-semibold">
              {isHindi 
                ? "आवेदक भारत का स्थायी नागरिक होना चाहिए। नेपाल और भूटान के कुछ शरणार्थी भी विशिष्ट नियमों के तहत आवेदन के पात्र हैं।" 
                : "The applicant must be a citizen of India. Domicile certificates must be produced during document verification to claim reserve quota benefits."
              }
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-100 rounded-3xl space-y-3 shadow-xs">
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl inline-block"><BookOpen className="w-5 h-5" /></span>
            <h4 className="font-extrabold text-sm text-slate-800">{isHindi ? "न्यूनतम शैक्षणिक योग्यता" : "Educational Requirement"}</h4>
            <p className="text-slate-500 text-[11px] leading-relaxed font-semibold">
              {isHindi 
                ? "विभिन्न पदों के लिए शैक्षणिक योग्यता न्यूनतम 10वीं पास, 12वीं पास या मान्यता प्राप्त विश्वविद्यालय से स्नातक डिग्री (Graduation) तय की गई है।" 
                : "Qualifications vary from Matriculation (10th pass), Higher Secondary (12th pass) to an absolute Bachelor's Degree from any UGC-approved institution."
              }
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-100 rounded-3xl space-y-3 shadow-xs">
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl inline-block"><Calendar className="w-5 h-5" /></span>
            <h4 className="font-extrabold text-sm text-slate-800">{isHindi ? "आयु सीमा एवं छूट" : "Age Limit & Relaxations"}</h4>
            <p className="text-slate-500 text-[11px] leading-relaxed font-semibold">
              {isHindi 
                ? "न्यूनतम आयु 18 वर्ष और अधिकतम आयु 27 वर्ष होनी चाहिए। आरक्षित श्रेणियों (OBC को 3 वर्ष, SC/ST को 5 वर्ष) को नियमानुसार छूट दी जाएगी।" 
                : "Minimum age of 18 years and maximum age of 27 years. Government-directed age relaxations apply (OBC: 3 years, SC/ST: 5 years, PwD: 10 years)."
              }
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 7: Salary & Benefits */}
      <section className="space-y-3.5 pt-2">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 border-l-4 border-indigo-600 pl-3.5">
          {isHindi ? "7. वेतनमान एवं भत्ते (Salary & Benefits)" : "7. Official Pay Scales & Allowances"}
        </h2>
        <p className="text-slate-600 text-xs md:text-sm leading-relaxed whitespace-pre-line font-medium">
          {isHindi ? (
            `चयनित उम्मीदवारों को भारत सरकार के 7वें वेतन आयोग (7th Pay Commission) के नियमों के अनुसार एक अत्यंत आकर्षक वेतनमान प्रदान किया जाएगा। पद के अनुसार यह वेतन स्तर पे-लेवल 3 या पे-लेवल 4 के तहत आता है।
- **मूल वेतन (Basic Pay)**: ₹21,700 से ₹69,100 प्रति माह।
- **महंगाई भत्ता (DA)**: वर्तमान सरकारी दरों के अनुसार मूल वेतन का 46% से अधिक।
- **मकान किराया भत्ता (HRA)**: ड्यूटी के शहर की श्रेणी (X, Y, Z) के आधार पर 9% से 27% तक।
- **अतिरिक्त लाभ**: इसके साथ ही मुफ्त चिकित्सा सुविधाएं, यात्रा रियायत (LTC), भविष्य निधि (PF), और पेंशन योजना का लाभ भी दिया जाता है जो आपके सुरक्षित सेवानिवृत्त जीवन की नींव रखता है।`
          ) : (
            `Successful candidates are entitled to a lucrative and secure salary package aligned strictly with the central government's 7th Pay Commission directives:
- **Pay Level Scale**: Level 3 or Level 4 depending on the specific job cadre.
- **Starting Basic Pay**: ₹21,700 to ₹69,100 per month.
- **Dearness Allowance (DA)**: Approximately 46%+ of the basic component, adjusted periodically based on inflation indexes.
- **House Rent Allowance (HRA)**: Ranges between 9% to 27% mapped to the metropolitan classification of your active posting city (X, Y, or Z categories).
- **Core Benefits**: Comprehensive coverage under the Central Government Health Scheme (CGHS), Leave Travel Concessions (LTC), Group Provident Fund accounts, and post-service social safety benefits.`
          )}
        </p>
      </section>

      {/* SECTION 8 & 9: Selection Process & Exam Pattern */}
      <section className="space-y-4 pt-2">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 border-l-4 border-indigo-600 pl-3.5">
          {isHindi ? "8, 9. चयन प्रक्रिया और लिखित परीक्षा का प्रारूप" : "8, 9. Selection Stages & Detailed Exam Pattern"}
        </h2>
        <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-medium">
          {isHindi ? (
            `चयन प्रक्रिया को पूर्णतः योग्यता आधारित और पारदर्शी बनाने के लिए इसे चार प्रमुख चरणों में विभाजित किया गया है:
1. **कंप्यूटर आधारित परीक्षा (CBT)**: यह चयन का प्राथमिक और सबसे महत्वपूर्ण चरण है जिसमें वस्तुनिष्ठ बहुविकल्पीय प्रश्न पूछे जाते हैं।
2. **शारीरिक दक्षता परीक्षा (PET/PST)**: केवल वर्दीधारी पुलिस/रक्षा पदों के लिए आवश्यक दौड़ और छाती/ऊंचाई माप।
3. **दस्तावेज़ सत्यापन (DV)**: शैक्षणिक योग्यता और जाति प्रमाण पत्रों की भौतिक जाँच।
4. **विस्तृत चिकित्सा परीक्षण (DME)**: उम्मीदवार के शारीरिक और मानसिक स्वास्थ्य की अंतिम जाँच।`
          ) : (
            `To identify the absolute finest logical and mental aptitude among millions of applicants, the selection roadmap is broken into 4 distinct checkpoints:
1. **Computer Based Test (CBT)**: A nationwide online examination featuring objective multiple-choice questions.
2. **Physical Efficiency Test (PET/PST)**: Applicable exclusively to uniform law enforcement/military positions evaluating physical endurance and build.
3. **Document Verification (DV)**: Direct physical verification of educational and class certificates.
4. **Detailed Medical Examination (DME)**: The final medical evaluation ensuring optimum eyesight and overall fitness standards.`
          )}
        </p>

        {/* Exam Pattern Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-xs mt-4">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-3 md:p-4 font-black text-slate-800 uppercase tracking-wider">{isHindi ? "परीक्षा खंड (Subject Name)" : "Subject Block"}</th>
                <th className="p-3 md:p-4 font-black text-slate-800 uppercase tracking-wider">{isHindi ? "प्रश्नों की संख्या" : "Questions Count"}</th>
                <th className="p-3 md:p-4 font-black text-slate-800 uppercase tracking-wider">{isHindi ? "कुल अंक (Total Marks)" : "Total Weightage"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              <tr className="hover:bg-slate-50/50 transition-colors font-medium text-slate-600">
                <td className="p-3 md:p-4 text-slate-800 font-extrabold">{isHindi ? "सामान्य बुद्धिमत्ता एवं तर्कशक्ति (Reasoning)" : "General Intelligence & Reasoning"}</td>
                <td className="p-3 md:p-4">25 Qs</td>
                <td className="p-3 md:p-4">50 Marks</td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors font-medium text-slate-600">
                <td className="p-3 md:p-4 text-slate-800 font-extrabold">{isHindi ? "सामान्य ज्ञान एवं जागरूकता (GK)" : "General Awareness & Static GS"}</td>
                <td className="p-3 md:p-4">25 Qs</td>
                <td className="p-3 md:p-4">50 Marks</td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors font-medium text-slate-600">
                <td className="p-3 md:p-4 text-slate-800 font-extrabold">{isHindi ? "संख्यात्मक अभिरुचि (Elementary Maths)" : "Quantitative Aptitude & Mathematics"}</td>
                <td className="p-3 md:p-4">25 Qs</td>
                <td className="p-3 md:p-4">50 Marks</td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors font-medium text-slate-600 bg-slate-50/30">
                <td className="p-3 md:p-4 text-indigo-700 font-black">{isHindi ? "कुल योग (Total)" : "Grand Total"}</td>
                <td className="p-3 md:p-4 text-slate-800 font-black">75 Qs</td>
                <td className="p-3 md:p-4 text-indigo-600 font-black">150 Marks</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 10: Syllabus Overview */}
      <section className="space-y-3.5 pt-2">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 border-l-4 border-indigo-600 pl-3.5">
          {isHindi ? "10. पाठ्यक्रम का विस्तृत विश्लेषण (Syllabus Overview)" : "10. Comprehensive Syllabus Breakdown"}
        </h2>
        <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-4 text-xs md:text-sm">
          <div className="space-y-1">
            <h5 className="font-extrabold text-slate-800">{isHindi ? "• रीजनिंग (Reasoning)" : "• Logical Reasoning"}</h5>
            <p className="text-slate-500 leading-relaxed font-semibold">{isHindi ? "कोडिंग-डिकोडिंग, रक्त संबंध, दिशा परीक्षण, सिटिंग अरेंजमेंट, न्याय वाक्य (Syllogism), और अशाब्दिक चित्र श्रृंखला प्रश्न।" : "Venn diagrams, coding-decoding, blood relations, syllogisms, and mirror image non-verbal logic."}</p>
          </div>
          <div className="space-y-1">
            <h5 className="font-extrabold text-slate-800">{isHindi ? "• सामान्य ज्ञान (General Knowledge)" : "• General Awareness & GS"}</h5>
            <p className="text-slate-500 leading-relaxed font-semibold">{isHindi ? "भारतीय इतिहास, भूगोल, बुनियादी अर्थशास्त्र, भारतीय संविधान के मौलिक अधिकार, विज्ञान की शाखाएं और पिछले 10 महीनों के राष्ट्रीय पुरस्कार एवं योजनाएं।" : "Indian Constitution, historical movements, basic chemistry & physics, banking sectors, and the last 10 months of national and international developments."}</p>
          </div>
          <div className="space-y-1">
            <h5 className="font-extrabold text-slate-800">{isHindi ? "• प्रारंभिक गणित (Elementary Mathematics)" : "• Quantitative Aptitude"}</h5>
            <p className="text-slate-500 leading-relaxed font-semibold">{isHindi ? "औसत, अनुपात-समानुपात, लाभ-हानि, साधारण एवं चक्रवृद्धि ब्याज, कार्य-समय और मूल क्षेत्रमिति (Mensuration) के व्यावहारिक प्रश्न।" : "Ratios, average configurations, speed-distance formulas, compound interest models, work-time laws, and basic 2D/3D mensuration equations."}</p>
          </div>
        </div>
      </section>

      {/* SECTION 11, 12: How To Apply & Required Documents */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
        <div className="space-y-4">
          <h3 className="text-lg md:text-xl font-black text-slate-900 border-l-4 border-indigo-600 pl-3">
            {isHindi ? "11. आवेदन करने के चरण (How To Apply)" : "11. Application Registration Steps"}
          </h3>
          <ol className="space-y-3.5 text-xs text-slate-600 font-semibold list-decimal pl-5">
            <li>{isHindi ? "सबसे पहले आधिकारिक भर्ती पोर्टल की आधिकारिक वेबसाइट पर जाएँ।" : "Log on directly to the official recruitment board portal."}</li>
            <li>{isHindi ? "'New Registration' लिंक पर क्लिक करें और बुनियादी विवरण दर्ज कर लॉग-इन आईडी प्राप्त करें।" : "Click on the 'New Candidate Registration' link and complete the initial layout."}</li>
            <li>{isHindi ? "लॉग-इन करने के बाद व्यक्तिगत विवरण, शैक्षणिक योग्यता और परीक्षा केंद्रों का चयन करें।" : "Enter your active email, phone number, and lock your primary exam center options."}</li>
            <li>{isHindi ? "सभी आवश्यक दस्तावेज, जैसे फोटो और हस्ताक्षर, उचित आकार में अपलोड करें।" : "Upload digital credentials in compliance with the recommended sizes."}</li>
            <li>{isHindi ? "श्रेणी के अनुसार आवेदन शुल्क का भुगतान केवल ऑनलाइन माध्यम से करें।" : "Execute the payment of application fee securely using debit cards or UPI."}</li>
            <li>{isHindi ? "अंतिम रूप से जमा (Submit) करने के बाद भविष्य के संदर्भ के लिए प्रिंटआउट अवश्य लें।" : "Review and download your fully filled form PDF for safe-keeping."}</li>
          </ol>
        </div>

        <div className="space-y-4 bg-slate-50/50 p-6 rounded-3xl border border-slate-100/80">
          <h3 className="text-lg md:text-xl font-black text-slate-900 border-l-4 border-indigo-600 pl-3">
            {isHindi ? "12. आवश्यक दस्तावेजों की सूची" : "12. Mandatory Documents Checklist"}
          </h3>
          <div className="space-y-2 text-xs text-slate-600 font-semibold">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
              <span>{isHindi ? "10वीं और 12वीं की अंकतालिका तथा मूल प्रमाण पत्र" : "Secondary School Board Certificate (10th/12th)"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
              <span>{isHindi ? "सक्रिय आधार कार्ड, पैन कार्ड या ड्राइविंग लाइसेंस" : "Aadhar Card, PAN, or Passport for Identity Proof"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
              <span>{isHindi ? "जाति और मूल निवास प्रमाण पत्र (आरक्षण का दावा करने के लिए)" : "State Caste & Domicile certificates (if claiming reserve quota)"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
              <span>{isHindi ? "नवीनतम पासपोर्ट आकार की रंगीन फोटो (20KB - 50KB, JPG)" : "Recent clear passport-size photo (20KB - 50KB, JPG)"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
              <span>{isHindi ? "सफेद कागज पर काली स्याही से किया गया हस्ताक्षर (10KB - 20KB)" : "Signature scanned strictly in black ink on white background"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 13, 14, 15: Dates, Fees, Instructions */}
      <section className="space-y-6 pt-2">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 border-l-4 border-indigo-600 pl-3.5">
          {isHindi ? "13, 14, 15. महत्वपूर्ण तिथियां, आवेदन शुल्क एवं निर्देश" : "13, 14, 15. Key Dates, Registration Fee & Guidelines"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-white border border-slate-100 rounded-3xl space-y-3">
            <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider text-indigo-600">{isHindi ? "महत्वपूर्ण तिथियां" : "Recruitment Calendar"}</h4>
            <div className="text-[11px] text-slate-500 space-y-1.5 font-semibold">
              <p>📅 {isHindi ? "आवेदन शुरू: घोषित" : "Application Starts: Activated"}</p>
              <p>📅 {isHindi ? "अंतिम तिथि: अधिसूचना देखें" : "Submission Deadline: See Notice"}</p>
              <p>📅 {isHindi ? "एडमिट कार्ड: परीक्षा से 10 दिन पहले" : "Admit Card: 10 days before Exam"}</p>
            </div>
          </div>

          <div className="p-5 bg-white border border-slate-100 rounded-3xl space-y-3">
            <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider text-indigo-600">{isHindi ? "आवेदन शुल्क का विवरण" : "Registration Fee Structure"}</h4>
            <div className="text-[11px] text-slate-500 space-y-1.5 font-semibold">
              <p>💵 {isHindi ? "सामान्य/OBC: ₹100" : "General / OBC Category: ₹100"}</p>
              <p>💵 {isHindi ? "SC/ST/दिव्यांग: ₹0 (निःशुल्क)" : "SC / ST / PwD Candidates: ₹0 (Exempt)"}</p>
              <p>💵 {isHindi ? "महिला उम्मीदवार: ₹0 (निःशुल्क)" : "All Female Applicants: ₹0 (Exempt)"}</p>
            </div>
          </div>

          <div className="p-5 bg-white border border-slate-100 rounded-3xl space-y-3">
            <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider text-indigo-600">{isHindi ? "अभ्यर्थियों के लिए निर्देश" : "Applicant Do's & Don'ts"}</h4>
            <ul className="text-[11px] text-slate-500 list-disc pl-4 space-y-1 font-semibold">
              <li>{isHindi ? "आवेदन पत्र में स्पेलिंग की गलतियों से बचें।" : "Ensure name spelling matches matric certificate."}</li>
              <li>{isHindi ? "चश्मा पहनकर खींची गई फोटो अपलोड न करें।" : "Avoid uploading photo wearing hats or glasses."}</li>
              <li>{isHindi ? "अंतिम तिथि के अंतिम घंटों की प्रतीक्षा न करें।" : "Submit early to avoid server traffic delays."}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 16: Preparation Strategy */}
      <section className="space-y-4 pt-2">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 border-l-4 border-indigo-600 pl-3.5">
          {isHindi ? "16. अचूक परीक्षा तैयारी रणनीति (Preparation Strategy)" : "16. Strategic 90-Day Exam Preparation Blueprint"}
        </h2>
        <p className="text-slate-600 text-xs md:text-sm leading-relaxed whitespace-pre-line font-medium">
          {isHindi ? (
            `लाखों अभ्यर्थियों की इस कड़ी प्रतिस्पर्धा में सफलता केवल कड़ी मेहनत से नहीं, बल्कि वैज्ञानिक रूप से बनाई गई 'स्मार्ट' रणनीति से प्राप्त होती है। परीक्षा विशेषज्ञों के अनुसार, निम्नलिखित तीन स्तंभों पर ध्यान देना अनिवार्य है:
1. **अवधारणा की स्पष्टता (Core Concept Clarity)**: सबसे पहले प्रत्येक विषय के बुनियादी सिद्धांतों को स्पष्ट करें। गणित में चक्रवृद्धि ब्याज, और रीजनिंग में न्याय वाक्य जैसे अध्यायों में शॉर्टकट्स का सहारा तब तक न लें जब तक आप उनकी मूल अवधारणा न समझ लें।
2. **दैनिक गति अभ्यास (Daily Mock Drills)**: हमारे शिक्षा पोर्टल पर उपलब्ध कूट मॉक टेस्ट का प्रतिदिन अभ्यास करें। इससे आपकी प्रश्न सुलझाने की गति (Solving Speed) में कम से कम 40% का सुधार होगा।
3. **कमजोर क्षेत्रों पर विशेष ध्यान**: प्रत्येक मॉक टेस्ट को पूरा करने के बाद उसके हल के व्याख्यात्मक विश्लेषण को बहुत गहराई से पढ़ें। एक डायरी बनाएं और उसमें सभी कठिन सूत्रों और गलतियों को नोट करें।`
          ) : (
            `Clearing a premium national level exam requires transition from passive reading to structured preparation tactics. Focus strictly on these three dimensions:
- **Calibrated Revision Cycles**: Set a strict 4-day active study and 1-day holistic revision system. Rote learning fails when cognitive load exceeds. Focus on creating mind-maps.
- **Speed Calibration via Online Mocks**: Attempt at least one focused full-length mock test daily. Budget exactly 45 seconds for GK and English segments, saving the surplus minutes for Quant and Analytical Reasoning.
- **Meticulous Error Diagnostics**: Maintain an offline "Error Journal". For every wrong answer, note down the specific root cause—whether it was conceptual lack, misread syntax, or calculation rush.`
          )}
        </p>
      </section>

      {/* SECTION 17: Common Mistakes to Avoid */}
      <section className="space-y-4 pt-2">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 border-l-4 border-indigo-600 pl-3.5">
          {isHindi ? "17. सामान्य गलतियाँ जिन्हें टालना है (Common Mistakes)" : "17. Common Mistakes That Lead to Rejection"}
        </h2>
        <div className="p-6 bg-rose-50/50 border border-rose-100 rounded-3xl space-y-3.5 text-xs md:text-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p className="text-slate-700 font-bold leading-relaxed">{isHindi ? "धुंधली फोटो और हस्ताक्षर अपलोड करना: इससे आवेदन तुरंत निरस्त हो जाता है।" : "Uploading Blurry Photo or Signature: It leads to instant automated software rejection."}</p>
          </div>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p className="text-slate-700 font-bold leading-relaxed">{isHindi ? "अधूरे प्रमाणपत्र के साथ आरक्षण का दावा करना: दस्तावेज सत्यापन के समय आप अयोग्य घोषित हो सकते हैं।" : "False Caste/Domicile Claims: Claiming reservation without valid valid certificates."}</p>
          </div>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p className="text-slate-700 font-bold leading-relaxed">{isHindi ? "बिना योजना के अंधाधुंध तुक्केबाजी करना: ऋणात्मक अंकन के कारण आपका औसत स्कोर कट-ऑफ से नीचे जा सकता है।" : "Wild Guessing under Penalties: Relying on random choices that deplete your raw score."}</p>
          </div>
        </div>
      </section>

      {/* SECTION 18: Frequently Asked Questions */}
      <section className="space-y-4 pt-2">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 border-l-4 border-indigo-600 pl-3.5">
          {isHindi ? "18. अक्सर पूछे जाने वाले प्रश्न (FAQ - Schema Enabled)" : "18. Frequently Asked Questions"}
        </h2>
        <div className="space-y-3">
          {jobFAQs.map((faq, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
              <h4 className="font-extrabold text-slate-800 text-xs md:text-sm flex gap-1.5 leading-relaxed">
                <span className="text-indigo-600 font-black">{isHindi ? "प्रश्न:" : "Q:"}</span> {faq.q}
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed pl-5 font-semibold">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 20: Official Source Section */}
      <section className="p-6 bg-slate-900 text-white rounded-3xl space-y-4 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <span className="p-1 bg-indigo-600/20 text-indigo-400 rounded-lg"><Building className="w-5 h-5" /></span>
          <h4 className="font-black text-sm uppercase text-indigo-400 tracking-wider">
            {isHindi ? "20. आधिकारिक स्रोत एवं महत्वपूर्ण लिंक" : "20. Verified Official Sources & Links"}
          </h4>
        </div>
        <p className="text-slate-300 text-xs leading-relaxed font-semibold">
          {isHindi 
            ? "jobsnews.online पूर्णतः प्रामाणिक और विश्वसनीय शैक्षिक जानकारी प्रदान करने के लिए प्रतिबद्ध है। कृपया आवेदन करने से पहले निम्नलिखित आधिकारिक सूत्रों से अधिसूचना की पुष्टि अवश्य करें:" 
            : "To maintain the highest standards of journalistic integrity and E-E-A-T practices, we recommend verified source verification directly via the official boards:"
          }
        </p>
        <div className="flex flex-wrap gap-3.5 pt-2">
          <a 
            href="https://ssc.gov.in" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-slate-800 hover:bg-slate-750 text-indigo-300 hover:text-white border border-slate-700/50 font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all"
          >
            <ExternalLink className="w-4 h-4" /> ssc.gov.in (Official Portal)
          </a>
          <a 
            href="https://indianrailways.gov.in" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-slate-800 hover:bg-slate-750 text-emerald-300 hover:text-white border border-slate-700/50 font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all"
          >
            <ExternalLink className="w-4 h-4" /> rrcb.gov.in (Railways Board)
          </a>
        </div>
      </section>

    </div>
  );
}
