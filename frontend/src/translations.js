// Centralized translations for SevaBot AI
// Reusing and extending original multilingual mappings from translations.js

export const LANGUAGES = [
  { code: 'en', label: 'English', voiceLang: 'en-IN' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)', voiceLang: 'kn-IN' },
  { code: 'hi', label: 'हिंदी (Hindi)', voiceLang: 'hi-IN' }
]

export const translations = {
  // Navigation & Brand
  "Profile": { hi: "प्रोफ़ाइल", kn: "ಪ್ರೊಫೈಲ್" },
  "Manage your profile": { hi: "अपनी प्रोफ़ाइल प्रबंधित करें", kn: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ನಿರ್ವಹಿಸಿ" },
  "Create or link profile": { hi: "प्रोफ़ाइल बनाएं या लिंक करें", kn: "ಪ್ರೊಫೈಲ್ ರಚಿಸಿ ಅಥವಾ ಲಿಂಕ್ ಮಾಡಿ" },
  "Home": { hi: "होम", kn: "ಮುಖಪುಟ" },

  // Hero Section
  "AI-Powered Welfare Portal": { hi: "एआई-संचालित कल्याण पोर्टल", kn: "AI-ಚಾಲಿತ ಕಲ್ಯಾಣ ಪೋರ್ಟಲ್" },
  "Your Multilingual Government Scheme Assistant": { hi: "आपका बहुभाषी सरकारी योजना सहायक", kn: "ನಿಮ್ಮ ಬಹುಭಾಷಾ ಸರ್ಕಾರಿ ಯೋಜನೆ ಸಹಾಯಕ" },
  "Discover government schemes, check eligibility, and get personalized recommendations.": {
    hi: "सरकारी योजनाओं की खोज करें, पात्रता की जांच करें और व्यक्तिगत सिफारिशें प्राप्त करें।",
    kn: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ, ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ವೈಯಕ್ತಿಕ ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆಯಿರಿ."
  },
  "Find Personalized Schemes": { hi: "व्यक्तिगत योजनाएं खोजें", kn: "ವೈಯಕ್ತಿಕ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ" },
  "Explore Schemes": { hi: "योजनाएं खोजें", kn: "ಯೋಜನೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ" },
  "Chat with SevaBot": { hi: "सेवा बॉट से चैट करें", kn: "ಸೇವಾಬಾಟ್‌ನೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಿ" },
  "Multilingual Support": { hi: "बहुभाषी सहयोग", kn: "ಹಲವು ಭಾಷೆಗಳ ಬೆಂಬಲ" },
  "Eligibility Check": { hi: "पात्रता जांच", kn: "ಅರ್ಹತೆ ಪರಿಶೀಲನೆ" },
  "Smart Guidance": { hi: "स्मार्ट मार्गदर्शन", kn: "ಸ್ಮಾರ್ಟ್ ಮಾರ್ಗದರ್ಶನ" },

  // Catalog & Search Section
  "Government Scheme Catalog": { hi: "सरकारी योजना कैटलॉग", kn: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಪಟ್ಟಿ" },
  "Available Government Schemes": { hi: "उपलब्ध सरकारी योजनाएं", kn: "ಲಭ್ಯವಿರುವ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು" },
  "Available Government": { hi: "उपलब्ध सरकारी", kn: "ಲಭ್ಯವಿರುವ ಸರ್ಕಾರಿ" },
  "Schemes": { hi: "योजनाएं", kn: "ಯೋಜನೆಗಳು" },
  "Browse verified welfare schemes directly retrieved from the SevaBot system.": {
    hi: "सेवा बॉट प्रणाली से सीधे पुनर्प्राप्त सत्यापित कल्याणकारी योजनाएं ब्राउज़ करें।",
    kn: "ಸೇವಾಬಾಟ್ ವ್ಯವಸ್ಥೆಯಿಂದ ನೇರವಾಗಿ ಪಡೆದ ಪರಿಶೀಲಿಸಿದ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ."
  },
  "Search by keyword, concept, or describe your situation...": {
    hi: "कीवर्ड, अवधारणा द्वारा खोजें, या अपनी स्थिति का वर्णन करें...",
    kn: "ಕೀವರ್ಡ್, ಪರಿಕಲ್ಪನೆಯ ಮೂಲಕ ಹುಡುಕಿ, ಅಥವಾ ನಿಮ್ಮ ಪರಿಸ್ಥಿತಿಯನ್ನು ವಿವರಿಸಿ..."
  },
  "Semantic Search": { hi: "सिमेंटिक खोज", kn: "ಸೆಮ್ಯಾಂಟಿಕ್ ಹುಡುಕಾಟ" },
  "AI Search": { hi: "एआई खोज", kn: "AI ಹುಡುಕಾಟ" },
  "Semantic": { hi: "सिमेंटिक", kn: "ಸೆಮ್ಯಾಂಟಿಕ್" },
  "AI Advisor": { hi: "एआई सलाहकार", kn: "AI ಸಲಹೆಗಾರ" },
  "STATE": { hi: "राज्य", kn: "ರಾಜ್ಯ" },
  "SECTOR / ORG": { hi: "क्षेत्र / संगठन", kn: "ವಲಯ / ಸಂಸ್ಥೆ" },
  "SCHEME TYPE": { hi: "योजना प्रकार", kn: "ಯೋಜನೆಯ ವಿಧ" },
  "All States": { hi: "सभी राज्य", kn: "ಎಲ್ಲಾ ರಾಜ್ಯಗಳು" },
  "All Sectors": { hi: "सभी क्षेत्र", kn: "ಎಲ್ಲಾ ವಲಯಗಳು" },
  "All Types": { hi: "सभी प्रकार", kn: "ಎಲ್ಲಾ ವಿಧಗಳು" },
  "State": { hi: "राज्य", kn: "ರಾಜ್ಯ" },
  "Sector": { hi: "क्षेत्र", kn: "ವಲಯ" },
  "Sector / Org": { hi: "क्षेत्र / संगठन", kn: "ವಲಯ / ಸಂಸ್ಥೆ" },
  "Scheme Type": { hi: "योजना प्रकार", kn: "ಯೋಜನೆಯ ವಿಧ" },
  "filter": { hi: "फ़िल्टर", kn: "ಫಿಲ್ಟರ್" },
  "Select your state to filter schemes": { hi: "योजनाओं को फ़िल्टर करने के लिए अपना राज्य चुनें", kn: "ಯೋಜನೆಗಳನ್ನು ಫಿಲ್ಟರ್ ಮಾಡಲು ನಿಮ್ಮ ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ" },
  "Filter schemes by state": { hi: "राज्य द्वारा योजनाएं फ़िल्टर करें", kn: "ರಾಜ್ಯದ ಪ್ರಕಾರ ಯೋಜನೆಗಳನ್ನು ಫಿಲ್ಟರ್ ಮಾಡಿ" },
  "Select organization": { hi: "संगठन चुनें", kn: "ಸಂಸ್ಥೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ" },
  "Filter schemes by sector or organization": { hi: "क्षेत्र या संगठन द्वारा योजनाएं फ़िल्टर करें", kn: "ವಲಯ ಅಥವಾ ಸಂಸ್ಥೆಯ ಪ್ರಕಾರ ಯೋಜನೆಗಳನ್ನು ಫಿಲ್ಟರ್ ಮಾಡಿ" },
  "Select scheme type": { hi: "योजना का प्रकार चुनें", kn: "ಯೋಜನೆಯ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ" },
  "Filter schemes by scheme type": { hi: "योजना प्रकार द्वारा फ़िल्टर करें", kn: "ಯೋಜನೆಯ ಪ್ರಕಾರದ ಮೂಲಕ ಫಿಲ್ಟರ್ ಮಾಡಿ" },
  "Clear all dropdown filters": { hi: "सभी ड्रॉपडाउन फ़िल्टर हटाएं", kn: "ಎಲ್ಲಾ ಡ್ರಾಪ್‌ಡೌನ್ ಫಿಲ್ಟರ್‌ಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ" },
  "Semantic Search Active": { hi: "सिमेंटिक खोज सक्रिय", kn: "ಸೆಮ್ಯಾಂಟಿಕ್ ಹುಡುಕಾಟ ಸಕ್ರಿಯವಾಗಿದೆ" },
  "AI Search Active": { hi: "एआई खोज सक्रिय", kn: "AI ಹುಡುಕಾಟ ಸಕ್ರಿಯವಾಗಿದೆ" },
  "Found": { hi: "मिले", kn: "ಕಂಡುಬಂದಿದೆ" },
  "matching schemes with relevance ranking": { hi: "प्रासंगिकता रैंकिंग के साथ मेल खाती योजनाएं", kn: "ಪ್ರಸ್ತುತತೆಯ ಶ್ರೇಯಾಂಕದೊಂದಿಗೆ ಹೊಂದಾಣಿಕೆಯ ಯೋಜನೆಗಳು" },
  "matching schemes": { hi: "मेल खाती योजनाएं", kn: "ಹೊಂದಾಣಿಕೆಯಾಗುವ ಯೋಜನೆಗಳು" },
  "(filters applied)": { hi: "(फ़िल्टर लागू)", kn: "(ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಅನ್ವಯಿಸಲಾಗಿದೆ)" },
  "(with filters applied)": { hi: "(फ़िल्टर लागू होने के साथ)", kn: "(ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಅನ್ವಯಿಸುವುದರೊಂದಿಗೆ)" },
  "Back to All Schemes": { hi: "सभी योजनाओं पर वापस जाएं", kn: "ಎಲ್ಲಾ ಯೋಜನೆಗಳಿಗೆ ಹಿಂತಿರುಗಿ" },
  "schemes matching": { hi: "योजनाएं मेल खाती हैं", kn: "ಹೊಂದಾಣಿಕೆಯ ಯೋಜನೆಗಳು" },
  "schemes matching selected filters": { hi: "चयनित फ़िल्टर से मेल खाती योजनाएं", kn: "ಆಯ್ಕೆಮಾಡಿದ ಫಿಲ್ಟರ್‌ಗಳಿಗೆ ಹೊಂದಾಣಿಕೆಯ ಯೋಜನೆಗಳು" },
  "Exit AI search": { hi: "एआई खोज बंद करें", kn: "AI ಹುಡುಕಾಟದಿಂದ ನಿರ್ಗಮಿಸಿ" },
  "No description provided.": { hi: "कोई विवरण प्रदान नहीं किया गया।", kn: "ಯಾವುದೇ ವಿವರಣೆ ಒದಗಿಸಲಾಗಿಲ್ಲ." },
  "Match Score": { hi: "मैच स्कोर", kn: "ಹೊಂದಾಣಿಕೆ ಅಂಕ" },
  "to your profile!": { hi: "आपकी प्रोफ़ाइल में!", kn: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್‌ಗೆ!" },
  "from saved schemes": { hi: "सहेजी गई योजनाओं से", kn: "ಉಳಿಸಿದ ಯೋಜನೆಗಳಿಂದ" },
  "Removed": { hi: "हटाया गया", kn: "ತೆಗೆದುಹಾಕಲಾಗಿದೆ" },
  "No schemes match both your search criteria and active filters.": {
    hi: "कोई भी योजना आपके खोज मानदंडों और सक्रिय फ़िल्टर दोनों से मेल नहीं खाती।",
    kn: "ಯಾವುದೇ ಯೋಜನೆಗಳು ನಿಮ್ಮ ಹುಡುಕಾಟ ಮಾನದಂಡಗಳು ಮತ್ತು ಸಕ್ರಿಯ ಫಿಲ್ಟರ್‌ಗಳೆರಡಕ್ಕೂ ಹೊಂದಿಕೆಯಾಗುವುದಿಲ್ಲ."
  },
  "Try broadening your filters or search keywords.": {
    hi: "अपने फ़िल्टर या खोज शब्दों को व्यापक बनाने का प्रयास करें।",
    kn: "ನಿಮ್ಮ ಫಿಲ್ಟರ್‌ಗಳು ಅಥವಾ ಹುಡುಕಾಟ ಕೀವರ್ಡ್‌ಗಳನ್ನು ವಿಸ್ತರಿಸಲು ಪ್ರಯತ್ನಿಸಿ."
  },
  "No schemes match your exact filter combination. Try selecting a broader category or resetting filters.": {
    hi: "कोई भी योजना आपके सटीक फ़िल्टर संयोजन से मेल नहीं खाती। व्यापक श्रेणी का चयन करने या फ़िल्टर रीसेट करने का प्रयास करें।",
    kn: "ಯಾವುದೇ ಯೋಜನೆಗಳು ನಿಮ್ಮ ನಿಖರವಾದ ಫಿಲ್ಟರ್ ಸಂಯೋಜನೆಗೆ ಹೊಂದಿಕೆಯಾಗುವುದಿಲ್ಲ. ವಿಶಾಲವಾದ ವರ್ಗವನ್ನು ಆಯ್ಕೆ ಮಾಡಲು ಅಥವಾ ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಮರುಹೊಂದಿಸಲು ಪ್ರಯತ್ನಿಸಿ."
  },
  "No schemes met the semantic relevance criteria for": {
    hi: "के लिए कोई भी योजना सिमेंटिक प्रासंगिकता मानदंडों को पूरा नहीं करती",
    kn: "ಗೆ ಯಾವುದೇ ಯೋಜನೆಗಳು ಸೆಮ್ಯಾಂಟಿಕ್ ಪ್ರಸ್ತುತತೆಯ ಮಾನದಂಡಗಳನ್ನು ಪೂರೈಸಿಲ್ಲ"
  },
  "Try related words or describe your need differently.": {
    hi: "संबंधित शब्दों का प्रयास करें या अपनी आवश्यकता का अलग ढंग से वर्णन करें।",
    kn: "ಸಂಬಂಧಿತ ಪದಗಳನ್ನು ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ನಿಮ್ಮ ಅಗತ್ಯವನ್ನು ವಿಭಿನ್ನವಾಗಿ ವಿವರಿಸಿ."
  },
  "The AI advisor could not find direct scheme matches for": {
    hi: "एआई सलाहकार को इसके लिए सीधे योजना मिलान नहीं मिल सके",
    kn: "AI ಸಲಹೆಗಾರರಿಗೆ ಇದಕ್ಕಾಗಿ ನೇರ ಯೋಜನೆಯ ಹೊಂದಾಣಿಕೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ"
  },
  "Try describing your requirement with other details.": {
    hi: "अन्य विवरणों के साथ अपनी आवश्यकता का वर्णन करने का प्रयास करें।",
    kn: "ಇತರ ವಿವರಗಳೊಂದಿಗೆ ನಿಮ್ಮ ಅಗತ್ಯವನ್ನು ವಿವರಿಸಲು ಪ್ರಯತ್ನಿಸಿ."
  },
  "No schemes matched your keyword search for": {
    hi: "आपके कीवर्ड खोज से कोई योजना मेल नहीं खाती",
    kn: "ನಿಮ್ಮ ಕೀವರ್ಡ್ ಹುಡುಕಾಟಕ್ಕೆ ಯಾವುದೇ ಯೋಜನೆಗಳು ಹೊಂದಿಕೆಯಾಗಿಲ್ಲ"
  },
  "Active Filters:": { hi: "सक्रिय फ़िल्टर:", kn: "ಸಕ್ರಿಯ ಫಿಲ್ಟರ್‌ಗಳು:" },
  "Clear Filters": { hi: "फ़िल्टर हटाएं", kn: "ಫಿಲ್ಟರ್‌ಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ" },
  "Reset All Filters": { hi: "सभी फ़िल्टर रीसेट करें", kn: "ಎಲ್ಲಾ ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಮರುಹೊಂದಿಸಿ" },
  "Clear Search": { hi: "खोज हटाएं", kn: "ಹುಡುಕಾಟ ತೆರವುಗೊಳಿಸಿ" },
  "Reset All": { hi: "सभी रीसेट करें", kn: "ಎಲ್ಲವನ್ನೂ ಮರುಹೊಂದಿಸಿ" },
  "Dismiss": { hi: "खारिज करें", kn: "ವಜಾಗೊಳಿಸಿ" },
  "Semantic Search Notice": { hi: "सिमेंटिक खोज सूचना", kn: "ಸೆಮ್ಯಾಂಟಿಕ್ ಹುಡುಕಾಟ ಸೂಚನೆ" },
  "AI Search Notice": { hi: "एआई खोज सूचना", kn: "AI ಹುಡುಕಾಟ ಸೂಚನೆ" },
  "Matching schemes using semantic similarity and concept relevance...": {
    hi: "सिमेंटिक समानता और प्रासंगिकता का उपयोग करके योजनाओं का मिलान किया जा रहा है...",
    kn: "ಸೆಮ್ಯಾಂಟಿಕ್ ಹೋಲಿಕೆ ಮತ್ತು ಪರಿಕಲ್ಪನೆಯ ಪ್ರಸ್ತುತತೆಯನ್ನು ಬಳಸಿಕೊಂಡು ಯೋಜನೆಗಳನ್ನು ಹೊಂದಿಸಲಾಗುತ್ತಿದೆ..."
  },
  "AI is analyzing your situation to recommend matching welfare schemes...": {
    hi: "एआई उपयुक्त कल्याणकारी योजनाओं की सिफारिश करने के लिए आपकी स्थिति का विश्लेषण कर रहा है...",
    kn: "ಹೊಂದಾಣಿಕೆಯಾಗುವ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳನ್ನು ಶಿಫಾರಸು ಮಾಡಲು AI ನಿಮ್ಮ ಪರಿಸ್ಥಿತಿಯನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ..."
  },
  "AI Scheme Advisor Recommendation": { hi: "एआई योजना सलाहकार सिफारिश", kn: "AI ಯೋಜನೆ ಸಲಹೆಗಾರ ಶಿಫಾರಸು" },
  "Loading government schemes from backend...": { hi: "बैकएंड से सरकारी योजनाएं लोड हो रही हैं...", kn: "ಬ್ಯಾಕೆಂಡ್‌ನಿಂದ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ..." },
  "Unable to Load Schemes": { hi: "योजनाएं लोड करने में असमर्थ", kn: "ಯೋಜನೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ" },
  "Retry Fetching Schemes": { hi: "योजनाएं पुनः प्राप्त करने का प्रयास करें", kn: "ಯೋಜನೆಗಳನ್ನು ಮರುಪಡೆಯಲು ಪ್ರಯತ್ನಿಸಿ" },
  "No government schemes found.": { hi: "कोई सरकारी योजना नहीं मिली।", kn: "ಯಾವುದೇ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ." },
  "No matching schemes found": { hi: "कोई मेल खाती योजना नहीं मिली", kn: "ಯಾವುದೇ ಹೊಂದಾಣಿಕೆಯ ಯೋಜನೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ" },

  // Scheme Cards
  "Match": { hi: "मेल", kn: "ಹೊಂದಾಣಿಕೆ" },
  "Matching...": { hi: "मिलान किया जा रहा है...", kn: "ಹೊಂದಿಸಲಾಗುತ್ತಿದೆ..." },
  "Thinking...": { hi: "विचार कर रहा है...", kn: "ಯೋಚಿಸುತ್ತಿದೆ..." },
  "Official Link": { hi: "आधिकारिक लिंक", kn: "ಅಧಿಕೃತ ಲಿಂಕ್" },
  "Official Portal": { hi: "आधिकारिक पोर्टल", kn: "ಅಧಿಕೃತ ಪೋರ್ಟಲ್" },
  "View Details ↗": { hi: "विवरण देखें ↗", kn: "ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ ↗" },
  "Try Again": { hi: "पुनः प्रयास करें", kn: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ" },
  "Save": { hi: "सहेजें", kn: "ಉಳಿಸಿ" },
  "Saved": { hi: "सहेजा गया", kn: "ಉಳಿಸಲಾಗಿದೆ" },
  "Steps & Docs": { hi: "चरण और दस्तावेज़", kn: "ಹಂತಗಳು ಮತ್ತು ದಾಖಲೆಗಳು" },
  "Save scheme to profile": { hi: "प्रोफ़ाइल में योजना सहेजें", kn: "ಪ್ರೊಫೈಲ್‌ಗೆ ಯೋಜನೆಯನ್ನು ಉಳಿಸಿ" },
  "Remove from saved schemes": { hi: "सहेजी गई योजनाओं से हटाएं", kn: "ಉಳಿಸಿದ ಯೋಜನೆಗಳಿಂದ ತೆಗೆದುಹಾಕಿ" },
  "View application steps and mandatory documents": {
    hi: "आवेदन चरण और अनिवार्य दस्तावेज़ देखें",
    kn: "ಅರ್ಜಿ ಹಂತಗಳು ಮತ್ತು ಕಡ್ಡಾಯ ದಾಖಲೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ"
  },

  // Sectors & Scheme Types
  "All India": { hi: "अखिल भारतीय", kn: "ಅಖಿಲ ಭಾರತ" },
  "Karnataka": { hi: "कर्नाटक", kn: "ಕರ್ನಾಟಕ" },
  "Delhi": { hi: "दिल्ली", kn: "ದೆಹಲಿ" },
  "Telangana": { hi: "तेलंगाना", kn: "ತೆಲಂಗಾಣ" },
  "Tamil Nadu": { hi: "तमिलनाडु", kn: "ತಮಿಳುನಾಡು" },
  "Odisha": { hi: "ओडिशा", kn: "ಒಡಿಶಾ" },
  "Gujarat": { hi: "गुजरात", kn: "ಗುಜರಾತ್" },
  "Maharashtra": { hi: "महाराष्ट्र", kn: "ಮಹಾರಾಷ್ಟ್ರ" },
  "Central Government": { hi: "केंद्र सरकार", kn: "ಕೇಂದ್ರ ಸರ್ಕಾರ" },
  "Government of Karnataka": { hi: "ಕರ್नाटक सरकार", kn: "ಕರ್ನಾಟಕ ಸರ್ಕಾರ" },
  "Government of Maharashtra": { hi: "महाराष्ट्र सरकार", kn: "ಮಹಾರಾಷ್ಟ್ರ ಸರ್ಕಾರ" },
  "Government of Telangana": { hi: "तेलंगाना सरकार", kn: "ತೆಲಂಗಾಣ ಸರ್ಕಾರ" },
  "Government of Odisha": { hi: "ओडिशा सरकार", kn: "ಒಡಿಶಾ ಸರ್ಕಾರ" },
  "Government of Delhi": { hi: "दिल्ली सरकार", kn: "ದೆಹಲಿ ಸರ್ಕಾರ" },
  "Government of Tamil Nadu": { hi: "तमिलनाडु सरकार", kn: "ತಮಿಳುನಾಡು ಸರ್ಕಾರ" },
  "Government of Gujarat": { hi: "गुजरात सरकार", kn: "ಗುಜರಾತ್ ಸರ್ಕಾರ" },
  "Government": { hi: "सरकार", kn: "ಸರ್ಕಾರ" },
  "Agriculture Sector": { hi: "कृषि क्षेत्र", kn: "ಕೃಷಿ ವಲಯ" },
  "Medical Sector": { hi: "चिकित्सा क्षेत्र", kn: "ವೈದ್ಯಕೀಯ ವಲಯ" },
  "Education Sector": { hi: "शिक्षा क्षेत्र", kn: "ಶಿಕ್ಷಣ ವಲಯ" },
  "Business & Housing Sector": { hi: "व्यवसाय और आवास क्षेत्र", kn: "ವ್ಯಾಪಾರ ಮತ್ತು ವಸತಿ ವಲಯ" },
  "General": { hi: "सामान्य", kn: "ಸಾಮಾನ್ಯ" },
  "Central Scheme": { hi: "केंद्रीय योजना", kn: "ಕೇಂದ್ರ ಯೋಜನೆ" },
  "State Scheme": { hi: "राज्य योजना", kn: "ರಾಜ್ಯ ಯೋಜನೆ" },
  "Others": { hi: "अन्य", kn: "ಇತರೆ" },
  "Loan for farming": { hi: "खेती के लिए ऋण", kn: "ಕೃಷಿಗೆ ಸಾಲ" },
  "Financial support": { hi: "आर्थिक सहायता", kn: "ಹಣಕಾಸಿನ ಬೆಂಬಲ" },
  "Crop insurance": { hi: "फसल बीमा", kn: "ಬೆಳೆ ವಿಮೆ" },
  "Equipment subsidy": { hi: "उपकरण सब्सिडी", kn: "ಉಪಕರಣ ಸಬ್ಸಿಡಿ" },
  "Debt Relief": { hi: "ऋण राहत", kn: "ಸಾಲ ಪರಿಹಾರ" },
  "Skill Development": { hi: "कौशल विकास", kn: "ಕೌಶಲ್ಯ ಅಭಿವೃದ್ಧಿ" },
  "Healthcare": { hi: "स्वास्थ्य देखभाल", kn: "ಆರೋಗ್ಯ ರಕ್ಷಣೆ" },
  "Girl Child Welfare": { hi: "बालिका कल्याण", kn: "ಹೆಣ್ಣು ಮಕ್ಕಳ ಕಲ್ಯಾಣ" },
  "Solar Energy & Irrigation": { hi: "सौर ऊर्जा और सिंचाई", kn: "ಸೌರ ಶಕ್ತಿ ಮತ್ತು ನೀರಾವರಿ" },
  "Market Linkage": { hi: "बाजार लिंकेज", kn: "ಮಾರುಕಟ್ಟೆ ಸಂಪರ್ಕ" },
  "Medical Insurance": { hi: "चिकित्सा बीमा", kn: "ವೈದ್ಯಕೀಯ ವಿಮೆ" },
  "Business Loan": { hi: "व्यापार ऋण", kn: "ವ್ಯಾಪಾರ ಸಾಲ" },
  "General checkups": { hi: "सामान्य स्वास्थ्य जांच", kn: "ಸಾಮಾನ್ಯ ತಪಾಸಣೆ" },
  "Hospitalization / Surgery": { hi: "अस्पताल में भर्ती / सर्जरी", kn: "ಆಸ್ಪತ್ರೆಗೆ ದಾಖಲು / ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ" },
  "Tuition Fee": { hi: "ट्यूशन फीस", kn: "ಶಿಕ್ಷಣ ಶುಲ್ಕ" },
  "Start a business": { hi: "व्यवसाय शुरू करना", kn: "ವ್ಯಾಪಾರವನ್ನು ಪ್ರಾರಂಭಿಸುವುದು" },
  "Not Applicable": { hi: "लागू नहीं", kn: "ಅನ್ವಯಿಸುವುದಿಲ್ಲ" },
  "Any": { hi: "कोई भी", kn: "ಯಾವುದಾದರೂ" },

  // Schemes Names & Descriptions
  "Kisan Credit Card (KCC)": { hi: "किसान क्रेडिट कार्ड (केसीसी)", kn: "ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ (ಕೆಯೆಸಿಸಿ)" },
  "Provides subsidized loans for farming up to 3 lakhs.": { hi: "खेती के लिए 3 लाख तक का अनुदानित ऋण प्रदान करता है।", kn: "ಕೃಷಿಗೆ 3 ಲಕ್ಷದವರೆಗೆ ಸಬ್ಸಿಡಿ ಸಾಲ ಒದಗಿಸುತ್ತದೆ." },
  "PM KISAN Samman Nidhi": { hi: "पीएम किसान सम्मान निधि", kn: "ಪಿಎಂ ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ" },
  "Direct benefit transfer of ₹6000 per year.": { hi: "प्रति वर्ष ₹6000 का प्रत्यक्ष लाभ हस्तांतरण।", kn: "ವರ್ಷಕ್ಕೆ ₹6000 ನೇರ ಲಾಭ ವರ್ಗಾವಣೆ." },
  "Pradhan Mantri Fasal Bima Yojana": { hi: "प्रधान मंत्री फसल बीमा योजना", kn: "ಪ್ರಧಾನ ಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ" },
  "Premium crop insurance coverage.": { hi: "प्रीमियम फसल बीमा कवरेज।", kn: "ಪ್ರೀಮಿಯಂ ಬೆಳೆ ವಿಮೆ ವ್ಯಾಪ್ತಿ." },
  "Sub Mission on Agricultural Mechanization": { hi: "कृषि यंत्रीकरण पर उप-मिशन", kn: "ಕೃಷಿ ಯಾಂತ್ರಿಕರಣದ ಉಪ-ಮಿಷನ್" },
  "Subsidies on equipment up to 50-80%.": { hi: "उपकरणों पर 50-80% तक सब्सिडी।", kn: "ಉಪಕರಣಗಳ ಮೇಲೆ 50-80% ರವರೆಗೆ ಸಬ್ಸಿಡಿ ಕಡಿತ." },
  "Karnataka Krishi Bhagya": { hi: "कर्नाटक कृषि भाग्य", kn: "ಕರ್ನಾಟಕ ಕೃಷಿ ಭಾಗ್ಯ" },
  "Rainwater harvesting and critical irrigation support during dry spells.": { hi: "सूखे के दौरान वर्षा जल संचयन और महत्वपूर्ण सिंचाई सहायता।", kn: "ಮಳೆಕೊಯ್ಲು ಮತ್ತು ಶುಷ್ಕ ಅವಧಿಗಳಲ್ಲಿ ನಿರ್ಣಾಯಕ ನೀರಾವರಿ ಬೆಂಬಲ." },
  "Karnataka Raitha Suraksha": { hi: "कर्नाटक रैता सुरक्षा", kn: "ಕರ್ನಾಟಕ ರೈತ ಸುರಕ್ಷಾ" },
  "Financial assistance to farmers during crop failure.": { hi: "फसल खराब होने के दौरान किसानों को आर्थिक सहायता।", kn: "ಬೆಳೆ ವೈಫಲ್ಯದ ಸಂದರ್ಭದಲ್ಲಿ ರೈತರಿಗೆ ಆರ್ಥಿಕ ನೆರವು." },
  "Maharashtra Mahatma Jotirao Phule Shetkari Karjmukti": { hi: "महाराष्ट्र महात्मा जोतराव फुले शेतकरी कर्जमुक्ति", kn: "ಮಹಾರಾಷ್ಟ್ರ ಮಹಾತ್ಮ ಜ್ಯೋತಿರಾವ್ ಫುಲೆ ರೈತ ಸಾಲ ಮನ್ನಾ" },
  "Debt relief for farmers facing severe financial crises.": { hi: "गंभीर आर्थिक संकट का सामना कर रहे किसानों के लिए ऋण राहत।", kn: "ತೀವ್ರ ಆರ್ಥಿಕ ಬಿಕ್ಕಟ್ಟು ಎದುರಿಸುತ್ತಿರುವ ರೈತರಿಗೆ ಸಾಲ ಮನ್ನಾ." },
  "Rythu Bandhu Scheme": { hi: "रायथू बंधु योजना", kn: "ರೈತ ಬಂಧು ಯೋಜನೆ" },
  "Investment support for agriculture and horticulture crops by way of a grant of ₹5,000 per acre per farmer.": { hi: "प्रति किसान ₹5,000 प्रति एकड़ के अनुदान के माध्यम से कृषि और बागवानी फसलों के लिए निवेश सहायता।", kn: "ಪ್ರತಿ ರೈತನಿಗೆ ಪ್ರತಿ ಎಕರೆಗೆ ₹5,000 ಅನುದಾನದ ಮೂಲಕ ಕೃಷಿ ಮತ್ತು ತೋಟಗಾರಿಕೆ ಬೆಳೆಗಳಿಗೆ ಹೂಡಿಕೆ ಬೆಂಬಲ." },
  "KALIA Scheme": { hi: "कालिया योजना (KALIA)", kn: "ಕಾಳಿಯಾ ಯೋಜನೆ (KALIA)" },
  "Financial assistance to cultivators, landless agricultural laborers, and vulnerable agricultural households.": { hi: "खेतिहरों, भूमिहीन कृषि मजदूरों और कमजोर कृषि परिवारों को वित्तीय सहायता।", kn: "ಕೃಷಿಕರು, ಭೂರಹಿತ ಕೃಷಿ ಕಾರ್ಮಿಕರು ಮತ್ತು ದುರ್ಬಲ ಕೃಷಿ ಕುಟುಂಬಗಳಿಗೆ ಆರ್ಥಿಕ ನೆರವು." },
  "Delhi Free Spoken English Course": { hi: "दिल्ली मुफ्त अंग्रेजी बोलने का पाठ्यक्रम", kn: "ದೆಹಲಿ ಉಚಿತ ಸ್ಪೋಕನ್ ಇಂಗ್ಲಿಷ್ ಕೋರ್ಸ್" },
  "Provides free comprehensive spoken English lessons for youth to enhance employability.": { hi: "रोजगार क्षमता बढ़ाने के लिए युवाओं को मुफ्त व्यापक बोली जाने वाली अंग्रेजी की कक्षाएं प्रदान करता है।", kn: "ಉದ್ಯೋಗವನ್ನು ಹೆಚ್ಚಿಸಲು ಯುವಜನರಿಗೆ ಉಚಿತ ಇಂಗ್ಲಿಷ್ ಭಾಷೆಯ ಪಾಠಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ." },
  "Tamil Nadu Makkalai Thedi Maruthuvam": { hi: "तमिलनाडु मक्कलै थेडी मरुथुवम", kn: "ತಮಿಳುನಾಡು ಮಕ್ಕಳೈ ತೇಡಿ ಮರುತ್ತುವಂ" },
  "Doorstep healthcare services ensuring medical access to isolated households.": { hi: "अलग-थलग पड़े घरों तक चिकित्सा पहुंच सुनिश्चित करने वाली डोरस्टेप स्वास्थ्य सेवाएँ।", kn: "ಪ್ರತ್ಯೇಕವಾದ ಮನೆಗಳಿಗೆ ವೈದ್ಯಕೀಯ ಪ್ರವೇಶವನ್ನು ಖಾತ್ರಿಪಡಿಸುವ ಮನೆ ಬಾಗಿಲಿನ ಆರೋಗ್ಯ ಸೇವೆಗಳು." },
  "Gujarat Vhali Dikri Yojana": { hi: "गुजरात वहाली दीकरी योजना", kn: "ಗುಜರಾತ್ ವಹಾಲಿ ದಿಕ್ರಿ ಯೋಜನೆ" },
  "Financial assistance to families for the education and marriage of the girl child.": { hi: "बालिका की शिक्षा और विवाह के लिए परिवारों को वित्तीय सहायता।", kn: "ಹೆಣ್ಣು ಮಗುವಿನ ಶಿಕ್ಷಣ ಮತ್ತು ಮದುವೆಗಾಗಿ ಕುಟುಂಬಗಳಿಗೆ ಆರ್ಥಿಕ ನೆರವು." },
  "PM KUSUM Scheme": { hi: "पीएम कुसुम योजना", kn: "ಪಿಎಂ ಕುಸುಮ್ ಯೋಜನೆ" },
  "Subsidies for setting up solar pumps and grid-connected solar power plants.": { hi: "सौर पंप और ग्रिड से जुड़े सौर ऊर्जा संयंत्र स्थापित करने के लिए सब्सिडी।", kn: "ಸೌರ ಪಂಪ್‌ಗಳು ಮತ್ತು ಗ್ರಿಡ್-ಸಂಪರ್ಕಿತ ಸೌರ ವಿದ್ಯುತ್ ಸ್ಥಾವರಗಳನ್ನು ಸ್ಥಾಪಿಸಲು ಸಬ್ಸಿಡಿಗಳು." },
  "e-NAM (National Agriculture Market)": { hi: "ई-नाम (राष्ट्रीय कृषि बाजार)", kn: "e-NAM (ರಾಷ್ಟ್ರೀಯ ಕೃಷಿ ಮಾರುಕಟ್ಟೆ)" },
  "Pan-India electronic trading portal linking APMCs.": { hi: "एपीएमसी को जोड़ने वाला अखिल भारतीय इलेक्ट्रॉनिक ट्रेडिंग पोर्टल।", kn: "ಎಪಿಎಂಸಿಗಳನ್ನು ಲಿಂಕ್ ಮಾಡುವ ಪ್ಯಾನ್-ಇಂಡಿಯಾ ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಟ್ರೇಡಿಂಗ್ ಪೋರ್ಟಲ್." },
  "Ayushman Bharat PMJAY": { hi: "आयुष्मान भारत (PMJAY)", kn: "ಆಯುಷ್ಮಾನ್ ಭಾರತ್ (PMJAY)" },
  "Medical cover up to 5 Lakhs.": { hi: "5 लाख तक का मेडिकल कवर।", kn: "5 ಲಕ್ಷದವರೆಗೆ ವೈದ್ಯಕೀಯ ರಕ್ಷಣೆ." },
  "MUDRA Yojana": { hi: "मुद्रा योजना (MUDRA)", kn: "ಮುದ್ರಾ ಯೋಜನೆ" },
  "Business loan support for entrepreneurs.": { hi: "उद्यमियों के लिए व्यवसाय ऋण सहायता।", kn: "ಉದ್ಯಮಿಗಳಿಗೆ ವ್ಯಾಪಾರ ಸಾಲ ಬೆಂಬಲ." },

  // Scheme Modal
  "Scheme Details & Application Guide": { hi: "योजना विवरण और आवेदन गाइड", kn: "ಯೋಜನೆ ವಿವರಗಳು ಮತ್ತು ಅರ್ಜಿ ಮಾರ್ಗದರ್ಶಿ" },
  "Target Sector": { hi: "लक्षित क्षेत्र", kn: "ಗುರಿ ವಲಯ" },
  "Income Eligibility": { hi: "आय पात्रता", kn: "ಆದಾಯ ಅರ್ಹತೆ" },
  "Authority": { hi: "प्राधिकरण", kn: "ಪ್ರಾಧಿಕಾರ" },
  "Key Benefits": { hi: "मुख्य लाभ", kn: "ಪ್ರಮುಖ ಪ್ರಯೋಜನಗಳು" },
  "Key Benefits & Details": { hi: "मुख्य लाभ और विवरण", kn: "ಪ್ರಮುಖ ಪ್ರಯೋಜನಗಳು ಮತ್ತು ವಿವರಗಳು" },
  "Step-by-Step Application Process": { hi: "चरण-दर-चरण आवेदन प्रक्रिया", kn: "ಹಂತ-ಹಂತದ ಅರ್ಜಿ ಪ್ರಕ್ರಿಯೆ" },
  "Mandatory Documents": { hi: "अनिवार्य दस्तावेज़", kn: "ಕಡ್ಡಾಯ ದಾಖಲೆಗಳು" },
  "Official Website": { hi: "आधिकारिक वेबसाइट", kn: "ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್" },
  "Save to My Profile": { hi: "मेरी प्रोफ़ाइल में सहेजें", kn: "ನನ್ನ ಪ್ರೊಫೈಲ್‌ಗೆ ಉಳಿಸಿ" },
  "Scheme Saved": { hi: "योजना सहेजी गई", kn: "ಯೋಜನೆ ಉಳಿಸಲಾಗಿದೆ" },
  "Close": { hi: "बंद करें", kn: "ಮುಚ್ಚಿ" },

  // Profile Modal
  "Citizen Profile": { hi: "नागरिक प्रोफ़ाइल", kn: "ನಾಗರಿಕ ಪ್ರೊಫೈಲ್" },
  "No phone linked yet": { hi: "कोई फ़ोन लिंक नहीं है", kn: "ಇನ್ನೂ ಯಾವುದೇ ಫೋನ್ ಲಿಂಕ್ ಮಾಡಲಾಗಿಲ್ಲ" },
  "Saved Schemes": { hi: "सहेजी गई योजनाएं", kn: "ಉಳಿಸಿದ ಯೋಜನೆಗಳು" },
  "User Profile": { hi: "उपयोगकर्ता प्रोफ़ाइल", kn: "ಬಳಕೆದಾರ ಪ್ರೊಫೈಲ್" },
  "Showing": { hi: "दिखाया जा रहा है", kn: "ತೋರಿಸಲಾಗುತ್ತಿದೆ" },
  "saved scheme": { hi: "सहेजी गई योजना", kn: "ಉಳಿಸಿದ ಯೋಜನೆ" },
  "saved schemes": { hi: "सहेजी गई योजनाएं", kn: "ಉಳಿಸಿದ ಯೋಜನೆಗಳು" },
  "Sync Backend": { hi: "बैकएंड सिंक करें", kn: "ಬ್ಯಾಕೆಂಡ್ ಸಿಂಕ್ ಮಾಡಿ" },
  "Syncing...": { hi: "सिंक हो रहा है...", kn: "ಸಿಂಕ್ ಆಗುತ್ತಿದೆ..." },
  "No saved schemes yet": { hi: "अभी तक कोई सहेजी गई योजना नहीं है", kn: "ಇನ್ನೂ ಯಾವುದೇ ಉಳಿಸಿದ ಯೋಜನೆಗಳಿಲ್ಲ" },
  "You haven't saved any government schemes yet. Explore our verified schemes catalog and click “Save Scheme” on any scheme you wish to track.": {
    hi: "आपने अभी तक कोई सरकारी योजना नहीं सहेजी है। हमारे सत्यापित योजनाओं के कैटलॉग को देखें और किसी भी योजना पर \"Save\" पर क्लिक करें।",
    kn: "ನೀವು ಇನ್ನೂ ಯಾವುದೇ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಉಳಿಸಿಲ್ಲ. ನಮ್ಮ ಪರಿಶೀಲಿಸಿದ ಯೋಜನೆಗಳ ಪಟ್ಟಿಯನ್ನು ಅನ್ವೇಷಿಸಿ ಮತ್ತು ಉಳಿಸಲು \"Save\" ಕ್ಲಿಕ್ ಮಾಡಿ."
  },
  "Browse Schemes": { hi: "योजनाएं ब्राउज़ करें", kn: "ಯೋಜನೆಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ" },
  "Applied": { hi: "लागू किया गया", kn: "ಅರ್ಜಿ ಸಲ್ಲಿಸಲಾಗಿದೆ" },
  "Required Documents:": { hi: "आवश्यक दस्तावेज़:", kn: "ಅಗತ್ಯವಿರುವ ದಾಖಲೆಗಳು:" },
  "Remove": { hi: "हटाएं", kn: "ತೆಗೆದುಹಾಕಿ" },
  "View Steps": { hi: "चरण देखें", kn: "ಹಂತಗಳನ್ನು ವೀಕ್ಷಿಸಿ" },
  "Citizen": { hi: "नागरिक", kn: "ನಾಗರಿಕ" },
  "Phone:": { hi: "फ़ोन:", kn: "ಫೋನ್:" },
  "Edit Profile": { hi: "प्रोफ़ाइल संपादित करें", kn: "ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ" },
  "Sign Out": { hi: "साइन आउट", kn: "ಸೈನ್ ಔಟ್" },
  "Full Name": { hi: "पूरा नाम", kn: "ಪೂರ್ಣ ಹೆಸರು" },
  "Phone Number": { hi: "फ़ोन नंबर", kn: "ಫೋನ್ ಸಂಖ್ಯೆ" },
  "Age": { hi: "आयु", kn: "ವಯಸ್ಸು" },
  "Address / District / State": { hi: "पता / जिला / राज्य", kn: "ವಿಳಾಸ / ಜಿಲ್ಲೆ / ರಾಜ್ಯ" },
  "Address / State": { hi: "पता / राज्य", kn: "ವಿಳಾಸ / ರಾಜ್ಯ" },
  "PIN Code": { hi: "पिन कोड", kn: "ಪಿನ್ ಕೋಡ್" },
  "Not provided": { hi: "प्रदान नहीं किया गया", kn: "ಒದಗಿಸಲಾಗಿಲ್ಲ" },
  "Years": { hi: "वर्ष", kn: "ವರ್ಷಗಳು" },
  "Enter your details below to create your profile and link your saved government schemes.": {
    hi: "अपनी प्रोफ़ाइल बनाने और अपनी सहेजी गई सरकारी योजनाओं को जोड़ने के लिए नीचे अपना विवरण दर्ज करें।",
    kn: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ರಚಿಸಲು ಮತ್ತು ಉಳಿಸಿದ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಲಿಂಕ್ ಮಾಡಲು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ."
  },
  "Enter your details below to save your profile to the backend database and automatically synchronize your saved schemes.": {
    hi: "अपनी प्रोफ़ाइल को बैकएंड डेटाबेस में सहेजने और अपनी सहेजी गई योजनाओं को स्वचालित रूप से सिंक्रनाइज़ करने के लिए नीचे अपना विवरण दर्ज करें।",
    kn: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಅನ್ನು ಬ್ಯಾಕೆಂಡ್ ಡೇಟಾಬೇಸ್‌ಗೆ ಉಳಿಸಲು ಮತ್ತು ಉಳಿಸಿದ ಯೋಜನೆಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಸಿಂಕ್ ಮಾಡಲು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಕೆಳಗೆ ನಮೂದಿಸಿ."
  },
  "Retrieving your saved schemes from SevaBot backend...": {
    hi: "सेवा बॉट बैकएंड से आपकी सहेजी गई योजनाएं प्राप्त की जा रही हैं...",
    kn: "ಸೇವಾಬಾಟ್ ಬ್ಯಾಕೆಂಡ್‌ನಿಂದ ನಿಮ್ಮ ಉಳಿಸಿದ ಯೋಜನೆಗಳನ್ನು ಹಿಂಪಡೆಯಲಾಗುತ್ತಿದೆ..."
  },
  "Used as your unique citizen ID to save schemes in the database.": {
    hi: "डेटाबेस में योजनाओं को सहेजने के लिए आपकी विशिष्ट नागरिक आईडी के रूप में उपयोग किया जाता है।",
    kn: "ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ಯೋಜನೆಗಳನ್ನು ಉಳಿಸಲು ನಿಮ್ಮ ಅನನ್ಯ ನಾಗರಿಕ ಐಡಿಯಾಗಿ ಬಳಸಲಾಗುತ್ತದೆ."
  },
  "Update your profile details below. Changes will sync to the database.": {
    hi: "नीचे अपनी प्रोफ़ाइल विवरण अपडेट करें। परिवर्तन डेटाबेस में सिंक होंगे।",
    kn: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ವಿವರಗಳನ್ನು ನವೀಕರಿಸಿ. ಬದಲಾವಣೆಗಳು ಡೇಟಾಬೇಸ್‌ಗೆ ಸಿಂಕ್ ಆಗುತ್ತವೆ."
  },
  "Enter your full name": { hi: "अपना पूरा नाम दर्ज करें", kn: "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ" },
  "Enter 10-digit mobile number": { hi: "10 अंकों का मोबाइल नंबर दर्ज करें", kn: "10-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ" },
  "Age in years": { hi: "आयु (वर्षों में)", kn: "ವಯಸ್ಸು (ವರ್ಷಗಳಲ್ಲಿ)" },
  "6-digit PIN code": { hi: "6 अंकों का पिन कोड", kn: "6-ಅಂಕಿಯ ಪಿನ್ ಕೋಡ್" },
  "City, State / District": { hi: "शहर, राज्य / जिला", kn: "ನಗರ, ರಾಜ್ಯ / ಜಿಲ್ಲೆ" },
  "Cancel": { hi: "रद्द करें", kn: "ರದ್ದುಮಾಡಿ" },
  "Save Profile": { hi: "प्रोफ़ाइल सहेजें", kn: "ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ" },
  "Saving to Database...": { hi: "डेटाबेस में सहेजा जा रहा है...", kn: "ಡೇಟಾಬೇಸ್‌ಗೆ ಉಳಿಸಲಾಗುತ್ತಿದೆ..." },

  // Questionnaire Modal
  "Personalized Scheme Questionnaire": { hi: "व्यक्तिगत योजना प्रश्नावली", kn: "ವೈಯಕ್ತಿಕ ಯೋಜನೆ ಪ್ರಶ್ನಾವಳಿ" },
  "Personalized Scheme Eligibility": { hi: "व्यक्तिगत योजना पात्रता", kn: "ವೈಯಕ್ತಿಕ ಯೋಜನೆ ಅರ್ಹತೆ" },
  "Answer simple questions to match schemes tailored to your occupation and income": {
    hi: "अपने व्यवसाय और आय के अनुसार योजनाओं का मिलान करने के लिए सरल प्रश्नों के उत्तर दें",
    kn: "ನಿಮ್ಮ ಉದ್ಯೋಗ ಮತ್ತು ಆದಾಯಕ್ಕೆ ತಕ್ಕಂತೆ ಯೋಜನೆಗಳನ್ನು ಹೊಂದಿಸಲು ಸರಳ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ"
  },
  "Answer a few questions to discover welfare schemes tailored for you": {
    hi: "अपने लिए उपयुक्त कल्याणकारी योजनाओं की खोज के लिए कुछ प्रश्नों के उत्तर दें",
    kn: "ನಿಮಗಾಗಿ ರೂಪಿಸಲಾದ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳನ್ನು ಅನ್ವೇಷಿಸಲು ಕೆಲವೇ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ"
  },
  "Step": { hi: "चरण", kn: "ಹಂತ" },
  "of": { hi: "का", kn: "ರ" },
  "Question": { hi: "प्रश्न", kn: "ಪ್ರಶ್ನೆ" },
  "Select Your Occupation or Sector": { hi: "अपना व्यवसाय या क्षेत्र चुनें", kn: "ನಿಮ್ಮ ಉದ್ಯೋಗ ಅಥವಾ ವಲಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ" },
  "Choose the sector that best describes your primary background. We'll ask targeted eligibility questions based on government welfare categories.": {
    hi: "उस क्षेत्र को चुनें जो आपकी पृष्ठभूमि का सबसे अच्छा वर्णन करता है। हम सरकारी श्रेणियों के आधार पर लक्षित पात्रता प्रश्न पूछेंगे।",
    kn: "ನಿಮ್ಮ ಪ್ರಾಥಮಿಕ ಹಿನ್ನೆಲೆಯನ್ನು ಉತ್ತಮವಾಗಿ ವಿವರಿಸುವ ವಲಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ. ನಾವು ಸರ್ಕಾರಿ ಕಲ್ಯಾಣ ವರ್ಗಗಳ ಆಧಾರದ ಮೇಲೆ ಅರ್ಹತಾ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳುತ್ತೇವೆ."
  },
  "Farmers, landholders, crop insurance & equipment subsidies": {
    hi: "किसान, भूमिधारक, फसल बीमा और उपकरण सब्सिडी",
    kn: "ರೈತರು, ಭೂಮಾಲೀಕರು, ಬೆಳೆ ವಿಮೆ ಮತ್ತು ಉಪಕರಣ ಸಬ್ಸಿಡಿಗಳು"
  },
  "Healthcare treatments, Ayushman cards & medical aid": {
    hi: "स्वास्थ्य उपचार, आयुष्मान कार्ड और चिकित्सा सहायता",
    kn: "ಆರೋಗ್ಯ ಚಿಕಿತ್ಸೆಗಳು, ಆಯುಷ್ಮಾನ್ ಕಾರ್ಡ್‌ಗಳು ಮತ್ತು ವೈದ್ಯಕೀಯ ನೆರವು"
  },
  "Scholarships, tuition support & higher education grants": {
    hi: "छात्रवृत्ति, ट्यूशन सहायता और उच्च शिक्षा अनुदान",
    kn: "ವಿದ್ಯಾರ್ಥಿವೇತನಗಳು, ಬೋಧನಾ ಬೆಂಬಲ ಮತ್ತು ಉನ್ನತ ಶಿಕ್ಷಣ ಅನುದಾನಗಳು"
  },
  "MUDRA business loans, housing schemes & pensions": {
    hi: "मुद्रा व्यापार ऋण, आवास योजनाएं और पेंशन",
    kn: "ಮುದ್ರಾ ವ್ಯಾಪಾರ ಸಾಲಗಳು, ವಸತಿ ಯೋಜನೆಗಳು ಮತ್ತು ಪಿಂಚಣಿಗಳು"
  },
  "Begin Eligibility Check": { hi: "पात्रता जांच शुरू करें", kn: "ಅರ್ಹತೆ ಪರಿಶೀಲನೆ ಪ್ರಾರಂಭಿಸಿ" },
  "Select the option that applies to you:": { hi: "आप पर लागू होने वाला विकल्प चुनें:", kn: "ನಿಮಗೆ ಅನ್ವಯಿಸುವ ಆಯ್ಕೆಯನ್ನು ಆರಿಸಿ:" },
  "Change Sector": { hi: "क्षेत्र बदलें", kn: "ವಲಯವನ್ನು ಬದಲಾಯಿಸಿ" },
  "Analyzing Your Profile...": { hi: "आपकी प्रोफ़ाइल का विश्लेषण किया जा रहा है...", kn: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಅನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ..." },
  "Matching your answers against official government criteria via SevaBot backend...": {
    hi: "सेवा बॉट बैकएंड के माध्यम से आधिकारिक सरकारी मानदंडों के साथ आपके उत्तरों का मिलान किया जा रहा है...",
    kn: "ಸೇವಾಬಾಟ್ ಬ್ಯಾಕೆಂಡ್ ಮೂಲಕ ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಮಾನದಂಡಗಳೊಂದಿಗೆ ನಿಮ್ಮ ಉತ್ತರಗಳನ್ನು ಹೊಂದಿಸಲಾಗುತ್ತಿದೆ..."
  },
  "Matching Complete": { hi: "मिलान पूरा हुआ", kn: "ಹೊಂದಾಣಿಕೆ ಪೂರ್ಣಗೊಂಡಿದೆ" },
  "Recommended Welfare Schemes": { hi: "अनुशंसित कल्याणकारी योजनाएं", kn: "ಶಿಫಾರಸು ಮಾಡಲಾದ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳು" },
  "No Exact Schemes Match Your Specific Criteria": {
    hi: "कोई भी सटीक योजना आपके विशिष्ट मानदंडों से मेल नहीं खाती",
    kn: "ಯಾವುದೇ ನಿಖರವಾದ ಯೋಜನೆಗಳು ನಿಮ್ಮ ನಿರ್ದಿಷ್ಟ ಮಾನದಂಡಗಳಿಗೆ ಹೊಂದಿಕೆಯಾಗುವುದಿಲ್ಲ"
  },
  "Explore General Catalog": { hi: "सामान्य कैटलॉग देखें", kn: "ಸಾಮಾನ್ಯ ಪಟ್ಟಿಯನ್ನು ಅನ್ವೇಷಿಸಿ" },
  "All recommendations are calculated directly from verified database criteria.": {
    hi: "सभी सिफारिशों की गणना सीधे सत्यापित डेटाबेस मानदंडों से की जाती है।",
    kn: "ಎಲ್ಲಾ ಶಿಫಾರಸುಗಳನ್ನು ಪರಿಶೀಲಿಸಿದ ಡೇಟಾಬೇಸ್ ಮಾನದಂಡಗಳಿಂದ ನೇರವಾಗಿ ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತದೆ."
  },
  "Reset Questionnaire": { hi: "प्रश्नावली रीसेट करें", kn: "ಪ್ರಶ್ನಾವಳಿ ಮರುಹೊಂದಿಸಿ" },
  "Select your primary occupation or sector:": { hi: "अपना प्राथमिक व्यवसाय या क्षेत्र चुनें:", kn: "ನಿಮ್ಮ ಪ್ರಾಥಮಿಕ ಉದ್ಯೋಗ ಅಥವಾ ವಲಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ:" },
  "Agriculture & Farming": { hi: "कृषि और खेती", kn: "ಕೃಷಿ ಮತ್ತು ಬೇಸಾಯ" },
  "Healthcare & Medical": { hi: "स्वास्थ्य सेवा और चिकित्सा", kn: "ಆರೋಗ್ಯ ರಕ್ಷಣೆ ಮತ್ತು ವೈದ್ಯಕೀಯ" },
  "Education & Students": { hi: "शिक्षा और छात्र", kn: "ಶಿಕ್ಷಣ ಮತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳು" },
  "Business, Housing & General": { hi: "व्यवसाय, आवास और सामान्य", kn: "ವ್ಯಾಪಾರ, ವಸತಿ ಮತ್ತು ಸಾಮಾನ್ಯ" },
  "Back": { hi: "पीछे", kn: "ಹಿಂದಕ್ಕೆ" },
  "Next": { hi: "अगला", kn: "ಮುಂದೆ" },
  "Find Matching Schemes": { hi: "योजनाएं खोजें", kn: "ಹೊಂದಾಣಿಕೆಯ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ" },
  "Recommended Schemes for You": { hi: "आपके लिए अनुशंसित योजनाएं", kn: "ನಿಮಗಾಗಿ ಶಿಫಾರಸು ಮಾಡಲಾದ ಯೋಜನೆಗಳು" },
  "Retake Questionnaire": { hi: "प्रश्नावली पुनः लें", kn: "ಪ್ರಶ್ನಾವಳಿಯನ್ನು ಮತ್ತೆ ತೆಗೆದುಕೊಳ್ಳಿ" },
  "Matched via Backend Server": { hi: "बैकएंड सर्वर के माध्यम से मेल खाया गया", kn: "ಬ್ಯಾಕೆಂಡ್ ಸರ್ವರ್ ಮೂಲಕ ಹೊಂದಾಣಿಕೆಯಾಗಿದೆ" },
  "Adjust Criteria": { hi: "मापदंड समायोजित करें", kn: "ಮಾನದಂಡವನ್ನು ಹೊಂದಿಸಿ" },
  "No exact schemes matched your answers.": { hi: "कोई भी सटीक योजना आपके उत्तरों से मेल नहीं खाती।", kn: "ಯಾವುದೇ ನಿಖರವಾದ ಯೋಜನೆಗಳು ನಿಮ್ಮ ಉತ್ತರಗಳಿಗೆ ಹೊಂದಿಕೆಯಾಗುವುದಿಲ್ಲ." },

  // Questions & Options (Questionnaire)
  "Are you a farmer?": { hi: "क्या आप किसान हैं?", kn: "ನೀವು ರೈತನಾಗಿದ್ದೀರಾ?" },
  "Yes": { hi: "हाँ", kn: "ಹೌದು" },
  "No": { hi: "नहीं", kn: "ಇಲ್ಲ" },
  "Do you own agricultural land?": { hi: "क्या आपके पास कृषि भूमि है?", kn: "ನೀವು ಕೃಷಿ ಭೂಮಿಯನ್ನು ಹೊಂದಿದ್ದೀರಾ?" },
  "What is the size of your land?": { hi: "आपकी भूमि का आकार क्या है?", kn: "ನಿಮ್ಮ ಭೂಮಿಯ ಗಾತ್ರ ಎಷ್ಟು?" },
  "Small (less than 2 acres)": { hi: "छोटी (2 एकड़ से कम)", kn: "ಚಿಕ್ಕ (2 ಎಕರೆಗಿಂತ ಕಡಿಮೆ)" },
  "Medium (2–5 acres)": { hi: "मध्यम (2-5 एकड़)", kn: "ಮಧ್ಯಮ (2-5 ಎಕರೆ)" },
  "Large (more than 5 acres)": { hi: "बड़ी (5 एकड़ से अधिक)", kn: "ದೊಡ್ಡ (5 ಎಕರೆಗಿಂತ ಹೆಚ್ಚು)" },
  "What type of crops do you grow?": { hi: "आप किस प्रकार की फसलें उगाते हैं?", kn: "ನೀವು ಯಾವ ರೀತಿಯ ಬೆಳೆಗಳನ್ನು ಬೆಳೆಯುತ್ತೀರಿ?" },
  "Food crops (rice, wheat)": { hi: "खाद्य फसलें (चावल, गेहूं)", kn: "ಆಹಾರ ಬೆಳೆಗಳು (ಭತ್ತ, ಗೋಧಿ)" },
  "Cash crops (cotton, sugarcane)": { hi: "नकदी फसलें (कपास, गन्ना)", kn: "ನಗದು ಬೆಳೆಗಳು (ಹತ್ತಿ, ಕಬ್ಬು)" },
  "Fruits / vegetables": { hi: "फल / सब्जियां", kn: "ಹಣ್ಣುಗಳು / ತರಕಾರಿಗಳು" },
  "Not sure": { hi: "निश्चित नहीं", kn: "ಖಚಿತವಾಗಿಲ್ಲ" },
  "Do you have irrigation facilities?": { hi: "क्या आपके पास सिंचाई की सुविधा है?", kn: "ನೀವು ನೀರಾವರಿ ಸೌಲಭ್ಯಗಳನ್ನು ಹೊಂದಿದ್ದೀರಾ?" },
  "Yes (borewell / canal)": { hi: "हाँ (बोरवेल / नहर)", kn: "ಹೌದು (ಬೋರ್-ವೆಲ್ / ನಾಲೆ)" },
  "No (rain-dependent)": { hi: "नहीं (बारिश पर निर्भर)", kn: "ಇಲ್ಲ (ಮಳೆ ಆಧಾರಿತ)" },
  "Do you own any heavy farm equipment (e.g. Tractor)?": { hi: "क्या आपके पास कोई भारी कृषि उपकरण (जैसे ट्रैक्टर) है?", kn: "ನೀವು ಯಾವುದೇ ಭಾರಿ ಕೃಷಿ ಉಪಕರಣವನ್ನು (ಉದಾ. ಟ್ರಾಕ್ಟರ್) ಹೊಂದಿದ್ದೀರಾ?" },
  "Have you taken any crop loan historically?": { hi: "क्या आपने पहले कोई फसल ऋण लिया है?", kn: "ನೀವು ಹಿಂದೆ ಯಾವುದೇ ಬೆಳೆ ಸಾಲ ಪಡೆದಿದ್ದೀರಾ?" },
  "Are you registered under PM-KISAN?": { hi: "क्या आप पीएम-किसान के तहत पंजीकृत हैं?", kn: "ನೀವು PM-ಕಿಸಾನ್ ಅಡಿಯಲ್ಲಿ ನೋಂದಾಯಿಸಿದ್ದೀರಾ?" },
  "Don't know": { hi: "पता नहीं", kn: "ತಿಳಿದಿಲ್ಲ" },
  "What kind of support do you need?": { hi: "आपको किस प्रकार की सहायता चाहिए?", kn: "ನಿಮಗೆ ಯಾವ ರೀತಿಯ ಬೆಂಬಲ ಬೇಕು?" },
  "Equipment subsidy": { hi: "उपकरण सब्सिडी", kn: "ಉಪಕರಣ ಸಬ್ಸಿಡಿ" },
  "Crop insurance": { hi: "फसल बीमा", kn: "ಬೆಳೆ ವಿಮೆ" },
  "What is your annual family income?": { hi: "आपकी वार्षिक पारिवारिक आय क्या है?", kn: "ನಿಮ್ಮ ವಾರ್ಷಿಕ ಕುಟುಂಬದ ಆದಾಯ ಎಷ್ಟು?" },
  "Below ₹2 Lakhs": { hi: "₹2 लाख से कम", kn: "₹2 ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ" },
  "₹2–5 Lakhs": { hi: "₹2-5 लाख", kn: "₹2-5 ಲಕ್ಷ" },
  "Above ₹5 Lakhs": { hi: "₹5 लाख से अधिक", kn: "₹5 ಲಕ್ಷಕ್ಕಿಂತ ಹೆಚ್ಚು" },
  "Where do you live?": { hi: "आप कहाँ रहते हैं?", kn: "ನೀವು ಎಲ್ಲಿ ವಾಸಿಸುತ್ತೀರಿ?" },
  "Rural": { hi: "ग्रामीण", kn: "ಗ್ರಾಮೀಣ" },
  "Semi-urban": { hi: "अर्ध-शहरी", kn: "ಅರೆ-ನಗರ" },
  "Urban": { hi: "शहरी", kn: "ನಗರ" },
  "Do you belong to any specific category?": { hi: "क्या आप किसी विशिष्ट श्रेणी से संबंधित हैं?", kn: "ನೀವು ಯಾವುದೇ ನಿರ್ದಿಷ್ಟ ವರ್ಗಕ್ಕೆ ಸೇರಿದವರೇ?" },
  "General": { hi: "सामान्य", kn: "ಸಾಮಾನ್ಯ" },
  "OBC": { hi: "ओबीसी", kn: "ಹಿಂದುಳಿದ ವರ್ಗ" },
  "SC/ST": { hi: "एससी/एसटी", kn: "ಎಸ್ಸಿ/ಎಸ್ಟಿ" },
  "Minority": { hi: "अल्पसंख्यक", kn: "ಅಲ್ಪಸಂಖ್ಯಾತ" },
  "Select your age group": { hi: "अपना आयु वर्ग चुनें", kn: "ನಿಮ್ಮ ವಯಸ್ಸಿನ ಗುಂಪನ್ನು ಆಯ್ಕೆಮಾಡಿ" },
  "Below 30": { hi: "30 से कम", kn: "30 ಕ್ಕಿಂತ ಕಡಿಮೆ" },
  "30–50": { hi: "30-50", kn: "30-50" },
  "Above 50": { hi: "50 से अधिक", kn: "50 ಕ್ಕಿಂತ ಹೆಚ್ಚು" },

  // Medical Sector Questions
  "Are you seeking healthcare support for yourself or family?": { hi: "क्या आप अपने या परिवार के लिए स्वास्थ्य सहायता चाह रहे हैं?", kn: "ನೀವು ನಿಮಗಾಗಿ ಅಥವಾ ಕುಟುಂಬಕ್ಕಾಗಿ ಆರೋಗ್ಯ ಬೆಂಬಲವನ್ನು ಹುಡುಕುತ್ತಿದ್ದೀರಾ?" },
  "Myself": { hi: "स्वयं", kn: "ನನಗಾಗಿ" },
  "Family Member": { hi: "परिवार के सदस्य", kn: "ಕುಟುಂಬದ ಸದಸ್ಯರಿಗಾಗಿ" },
  "What is your primary healthcare requirement?": { hi: "आपकी प्राथमिक स्वास्थ्य देखभाल आवश्यकता क्या है?", kn: "ನಿಮ್ಮ ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಅಗತ್ಯವೇನು?" },
  "Chronic disease treatment": { hi: "गंभीर बीमारी का इलाज", kn: "ದೀರ್ಘಕಾಲದ ಕಾಯಿಲೆ ಚಿಕಿತ್ಸೆ" },
  "Maternity care": { hi: "मातृत्व देखभाल", kn: "ಹೆರಿಗೆ ಆರೈಕೆ" },
  "Do you suffer from any critical illness?": { hi: "क्या आपको कोई गंभीर बीमारी है?", kn: "ನೀವು ಯಾವುದೇ ಗಂಭೀರ ಕಾಯಿಲೆಯಿಂದ ಬಳಲುತ್ತಿದ್ದೀರಾ?" },
  "Cancer": { hi: "कैंसर", kn: "ಕ್ಯಾನ್ಸರ್" },
  "Heart Disease": { hi: "ह्रदय रोग", kn: "ಹೃದಯ ಕಾಯಿಲೆ" },
  "Kidney issues": { hi: "किडनी की समस्या", kn: "ಮೂತ್ರಪಿಂಡದ ಸಮಸ್ಯೆಗಳು" },
  "None": { hi: "कोई नहीं", kn: "ಯಾವುದೂ ಇಲ್ಲ" },
  "Other": { hi: "अन्य", kn: "ಇತರ" },
  "Are you a person with disabilities (PwD)?": { hi: "क्या आप विकलांग व्यक्ति (PwD) हैं?", kn: "ನೀವು ಅಂಗವಿಕಲ ವ್ಯಕ್ತಿಯೇ (PwD)?" },
  "Are you a pregnant or lactating mother?": { hi: "क्या आप गर्भवती या स्तनपान कराने वाली महिला हैं?", kn: "ನೀವು ಗರ್ಭಿಣಿ ಅಥವಾ ಹಾಲುಣಿಸುವ ತಾಯಿಯೇ?" },
  "Do you have an Ayushman Bharat Card (PMJAY)?": { hi: "क्या आपके पास आयुष्मान भारत कार्ड (PMJAY) है?", kn: "ನಿಮ್ಮ ಬಳಿ ಆಯುಷ್ಮಾನ್ ಭಾರತ್ ಕಾರ್ಡ್ (PMJAY) ಇದೆಯೇ?" },
  "Do you have any private health insurance?": { hi: "क्या आपके पास कोई निजी स्वास्थ्य बीमा है?", kn: "ನಿಮ್ಮ ಬಳಿ ಯಾವುದೇ ಖಾಸಗಿ ಆರೋಗ್ಯ ವಿಮೆ ಇದೆಯೇ?" },
  "What kind of hospital do you prefer?": { hi: "आप किस प्रकार का अस्पताल पसंद करते हैं?", kn: "ನೀವು ಯಾವ ರೀತಿಯ ಆಸ್ಪತ್ರೆಯನ್ನು ಆದ್ಯತೆ ನೀಡುತ್ತೀರಿ?" },
  "Government": { hi: "सरकारी", kn: "ಸರ್ಕಾರಿ" },
  "Empanelled Private": { hi: "पैनल में शामिल निजी", kn: "ನೋಂದಾಯಿತ ಖಾಸಗಿ" },
  "Any": { hi: "कोई भी", kn: "ಯಾವುದೇ" },
  "Do you possess a BPL (Below Poverty Line) card?": { hi: "क्या आपके पास बीपीएल (गरीबी रेखा से नीचे) कार्ड है?", kn: "ನಿಮ್ಮ ಬಳಿ BPL (ಬಡತನ ರೇಖೆಗಿಂತ ಕೆಳಗಿನ) ಕಾರ್ಡ್ ಇದೆಯೇ?" },
  "Below ₹1 Lakh": { hi: "₹1 लाख से कम", kn: "₹1 ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ" },
  "₹1–3 Lakhs": { hi: "₹1-3 लाख", kn: "₹1-3 ಲಕ್ಷ" },
  "Above ₹3 Lakhs": { hi: "₹3 लाख से अधिक", kn: "₹3 ಲಕ್ಷಕ್ಕಿಂತ ಹೆಚ್ಚು" },
  "Below 18": { hi: "18 से कम", kn: "18 ಕ್ಕಿಂತ ಕಡಿಮೆ" },
  "18–40": { hi: "18-40", kn: "18-40" },
  "40–60": { hi: "40-60", kn: "40-60" },
  "Senior Citizen 60+": { hi: "वरिष्ठ नागरिक 60+", kn: "ಹಿರಿಯ ನಾಗರಿಕ 60+" },

  // Education Sector Questions
  "Are you currently enrolled in a school/college?": { hi: "क्या आप वर्तमान में किसी स्कूल/कॉलेज में नामांकित हैं?", kn: "ನೀವು ಪ್ರಸ್ತುತ ಶಾಲೆ/ಕಾಲೇಜಿನಲ್ಲಿ ದಾಖಲಾಗಿದ್ದೀರಾ?" },
  "What is your current level of education?": { hi: "आपकी शिक्षा का वर्तमान स्तर क्या है?", kn: "ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಶಿಕ್ಷಣ ಮಟ್ಟ ಏನು?" },
  "School (up to 12th)": { hi: "स्कूल (12वीं तक)", kn: "ಶಾಲೆ (12 ನೇ ವರೆಗೆ)" },
  "Undergrad / Degree": { hi: "स्नातक / डिग्री", kn: "ಪದವಿಪೂರ್ವ / ಪದವಿ" },
  "Postgrad / PhD": { hi: "स्नातकोत्तर / पीएचडी", kn: "ಸ್ನಾತಕೋತ್ತರ / ಪಿಎಚ್‌ಡಿ" },
  "Professional Training": { hi: "व्यावसायिक प्रशिक्षण", kn: "ವೃತ್ತಿಪರ ತರಬೇತಿ" },
  "Which type of institution are you studying in?": { hi: "आप किस प्रकार के संस्थान में पढ़ रहे हैं?", kn: "ನೀವು ಯಾವ ರೀತಿಯ ಸಂಸ್ಥೆಯಲ್ಲಿ ಓದುತ್ತಿದ್ದೀರಿ?" },
  "Private Aided": { hi: "निजी सहायता प्राप्त", kn: "ಖಾಸಗಿ ಅನುದಾನಿತ" },
  "Private Unaided": { hi: "गैर सहायता प्राप्त निजी", kn: "ಅನುದಾನರಹಿತ ಖಾಸಗಿ" },
  "Are you planning to study abroad?": { hi: "क्या आप विदेश में अध्ययन करने की योजना बना रहे हैं?", kn: "ನೀವು ವಿದೇಶದಲ್ಲಿ ಓದಲು ಯೋಜಿಸುತ್ತಿದ್ದೀರಾ?" },
  "Did you score above 75% in your previous exam?": { hi: "क्या आपने अपनी पिछली परीक्षा में 75% से अधिक अंक प्राप्त किए हैं?", kn: "ನಿಮ್ಮ ಹಿಂದಿನ ಪರೀಕ್ಷೆಯಲ್ಲಿ 75% ಕ್ಕಿಂತ ಹೆಚ್ಚು ಅಂಕ ಗಳಿಸಿದ್ದೀರಾ?" },
  "Are you a single girl child?": { hi: "क्या आप अकेली बालिका हैं?", kn: "ನೀವು ಒಂಟಿ ಹೆಣ್ಣು ಮಗುವೇ?" },
  "Are you seeking support for tuition or hostel fees?": { hi: "क्या आप ट्यूशन या हॉस्टल फीस के लिए सहायता चाह रहे हैं?", kn: "ನೀವು ಟ್ಯೂಷನ್ ಅಥವಾ ಹಾಸ್ಟೆಲ್ ಶುಲ್ಕಕ್ಕಾಗಿ ಬೆಂಬಲವನ್ನು ಪಡೆಯುತ್ತಿದ್ದೀರಾ?" },
  "Hostel Fee": { hi: "हॉस्टल फीस", kn: "ಹಾಸ್ಟೆಲ್ ಶುಲ್ಕ" },
  "Both": { hi: "दोनों", kn: "ಎರಡೂ" },
  "Are you applying for competitive exam coaching subsidy?": { hi: "क्या आप प्रतियोगी परीक्षा कोचिंग सब्सिडी के लिए आवेदन कर रहे हैं?", kn: "ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷಾ ತರಬೇತಿ ಸಬ್ಸಿಡಿಗಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸುತ್ತಿದ್ದೀರಾ?" },
  "Do you possess a resident/domicile certificate for your state?": { hi: "क्या आपके पास अपने राज्य का निवासी/अधिवास प्रमाण पत्र है?", kn: "ನಿಮ್ಮ ರಾಜ್ಯದ ನಿವಾಸಿ/ವಾಸಸ್ಥಳ ಪ್ರಮಾಣಪತ್ರವನ್ನು ಹೊಂದಿದ್ದೀರಾ?" },
  "Below ₹2.5 Lakhs": { hi: "₹2.5 लाख से कम", kn: "₹2.5 ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ" },
  "₹2.5–5 Lakhs": { hi: "₹2.5-5 लाख", kn: "₹2.5-5 ಲಕ್ಷ" },
  "Below 16": { hi: "16 से कम", kn: "16 ಕ್ಕಿಂತ ಕಡಿಮೆ" },
  "16–22": { hi: "16-22", kn: "16-22" },
  "23–30": { hi: "23-30", kn: "23-30" },

  // Business & Others Questions
  "What is your primary objective?": { hi: "आपका मुख्य उद्देश्य क्या है?", kn: "ನಿಮ್ಮ ಪ್ರಾಥಮಿಕ ಉದ್ದೇಶವೇನು?" },
  "Start a business": { hi: "व्यवसाय शुरू करना", kn: "ವ್ಯಾಪಾರವನ್ನು ಪ್ರಾರಂಭಿಸುವುದು" },
  "House / Housing Loan": { hi: "घर / आवास ऋण", kn: "ಮನೆ / ಗೃಹ ಸಾಲ" },
  "Pension / Retirement": { hi: "पेंशन / सेवानिवृत्ति", kn: "ಪಿಂಚಣಿ / ನಿವೃತ್ತಿ" },
  "Unemployed / Skill Training": { hi: "बेरोजगार / कौशल प्रशिक्षण", kn: "ನಿರುದ್ಯೋಗಿ / ಕೌಶಲ್ಯ ತರಬೇತಿ" },
  "If looking for a business loan, what is your sector?": { hi: "यदि व्यवसाय ऋण की तलाश है, तो आपका क्षेत्र क्या है?", kn: "ವ್ಯಾಪಾರ ಸಾಲವನ್ನು ಹುಡುಕುತ್ತಿದ್ದರೆ, ನಿಮ್ಮ ವಲಯ ಯಾವುದು?" },
  "Manufacturing": { hi: "विनिर्माण", kn: "ಉತ್ಪಾದನೆ" },
  "Services": { hi: "सेवाएँ", kn: "ಸೇವೆಗಳು" },
  "Trading": { hi: "व्यापार", kn: "ವ್ಯಾಪಾರ" },
  "Do you currently own a pucca (permanent) house?": { hi: "क्या आपके पास वर्तमान में पक्का घर है?", kn: "ನೀವು ಪ್ರಸ್ತುತ ಪಕ್ಕಾ (ಶಾಶ್ವತ) ಮನೆಯನ್ನು ಹೊಂದಿದ್ದೀರಾ?" },
  "Are you registered as an unorganized sector worker (e-Shram)?": { hi: "क्या आप असंगठित क्षेत्र के कार्यकर्ता (ई-श्रम) के रूप में पंजीकृत हैं?", kn: "ನೀವು ಅಸಂಘಟಿತ ವಲಯದ ಕಾರ್ಮಿಕರಾಗಿ (ಇ-ಶ್ರಮ್) ನೋಂದಾಯಿಸಿಕೊಂಡಿದ್ದೀರಾ?" },
  "Are you actively looking for employment or skill development?": { hi: "क्या आप रोजगार या कौशल विकास की तलाश कर रहे हैं?", kn: "ನೀವು ಉದ್ಯೋಗ ಅಥವಾ ಕೌಶಲ್ಯ ಅಭಿವೃದ್ಧಿಯನ್ನು ಹುಡುಕುತ್ತಿದ್ದೀರಾ?" },

  // Chatbot Interface
  "SevaBot AI Assistant": { hi: "सेवा बॉट एआई सहायक", kn: "ಸೇವಾಬಾಟ್ AI ಸಹಾಯಕ" },
  "Online • Multilingual Voice AI": { hi: "ऑनलाइन • बहुभाषी वॉयस एआई", kn: "ಆನ್‌ಲೈನ್ • ಬಹುಭಾಷಾ ಧ್ವನಿ AI" },
  "Voice: On": { hi: "आवाज़: चालू", kn: "ಧ್ವನಿ: ಆನ್" },
  "Voice: Off": { hi: "आवाज़: बंद", kn: "ಧ್ವನಿ: ಆಫ್" },
  "New": { hi: "नया", kn: "ಹೊಸದು" },
  "New Chat": { hi: "नई चैट", kn: "ಹೊಸ ಚಾಟ್" },
  "Send": { hi: "भेजें", kn: "ಕಳುಹಿಸಿ" },
  "Stop": { hi: "रोकें", kn: "ನಿಲ್ಲಿಸಿ" },
  "Listening now...": { hi: "सुना जा रहा है...", kn: "ಈಗ ಆಲಿಸಲಾಗುತ್ತಿದೆ..." },
  "SevaBot is thinking...": { hi: "सेवा बॉट सोच रहा है...", kn: "ಸೇವಾಬಾಟ್ ಯೋಚಿಸುತ್ತಿದೆ..." },
  "SevaBot is speaking...": { hi: "सेवा बॉट बोल रहा है...", kn: "ಸೇವಾಬಾಟ್ ಮಾತನಾಡುತ್ತಿದೆ..." },
  "Generating spoken response with SevaBot voice engine...": { hi: "सेवा बॉट वॉइस इंजन के साथ प्रतिक्रिया तैयार की जा रही है...", kn: "ಸೇವಾಬಾಟ್ ಧ್ವನಿ ಎಂಜಿನ್‌ನೊಂದಿಗೆ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ರಚಿಸಲಾಗುತ್ತಿದೆ..." },
  "Speak your scheme question clearly into the microphone": { hi: "माइक में अपनी योजना का प्रश्न स्पष्ट रूप से बोलें", kn: "ನಿಮ್ಮ ಯೋಜನೆಯ ಪ್ರಶ್ನೆಯನ್ನು ಮೈಕ್‌ನಲ್ಲಿ ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ" },
  "Suggested questions:": { hi: "सुझाए गए प्रश्न:", kn: "ಸೂಚಿಸಲಾದ ಪ್ರಶ್ನೆಗಳು:" },
  "Language:": { hi: "भाषा:", kn: "ಭಾಷೆ:" },
  "Listening to your voice...": { hi: "आपकी आवाज़ सुनी जा रही है...", kn: "ನಿಮ್ಮ ಧ್ವನಿಯನ್ನು ಆಲಿಸಲಾಗುತ್ತಿದೆ..." },
  "Type your query or click mic to speak...": { hi: "अपना प्रश्न टाइप करें या बोलने के लिए माइक पर क्लिक करें...", kn: "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮಾತನಾಡಲು ಮೈಕ್ ಕ್ಲಿಕ್ ಮಾಡಿ..." },
  "Audio replies will speak aloud": { hi: "ऑडियो उत्तर बोले जाएंगे", kn: "ಆಡಿಯೊ ಪ್ರತ್ಯುತ್ತರಗಳನ್ನು ಧ್ವನಿಯಾಗಿ ನುಡಿಯಲಾಗುವುದು" },
  "Listen": { hi: "सुनें", kn: "ಕೇಳಿ" },
  "Stop Audio": { hi: "ऑडियो रोकें", kn: "ಆಡಿಯೋ ನಿಲ್ಲಿಸಿ" },
  "kisan schemes": { hi: "किसान योजनाएं", kn: "ಕಿಸಾನ್ ಯೋಜನೆಗಳು" },
  "medical aid": { hi: "चिकित्सा सहायता", kn: "ವೈದ್ಯಕೀಯ ನೆರವು" },
  "student scholarship": { hi: "छात्रवृत्ति", kn: "ವಿದ್ಯಾರ್ಥಿವೇತನ" },
  "business loans": { hi: "व्यवसाय ऋण", kn: "ವ್ಯಾಪಾರ ಸಾಲ" },

  // Footer & Common
  "© 2026 SevaBot AI • Empowering citizens with accessible welfare guidance": {
    hi: "© 2026 सेवा बॉट एआई • सुलभ कल्याणकारी मार्गदर्शन के साथ नागरिकों को सशक्त बनाना",
    kn: "© 2026 ಸೇವಾಬಾಟ್ AI • ಸುಲಭ ಕಲ್ಯಾಣ ಮಾರ್ಗದರ್ಶನದೊಂದಿಗೆ ನಾಗರಿಕರನ್ನು ಸಬಲೀಕರಣಗೊಳಿಸುವುದು"
  },
  "Profile saved successfully!": { hi: "प्रोफ़ाइल सफलतापूर्वक सहेजी गई!", kn: "ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!" },
  "Signed out of profile": { hi: "प्रोफ़ाइल से साइन आउट किया गया", kn: "ಪ್ರೊಫೈಲ್‌ನಿಂದ ಸೈನ್ ಔಟ್ ಮಾಡಲಾಗಿದೆ" }
}

export function t(key, lang = 'en') {
  if (!key || typeof key !== 'string') return key
  if (lang === 'en') return key
  const trimmed = key.trim()
  const entry = translations[trimmed] || translations[key]
  if (entry && entry[lang]) {
    return entry[lang]
  }
  return key
}
