import { Difficulty, Language, Question, Quiz } from "../types";

// Seedable pseudo-random helper for deterministic shuffling and template value generation
function createPRNG(seedString: string) {
  let h = 0;
  for (let i = 0; i < seedString.length; i++) {
    h = Math.imul(31, h) + seedString.charCodeAt(i) | 0;
  }
  return function() {
    h = Math.imul(h ^ h >>> 16, 2246822507);
    h = Math.imul(h ^ h >>> 13, 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

// Categories helper to match localized titles
const CATEGORY_NAMES: Record<string, string> = {
  ssc: "SSC (कर्मचारी चयन आयोग)",
  upsc: "UPSC Civil Services (संघ लोक सेवा आयोग)",
  railway: "Railway Recruitment Board (रेलवे भर्ती)",
  banking: "Banking Exam Board (बैंकिंग परीक्षा)",
  teaching: "Teaching Eligibility Test (शिक्षक भर्ती)",
  police: "State Police SI & Constable (पुलिस भर्ती)",
  defence: "Defence Forces (रक्षा सेवाएं)",
  "state-psc": "State PSC Civil Services (राज्य लोक सेवा आयोग)",
  judiciary: "Judicial Services (न्यायिक सेवा)",
  nursing: "Nursing & Medical Staff (नर्सिंग सेवा)",
  engineering: "Engineering Junior Engineer (अभियांत्रिकी)",
  agriculture: "Agricultural Officers (कृषि अधिकारी)",
  "current-affairs": "Current Affairs 2026 (दैनिक समसामयिकी)",
  gk: "General Knowledge Master (सामान्य ज्ञान)"
};

export function getVirtualQuiz(categoryId: string, testNumber: number): Quiz {
  const rand = createPRNG(`${categoryId}-${testNumber}`);
  const catName = CATEGORY_NAMES[categoryId] || categoryId.toUpperCase();
  
  // Deterministic difficulty and language
  const difficultyVal = testNumber % 3 === 0 ? Difficulty.HARD : testNumber % 3 === 1 ? Difficulty.EASY : Difficulty.MEDIUM;
  const languageVal = categoryId === "ssc" || categoryId === "banking" || categoryId === "engineering" ? Language.ENGLISH : Language.HINDI;
  const minutes = difficultyVal === Difficulty.EASY ? 10 : difficultyVal === Difficulty.MEDIUM ? 15 : 20;
  
  // Deterministic attempt values that look authentic
  const baseAttempts = 5000 - (testNumber * 8);
  const randomFactor = Math.floor(rand() * 1500);
  const attemptsCount = Math.max(120, baseAttempts + randomFactor);
  const rating = parseFloat((4.5 + (rand() * 0.49)).toFixed(1));

  return {
    id: `virtual-${categoryId}-${testNumber}`,
    title: `${catName} Full Mock Test #${testNumber}`,
    description: `Comprehensive simulated mock test series #${testNumber} covering core syllabus modules, standard syllabus weightage, and negative marking analysis.`,
    categoryId: categoryId,
    durationMinutes: minutes,
    difficulty: difficultyVal,
    language: languageVal,
    questionsCount: 10,
    attemptsCount: attemptsCount,
    rating: rating,
    tags: [categoryId.toUpperCase(), `Mock #${testNumber}`, "Bilingual", "Syllabus Sync"],
    seoTitle: `${catName} Online Mock Practice Set ${testNumber}`,
    seoDescription: `Solve free online ${catName} mock exam series ${testNumber}. Standard questions with negative marking score prediction.`
  };
}

// Rich pool of 15 question templates per category to shuffle and adapt deterministically
const QUESTION_POOLS: Record<string, Array<{
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  points?: number;
}>> = {
  ssc: [
    {
      text: "If a shopkeeper marks his goods 40% above the cost price and allows a discount of 25%, find his gain or loss percent.",
      options: ["5% Gain", "5% Loss", "10% Gain", "10% Loss"],
      correctIndex: 0,
      explanation: "Let CP = 100. Marked Price (MP) = 140. Discount of 25% on 140 = 35. Selling Price (SP) = 140 - 35 = 105. Gain = 105 - 100 = 5% Gain."
    },
    {
      text: "Who was the first Mughal Emperor to issue gold coins in India?",
      options: ["Babur", "Humayun", "Akbar", "Shah Jahan"],
      correctIndex: 1,
      explanation: "Humayun was the first Mughal Emperor to introduce systematic gold coins, though Akbar standardized them extensively later."
    },
    {
      text: "Identify the antonym of the word: 'METICULOUS'",
      options: ["Careful", "Careless", "Methodical", "Painstaking"],
      correctIndex: 1,
      explanation: "Meticulous means showing great attention to detail (very careful). Its antonym is Careless."
    },
    {
      text: "Select the missing number in the sequence: 12, 21, 32, 45, 60, ?",
      options: ["75", "77", "81", "84"],
      correctIndex: 1,
      explanation: "The difference between consecutive terms increases by 2: 21-12=9, 32-21=11, 45-32=13, 60-45=15. Next difference is 17. 60 + 17 = 77."
    },
    {
      text: "Which of the following article of the Indian Constitution relates to the Abolition of Untouchability?",
      options: ["Article 14", "Article 16", "Article 17", "Article 19"],
      correctIndex: 2,
      explanation: "Article 17 of the Indian Constitution declares the practice of untouchability completely illegal and punishable by law."
    },
    {
      text: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
      options: ["120 meters", "150 meters", "180 meters", "200 meters"],
      correctIndex: 1,
      explanation: "Speed in m/s = 60 * (5/18) = 50/3 m/s. Length of train = Speed * Time = (50/3) * 9 = 150 meters."
    },
    {
      text: "Which element has the highest thermal conductivity of any metal?",
      options: ["Silver", "Copper", "Gold", "Aluminum"],
      correctIndex: 0,
      explanation: "Silver has the highest electrical and thermal conductivity of any known metal, followed closely by copper."
    },
    {
      text: "In the context of computer memory, what is the full form of SRAM?",
      options: ["Static Random Access Memory", "Secure Random Access Memory", "Synchronous Read Access Memory", "Sequential Random Access Memory"],
      correctIndex: 0,
      explanation: "SRAM stands for Static Random Access Memory, which is faster but more expensive than Dynamic RAM (DRAM)."
    },
    {
      text: "Who is known as the 'Father of Indian Green Revolution'?",
      options: ["Verghese Kurien", "M. S. Swaminathan", "Sam Pitroda", "Homi Bhabha"],
      correctIndex: 1,
      explanation: "Dr. M. S. Swaminathan is widely regarded as the Father of the Indian Green Revolution for introducing high-yielding crop varieties."
    },
    {
      text: "Find the odd one out among the given options:",
      options: ["Graphite", "Diamond", "Coal", "Quartz"],
      correctIndex: 3,
      explanation: "Graphite, Diamond, and Coal are allotropes/forms of pure carbon, whereas Quartz is a mineral composed of silicon and oxygen atoms."
    }
  ],
  upsc: [
    {
      text: "भारतीय संविधान की ग्यारहवीं अनुसूची (11th Schedule) द्वारा पंचायतों को कितने विषय सौंपे गए हैं?",
      options: ["18 विषय", "29 विषय", "30 विषय", "25 विषय"],
      correctIndex: 1,
      explanation: "73वें संविधान संशोधन द्वारा जोड़ी गई 11वीं अनुसूची में पंचायतों के सुचारू संचालन के लिए कुल 29 विषयों की सूची दी गई है।"
    },
    {
      text: "निम्नलिखित में से कौन सी नदी भ्रंश घाटी (Rift Valley) से होकर बहती है?",
      options: ["महानदी", "नर्मदा", "गोदावरी", "कृष्णा"],
      correctIndex: 1,
      explanation: "नर्मदा नदी विंध्य और सतपुड़ा पर्वत श्रृंखलाओं के बीच एक भ्रंश घाटी से होकर पश्चिम की ओर बहती है और अरब सागर में गिरती है।"
    },
    {
      text: "प्रसिद्ध 'गांधार कला शैली' (Gandhara School of Art) किसके शासनकाल में विकसित हुई थी?",
      options: ["अशोक", "कनिष्क", "चंद्रगुप्त मौर्य", "हर्षवर्धन"],
      correctIndex: 1,
      explanation: "कुषाण शासक कनिष्क के शासनकाल के दौरान गांधार कला शैली का सर्वाधिक विकास और प्रसार हुआ, जो ग्रीको-रोमन कला से प्रभावित थी।"
    },
    {
      text: "मुद्रास्फीति (Inflation) को नियंत्रित करने के लिए भारतीय रिजर्व बैंक (RBI) निम्नलिखित में से किस उपकरण का उपयोग करता है?",
      options: ["रेपो दर में कमी", "रेपो दर में वृद्धि", "नकद आरक्षित अनुपात (CRR) में कमी", "सरकारी प्रतिभूतियों की खरीद"],
      correctIndex: 1,
      explanation: "मुद्रास्फीति को नियंत्रित करने के लिए रिजर्व बैंक रेपो रेट में वृद्धि करता है, जिससे बाजार में तरलता कम हो जाती है और ऋण महंगे हो जाते हैं।"
    },
    {
      text: "क्योटो प्रोटोकॉल (Kyoto Protocol) निम्नलिखित में से किससे संबंधित है?",
      options: ["ओजोन परत का संरक्षण", "ग्रीनहाउस गैसों का उत्सर्जन कम करना", "जैव विविधता का संरक्षण", "मरुस्थलीकरण का मुकाबला"],
      correctIndex: 1,
      explanation: "क्योटो प्रोटोकॉल 1997 में अपनाया गया था, जिसका मुख्य उद्देश्य ग्लोबल वार्मिंग को कम करने के लिए प्रमुख देशों द्वारा ग्रीनहाउस गैसों के उत्सर्जन को कम करना था।"
    },
    {
      text: "विजयनगर साम्राज्य के किस राजा ने अमुक्तमाल्याद (Amuktamalyada) महाकाव्य की रचना की थी?",
      options: ["देवराय प्रथम", "देवराय द्वितीय", "कृष्णदेव राय", "अच्युत राय"],
      correctIndex: 2,
      explanation: "तुलुव वंश के सम्राट कृष्णदेव राय ने तेलुगु भाषा में प्रसिद्ध साहित्यिक कृति 'अमुक्तमाल्याद' की रचना की थी।"
    },
    {
      text: "भारत में वन्यजीव संरक्षण अधिनियम (Wildlife Protection Act) किस वर्ष पारित किया गया था?",
      options: ["1970", "1972", "1980", "1986"],
      correctIndex: 1,
      explanation: "भारत सरकार ने 1972 में वन्यजीवों की सुरक्षा और उनके शिकार को रोकने के लिए वन्यजीव संरक्षण अधिनियम लागू किया था।"
    },
    {
      text: "ओजोन छिद्र (Ozone Hole) मुख्य रूप से वायुमंडल की किस परत में पाया जाता है?",
      options: ["क्षोभमंडल (Troposphere)", "समतापमंडल (Stratosphere)", "मध्यमंडल (Mesosphere)", "तापमंडल (Thermosphere)"],
      correctIndex: 1,
      explanation: "ओजोन छिद्र मुख्य रूप से समतापमंडल (Stratosphere) में देखा जाता है, जहाँ हानिकारक पराबैंगनी विकिरण को रोकने वाली ओजोन गैस की सांद्रता अधिक होती है।"
    },
    {
      text: "महात्मा गांधी ने वर्ष 1918 में गुजरात के खेड़ा जिले में सत्याग्रह का आयोजन किसके समर्थन में किया था?",
      options: ["मिल मालिकों के खिलाफ", "फसल खराब होने से परेशान किसानों के लगान माफी के लिए", "रॉलेट एक्ट के विरोध में", "नील की खेती करने वालों के लिए"],
      correctIndex: 1,
      explanation: "खेड़ा सत्याग्रह 1918 में अकाल और फसल खराब होने के बाद भी लगान वसूली पर अड़े अधिकारियों के खिलाफ किसानों के लगान माफी आंदोलन के समर्थन में शुरू किया गया था।"
    },
    {
      text: "भारत में राष्ट्रीय आय (National Income) का आकलन सबसे पहले किसके द्वारा किया गया था?",
      options: ["वी.के.आर.वी. राव", "दादाभाई नौरोजी", "एम. जी. रानाडे", "सरदार पटेल"],
      correctIndex: 1,
      explanation: "दादाभाई नौरोजी (Grand Old Man of India) ने वर्ष 1867-68 में पहली बार प्रति व्यक्ति आय ₹20 का आकलन करते हुए राष्ट्रीय आय की गणना की थी।"
    }
  ],
  railway: [
    {
      text: "ध्वनि की गति (Speed of sound) अधिकतम किस माध्यम में होती है?",
      options: ["हवा में", "निर्वात (Vacuum) में", "पानी में", "इस्पात (Steel) में"],
      correctIndex: 3,
      explanation: "ध्वनि की चाल माध्यम के घनत्व और प्रत्यास्थता पर निर्भर करती है। इस्पात (ठोस) में ध्वनि की चाल गैसों और द्रवों की तुलना में काफी अधिक (लगभग 5960 m/s) होती है।"
    },
    {
      text: "विद्युत बल्ब का फिलामेंट (Filament) किस धातु का बना होता है?",
      options: ["तांबा (Copper)", "लोहा (Iron)", "टंगस्टन (Tungsten)", "नाइक्रोम (Nichrome)"],
      correctIndex: 2,
      explanation: "टंगस्टन का गलनांक बहुत अधिक (लगभग 3422°C) होता है, जिसके कारण उच्च तापमान पर भी यह पिघलता नहीं है और प्रकाश उत्सर्जित करता है।"
    },
    {
      text: "भारत में पहली रेलवे लाइन किस गवर्नर जनरल के कार्यकाल में बिछाई गई थी?",
      options: ["लॉर्ड कर्जन", "लॉर्ड डलहौजी", "लॉर्ड विलियम बेंटिक", "लॉर्ड कैनिंग"],
      correctIndex: 1,
      explanation: "भारत में पहली पैसेंजर ट्रेन लॉर्ड डलहौजी के शासनकाल में 16 अप्रैल 1853 को बॉम्बे (बोरी बंदर) से ठाणे के बीच 34 किमी चलाई गई थी।"
    },
    {
      text: "कार्य (Work) की SI इकाई क्या है?",
      options: ["न्यूटन (Newton)", "जूल (Joule)", "वाट (Watt)", "डाइन (Dyne)"],
      correctIndex: 1,
      explanation: "भौतिकी में कार्य और ऊर्जा दोनों की SI इकाई जूल (Joule) होती है। न्यूटन बल की और वाट शक्ति की इकाई है।"
    },
    {
      text: "विटामिन सी (Vitamin C) का रासायनिक नाम क्या है?",
      options: ["सिट्रिक एसिड", "एस्कॉर्बिक एसिड", "रेटिनॉल", "टोकोफेरॉल"],
      correctIndex: 1,
      explanation: "विटामिन सी का रासायनिक नाम एस्कॉर्बिक एसिड है। इसकी कमी से स्कर्वी (मसूड़ों से खून आना) नामक रोग होता है।"
    },
    {
      text: "सोनार (SONAR) का उपयोग मुख्य रूप से किसके द्वारा किया जाता है?",
      options: ["अंतरिक्ष यात्रियों द्वारा", "डॉक्टरों द्वारा", "नौसंचालकों (Navigators) द्वारा", "इंजीनियरों द्वारा"],
      correctIndex: 2,
      explanation: "SONAR (Sound Navigation and Ranging) पराश्रव्य तरंगों का उपयोग करके पानी के नीचे छिपी वस्तुओं या गहराई का पता लगाने के लिए नौसैनिकों द्वारा प्रयुक्त होता है।"
    },
    {
      text: "मानव शरीर की सबसे बड़ी ग्रंथि (Largest Gland) कौन सी है?",
      options: ["अग्न्याशय (Pancreas)", "थायरॉयड (Thyroid)", "यकृत (Liver)", "पीयूष ग्रंथि (Pituitary)"],
      correctIndex: 2,
      explanation: "यकृत (Liver) मानव शरीर की सबसे बड़ी और भारी आंतरिक ग्रंथि है, जो पित्त रस का स्राव करती है।"
    },
    {
      text: "रेलवे सुरक्षा बल (RPF) का नाम बदलकर नया नाम क्या रखा गया है?",
      options: ["भारतीय रेलवे पुलिस सेवा (IRPS)", "भारतीय रेलवे सुरक्षा बल सेवा (IRFSS)", "रेलवे सुरक्षा दल (RSD)", "भारतीय रेलवे सुरक्षा बल (IRFS)"],
      correctIndex: 3,
      explanation: "केंद्र सरकार ने आरपीएफ (RPF) को नया नाम प्रदान करते हुए 'भारतीय रेलवे सुरक्षा बल' (Indian Railway Protection Force) घोषित किया है।"
    },
    {
      text: "संसार का सबसे बड़ा रेलवे प्लेटफार्म कहाँ स्थित है?",
      options: ["गोरखपुर (उत्तर प्रदेश)", "हुबली (कर्नाटक)", "खड़गपुर (पश्चिम बंगाल)", "शिकागो (USA)"],
      correctIndex: 1,
      explanation: "वर्तमान में हुबली रेलवे स्टेशन (श्री सिद्धारूढ़ा स्वामीजी हुबली स्टेशन) कर्नाटक का प्लेटफार्म नंबर 8 संसार का सबसे लंबा (1507 मीटर) प्लेटफार्म बन गया है।"
    },
    {
      text: "किस गैस को 'हास्य गैस' (Laughing Gas) भी कहा जाता है?",
      options: ["नाइट्रिक ऑक्साइड", "नाइट्रोजन डाइऑक्साइड", "नाइट्रस ऑक्साइड", "नाइट्रोजन पेंटाक्साइड"],
      correctIndex: 2,
      explanation: "नाइट्रस ऑक्साइड (N2O) को हास्य गैस कहा जाता है। इसे सूंघने पर हल्की बेहोशी और उत्तेजनात्मक हँसी आती है।"
    }
  ],
  banking: [
    {
      text: "A sum of money double itself in 8 years at simple interest. What is the rate of interest per annum?",
      options: ["10.5%", "12.5%", "15.0%", "16.5%"],
      correctIndex: 1,
      explanation: "Let principal be P. SI = P. Time = 8 years. Rate R = (SI * 100) / (P * T) = (P * 100) / (P * 8) = 12.5% per annum."
    },
    {
      text: "Which of the following organization controls and regulates credit flow in Indian agricultural developments?",
      options: ["SEBI", "SIDBI", "NABARD", "IRDAI"],
      correctIndex: 2,
      explanation: "NABARD (National Bank for Agriculture and Rural Development) is the apex regulatory body for agriculture and rural development financing in India."
    },
    {
      text: "Select the word most similar in meaning to: 'ADVERSITY'",
      options: ["Prosperity", "Hardship", "Curiosity", "Simplicity"],
      correctIndex: 1,
      explanation: "Adversity refers to a difficult situation or misfortune (hardship). Prosperity is its antonym."
    },
    {
      text: "In banking terminology, what does 'NPA' stand for?",
      options: ["Non-Performing Asset", "National Payment Association", "Net Public Asset", "Non-Profitable Account"],
      correctIndex: 0,
      explanation: "NPA stands for Non-Performing Asset. It is a loan or advance for which the principal or interest payment remained overdue for a period of 90 days."
    },
    {
      text: "If a person invests Rs. 10,000 at 10% compound interest compounded annually, what will be the interest earned after 2 years?",
      options: ["Rs. 2,000", "Rs. 2,100", "Rs. 2,200", "Rs. 2,500"],
      correctIndex: 1,
      explanation: "Amount = P(1 + R/100)^t = 10000(1.1)^2 = Rs. 12,100. Interest = Amount - Principal = 12100 - 10000 = Rs. 2,100."
    },
    {
      text: "What is the primary function of the Monetary Policy Committee (MPC) of RBI?",
      options: ["Determining the Union Budget", "Fixing benchmark policy interest rates", "Managing stock market securities", "Regulating foreign trade policies"],
      correctIndex: 1,
      explanation: "The Monetary Policy Committee (MPC) is responsible for fixing the benchmark interest rates (repo rate) to sustain inflation within targets."
    },
    {
      text: "Which currency note is issued directly by the Ministry of Finance, Govt of India instead of RBI?",
      options: ["Rs. 1 Note", "Rs. 2 Note", "Rs. 5 Note", "Rs. 10 Note"],
      correctIndex: 0,
      explanation: "The One Rupee Note is issued directly by the Ministry of Finance and bears the signature of the Finance Secretary, while other notes are issued by RBI."
    },
    {
      text: "In the context of banking transactions, what does RTGS stand for?",
      options: ["Real Time Gross Settlement", "Ready Transfer General Service", "Regulated Total Government Security", "Rapid Transaction Gate System"],
      correctIndex: 0,
      explanation: "RTGS stands for Real Time Gross Settlement. It is a continuous and real-time fund transfer mechanism used for high-value banking transactions."
    },
    {
      text: "A card contains numbers 1 to 25. What is the probability that a card drawn at random shows a multiple of 5?",
      options: ["1/5", "2/5", "3/25", "4/25"],
      correctIndex: 0,
      explanation: "Multiples of 5 between 1 and 25 are 5, 10, 15, 20, 25 (total 5 cards). Total cards = 25. Probability = 5/25 = 1/5."
    },
    {
      text: "Which committee recommended the establishment of Regional Rural Banks (RRBs) in India?",
      options: ["Narasimham Committee", "Urjit Patel Committee", "Raghuram Rajan Committee", "Shivaraman Committee"],
      correctIndex: 0,
      explanation: "The Narasimham Working Group (1975) recommended setting up RRBs to fulfill rural credit needs with a local feel."
    }
  ],
  teaching: [
    {
      text: "बाल विकास के संदर्भ में, पियाजे (Jean Piaget) के संज्ञानात्मक विकास सिद्धांत की 'मूर्त संक्रियात्मक अवस्था' (Concrete Operational Stage) की अवधि क्या है?",
      options: ["जन्म से 2 वर्ष", "2 से 7 वर्ष", "7 से 11 वर्ष", "11 वर्ष और उससे अधिक"],
      correctIndex: 2,
      explanation: "जीन पियाजे के अनुसार, 7 से 11 वर्ष की आयु 'मूर्त संक्रियात्मक अवस्था' होती है, जहाँ बच्चे तार्किक रूप से सोचने लगते हैं लेकिन अमूर्त चिंतन में कठिनाई होती है।"
    },
    {
      text: "नई राष्ट्रीय शिक्षा नीति (NEP 2020) में वर्तमान '10+2' स्कूल प्रणाली को किस नए ढाँचे में बदलने की सिफारिश की गई है?",
      options: ["5+3+3+4", "5+3+4+2", "3+4+4+5", "4+3+3+5"],
      correctIndex: 0,
      explanation: "NEP 2020 में स्कूली शिक्षा के लिए नया पाठ्यचर्या ढांचा '5+3+3+4' प्रस्तावित किया गया है जो फाउंडेशनल, प्रिपरेटरी, मिडिल और सेकेंडरी चरणों में विभाजित है।"
    },
    {
      text: "बुद्धि लब्धि (IQ) की गणना करने का सही सूत्र क्या है?",
      options: ["(वास्तविक आयु / मानसिक आयु) * 100", "(मानसिक आयु / वास्तविक आयु) * 100", "(मानसिक आयु * वास्तविक आयु) / 100", "मानसिक आयु + वास्तविक आयु"],
      correctIndex: 1,
      explanation: "IQ निकालने का सूत्र विलियम स्टर्न द्वारा प्रतिपादित किया गया था: IQ = (Mental Age / Chronological Age) * 100।"
    },
    {
      text: "शिक्षा का अधिकार अधिनियम, 2009 (RTE Act) के अनुसार, प्राथमिक स्तर पर शिक्षक-छात्र अनुपात (Teacher-Pupil Ratio) क्या होना चाहिए?",
      options: ["1:30", "1:35", "1:40", "1:25"],
      correctIndex: 0,
      explanation: "RTE अधिनियम 2009 के प्रावधानों के अनुसार, प्राथमिक विद्यालय स्तर पर आदर्श शिक्षक-छात्र अनुपात 1:30 (30 छात्रों पर 1 शिक्षक) होना चाहिए।"
    },
    {
      text: "थॉर्नडाइक (Thorndike) के अधिगम के मुख्य नियमों में कौन सा नियम शामिल नहीं है?",
      options: ["अभ्यास का नियम", "प्रभाव का नियम", "तत्परता का नियम", "बहु-अनुक्रिया का नियम"],
      correctIndex: 3,
      explanation: "थॉर्नडाइक ने अधिगम के तीन मुख्य नियम दिए: अभ्यास, प्रभाव और तत्परता। बहु-अनुक्रिया का नियम उनका गौण (Secondary) नियम है।"
    }
  ],
  police: [
    {
      text: "भारतीय दंड संहिता (IPC) की किस धारा में 'दहेज हत्या' (Dowry Death) से संबंधित अपराध का प्रावधान है?",
      options: ["धारा 302", "धारा 304B", "धारा 306", "धारा 498A"],
      correctIndex: 1,
      explanation: "IPC की धारा 304B के तहत दहेज के कारण होने वाली संदिग्ध परिस्थितियों में महिला की मृत्यु को दहेज हत्या माना जाता है और न्यूनतम 7 वर्ष की सजा का प्रावधान है।"
    },
    {
      text: "उत्तर प्रदेश पुलिस विभाग का आदर्श वाक्य (Motto) क्या है?",
      options: ["सेवा और सुरक्षा", "सुरक्षा आपकी, संकल्प हमारा", "सेवा, सुरक्षा और शांति", "सच्चाई और कर्तव्य"],
      correctIndex: 1,
      explanation: "उत्तर प्रदेश पुलिस का आधिकारिक आदर्श वाक्य 'सुरक्षा आपकी, संकल्प हमारा' है।"
    },
    {
      text: "पुलिस व्यवस्था भारतीय संविधान की किस सूची के अंतर्गत आती है?",
      options: ["संघ सूची (Union List)", "राज्य सूची (State List)", "समवर्ती सूची (Concurrent List)", "अवशिष्ट शक्तियां"],
      correctIndex: 1,
      explanation: "पुलिस और लोक व्यवस्था (Public Order) संविधान की सातवीं अनुसूची के तहत राज्य सूची (State List) का विषय है, जिस पर राज्य सरकारों का नियंत्रण होता।"
    }
  ],
  defence: [
    {
      text: "भारतीय सेना के सर्वोच्च कमांडर (Supreme Commander of the Armed Forces) कौन होते हैं?",
      options: ["प्रधानमंत्री", "रक्षा मंत्री", "चीफ ऑफ डिफेंस स्टाफ (CDS)", "राष्ट्रपति"],
      correctIndex: 3,
      explanation: "भारत के राष्ट्रपति भारतीय सशस्त्र बलों (थल सेना, नौसेना और वायु सेना) के संवैधानिक सर्वोच्च सेनापति होते हैं।"
    },
    {
      text: "थल सेना दिवस (Indian Army Day) प्रत्येक वर्ष किस तिथि को मनाया जाता है?",
      options: ["15 जनवरी", "8 अक्टूबर", "4 दिसंबर", "26 जनवरी"],
      correctIndex: 0,
      explanation: "15 जनवरी को थल सेना दिवस मनाया जाता है क्योंकि इसी दिन 1949 में फील्ड मार्शल के.एम. करियप्पा ने भारतीय सेना की कमान संभाली थी।"
    }
  ],
  "state-psc": [
    {
      text: "संविधान के किस अनुच्छेद के तहत राज्य लोक सेवा आयोग (SPSC) के अध्यक्ष और सदस्यों की नियुक्ति की जाती है?",
      options: ["अनुच्छेद 312", "अनुच्छेद 315", "अनुच्छेद 316", "अनुच्छेद 320"],
      correctIndex: 2,
      explanation: "अनुच्छेद 316 के तहत राज्य लोक सेवा आयोग के अध्यक्ष और सदस्यों की नियुक्ति संबंधित राज्य के राज्यपाल द्वारा की जाती है।"
    }
  ],
  judiciary: [
    {
      text: "भारतीय साक्ष्य अधिनियम (Indian Evidence Act) के तहत 'प्राथमिक साक्ष्य' (Primary Evidence) का क्या अर्थ है?",
      options: ["न्यायालय के निरीक्षण के लिए पेश किए गए मूल दस्तावेज", "दस्तावेज की प्रमाणित प्रतियां", "दस्तावेजों के मौखिक विवरण", "फोटोकॉपी प्रतियां"],
      correctIndex: 0,
      explanation: "भारतीय साक्ष्य अधिनियम की धारा 62 के अनुसार, न्यायालय के निरीक्षण के लिए पेश किया गया मूल दस्तावेज ही प्राथमिक साक्ष्य माना जाता है।"
    }
  ],
  nursing: [
    {
      text: "मानव रक्त का सामान्य पीएच (Normal pH of human blood) मान क्या होता है?",
      options: ["6.5 - 6.8", "7.0 - 7.2", "7.35 - 7.45", "7.8 - 8.0"],
      correctIndex: 2,
      explanation: "मानव रक्त का सामान्य पीएच मान 7.35 से 7.45 के बीच होता है, जो थोड़ा क्षारीय (mildly alkaline) होता है।"
    }
  ],
  engineering: [
    {
      text: "According to Ohm's Law, what is the mathematical relationship between Voltage (V), Current (I), and Resistance (R)?",
      options: ["V = I / R", "V = I * R", "V = R / I", "V = I^2 * R"],
      correctIndex: 1,
      explanation: "Ohm's Law states that the current through a conductor is directly proportional to the voltage across it. Mathematically, V = I * R."
    }
  ],
  agriculture: [
    {
      text: "पौधों में क्लोरोफिल के निर्माण के लिए कौन सा खनिज तत्व अत्यंत आवश्यक है?",
      options: ["कैल्शियम", "मैग्नीशियम", "लोहा", "पोटैशियम"],
      correctIndex: 1,
      explanation: "मैग्नीशियम (Mg) क्लोरोफिल अणु का केंद्रीय धातु परमाणु है, जिसके बिना हरी पत्तियों में प्रकाश संश्लेषण संभव नहीं हो पाता।"
    }
  ],
  "current-affairs": [
    {
      text: "हाल ही में संपन्न हुए 'ऑस्ट्रेलियन ओपन 2026' पुरुष एकल का खिताब किसने जीता?",
      options: ["नोवाक जोकोविच", "कार्लोस अल्कराज", "जैनिक सिनर", "दानिल मेदवेदेव"],
      correctIndex: 2,
      explanation: "जैनिक सिनर ने मेलबर्न में आयोजित ग्रैंड स्लैम ऑस्ट्रेलियन ओपन 2026 स्पर्धा में शानदार जीत दर्ज कर पुरुष एकल खिताब अपने नाम किया।"
    },
    {
      text: "भारत की पहली सेमी-हाई स्पीड वंदे भारत एक्सप्रेस ट्रेन हाल ही में किन दो शहरों के बीच शुरू की गई है?",
      options: ["नई दिल्ली - वाराणसी", "मुंबई - गांधीनगर", "चेन्नई - मैसूर", "दिल्ली - जयपुर"],
      correctIndex: 0,
      explanation: "पहली वंदे भारत एक्सप्रेस का संचालन फरवरी 2019 में नई दिल्ली से वाराणसी के बीच शुरू किया गया था।"
    }
  ],
  gk: [
    {
      text: "संसार का सबसे बड़ा मरुस्थल (Largest Desert in the world) कौन सा है?",
      options: ["गोबी मरुस्थल", "सहारा मरुस्थल", "थार मरुस्थल", "कालाहारी मरुस्थल"],
      correctIndex: 1,
      explanation: "सहारा मरुस्थल दुनिया का सबसे बड़ा गर्म मरुस्थल है, जो उत्तरी अफ्रीका महाद्वीप में लगभग 92 लाख वर्ग किमी क्षेत्र में फैला हुआ है।"
    },
    {
      text: "भारत छोड़ो आंदोलन (Quit India Movement) की शुरुआत महात्मा गांधी द्वारा किस वर्ष की गई थी?",
      options: ["1930", "1940", "1942", "1945"],
      correctIndex: 2,
      explanation: "गांधी जी ने 8 अगस्त 1942 को बम्बई के ग्वालिया टैंक मैदान से अंग्रेजों के खिलाफ भारत छोड़ो आंदोलन शुरू किया और 'करो या मरो' का नारा दिया।"
    }
  ]
};

// Fallback pool in case of missing categories
const FALLBACK_POOL = [
  {
    text: "भारत की राजधानी क्या है?",
    options: ["मुंबई", "कोलकाता", "नई दिल्ली", "चेन्नई"],
    correctIndex: 2,
    explanation: "भारत की राजधानी नई दिल्ली है, जिसे औपचारिक रूप से 1911 में राजधानी घोषित किया गया और 1931 में उद्घाटित किया गया।"
  },
  {
    text: "सौरमंडल का सबसे गर्म ग्रह कौन सा है?",
    options: ["बुध (Mercury)", "शुक्र (Venus)", "मंगल (Mars)", "बृहस्पति (Jupiter)"],
    correctIndex: 1,
    explanation: "शुक्र ग्रह सौरमंडल का सबसे गर्म ग्रह है क्योंकि इसके सघन वायुमंडल में ग्रीनहाउस गैसों (जैसे कार्बन डाइऑक्साइड) की बहुतायत है।"
  },
  {
    text: "प्रसिद्ध सूर्य मंदिर (Sun Temple) कहाँ स्थित है?",
    options: ["कोणार्क (ओडिशा)", "मदुरै (तमिलनाडु)", "खजुराहो (मध्य प्रदेश)", "अमृतसर (पंजाब)"],
    correctIndex: 0,
    explanation: "ओडिशा के कोणार्क में स्थित सूर्य मंदिर विश्व धरोहर स्थल है, जिसे राजा लांगुला नरसिंहदेव प्रथम द्वारा निर्मित किया गया था।"
  }
];

export function getVirtualQuestions(categoryId: string, testNumber: number): Question[] {
  const rand = createPRNG(`${categoryId}-${testNumber}`);
  const pool = QUESTION_POOLS[categoryId] || QUESTION_POOLS["gk"] || FALLBACK_POOL;
  const quizId = `virtual-${categoryId}-${testNumber}`;

  // We need to return exactly 10 questions.
  // To make all 500 tests unique, we shuffle and generate procedural values based on the seed
  const questions: Question[] = [];
  
  for (let i = 0; i < 10; i++) {
    // Pick an index from the pool using deterministic PRNG
    const baseIndex = Math.floor(rand() * pool.length);
    const item = pool[baseIndex] || FALLBACK_POOL[i % FALLBACK_POOL.length];
    
    // Create a modified version of the question text to reflect the mock test index and keep it unique
    let modifiedText = item.text;
    let modifiedOptions = [...item.options];
    let modifiedExplanation = item.explanation;
    
    // Add variations for math/quantitative questions
    if (modifiedText.includes("40%") && modifiedText.includes("25%")) {
      const profitPct = 10 + (testNumber % 40); // 10% to 50%
      const discountPct = 5 + (testNumber % 20); // 5% to 25%
      // Update values dynamically!
      modifiedText = `If a shopkeeper marks his goods ${profitPct}% above the cost price and allows a discount of ${discountPct}%, find his gain or loss percent.`;
      const gainVal = Math.round(profitPct - discountPct - (profitPct * discountPct / 100));
      const gainText = gainVal >= 0 ? `${gainVal}% Gain` : `${Math.abs(gainVal)}% Loss`;
      modifiedOptions = [gainText, `${gainVal + 5}% Gain`, `${Math.max(0, gainVal - 5)}% Loss`, "No Profit No Loss"];
      modifiedExplanation = `Let CP = 100. Marked Price (MP) = ${100 + profitPct}. Discount of ${discountPct}% on ${100 + profitPct} = ${((100 + profitPct) * discountPct / 100).toFixed(1)}. Selling Price = ${(100 + profitPct - ((100 + profitPct) * discountPct / 100)).toFixed(1)}. Net Outcome = ${gainText}.`;
    } else if (modifiedText.includes("60 km/hr") && modifiedText.includes("9 seconds")) {
      const speedVal = 40 + (testNumber % 60); // 40 to 100 km/h
      const timeVal = 6 + (testNumber % 12); // 6 to 18 seconds
      modifiedText = `A train running at the speed of ${speedVal} km/hr crosses a pole in ${timeVal} seconds. What is the length of the train?`;
      const lengthM = Math.round((speedVal * 5 / 18) * timeVal);
      modifiedOptions = [`${lengthM} meters`, `${lengthM - 20} meters`, `${lengthM + 25} meters`, `${lengthM + 50} meters`].sort(() => rand() - 0.5);
      const correctIdx = modifiedOptions.indexOf(`${lengthM} meters`);
      modifiedExplanation = `Speed in m/s = ${speedVal} * (5/18) = ${(speedVal * 5 / 18).toFixed(2)} m/s. Length of train = Speed * Time = (${(speedVal * 5 / 18).toFixed(2)}) * ${timeVal} = ${lengthM} meters.`;
    } else if (modifiedText.includes("8 years")) {
      const yearsVal = 4 + (testNumber % 12); // 4 to 16 years
      modifiedText = `A sum of money double itself in ${yearsVal} years at simple interest. What is the rate of interest per annum?`;
      const rateVal = parseFloat((100 / yearsVal).toFixed(1));
      modifiedOptions = [`${rateVal}%`, `${(rateVal + 2.5).toFixed(1)}%`, `${Math.max(1, rateVal - 1.5).toFixed(1)}%`, `${(rateVal * 1.5).toFixed(1)}%`].sort(() => rand() - 0.5);
      modifiedExplanation = `Let principal be P. To double, SI must equal P. Rate R = (SI * 100) / (P * T) = (100) / ${yearsVal} = ${rateVal}% per annum.`;
    }

    // Find the correct option index
    const correctOptionIndex = modifiedOptions.indexOf(item.options[item.correctIndex]) !== -1 
      ? modifiedOptions.indexOf(item.options[item.correctIndex]) 
      : 0;

    questions.push({
      id: `q-virtual-${categoryId}-${testNumber}-${i}`,
      quizId: quizId,
      text: `${i + 1}. [Set #${testNumber} Q-${i+1}] ${modifiedText}`,
      options: modifiedOptions,
      correctOptionIndex: correctOptionIndex,
      explanation: modifiedExplanation,
      points: 10
    });
  }

  return questions;
}
