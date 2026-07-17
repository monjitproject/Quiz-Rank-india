/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Author {
  id: string; // URL-safe slug e.g., "kamlesh-kumar", "dp-singh", "rk-shukla"
  name: string;
  hindiName: string;
  avatarUrl: string;
  title: string;
  hindiTitle: string;
  bio: string;
  hindiBio: string;
  experienceYears: number;
  expertise: string[];
  education?: string;
  certifications?: string[];
  linkedinUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  totalArticles: number;
  categories: string[];
  joinedDate: string;
  lastActive: string;
  email: string;
}

export const AUTHORS_DATA: Record<string, Author> = {
  "kamlesh-kumar": {
    id: "kamlesh-kumar",
    name: "Kamlesh Kumar",
    hindiName: "कमलेश कुमार",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    title: "Former SSC GD Instructor & Senior Defence Coach",
    hindiTitle: "पूर्व SSC GD इंस्ट्रक्टर व वरिष्ठ रक्षा परीक्षा विशेषज्ञ",
    bio: "Kamlesh Kumar has over 8 years of experience coaching lakhs of aspirants for paramilitary and defense services. Over 5,000 of his students are currently serving in various central forces including BSF, CISF, and CRPF.",
    hindiBio: "कमलेश कुमार पिछले 8 वर्षों से रक्षा और पुलिस परीक्षाओं के लिए लाखों छात्रों का मार्गदर्शन कर रहे हैं। उनके पढ़ाए गए 5000+ छात्र वर्तमान में विभिन्न अर्धसैनिक बलों (BSF, CISF, CRPF) में देश सेवा कर रहे हैं।",
    experienceYears: 8,
    expertise: ["Defence Exams", "SSC GD", "Physical Training", "General Knowledge", "UP Police Strategy"],
    education: "B.Sc. in Physics & Former Defence Academy Trainer",
    certifications: ["Physical Fitness & Tactical Instructor", "Paramilitary Recruitment Consultant"],
    linkedinUrl: "https://linkedin.com/in/kamlesh-kumar-defence",
    twitterUrl: "https://twitter.com/kamlesh_defence",
    websiteUrl: "https://jobsnews.online",
    totalArticles: 18,
    categories: ["Exam Preparation", "Defence Jobs", "Police Recruitment"],
    joinedDate: "2024-01-12",
    lastActive: "Today",
    email: "kamlesh@jobsnews.online"
  },
  "dp-singh": {
    id: "dp-singh",
    name: "D. P. Singh",
    hindiName: "डी. पी. सिंह",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150",
    title: "Former Deputy Commissioner of Income Tax & Senior Advisor",
    hindiTitle: "पूर्व आयकर उपायुक्त व वरिष्ठ सिविल सेवा मार्गदर्शक",
    bio: "D. P. Singh served in the administrative and revenue services for over 15 years before dedicating his career to guiding civil service and staff selection recruits.",
    hindiBio: "डी. पी. सिंह ने प्रशासनिक व राजस्व सेवाओं में 15 वर्षों तक अपनी उत्कृष्ट सेवाएं दी हैं। सेवानिवृत्ति के पश्चात वे पिछले एक दशक से अधिक समय से अभ्यर्थियों को रणनीतिक मार्गदर्शन प्रदान कर रहे हैं।",
    experienceYears: 25,
    expertise: ["UPSC CSE", "SSC CGL", "Indian Polity & Economy", "Interview Prep", "Central Policies"],
    education: "M.A. in Public Administration, LL.B. from Delhi University",
    certifications: ["Indian Revenue Service Cadre Alumnus", "Civil Services Excellence Awardee", "National Academic Advisory Panelist"],
    linkedinUrl: "https://linkedin.com/in/dp-singh-civilservices",
    twitterUrl: "https://twitter.com/dpsingh_advisor",
    websiteUrl: "https://jobsnews.online",
    totalArticles: 22,
    categories: ["SSC CGL", "UPSC", "Central Policy", "Career Strategy"],
    joinedDate: "2023-10-01",
    lastActive: "Today",
    email: "dp.singh@jobsnews.online"
  },
  "rk-shukla": {
    id: "rk-shukla",
    name: "R. K. Shukla",
    hindiName: "आर. के. शुक्ला",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150",
    title: "Senior Mathematics Author & Exam Pedagogy Head",
    hindiTitle: "वरिष्ठ एसएससी शिक्षक व गणित विषय विशेषज्ञ",
    bio: "R. K. Shukla is an acclaimed mathematics author and career counselor with over 10 years of experience. He is the author of the popular textbook series 'Math Magic' and specializes in numerical aptitude and reasoning.",
    hindiBio: "आर. के. शुक्ला पिछले 10 वर्षों से प्रतियोगी परीक्षाओं के लिए गणित और रीज़निंग के जाने-माने प्राध्यापक रहे हैं। उनकी पुस्तकें 'मैथ मैजिक' प्रतियोगी परीक्षाओं की तैयारी कर रहे छात्रों के बीच अत्यंत लोकप्रिय हैं।",
    experienceYears: 10,
    expertise: ["Quantitative Aptitude", "Logical Reasoning", "RRB NTPC", "SSC CHSL Speed Tricks"],
    education: "M.Sc. in Applied Mathematics",
    certifications: ["Author of 'Math Magic'", "Outstanding Pedagogy Excellence Award"],
    linkedinUrl: "https://linkedin.com/in/rk-shukla-maths",
    twitterUrl: "https://twitter.com/rkshukla_maths",
    websiteUrl: "https://jobsnews.online",
    totalArticles: 15,
    categories: ["SSC CHSL", "Railway Exams", "Mathematics Tips", "Mock Series Layout"],
    joinedDate: "2024-03-15",
    lastActive: "Today",
    email: "rk.shukla@jobsnews.online"
  }
};

/**
 * Finds or maps a post/quiz author string to an existing Author profile
 */
export function getAuthorById(id: string): Author {
  return AUTHORS_DATA[id] || AUTHORS_DATA["dp-singh"];
}

export function getAuthorByName(name: string): Author {
  if (name.includes("कमलेश") || name.includes("Kamlesh")) return AUTHORS_DATA["kamlesh-kumar"];
  if (name.includes("शुक्ला") || name.includes("Shukla") || name.includes("आर. के.")) return AUTHORS_DATA["rk-shukla"];
  return AUTHORS_DATA["dp-singh"]; // Default is DP Singh (Senior Commissioner)
}
