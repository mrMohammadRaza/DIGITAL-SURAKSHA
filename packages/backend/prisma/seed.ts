import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Digital Suraksha database seeding...');

  // 1. Clean existing records (safe order)
  await prisma.quizResponse.deleteMany({});
  await prisma.quizAttempt.deleteMany({});
  await prisma.option.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.quiz.deleteMany({});
  await prisma.scenario.deleteMany({});
  await prisma.topic.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.adminUser.deleteMany({});
  await prisma.feedback.deleteMany({});
  await prisma.auditLog.deleteMany({});

  console.log('🧹 Cleaned existing tables.');

  // 2. Seed Admin User
  const adminPasswordHash = bcrypt.hashSync('SurakshaAdmin2026!', 10);
  const admin = await prisma.adminUser.create({
    data: {
      email: 'admin@suraksha.gov.in',
      passwordHash: adminPasswordHash,
      name: 'Suraksha SuperAdmin',
      role: 'admin',
    },
  });
  console.log(`👤 Created Administrator: ${admin.email}`);

  // 3. Seed Categories
  const categoriesData = [
    {
      slug: 'upi-payments',
      nameEn: 'UPI & Payment Safety',
      nameHi: 'यूपीआई और डिजिटल भुगतान सुरक्षा',
      nameMr: 'यूपीआय आणि डिजिटल पेमेंट सुरक्षा',
      descriptionEn: 'Essential rules for Google Pay, PhonePe, Paytm, QR codes, and UPI PIN safety.',
      descriptionHi: 'गूगल पे, फोनपे, पेटीएम, क्यूआर कोड और यूपीआई पिन की सुरक्षा के नियम।',
      descriptionMr: 'गुगल पे, फोनपे, पेटीएम, क्यूआर कोड आणि यूपीआय पिन सुरक्षेचे महत्त्वाचे नियम.',
      icon: 'CreditCard',
      order: 1,
    },
    {
      slug: 'banking-fraud',
      nameEn: 'Banking & OTP Fraud',
      nameHi: 'बैंकिंग कॉल एवं ओटीपी चोरी',
      nameMr: 'बँकिंग फोन कॉल्स आणि ओटीपी फसवणूक',
      descriptionEn: 'How scammers pose as bank managers to steal confidential OTPs and credentials.',
      descriptionHi: 'बैंक मैनेजर बनकर गोपनीय ओटीपी और पासवर्ड चुराने वाले फ्रॉड से बचाव।',
      descriptionMr: 'बँक अधिकारी असल्याचे भासवून ओटीपी आणि खात्याची माहिती चोरणाऱ्यांपासून संरक्षण.',
      icon: 'ShieldAlert',
      order: 2,
    },
    {
      slug: 'smartphone-safety',
      nameEn: 'Smartphone & App Security',
      nameHi: 'स्मार्टफोन सुरक्षा एवं खतरनाक ऐप्स',
      nameMr: 'स्मार्टफोन सुरक्षा आणि धोकादायक अॅप्स',
      descriptionEn: 'Safe app installation, app permissions, screen locks, and screen-sharing app dangers.',
      descriptionHi: 'सुरक्षित ऐप डाउनलोड, परमिशन चेक, स्क्रीन लॉक और स्क्रीन शेयरिंग ऐप्स के खतरे।',
      descriptionMr: 'सुरक्षित अॅप इन्स्टॉलेशन, परवानग्या, स्क्रीन लॉक आणि स्क्रीन-शेअरिंग अॅप्सचे धोके.',
      icon: 'Smartphone',
      order: 3,
    },
    {
      slug: 'fake-schemes',
      nameEn: 'Lottery, Jobs & Investment Scams',
      nameHi: 'लॉटरी, नौकरी एवं निवेश घोटाले',
      nameMr: 'लॉटरी, नोकरी आणि बनावट गुंतवणूक योजना',
      descriptionEn: 'Fake government schemes, work-from-home tasks, lottery prizes, and high-return schemes.',
      descriptionHi: 'फर्जी सरकारी योजनाएं, वर्क फ्रॉम होम पार्ट टाइम जॉब्स और लॉटरी के नाम पर ठगी।',
      descriptionMr: 'बनावट सरकारी योजना, घरबसल्या नोकरीचे आमिष आणि लॉटरीच्या नावाखाली होणारी लूट.',
      icon: 'BadgePercent',
      order: 4,
    },
    {
      slug: 'social-media',
      nameEn: 'WhatsApp & Social Engineering',
      nameHi: 'व्हाट्सएप एवं सोशल मीडिया ठगी',
      nameMr: 'व्हॉट्सअॅप आणि सोशल मीडिया फसवणूक',
      descriptionEn: 'Digital arrest threats, friend impersonation emergencies, and malicious APK links.',
      descriptionHi: 'डिजिटल अरेस्ट, रिश्तेदार बनकर पैसे मांगना और व्हाट्सएप पर भेजी गई संदिग्ध APK फाइलें।',
      descriptionMr: 'डिजिटल अरेस्टची भीती, नातेवाईक असल्याचे सांगून पैसे मागणे आणि बनावट APK फाईल्स.',
      icon: 'MessageSquareWarning',
      order: 5,
    },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categoryMap.set(cat.slug, created.id);
  }
  console.log(`📁 Seeded ${categoriesData.length} fraud categories.`);

  // 4. Seed Topics
  const topicsData = [
    {
      slug: 'upi-collect-request',
      categorySlug: 'upi-payments',
      severity: 'critical',
      tags: JSON.stringify(['UPI', 'PhonePe', 'GPay', 'PIN', 'Collect Request']),
      order: 1,
      // English
      titleEn: 'UPI Collect Request Fraud ("PIN to Receive Money" Trap)',
      definitionEn: 'A widespread scam where fraudsters send a payment "Collect Request" or QR code and falsely claim you need to enter your UPI PIN to receive money, lottery funds, or buyer payments.',
      howItWorksEn: 'The fraudster poses as an online buyer (e.g. on OLX, Facebook) or government officer. They say: "I am sending you ₹10,000. Open PhonePe/GPay and enter your UPI PIN to accept it." As soon as you enter your UPI PIN, money is DEDUCTED from your bank account rather than credited.',
      fictionalExampleEn: 'Ramesh from a village listed a cow for sale for ₹25,000. A caller said: "I am an army officer, I am transferring ₹25,000 right now. I sent a PhonePe request, just type your 6-digit PIN to receive the money." Ramesh typed his PIN and instantly lost ₹25,000.',
      warningSignsEn: JSON.stringify([
        'Anyone telling you to enter UPI PIN to receive money',
        'Incoming notification labeled "Pay" or "Request from..." when you are expecting money',
        'Caller claiming army officer, government, or bank authority insisting on quick action',
        'A screen asking for 4-digit or 6-digit secret PIN',
      ]),
      safeActionsEn: JSON.stringify([
        'Remember the Golden Rule: UPI PIN is ONLY entered to SEND money, NEVER to receive money',
        'When someone sends you money, it deposits directly without asking for any PIN or confirmation tap',
        'Decline any unexpected "Pay" or "Collect" notification immediately',
        'Check your bank balance via official banking app if in doubt',
      ]),
      victimGuidanceEn: JSON.stringify([
        'Immediately call the Cyber Crime National Helpline: 1930 within the Golden Hour',
        'Open your UPI app and tap "Help / Report Fraud" on that specific transaction',
        'Call your bank helpline to freeze or block net banking / UPI services immediately',
        'Save screenshots of the chat, mobile number, and UPI transaction ID (UTR number)',
      ]),
      // Hindi
      titleHi: 'यूपीआई कलेक्ट रिक्वेस्ट फ्रॉड (पैसे पाने के लिए पिन डालने का जाल)',
      definitionHi: 'एक बहुत आम धोखाधड़ी जिसमें ठग आपको पैसे भेजने का झांसा देकर "Collect Request" भेजते हैं और कहते हैं कि पैसे प्राप्त करने के लिए अपना UPI PIN डालें।',
      howItWorksHi: 'ठग फोन करके कहता है कि वह आपको सरकारी योजना, कैशबैक या किसी सामान की खरीदारी का पैसा भेज रहा है। वह फोनपे या गूगल पे पर रिक्वेस्ट भेजकर कहता है: "ऐप खोलिए और अपना 6 अंकों का गुप्त पिन डालिए ताकि पैसे आपके खाते में आ जाएं।" जैसे ही आप पिन डालते हैं, पैसे आते नहीं बल्कि आपके खाते से कट जाते हैं।',
      fictionalExampleHi: 'गाँव के किसान रामेश्वर जी ने अपनी पुरानी मोटरसाइकिल बेचने का विज्ञापन दिया। एक व्यक्ति ने फोन कर कहा: "मैं सेना का जवान हूँ, मुझे बाइक पसंद है। मैं ₹30,000 एडवांस भेज रहा हूँ। फोनपे पर आई रिक्वेस्ट पर अपना यूपीआई पिन डालकर पैसे स्वीकार करें।" रामेश्वर जी ने पिन डाला और उनके खाते से ₹30,000 गायब हो गए।',
      warningSignsHi: JSON.stringify([
        'कोई भी व्यक्ति जो कहे कि पैसे पाने के लिए UPI PIN डालना पड़ेगा',
        'पैसे मिलने के बजाय स्क्रीन पर "Pay" या "Request" का बटन दिखना',
        'कॉलर का खुद को सेना का जवान, बैंक अधिकारी या सरकारी कर्मचारी बताना',
        'जल्दबाजी करना कि "तुरंत 5 मिनट में पिन नहीं डाला तो पैसे वापस चले जाएंगे"',
      ]),
      safeActionsHi: JSON.stringify([
        'स्वर्ण नियम हमेशा याद रखें: UPI PIN केवल पैसे भेजने (खर्च करने) के लिए डाला जाता है, पैसे लेने के लिए कभी नहीं!',
        'जब कोई आपके खाते में पैसे भेजता है, तो वे सीधे आपके खाते में आते हैं, उसके लिए किसी पिन की जरूरत नहीं होती',
        'किसी भी संदिग्ध "Pay" या "Collect Request" को तुरंत Decline (खारिज) कर दें',
        'अपने बैंक या यूपीआई ऐप का बैलेंस केवल आधिकारिक ऐप खोलकर ही चेक करें',
      ]),
      victimGuidanceHi: JSON.stringify([
        'पैसे कटते ही 1-2 घंटे के अंदर तुरंत राष्ट्रीय साइबर हेल्पलाइन 1930 पर कॉल करें',
        'जिस ऐप (PhonePe, GPay, Paytm) से फ्रॉड हुआ है, उसमें ट्रांजेक्शन पर जाकर "Report Fraud" करें',
        'तुरंत अपने बैंक के टोल-फ्री नंबर पर कॉल करके अपना यूपीआई और खाता ब्लॉक करवाएं',
        'ट्रांजेक्शन आईडी (UTR नंबर), कॉलर का नंबर और स्क्रीनशॉट संभाल कर रखें',
      ]),
      // Marathi
      titleMr: 'यूपीआय कलेक्ट रिक्वेस्ट फसवणूक (पैसे मिळवण्यासाठी पिन टाकण्याची अफवा)',
      definitionMr: 'एक अतिशय सामान्य फसवणूक ज्यामध्ये भामटे पैसे देण्याच्या बहाण्याने "Collect Request" पाठवतात आणि पैसे खात्यात जमा करण्यासाठी UPI PIN टाकण्यास सांगतात.',
      howItWorksMr: 'भामटा फोन करून सांगतो की तो तुम्हाला खरेदीचे पैसे, अनुदान किंवा लॉटरी पाठवत आहे. तो फोनपे/गुगल पे वर रिक्वेस्ट पाठवून सांगतो: "अॅप उघडा आणि ६ अंकी पिन टाका म्हणजे पैसे जमा होतील." तुम्ही पिन टाकताच पैसे जमा होण्याऐवजी तुमच्या खात्यातून परस्पर वजा होतात.',
      fictionalExampleMr: 'गावातील शेतकरी रमेशरावांनी शेतीमालाच्या विक्रीसाठी जाहिरात दिली. एका व्यक्तीने फोन करून सांगितले: "मी सैन्यात आहे, मी तुम्हाला ₹२०,००० अॅडव्हान्स पाठवतो. फोनपे वर आलेल्या मेसेजवर पिन टाका." रमेशरावांनी पिन टाकला आणि काही सेकंदात त्यांच्या खात्यातील ₹२०,००० चोरीला गेले.',
      warningSignsMr: JSON.stringify([
        'पैसे मिळवण्यासाठी किंवा स्वीकारण्यासाठी UPI PIN टाकावा लागेल असे सांगणे',
        'पैसे येण्याऐवजी स्क्रीनवर "Pay" किंवा "Request" चे बटण दिसणे',
        'स्वतःला आर्मी ऑफिसर किंवा बँक अधिकारी भासवून घाईगडबड करणे',
        'पिन टाकल्याशिवाय पैसे जमा होणार नाहीत असा खोटा दावा करणे',
      ]),
      safeActionsMr: JSON.stringify([
        'सुवर्ण नियम लक्षात ठेवा: UPI PIN फक्त पैसे पाठवण्यासाठी असतो, पैसे स्वीकारण्यासाठी कधीही नाही!',
        'कोणीही पैसे पाठवले तर ते थेट खात्यात जमा होतात, त्यासाठी पिन टाकण्याची गरज नसते',
        'कोणतीही अनोळखी "Pay" किंवा "Collect" विनंती लगेच Decline करा',
        'अनोळखी व्यक्तीच्या सांगण्यावरून फोनवर कोणतेही अॅप उघडू नका',
      ]),
      victimGuidanceMr: JSON.stringify([
        'फसवणूक होताच तातडीने १-२ तासांच्या आत १९३० या राष्ट्रीय सायबर हेल्पलाइनवर कॉल करा',
        'ज्या यूपीआय अॅपवरून पैसे गेले त्यावर "Report Fraud" नोंदवा',
        'बँकेच्या टोल-फ्री नंबरवर संपर्क साधून यूपीआय सुविधा तत्काळ ब्लॉक करा',
        'ट्रान्झॅक्शन आयडी (UTR नंबर), मेसेज आणि स्क्रीनशॉट पुरावा म्हणून सुरक्षित ठेवा',
      ]),
      relatedSlugs: JSON.stringify(['qr-code-scam', 'fake-bank-calls']),
    },
    {
      slug: 'qr-code-scam',
      categorySlug: 'upi-payments',
      severity: 'high',
      tags: JSON.stringify(['QR Code', 'UPI', 'OLX', 'Payment Scanner']),
      order: 2,
      // English
      titleEn: 'Deceptive QR Code Scams',
      definitionEn: 'Fraudsters send a barcode or QR code image via WhatsApp and trick you into scanning it with PhonePe/GPay under the pretext of crediting cash into your account.',
      howItWorksEn: 'Scanning a QR code in a payment app is fundamentally an instruction to SEND money from your bank account to the recipient encoded in the QR. Fraudsters write "₹5,000 Received" in fancy text on the image to deceive beginners. When scanned, it opens a payment debit window.',
      fictionalExampleEn: 'Sunita received a WhatsApp image with a QR code stating "PM Kisan Yojana Bonus ₹6,000 - Scan to Receive in Bank". She opened Google Pay, scanned the image, and typed her PIN. Her account was debited by ₹6,000.',
      warningSignsEn: JSON.stringify([
        'Receiving a QR code via WhatsApp or SMS to "receive" money',
        'QR codes with fake logos of Government of India, SBI, or PhonePe',
        'The QR scan screen asks for "Pay" and requires your UPI PIN',
      ]),
      safeActionsEn: JSON.stringify([
        'Never scan a QR code to receive money. Scanning a QR code ALWAYS sends money out',
        'Never scan barcodes received from strangers on WhatsApp',
        'Merchant QR codes at physical shops are solely for paying for goods you purchase',
      ]),
      victimGuidanceEn: JSON.stringify([
        'Immediately report to 1930 Cybercrime Helpline',
        'Lodge a dispute on your UPI payment application',
        'Inform your bank to place a temporary freeze on UPI debit transactions',
      ]),
      // Hindi
      titleHi: 'फर्जी क्यूआर कोड (QR Code) घोटाला',
      definitionHi: 'जालसाज व्हाट्सएप पर क्यूआर कोड भेजकर कहते हैं कि इसे स्कैन करने से आपके खाते में सरकारी योजना का पैसा या इनाम आ जाएगा।',
      howItWorksHi: 'क्यूआर कोड (QR Code) को स्कैन करने का मतलब होता है आपके बैंक खाते से पैसे काटना। ठग उस इमेज पर "₹5000 प्राप्त करें" लिख देते हैं। जैसे ही आप फोनपे या गूगल पे से उसे स्कैन करके पिन डालते हैं, आपके खाते से पैसे कटकर ठग के खाते में चले जाते हैं।',
      fictionalExampleHi: 'सुनीता देवी को व्हाट्सएप पर एक संदेश मिला: "लाडली बहना / पीएम किसान योजना के तहत ₹5,000 तुरंत पाएं। नीचे दिया गया QR कोड स्कैन करें।" उन्होंने फोनपे से स्कैन किया और पिन डाला। उनके खाते से ₹5,000 कट गए।',
      warningSignsHi: JSON.stringify([
        'व्हाट्सएप पर किसी अनजान द्वारा पैसे देने के नाम पर QR कोड भेजना',
        'QR कोड पर सरकारी प्रतीक, बैंक लोगो या "Cashback Received" जैसे भ्रामक शब्द लिखे होना',
        'स्कैन करते ही स्क्रीन पर पैसे काटने और पिन डालने का विकल्प आना',
      ]),
      safeActionsHi: JSON.stringify([
        'हमेशा याद रखें: QR कोड स्कैन करने का मतलब हमेशा पैसे देना (पेमेंट करना) होता है, पैसे लेना नहीं',
        'व्हाट्सएप या सोशल मीडिया पर आए किसी भी QR कोड को कभी स्कैन न करें',
        'दुकान पर भी केवल वही QR स्कैन करें जहां आप खुद खरीदारी के पैसे चुका रहे हों',
      ]),
      victimGuidanceHi: JSON.stringify([
        'तुरंत 1930 पर कॉल करें और पुलिस को सूचित करें',
        'अपने यूपीआई ऐप में ट्रांजेक्शन पर रिपोर्ट दर्ज करें',
        'अपने बैंक शाखा या हेल्पलाइन पर कॉल कर ट्रांजेक्शन ब्लॉक करवाएं',
      ]),
      // Marathi
      titleMr: 'बनावट क्यूआर कोड (QR Code) फसवणूक',
      definitionMr: 'भामटे व्हॉट्सअॅपवर क्यूआर कोड पाठवून सांगतात की हा कोड स्कॅन केल्यावर तुमच्या खात्यात योजनांचे किंवा बक्षिसाचे पैसे जमा होतील.',
      howItWorksMr: 'पेमेंट अॅपमध्ये क्यूआर कोड स्कॅन करणे म्हणजे स्वतःच्या खात्यातून पैसे देणे असते. भामटे त्या इमेजवर "₹५,००० जमा करा" असे खोटे लिहून फसवतात. स्कॅन करून पिन टाकताच पैसे निघून जातात.',
      fictionalExampleMr: 'सुनीताताईंना व्हॉट्सअॅपवर एक मेसेज आला: "लाडकी बहीण योजनेचे ₹३,००० मिळवण्यासाठी हा QR कोड स्कॅन करा." त्यांनी गुगल पे वरून स्कॅन केले आणि पिन टाकला. त्यांच्या खात्यातील ₹३,००० वजा झाले.',
      warningSignsMr: JSON.stringify([
        'पैसे मिळवण्यासाठी व्हॉट्सअॅपवर अनोळखी व्यक्तीकडून QR कोड येणे',
        'QR कोडवर शासकीय किंवा बँकेचे बनावट लोगो असणे',
        'स्कॅन केल्यावर स्क्रीनवर "Pay" आणि पिन विचारणे',
      ]),
      safeActionsMr: JSON.stringify([
        'लक्षात ठेवा: QR कोड स्कॅन केल्याने नेहमी पैसे जातात, खात्यात कधीही येत नाहीत',
        'कोणत्याही अनोळखी QR कोडला स्कॅन करू नका',
        'फक्त दुकानात स्वतः खरेदी केलेल्या वस्तूंचे बिल भरतानाच QR स्कॅन करा',
      ]),
      victimGuidanceMr: JSON.stringify([
        'लगेच १९३० या सायबर हेल्पलाइनवर तक्रार नोंदवा',
        'यूपीआय अॅपवर जाऊन तात्काळ तक्रार करा',
        'बँकेला संपर्क करून यूपीआय व्यवहार थांबवण्याची विनंती करा',
      ]),
      relatedSlugs: JSON.stringify(['upi-collect-request']),
    },
    {
      slug: 'fake-bank-calls',
      categorySlug: 'banking-fraud',
      severity: 'critical',
      tags: JSON.stringify(['Bank Call', 'OTP', 'Debit Card', 'Manager']),
      order: 3,
      // English
      titleEn: 'Fake Bank Manager Calls & Card Expiry Threats',
      definitionEn: 'Scammers call posing as SBI, PNB, or bank officials claiming your ATM card, account, or Aadhaar link has expired and will be blocked unless you verify your details immediately.',
      howItWorksEn: 'The caller sounds polite, authoritative, and speaks in your regional language. They read out partial details (like your name or bank branch) acquired from leaks. They create extreme panic: "Your account is frozen right now! Tell me your 16-digit card number and the OTP received on SMS to reactivate it." With that OTP, they drain your savings.',
      fictionalExampleEn: 'Mahesh received a call: "I am Branch Manager Sharma from SBI. Your ATM card is expiring today. Tell me the OTP sent to your phone or your account will be shut down forever." Panicked Mahesh read out the 6-digit OTP. ₹48,000 was debited within 30 seconds.',
      warningSignsEn: JSON.stringify([
        'Caller claiming to be bank manager asking for OTP, CVV, or card PIN',
        'Threats of immediate account blocking or legal action within minutes',
        'Call originating from a normal 10-digit mobile number instead of an official bank SMS header',
      ]),
      safeActionsEn: JSON.stringify([
        'Remember: Real banks NEVER ask for your OTP, ATM PIN, or CVV over telephone calls',
        'If anyone calls regarding your account, disconnect the call immediately and visit your local bank branch',
        'Never read out SMS codes to anyone, even if they claim your life or savings depend on it',
      ]),
      victimGuidanceEn: JSON.stringify([
        'Call 1930 helpline without any delay',
        'Call your bank toll-free number and block your ATM card and net banking immediately',
        'Forward the fraud caller mobile number to DoT Chakshu portal (sancharsaathi.gov.in)',
      ]),
      // Hindi
      titleHi: 'फर्जी बैंक मैनेजर कॉल और एटीएम ब्लॉक की धमकी',
      definitionHi: 'ठग खुद को एसबीआई या अन्य बैंक का बड़ा अधिकारी बताकर कॉल करते हैं और कहते हैं कि आपका एटीएम कार्ड बंद हो रहा है या आधार लिंक नहीं है।',
      howItWorksHi: 'कॉलर बहुत अधिकार से और आपकी ही भाषा में बात करता है। वह आपके नाम या बैंक का नाम बोलकर विश्वास जीतता है। फिर डराता है कि "अगर अभी 2 मिनट में कार्ड नंबर और फोन पर आया 6 अंकों का OTP नहीं बताया, तो आपका खाता हमेशा के लिए ब्लॉक हो जाएगा।" जैसे ही आप OTP बताते हैं, वे आपकी मेहनत की कमाई साफ कर देते हैं।',
      fictionalExampleHi: 'महेश जी को फोन आया: "मैं एसबीआई हेड ऑफिस से मैनेजर बोल रहा हूँ। आपका एटीएम कार्ड आज रात बंद हो जाएगा। चालू रखने के लिए आपके मोबाइल पर आए 6 अंकों के कोड को तुरंत बताएं।" डर के मारे महेश जी ने OTP बता दिया। 1 मिनट में खाते से ₹48,000 कट गए।',
      warningSignsHi: JSON.stringify([
        'बैंक कर्मचारी बनकर फोन पर OTP, एटीएम पिन या कार्ड के पीछे का 3 अंकों का CVV मांगना',
        'खाता तुरंत बंद होने या जुर्माना लगने की धमकी देकर डराना',
        'कॉल किसी सामान्य 10 अंकों के मोबाइल नंबर से आना',
      ]),
      safeActionsHi: JSON.stringify([
        'बैंक कभी भी किसी ग्राहक से फोन पर OTP या पासवर्ड नहीं मांगता',
        'यदि कोई बैंक के नाम पर फोन करे, तो तुरंत फोन काट दें और अपनी नजदीकी बैंक शाखा में जाकर बात करें',
        'अपने फोन पर आए किसी भी SMS के नंबर (OTP) को किसी के साथ साझा न करें',
      ]),
      victimGuidanceHi: JSON.stringify([
        'तुरंत 1930 राष्ट्रीय साइबर हेल्पलाइन पर कॉल करें',
        'अपने बैंक के टोल फ्री नंबर पर फोन करके अपना एटीएम कार्ड और खाता तुरंत ब्लॉक करवाएं',
        'संचार साथी (Chakshu) पोर्टल पर उस फर्जी कॉलर के नंबर की रिपोर्ट करें',
      ]),
      // Marathi
      titleMr: 'बनावट बँक अधिकारी कॉल्स आणि एटीएम ब्लॉक करण्याची भीती',
      definitionMr: 'भामटे स्वतःला बँकेचे वरिष्ठ मॅनेजर असल्याचे सांगून कॉल करतात आणि तुमचे एटीएम किंवा बँक खाते बंद होण्याची भीती दाखवतात.',
      howItWorksMr: 'फोन करणारा व्यक्ती अतिशय नम्रपणे आणि तुमच्या परिचयाच्या भाषेत बोलतो. तो म्हणतो: "तुमचे आधार लिंक नाही, तुमचे खाते आज बंद होत आहे. चालू ठेवण्यासाठी तुमच्या मोबाईलवर आलेला OTP सांगा." घाबरून OTP सांगताच खात्यातील सर्व रक्कम काढून घेतली जाते.',
      fictionalExampleMr: 'महेशरावांना कॉल आला: "मी बँक ऑफ महाराष्ट्र मधून बोलतोय. तुमचे एटीएम कार्ड एक्सपायर झाले आहे. कार्ड चालू ठेवण्यासाठी आलेला OTP सांगा." घाबरून महेशरावांनी OTP दिला. पुढच्या एका मिनिटात ₹५०,००० कापले गेले.',
      warningSignsMr: JSON.stringify([
        'फोनवर बँकेचे नाव सांगून OTP, एटीएम पिन किंवा कार्ड वरील माहिती मागणे',
        'खाते तात्काळ बंद होईल अशी भीती दाखवून घाई करणे',
        'सामान्य १० अंकी मोबाईल नंबरवरून बँक मॅनेजर असल्याचा दावा करणे',
      ]),
      safeActionsMr: JSON.stringify([
        'बँक कधीही फोनवर कोणाकडूनही OTP किंवा पिन मागत नाही',
        'असा कॉल आल्यास तत्काळ फोन कट करा आणि स्वतःच्या बँकेच्या शाखेत जाऊन खात्री करा',
        'मोबाईलवर आलेला कोणताही OTP कोणालाही सांगू नका',
      ]),
      victimGuidanceMr: JSON.stringify([
        'त्वरित १९३० या सायबर हेल्पलाइनवर कॉल करा',
        'बँकेला संपर्क करून कार्ड आणि खात्यावरील व्यवहार तात्काळ थांबवा',
        'त्या नंबरची चक्षू (Chakshu) पोर्टलवर तक्रार नोंदवा',
      ]),
      relatedSlugs: JSON.stringify(['otp-theft', 'screen-sharing-fraud']),
    },
    {
      slug: 'otp-theft',
      categorySlug: 'banking-fraud',
      severity: 'critical',
      tags: JSON.stringify(['OTP', 'Password', 'Authentication', 'Security']),
      order: 4,
      // English
      titleEn: 'OTP Theft and Social Engineering',
      definitionEn: 'One-Time Passwords (OTPs) are the digital keys to your bank account and personal messages. Scammers invent convincing emergency stories to trick you into reciting them.',
      howItWorksEn: 'Scammers trigger a password reset on your bank or WhatsApp. Then they call you: "Sir, I sent a courier / medicine parcel by mistake to your address, I just sent a 4-digit cancellation code to your phone, please tell me that code to cancel it." In reality, that code was the authorization to log into your account.',
      fictionalExampleEn: 'A scammer called Geeta claiming to be an electricity board executive: "Your power will be cut tonight at 9 PM. Send the OTP sent to your phone to confirm payment." Geeta gave the OTP, which was actually for a net banking transfer of ₹35,000.',
      warningSignsEn: JSON.stringify([
        'Anyone asking you to read out a code that arrived via SMS',
        'The SMS message clearly says: "DO NOT SHARE THIS OTP WITH ANYONE"',
        'Caller creating fake urgency about electricity cuts, courier delivery, or lottery verification',
      ]),
      safeActionsEn: JSON.stringify([
        'Read the SMS carefully: It explicitly tells you what the OTP is for (e.g. "Transfer of Rs 10,000")',
        'Treat your OTP like your house keys. Never give it away to any stranger or caller',
        'Enable biometric authentication (fingerprint) on mobile banking apps',
      ]),
      victimGuidanceEn: JSON.stringify([
        'Call 1930 immediately to freeze the money trail before it leaves the banking system',
        'Change passwords for your net banking, email, and UPI apps immediately from a safe device',
        'File a formal report on cybercrime.gov.in',
      ]),
      // Hindi
      titleHi: 'ओटीपी (OTP) चोरी और सोशल इंजीनियरिंग',
      definitionHi: 'वन-टाइम पासवर्ड (OTP) आपके बैंक खाते और सोशल मीडिया की डिजिटल चाबी है। ठग झूठे बहाने बनाकर आपसे यह चाबी हासिल कर लेते हैं।',
      howItWorksHi: 'ठग आपके बैंक या सोशल मीडिया अकाउंट पर पासवर्ड रीसेट का बटन दबाता है। फिर आपको फोन करके कहता है: "सर, गलती से मेरा कूरियर या पैसे का वेरिफिकेशन कोड आपके नंबर पर आ गया है, कृपया वह 4 या 6 अंकों का कोड मुझे बता दीजिए।" जैसे ही आप वह कोड बताते हैं, वह आपके खाते पर कब्जा कर लेता है।',
      fictionalExampleHi: 'गीता देवी को फोन आया: "बिजली विभाग से बोल रहे हैं। आज रात 9 बजे आपके घर की बिजली कट जाएगी। लाइन चालू रखने के लिए आपके फोन पर आए कोड को बताएं।" गीता देवी ने कोड बता दिया, जो असल में ₹35,000 के बैंक ट्रांसफर का OTP था।',
      warningSignsHi: JSON.stringify([
        'कोई भी व्यक्ति जो आपके फोन पर आए SMS का कोड मांगे',
        'SMS में साफ-साफ लिखा होना: "यह OTP किसी से शेयर न करें / Do not share with anyone"',
        'बिजली कटने, कूरियर पहुंचने या गैस कनेक्शन रद्द होने का झूठा डर दिखाना',
      ]),
      safeActionsHi: JSON.stringify([
        'SMS को पूरा ध्यान से पढ़ें: उसमें साफ लिखा होता है कि यह OTP किस काम के लिए है',
        'OTP को अपने घर की तिजोरी की चाबी समझें। इसे किसी भी अनजान व्यक्ति को कभी न बताएं',
        'बैंकिंग ऐप्स में फिंगरप्रिंट लॉक का इस्तेमाल करें',
      ]),
      victimGuidanceHi: JSON.stringify([
        'तुरंत 1930 पर कॉल करें ताकि चोरी की रकम रोकी जा सके',
        'अपने नेट बैंकिंग और ईमेल का पासवर्ड तुरंत बदलें',
        'cybercrime.gov.in पर आधिकारिक शिकायत दर्ज करें',
      ]),
      // Marathi
      titleMr: 'ओटीपी (OTP) चोरी आणि दिशाभूल',
      definitionMr: 'वन-टाइम पासवर्ड (OTP) ही तुमच्या बँक खात्याची आणि सुरक्षिततेची डिजिटल चावी आहे. भामटे वेगवेगळी कारणे सांगून ती चोरतात.',
      howItWorksMr: 'भामटा तुमच्या खात्यावर पासवर्ड बदलण्याची विनंती करतो आणि नंतर तुम्हाला फोन करतो: "माझा पार्सल किंवा पडताळणी कोड चुकून तुमच्या फोनवर आला आहे, कृपया तो कोड सांगा." तुम्ही तो कोड सांगताच तुमचे खाते रिकामे होते.',
      fictionalExampleMr: 'गीताताईंना फोन आला: "महावितरणमधून बोलत आहोत. तुमचे वीज बिल भरले नाही म्हणून आज वीज कापली जाईल. वीज चालू ठेवण्यासाठी आलेला कोड सांगा." कोड सांगताच खात्यातून ₹३५,००० कापले गेले.',
      warningSignsMr: JSON.stringify([
        'मेसेजमधील ओटीपी किंवा गुप्त कोड कोणाही अनोळखी व्यक्तीने मागणे',
        'मेसेजमध्ये "Do not share this OTP" असे स्पष्ट लिहिलेले असणे',
        'वीज बिल, गॅस कनेक्शन किंवा पार्सलच्या नावाखाली घाबरवणे',
      ]),
      safeActionsMr: JSON.stringify([
        'मोबाईलवरील मेसेज पूर्ण वाचा: त्यामध्ये हा ओटीपी कशासाठी वापरला जात आहे ते लिहिलेले असते',
        'ओटीपी म्हणजे तिजोरीची चावी; तो कोणालाही कधीही सांगू नका',
        'बँकेच्या कामासाठी अधिकृत अॅप वापरा',
      ]),
      victimGuidanceMr: JSON.stringify([
        'ताबडतोब १९३० वर संपर्क साधून पैसे गोठवण्याची विनंती करा',
        'सर्व पासवर्ड्स सुरक्षितपणे बदला',
        'cybercrime.gov.in वर तक्रार नोंदवा',
      ]),
      relatedSlugs: JSON.stringify(['fake-bank-calls', 'upi-collect-request']),
    },
    {
      slug: 'screen-sharing-fraud',
      categorySlug: 'smartphone-safety',
      severity: 'critical',
      tags: JSON.stringify(['AnyDesk', 'TeamViewer', 'Screen Share', 'Remote Access', 'App']),
      order: 5,
      // English
      titleEn: 'Screen-Sharing App Scams (AnyDesk, QuickSupport, RustDesk)',
      definitionEn: 'Fraudsters convince victims to install remote screen-sharing tools from the Play Store or APK links, giving the criminal complete real-time view and control of the phone screen.',
      howItWorksEn: 'While assisting with a fake customer support complaint (e.g. failed recharge), the fraudster says: "Install QuickSupport or AnyDesk app from Play Store so our technical engineer can check your network." Once installed, the app generates a 9-digit session code. The fraudster asks for this code, and suddenly they can see everything on your screen—including your bank passwords and OTPs.',
      fictionalExampleEn: 'Anil’s gas subsidy had not arrived. He searched on Google for "Gas Helpline" and called a fake number. The person told him to install "AnyDesk" to fix the subsidy error. As Anil opened his mobile banking app to check, the fraudster saw his password on live screen and stole ₹80,000.',
      warningSignsEn: JSON.stringify([
        'Customer support representative asking you to install AnyDesk, TeamViewer, RustDesk, or QuickSupport',
        'Asking you to read out a 9-digit or 10-digit code displayed inside the newly installed app',
        'A red warning icon or screen-sharing notification on your mobile status bar',
      ]),
      safeActionsEn: JSON.stringify([
        'NEVER install AnyDesk, TeamViewer, or screen-sharing apps on the instruction of any phone caller',
        'If already installed, immediately turn on Airplane Mode, disconnect WiFi, and uninstall the app',
        'Genuine bank or customer support executives will NEVER ask you to share your phone screen',
      ]),
      victimGuidanceEn: JSON.stringify([
        'Switch off your phone or disconnect internet immediately to cut remote control',
        'Call 1930 Cybercrime Helpline from another family member’s phone',
        'Uninstall the suspicious app completely from Settings > Apps',
        'Call bank to freeze accounts until your phone is clean',
      ]),
      // Hindi
      titleHi: 'स्क्रीन शेयरिंग ऐप फ्रॉड (AnyDesk, QuickSupport का खतरा)',
      definitionHi: 'ठग मदद करने के बहाने आपके फोन में स्क्रीन शेयरिंग ऐप (जैसे AnyDesk या QuickSupport) डाउनलोड करवाते हैं, जिससे वे आपके पूरे फोन की स्क्रीन लाइव देख सकते हैं।',
      howItWorksHi: 'कस्टमर केयर या तकनीकी खराबी ठीक करने के नाम पर ठग कहते हैं: "प्ले स्टोर से AnyDesk या QuickSupport ऐप डाउनलोड करें।" ऐप खुलने पर उसमें एक 9 अंकों का कोड आता है। जैसे ही आप वह कोड कॉलर को बताते हैं, वह अपने कंप्यूटर से आपका पूरा फोन देखने लगता है। फिर जब आप बैंक ऐप खोलते हैं, तो वह आपका पिन और पासवर्ड लाइव देखकर पैसे चुरा लेता है।',
      fictionalExampleHi: 'अनिल जी की गैस सब्सिडी नहीं आई थी। उन्होंने गूगल पर कस्टमर केयर नंबर ढूंढकर फोन किया। ठग ने कहा कि गलती सुधारने के लिए "AnyDesk" ऐप डाउनलोड करें। अनिल जी ने ऐप डालकर कोड बता दिया। जैसे ही उन्होंने बैंक बैलेंस देखने के लिए ऐप खोली, ठग ने पासवर्ड देखकर उनके खाते से ₹80,000 उड़ा लिए।',
      warningSignsHi: JSON.stringify([
        'कस्टमर केयर या बैंक अधिकारी द्वारा AnyDesk, TeamViewer या QuickSupport डाउनलोड करने को कहना',
        'ऐप खोलने पर स्क्रीन पर दिख रहे 9 अंकों के कोड को पूछना',
        'फोन के ऊपर स्क्रीन रिकॉर्डिंग या शेयरिंग का लाल निशान दिखाई देना',
      ]),
      safeActionsHi: JSON.stringify([
        'किसी भी अनजान व्यक्ति के फोन पर कहने पर स्क्रीन शेयरिंग ऐप कभी भी इंस्टॉल न करें',
        'यदि गलती से इंस्टॉल हो जाए, तो तुरंत मोबाइल डेटा/वाईफाई बंद करें और ऐप को अनइंस्टॉल करें',
        'असली बैंक या कंपनी कर्मचारी कभी भी आपकी फोन स्क्रीन देखने की मांग नहीं करते',
      ]),
      victimGuidanceHi: JSON.stringify([
        'तुरंत फोन को एयरप्लेन मोड पर डालें या इंटरनेट बंद करें ताकि ठग का कनेक्शन कट जाए',
        'घर के किसी दूसरे फोन से तुरंत 1930 पर कॉल करके फ्रॉड की सूचना दें',
        'सेटिंग्स में जाकर उस ऐप को तुरंत अनइंस्टॉल (डिलीट) करें',
        'बैंक में फोन कर अपना खाता अस्थायी रूप से ब्लॉक करवाएं',
      ]),
      // Marathi
      titleMr: 'स्क्रीन शेअरिंग अॅप फसवणूक (AnyDesk, QuickSupport चा धोका)',
      definitionMr: 'भामटे मदतीचा बहाणा करून तुमच्या मोबाईलमध्ये स्क्रीन शेअरिंग अॅप्स (उदा. AnyDesk, TeamViewer) इन्स्टॉल करून घेतात, ज्यामुळे ते तुमचा संपूर्ण फोन स्क्रीन थेट पाहू शकतात.',
      howItWorksMr: 'कस्टमर केअरच्या नावाखाली भामटे सांगतात: "अडचण सोडवण्यासाठी AnyDesk अॅप डाउनलोड करा." अॅप उघडल्यावर येणारा ९ अंकी कोड तुम्ही त्यांना सांगताच, तुमचा मोबाईल त्यांच्या ताब्यात जातो. तुम्ही बँक अॅप उघडून पासवर्ड टाकताच तो पासवर्ड भामट्याला दिसतो.',
      fictionalExampleMr: 'अनिलरावांना गॅस सबसिडी मिळाली नव्हती. त्यांनी गुगलवरून शोधलेल्या नंबरवर कॉल केला. कॉलरने "AnyDesk" डाऊनलोड करायला लावून कोड मागितला. अनिलरावांनी बँक अॅप उघडताच भामट्याने त्यांचा पासवर्ड पाहून खात्यातील ₹८०,००० पळवले.',
      warningSignsMr: JSON.stringify([
        'कोणत्याही फोन कॉलरने AnyDesk, TeamViewer किंवा QuickSupport डाऊनलोड करायला सांगणे',
        'स्क्रीनवर आलेला ९ किंवा १० अंकी कोड वाचून सांगण्यास सांगणे',
        'मोबाईलच्या वरच्या भागात स्क्रीन शेअरिंगचे चिन्ह दिसणे',
      ]),
      safeActionsMr: JSON.stringify([
        'कोणाच्याही सांगण्यावरून AnyDesk सारखे स्क्रीन शेअरिंग अॅप्स इन्स्टॉल करू नका',
        'अॅप इन्स्टॉल झाले असल्यास लगेच इंटरनेट बंद करा आणि अॅप काढून टाका (Uninstall)',
        'अधिकृत बँक कर्मचारी कधीही स्क्रीन शेअर करायला सांगत नाहीत',
      ]),
      victimGuidanceMr: JSON.stringify([
        'फोन लगेच फ्लाईट मोडवर टाका किंवा इंटरनेट बंद करा',
        'दुसऱ्या फोनवरून लगेच १९३० वर कॉल करून सायबर तक्रार नोंदवा',
        'सेटिंग्जमधून ते अॅप तात्काळ अनइन्स्टॉल करा आणि बँकेला कळवा',
      ]),
      relatedSlugs: JSON.stringify(['malicious-apk-download', 'fake-bank-calls']),
    },
    {
      slug: 'digital-arrest-scam',
      categorySlug: 'social-media',
      severity: 'critical',
      tags: JSON.stringify(['Digital Arrest', 'Police', 'CBI', 'ED', 'Video Call', 'Extortion']),
      order: 6,
      // English
      titleEn: 'Digital Arrest Scams (Fake Police, CBI & ED Video Calls)',
      definitionEn: 'Extortion racket where scammers dress in police or customs uniforms, make video calls from fake police stations, and claim you are under "Digital Arrest" for drugs or money laundering.',
      howItWorksEn: 'You receive an IVR call stating: "Your parcel containing narcotics and fake passports was intercepted at Mumbai Airport. Connecting you to cyber crime branch." A fraudster in a police uniform on Skype/WhatsApp video shows fake supreme court orders and threatens immediate physical arrest unless you transfer "refundable verification funds" to an RBI escrow account.',
      fictionalExampleEn: 'Govind, a retired school teacher, received a Skype video call from a person dressed as a CBI officer with a police logo in the background. The officer accused Govind’s Aadhaar of being used in a ₹50 crore money laundering case and demanded ₹3,00,000 for "court clearance verification". Panicked Govind sent his life savings.',
      warningSignsEn: JSON.stringify([
        'Video calls on WhatsApp or Skype by persons dressed in police or judicial uniforms',
        'Terms like "Digital Arrest" (There is NO SUCH THING as digital arrest in Indian Law)',
        'Demand to keep the camera on 24 hours and not inform family or friends',
        'Demand to transfer money to a private bank account for "court inspection" or "RBI clearance"',
      ]),
      safeActionsEn: JSON.stringify([
        'Remember: Indian Police, CBI, ED, or Courts NEVER conduct arrests or judicial hearings via WhatsApp video calls',
        'There is NO provision of "Digital Arrest" under any Indian law (IPC/BNS or CrPC/BNSS)',
        'Never transfer money to clear criminal charges. Government agencies never ask for funds into bank accounts',
        'Disconnect the video call immediately and report to the local police station',
      ]),
      victimGuidanceEn: JSON.stringify([
        'Immediately call 1930 and report extortion and impersonation',
        'Preserve the Skype ID, WhatsApp numbers, fake warrants, and bank transfer receipts',
        'Visit your local Cyber Police station or city police station in person',
      ]),
      // Hindi
      titleHi: 'डिजिटल अरेस्ट फ्रॉड (फर्जी पुलिस, सीबीआई एवं ईडी वीडियो कॉल)',
      definitionHi: 'जबरन वसूली का एक खतरनाक गिरोह जिसमें ठग पुलिस की वर्दी पहनकर फर्जी थाने से वीडियो कॉल करते हैं और दावा करते हैं कि आपको "डिजिटल अरेस्ट" किया गया है।',
      howItWorksHi: 'फोन आता है कि "आपके नाम से भेजे गए पार्सल में ड्रग्स और जाली पासपोर्ट मिले हैं। आपको साइबर क्राइम सेल से जोड़ा जा रहा है।" फिर व्हाट्सएप या स्काइप पर पुलिस की वर्दी पहने व्यक्ति वीडियो कॉल पर आता है। वह सुप्रीम कोर्ट के फर्जी नोटिस दिखाकर जेल भेजने की धमकी देता है और कहता है कि जमानत या जांच के लिए तुरंत लाखों रुपये इस सरकारी खाते में ट्रांसफर करें।',
      fictionalExampleHi: 'गोविंद जी, जो एक रिटायर्ड शिक्षक हैं, को स्काइप पर एक वीडियो कॉल आया जिसमें सामने वाला पुलिस की वर्दी में बैठा था। उसने कहा कि गोविंद जी के आधार कार्ड से मनी लॉन्ड्रिंग हुई है और अगर तुरंत ₹3,00,000 "सत्यापन फंड" में ट्रांसफर नहीं किए, तो सीबीआई पुलिस उनके घर पहुंच जाएगी। डर के मारे उन्होंने पैसे भेज दिए।',
      warningSignsHi: JSON.stringify([
        'व्हाट्सएप या स्काइप पर पुलिस या कस्टम अधिकारी बनकर वीडियो कॉल करना',
        '"डिजिटल अरेस्ट" शब्द का इस्तेमाल (भारतीय कानून में डिजिटल अरेस्ट नाम की कोई चीज नहीं होती!)',
        'कैमरा लगातार चालू रखने और किसी रिश्तेदार को न बताने का दबाव बनाना',
        'केस रफा-दफा करने या जांच के नाम पर बैंक खाते में पैसे ट्रांसफर करने की मांग',
      ]),
      safeActionsHi: JSON.stringify([
        'याद रखें: भारतीय पुलिस, सीबीआई या अदालत कभी भी व्हाट्सएप वीडियो कॉल पर न तो गिरफ्तारी करती है और न ही पूछताछ',
        'भारतीय कानून में "डिजिटल अरेस्ट" का कोई कानूनी प्रावधान नहीं है; यह 100% फर्जीवाड़ा है',
        'सरकारी एजेंसियां कभी भी किसी प्राइवेट खाते में पैसे जमा करने को नहीं कहतीं',
        'तुरंत वीडियो कॉल काटें और अपने नजदीकी थाने में जाकर सूचना दें',
      ]),
      victimGuidanceHi: JSON.stringify([
        'तुरंत 1930 साइबर हेल्पलाइन पर कॉल करें और पूरे गिरोह की रिपोर्ट दर्ज कराएं',
        'वीडियो कॉल के स्क्रीनशॉट, ठग के नंबर और बैंक ट्रांसफर रसीद संभाल कर रखें',
        'अपने स्थानीय पुलिस थाने में लिखित शिकायत दर्ज कराएं',
      ]),
      // Marathi
      titleMr: 'डिजिटल अरेस्ट फसवणूक (बनावट पोलीस, सीबीआय व्हिडिओ कॉल)',
      definitionMr: 'भामटे पोलिसांच्या गणवेशात व्हिडिओ कॉल करून नागरिकांना घाबरवतात आणि तुम्ही "डिजिटल अरेस्ट" मध्ये आहात असा खोटा दावा करून खंडणी उकळतात.',
      howItWorksMr: 'कॉल येतो की "तुमच्या पार्सलमध्ये बेकायदेशीर वस्तू आणि ड्रग्ज सापडले आहेत." त्यानंतर व्हॉट्सअॅप किंवा स्काईपवर पोलिसांच्या वेशातील व्यक्ती व्हिडिओ कॉलवर येते. सुप्रीम कोर्टाची बनावट पत्रे दाखवून अटक न करण्यासाठी तपासणी खात्यात लाखो रुपये भरण्यास भाग पाडले जाते.',
      fictionalExampleMr: 'निवृत्त शिक्षक गोविंदरावांना एका व्यक्तीने पोलीस गणवेशात व्हिडिओ कॉल केला आणि सांगितले की त्यांच्या नावावर मनी लाँड्रिंगचा गुन्हा दाखल झाला आहे. चौकशीसाठी त्यांनी ₹३ लाख जमा केले नाही तर तात्काळ पोलीस घरी येतील अशी भीती दाखवली. घाबरून त्यांनी पैसे पाठवले.',
      warningSignsMr: JSON.stringify([
        'व्हॉट्सअॅप किंवा स्काईपवर पोलीस अधिकाऱ्याच्या वेशातील व्यक्तीकडून व्हिडिओ कॉल येणे',
        '"डिजिटल अरेस्ट" हा शब्द वापरणे (भारतीय कायद्यात डिजिटल अरेस्ट अस्तित्वातच नाही!)',
        'कोणालाही फोन करू नये आणि कॅमेरा बंद करू नये अशी सक्ती करणे',
        'चौकशीच्या नावाखाली पैसे बँक खात्यात ट्रान्सफर करण्याची मागणी',
      ]),
      safeActionsMr: JSON.stringify([
        'लक्षात ठेवा: पोलीस किंवा सीबीआय कधीही व्हॉट्सअॅप व्हिडिओ कॉलवर तपास किंवा अटक करत नाही',
        'भारतीय कायद्यात "डिजिटल अरेस्ट" अशी कोणतीही तरतूद नाही; ही निव्वळ फसवणूक आहे',
        'सरकारी यंत्रणा कधीही नागरिकांकडून बँक खात्यात पैसे मागत नाहीत',
        'व्हिडिओ कॉल तत्काळ कट करा आणि जवळच्या पोलीस ठाण्यात संपर्क साधा',
      ]),
      victimGuidanceMr: JSON.stringify([
        'लगेच १९३० या सायबर हेल्पलाइनवर कॉल करून माहिती द्या',
        'कॉलचे रेकॉर्डिंग, फोन नंबर आणि सर्व पुरावे सुरक्षित ठेवा',
        'स्थानिक पोलीस ठाण्यात लेखी तक्रार नोंदवा',
      ]),
      relatedSlugs: JSON.stringify(['fake-bank-calls', 'whatsapp-impersonation']),
    },
    {
      slug: 'malicious-apk-download',
      categorySlug: 'smartphone-safety',
      severity: 'critical',
      tags: JSON.stringify(['APK', 'Android', 'Malware', 'WhatsApp File', 'Trojan']),
      order: 7,
      // English
      titleEn: 'Malicious APK Downloads (Wedding Cards, PM Schemes, E-Challan)',
      definitionEn: 'Dangerous Android application files (.apk) distributed via WhatsApp disguised as wedding invitation cards, traffic challans, or free electricity subsidies.',
      howItWorksEn: 'You receive a WhatsApp message: "Shadi Ka Card.apk" or "PM-Kisan-Yojana-List.apk". When clicked, Android asks permission to "Install Unknown Apps". Once installed, the malicious app hides its icon, accesses your SMS inbox, steals your incoming bank OTPs in the background, and forwards them directly to cybercriminals.',
      fictionalExampleEn: 'Deepak received a WhatsApp message from an unknown number: "Bhaiya, marriage invitation card attached, please come with family - Wedding_Card.apk". Deepak tapped it and installed the file. Within 2 hours, three unauthorized transactions debited ₹45,000 without any notification showing up.',
      warningSignsEn: JSON.stringify([
        'Files ending in ".apk" sent via WhatsApp or Telegram',
        'Invitations, bills, or PDF documents that insist on installing an application',
        'Phone prompting: "For security, your phone is not allowed to install unknown apps from this source"',
      ]),
      safeActionsEn: JSON.stringify([
        'NEVER download or install files ending with ".apk" sent by anyone on WhatsApp',
        'Install apps ONLY from the official Google Play Store',
        'Never toggle ON "Allow from this source" in your phone’s Unknown Apps settings',
        'Real wedding cards and government documents are pictures (.jpg) or documents (.pdf), NEVER apps (.apk)',
      ]),
      victimGuidanceEn: JSON.stringify([
        'Put the phone in Airplane mode and immediately back up photos/contacts',
        'Go to Settings > Apps > see all apps, locate any suspicious app with blank or generic name and Uninstall',
        'If unable to remove, perform a Factory Reset of the device',
        'Call 1930 immediately to freeze any stolen bank money',
      ]),
      // Hindi
      titleHi: 'खतरनाक APK फाइलें (शादी का कार्ड, सरकारी योजना, ई-चालान फ्रॉड)',
      definitionHi: 'व्हाट्सएप पर शादी के कार्ड, ट्रैफिक चालान या सरकारी योजना के नाम पर भेजी जाने वाली फर्जी एंड्रॉयड एप्लिकेशन (.apk) फाइलें जो फोन का सारा डेटा चुरा लेती हैं।',
      howItWorksHi: 'व्हाट्सएप पर मैसेज आता है: "Wedding_Card.apk" या "Bijli_Bill_Chhoot.apk"। जब आप इस पर क्लिक करते हैं, तो फोन चेतावनी देता है कि यह अज्ञात ऐप है। जैसे ही आप इसे इंस्टॉल करते हैं, यह ऐप फोन में छुप जाती है और आपके बैंक से आने वाले सारे OTP सीधे ठगों को भेजने लगती है।',
      fictionalExampleHi: 'दीपक जी को व्हाट्सएप पर मैसेज मिला: "भैया, शादी का कार्ड भेजा है, सपरिवार जरूर आएं - Wedding_Invitation.apk"। दीपक जी ने सोचा यह शादी का कार्ड है और इंस्टॉल कर लिया। दो घंटे बाद उनके खाते से बिना कोई SMS दिखे ₹45,000 गायब हो गए क्योंकि ऐप ने OTP छुपाकर ठग को भेज दिया था।',
      warningSignsHi: JSON.stringify([
        'व्हाट्सएप या टेलीग्राम पर किसी फाइल के नाम के अंत में ".apk" लिखा होना',
        'शादी के कार्ड या बिजली के बिल के लिए ऐप डाउनलोड करने को कहना',
        'फोन की स्क्रीन पर चेतावनी आना कि "अज्ञात स्रोतों से ऐप इंस्टॉल करना असुरक्षित है"',
      ]),
      safeActionsHi: JSON.stringify([
        'व्हाट्सएप पर आई किसी भी ".apk" फाइल को कभी भी डाउनलोड या इंस्टॉल न करें',
        'अपने स्मार्टफोन में केवल आधिकारिक गूगल प्ले स्टोर (Google Play Store) से ही ऐप इंस्टॉल करें',
        'फोन सेटिंग्स में "Install Unknown Apps" की अनुमति कभी चालू न करें',
        'शादी का कार्ड हमेशा फोटो (.jpg) या पीडीएफ (.pdf) होता है, ऐप (.apk) कभी नहीं होता',
      ]),
      victimGuidanceHi: JSON.stringify([
        'तुरंत फोन को एयरप्लेन मोड में डालें ताकि इंटरनेट बंद हो जाए',
        'सेटिंग्स > ऐप्स (Apps) में जाएं और उस संदिग्ध ऐप को तुरंत Uninstall करें',
        'यदि ऐप डिलीट न हो, तो फोन को तुरंत फैक्ट्री रीसेट (Factory Reset) करें',
        '1930 पर कॉल करें और बैंक को सूचित करें',
      ]),
      // Marathi
      titleMr: 'धोकादायक APK फाईल्स (लग्नाची पत्रिका, सरकारी योजना, ई-चलन फ्रॉड)',
      definitionMr: 'व्हॉट्सअॅपवर लग्नाची पत्रिका, वीज बिल किंवा सरकारी अनुदानाच्या नावाखाली पाठवल्या जाणाऱ्या घातक अँड्रॉइड अॅप्स (.apk) फाईल्स.',
      howItWorksMr: 'मेसेज येतो: "Lagnachi_Patrika.apk". यावर क्लिक करताच फोन अज्ञात अॅप इन्स्टॉल करण्याची परवानगी मागतो. इन्स्टॉल होताच हे अॅप लपून बसते आणि तुमच्या फोनवर येणारे सर्व बँक ओटीपी परस्पर भामट्यांकडे पाठवते.',
      fictionalExampleMr: 'दीपकरावांना अनोळखी नंबरवरून मेसेज आला: "दादा, लग्नाची पत्रिका पाठवली आहे, नक्की या - Wedding_Card.apk". त्यांनी फाईल डाऊनलोड केली. संध्याकाळपर्यंत त्यांच्या खात्यातून ₹४५,००० परस्पर गायब झाले.',
      warningSignsMr: JSON.stringify([
        'व्हॉट्सअॅपवर आलेल्या फाईलच्या शेवटी ".apk" असे असणे',
        'लग्नाची पत्रिका किंवा शासकीय योजनेच्या नावाखाली अॅप इन्स्टॉल करण्यास सांगणे',
        'मोबाईलने अनोळखी स्त्रोतावरून अॅप घेण्यास धोक्याची सूचना देणे',
      ]),
      safeActionsMr: JSON.stringify([
        'व्हॉट्सअॅपवर आलेली कोणतीही ".apk" फाईल चुकूनही डाऊनलोड करू नका',
        'अॅप्स फक्त आणि फक्त अधिकृत गुगल प्ले स्टोअर (Google Play Store) वरूनच घ्या',
        'लग्नाची पत्रिका ही फोटो किंवा पीडीएफ असते, अॅप (.apk) कधीही नसते',
      ]),
      victimGuidanceMr: JSON.stringify([
        'फोन तात्काळ फ्लाईट मोडवर टाका',
        'सेटिंग्ज > अॅप्स मध्ये जाऊन ते धोकादायक अॅप डिलीट (Uninstall) करा',
        '१९३० हेल्पलाइनवर तक्रार नोंदवा आणि बँक खाते तपासा',
      ]),
      relatedSlugs: JSON.stringify(['screen-sharing-fraud', 'fake-bank-calls']),
    },
    {
      slug: 'part-time-job-scam',
      categorySlug: 'fake-schemes',
      severity: 'high',
      tags: JSON.stringify(['Job Scam', 'Work from Home', 'Telegram', 'YouTube Like', 'Investment']),
      order: 8,
      // English
      titleEn: 'Part-Time Work-From-Home & YouTube "Like & Earn" Scams',
      definitionEn: 'Fraudsters offer easy work-from-home tasks like liking YouTube videos or rating hotels for ₹50 per like, initially paying small amounts to build trust, then taking thousands under the pretext of "prepaid investment tasks".',
      howItWorksEn: 'You receive a WhatsApp message: "Earn ₹3,000 daily from home by simply liking videos." For the first 3 tasks, they actually transfer ₹150 directly to your UPI. Then they add you to a Telegram VIP group and say: "To unlock task 4, deposit ₹5,000 for ₹7,500 return." As deposits increase to ₹50,000 or lakhs, they freeze your money and demand more fees.',
      fictionalExampleEn: 'Kavita, a college student, took up a Telegram YouTube rating task. She received ₹300 initially. Convinced, she joined the VIP task and deposited ₹10,000, then ₹50,000 to "unlock" her earnings. When she tried to withdraw, the scammers asked for ₹80,000 more tax. She lost ₹60,000.',
      warningSignsEn: JSON.stringify([
        'Unsolicited WhatsApp/Telegram offers for "Like & Earn" or "Hotel Rating"',
        'Paying small amounts (₹100-₹300) immediately to win your confidence',
        'Demanding you deposit money into random individual bank accounts to unlock payouts',
      ]),
      safeActionsEn: JSON.stringify([
        'Legitimate companies never pay people to like random videos or write fake reviews',
        'Never pay money to get a job or task payout. If a job requires you to invest first, it is a SCAM',
        'Block and report unsolicited work-from-home Telegram channels',
      ]),
      victimGuidanceEn: JSON.stringify([
        'Stop sending any additional money immediately—you will never recover it by paying more',
        'Call 1930 Cybercrime Helpline with transaction receipts and Telegram usernames',
        'File an online complaint on cybercrime.gov.in',
      ]),
      // Hindi
      titleHi: 'पार्ट-टाइम वर्क फ्रॉम होम एवं यूट्यूब "लाइक एंड अर्न" फ्रॉड',
      definitionHi: 'घर बैठे यूट्यूब वीडियो लाइक करने या होटल रेटिंग देने के नाम पर रोज़ाना ₹3,000 कमाने का लालच देकर लाखों रुपये की ठगी करना।',
      howItWorksHi: 'व्हाट्सएप पर मैसेज आता है कि घर बैठे केवल वीडियो लाइक करके पैसे कमाएं। शुरू में 2-3 लाइक करने पर वे सचमुच आपके खाते में ₹150 भेज देते हैं ताकि आपको भरोसा हो जाए। फिर वे टेलीग्राम ग्रुप में जोड़ते हैं और कहते हैं कि बड़ा मुनाफा पाने के लिए ₹5,000 जमा करें। जब आप ₹50,000 या ₹1 लाख जमा कर देते हैं, तो पैसे निकालना बंद हो जाता है और वे और पैसे मांगने लगते हैं।',
      fictionalExampleHi: 'कविता, जो एक कॉलेज छात्रा है, को मैसेज मिला कि वीडियो लाइक करने पर हर लाइक के ₹50 मिलेंगे। शुरू में उसे ₹300 मिले। खुश होकर उसने वीआईपी टास्क के लिए ₹10,000 और फिर ₹50,000 ट्रांसफर कर दिए। जब पैसे वापस मांगे, तो ठग बोले ₹80,000 टैक्स जमा करो। उसने अपनी पूरी फीस के पैसे गंवा दिए।',
      warningSignsHi: JSON.stringify([
        'व्हाट्सएप पर बिना मांगे "घर बैठे 2 घंटे काम करके ₹3,000 कमाएं" का मैसेज आना',
        'विश्वास जीतने के लिए शुरुआत में छोटे पैसे (₹100-₹300) तुरंत ट्रांसफर करना',
        'कमाई निकालने के लिए पहले खुद का पैसा लगाने (टास्क रिचार्ज) की शर्त रखना',
      ]),
      safeActionsHi: JSON.stringify([
        'कोई भी असली कंपनी केवल वीडियो लाइक करने या फर्जी रिव्यू लिखने के पैसे नहीं देती',
        'नौकरी पाने या वेतन लेने के लिए कभी भी अपनी जेब से पैसे न लगाएं; यह 100% घोटाला है',
        'टेलीग्राम और व्हाट्सएप पर ऐसे मैसेज भेजने वालों को तुरंत ब्लॉक और रिपोर्ट करें',
      ]),
      victimGuidanceHi: JSON.stringify([
        'ठगों को और पैसे भेजना तुरंत बंद करें; और पैसे देने से फंसा हुआ पैसा कभी वापस नहीं मिलता',
        '1930 राष्ट्रीय साइबर हेल्पलाइन पर तुरंत कॉल करें',
        'cybercrime.gov.in पर बैंक ट्रांसफर के स्क्रीनशॉट के साथ शिकायत दर्ज करें',
      ]),
      // Marathi
      titleMr: 'पार्ट-टाइम घरबसल्या काम आणि यूट्यूब "लाइक करा व पैसे कमवा" फसवणूक',
      definitionMr: 'घरबसल्या यूट्यूब व्हिडिओ लाइक करून दररोज ₹३,००० कमवा असे आमिष दाखवून नागरिकांची लाखो रुपयांची लूट करणे.',
      howItWorksMr: 'सुरुवातीला विश्वास बसण्यासाठी २-३ व्हिडिओ लाइक केल्यावर ते खरंच ₹१५० पाठवतात. नंतर टेलिग्राम ग्रुपमध्ये जोडून सांगतात: "मोठा परतावा हवा असल्यास ₹५,००० ची गुंतवणूक करा." एकदा मोठी रक्कम भरली की पैसे अडकवून आणखी पैशांची मागणी करतात.',
      fictionalExampleMr: 'कॉलेज विद्यार्थिनी कविताला मेसेज आला. सुरुवातीला तिला ₹२०० मिळाले. विश्वास बसल्याने तिने टास्क पूर्ण करण्यासाठी ₹५०,००० भरले. पैसे काढायला गेल्यावर आणखी ₹३०,००० मागण्यात आले. तिचे सर्व पैसे बुडाले.',
      warningSignsMr: JSON.stringify([
        'व्हॉट्सअॅपवर "घरबसल्या व्हिडिओ लाइक करून पैसे मिळवा" असे मेसेज येणे',
        'सुरुवातीला थोडे पैसे पाठवून भुलवणे',
        'पैसे मिळवण्यासाठी आधी स्वतःचे पैसे भरण्यास सांगणे',
      ]),
      safeActionsMr: JSON.stringify([
        'कोणतीही अधिकृत कंपनी व्हिडिओ लाइक करण्यासाठी पैसे देत नाही',
        'कामासाठी आधी पैसे भरावे लागत असतील तर तो १००% फ्रॉड आहे',
        'अनोळखी टेलिग्राम चॅनेल्स त्वरित ब्लॉक करा',
      ]),
      victimGuidanceMr: JSON.stringify([
        'आणखी पैसे भरणे तात्काळ थांबवा',
        '१९३० हेल्पलाइनवर संपर्क साधून सर्व व्यवहारांची माहिती द्या',
        'सायबर पोलीस ठाण्यात अधिकृत तक्रार नोंदवा',
      ]),
      relatedSlugs: JSON.stringify(['fake-lottery-prize']),
    },
    {
      slug: 'fake-lottery-prize',
      categorySlug: 'fake-schemes',
      severity: 'medium',
      tags: JSON.stringify(['Lottery', 'KBC', 'Prize', 'WhatsApp Message', 'Fraud']),
      order: 9,
      // English
      titleEn: 'Fake Lottery, KBC & Lucky Winner Scams',
      definitionEn: 'Fraudulent voice notes or posters on WhatsApp claiming your mobile number has won a ₹25 Lakh lottery from KBC or a major car manufacturer.',
      howItWorksEn: 'You receive an audio message on WhatsApp featuring Amitabh Bachchan’s voice or fanfare saying your SIM card won a ₹25 Lakh prize. The message gives a fake manager’s WhatsApp number. When contacted, they demand ₹12,500 for "GST tax" or "file processing charge" before dispatching the prize. Once paid, they demand more charges until you realize it is a fraud.',
      fictionalExampleEn: 'Suresh received an image with a picture of a ₹25 Lakh SBI cheque and a voice note congratulating him. Suresh called the number. The caller asked for ₹25,000 for government tax to release the cheque. Suresh paid and the scammer switched off the phone.',
      warningSignsEn: JSON.stringify([
        'Winning a lottery or contest you never purchased a ticket for or entered',
        'Requests to pay advance fees, GST, or processing charges to collect a prize',
        'Official letters loaded with spelling mistakes and bad formatting',
      ]),
      safeActionsEn: JSON.stringify([
        'Remember: You CANNOT win a lottery you never participated in',
        'Real contests NEVER ask winners to deposit money in advance to receive prize money',
        'Block and report the sender on WhatsApp immediately',
      ]),
      victimGuidanceEn: JSON.stringify([
        'Report to 1930 Cybercrime Helpline',
        'Submit the WhatsApp chat and bank payment details on cybercrime.gov.in',
      ]),
      // Hindi
      titleHi: 'फर्जी लॉटरी, केबीसी एवं लकी ड्रा ईनाम फ्रॉड',
      definitionHi: 'व्हाट्सएप पर फर्जी ऑडियो या पोस्टर भेजकर दावा करना कि आपके मोबाइल नंबर ने केबीसी (KBC) या कंपनी से ₹25 लाख की लॉटरी जीती है।',
      howItWorksHi: 'व्हाट्सएप पर एक ऑडियो संदेश आता है जिसमें बधाई दी जाती है कि आपके सिम नंबर ने ₹25 लाख जीते हैं। नीचे एक तथाकथित बैंक मैनेजर का नंबर दिया होता है। जब आप कॉल करते हैं, तो वे कहते हैं: "लॉटरी का चेक भेजने के लिए पहले ₹12,500 का सरकारी टैक्स या फाइल चार्ज जमा करें।" जैसे ही आप पैसे भेजते हैं, वे फोन बंद कर लेते हैं।',
      fictionalExampleHi: 'सुरेश जी को व्हाट्सएप पर ₹25 लाख के चेक की फोटो और बधाई संदेश मिला। सुरेश जी ने दिए गए नंबर पर फोन किया। सामने वाले ने कहा कि चेक खाते में ट्रांसफर करने के लिए ₹25,000 टैक्स जमा करना होगा। सुरेश जी ने पैसे भेज दिए और फिर वह नंबर हमेशा के लिए बंद हो गया।',
      warningSignsHi: JSON.stringify([
        'ऐसी किसी लॉटरी या लकी ड्रा में जीतना जिसका आपने कभी टिकट ही नहीं खरीदा',
        'ईनाम पाने के लिए पहले टैक्स, जीएसटी या फाइल चार्ज के नाम पर पैसे मांगने की शर्त',
        'व्हाट्सएप पर अमिताभ बच्चन या अधिकारियों के फर्जी फोटो और रिकॉर्डेड ऑडियो',
      ]),
      safeActionsHi: JSON.stringify([
        'सीधा नियम याद रखें: जिस प्रतियोगिता में आपने भाग नहीं लिया, उसमें आप कभी नहीं जीत सकते',
        'कोई भी असली लॉटरी या कंपनी ईनाम देने के लिए पहले पैसे जमा करने को नहीं कहती',
        'ऐसे संदेश आने पर बिना किसी को बताए तुरंत नंबर को ब्लॉक और रिपोर्ट करें',
      ]),
      victimGuidanceHi: JSON.stringify([
        'तुरंत 1930 पर कॉल करके ठग के खाते और नंबर की शिकायत करें',
        'cybercrime.gov.in पर स्क्रीनशॉट के साथ रिपोर्ट दर्ज करें',
      ]),
      // Marathi
      titleMr: 'बनावट लॉटरी, केबीसी आणि लकी ड्रॉ बक्षीस फसवणूक',
      definitionMr: 'व्हॉट्सअॅपवर बनावट मेसेज किंवा ऑडिओ पाठवून तुमच्या नंबरला २५ लाख रुपयांची लॉटरी लागल्याचे खोटे सांगणे.',
      howItWorksMr: 'व्हॉट्सअॅपवर मेसेज येतो की तुमच्या सिम कार्डला २५ लाखांचे बक्षीस लागले आहे. बक्षीस मिळवण्यासाठी आधी फाईल चार्ज किंवा टॅक्स म्हणून ₹१२,००० भरावे लागतील असे सांगितले जाते. पैसे भरताच भामटा फोन बंद करतो.',
      fictionalExampleMr: 'सुरेशरावांना २५ लाखांच्या लॉटरीचा मेसेज आला. त्यांनी संपर्क केल्यावर ₹२५,००० टॅक्स भरण्यास सांगितले गेले. सुरेशरावांनी पैसे भरले आणि त्यानंतर कॉलरचा फोन नॉट रिचेबल झाला.',
      warningSignsMr: JSON.stringify([
        'ज्या स्पर्धेत भागच घेतला नाही त्यामध्ये लॉटरी लागल्याचा मेसेज येणे',
        'बक्षीस मिळवण्यासाठी आधी टॅक्स किंवा प्रोसेसिंग फी मागणे',
        'व्हॉट्सअॅपवर बनावट धनादेशाचे (Cheque) फोटो पाठवणे',
      ]),
      safeActionsMr: JSON.stringify([
        'ज्या स्पर्धेत भाग घेतला नाही त्यात कोणीही जिंकू शकत नाही',
        'बक्षीस देण्यासाठी आधी पैसे भरण्यास सांगणे म्हणजे निव्वळ फसवणूक',
        'असा मेसेज आल्यास तात्काळ नंबर ब्लॉक करा',
      ]),
      victimGuidanceMr: JSON.stringify([
        '१९३० या हेल्पलाईनवर तात्काळ तक्रार करा',
        'cybercrime.gov.in वर स्क्रीनशॉटसह तक्रार दाखल करा',
      ]),
      relatedSlugs: JSON.stringify(['part-time-job-scam']),
    },
    {
      slug: 'fake-customer-care',
      categorySlug: 'banking-fraud',
      severity: 'high',
      tags: JSON.stringify(['Google Search', 'Helpline', 'Toll Free', 'Customer Support']),
      order: 10,
      // English
      titleEn: 'Fake Customer Care Numbers on Google Search',
      definitionEn: 'Fraudsters post their personal mobile numbers as official helpline numbers of banks, Swiggy, electricity boards, or courier companies on Google Maps and search results.',
      howItWorksEn: 'When an order fails or bank transaction is delayed, people search Google for "SBI Customer Care Number" or "PhonePe Helpline". Fraudsters create fake websites and Google Maps listings with their numbers. When called, the fake agent says: "Download this app or send ₹10 via UPI to verify your refund." That ₹10 transaction drains thousands from the account.',
      fictionalExampleEn: 'Radha wanted to refund a wrong train ticket. She googled "IRCTC Helpline" and dialed the top number. The fake agent sent a link and asked her to enter UPI PIN to get the refund. ₹15,000 was debited instead.',
      warningSignsEn: JSON.stringify([
        'Helpline numbers starting with regular 10-digit mobile numbers (e.g., 98xx, 87xx, 70xx) instead of official 1800 toll-free codes',
        'Customer care agent asking for UPI PIN, OTP, or remote screen app download',
        'Agent asking you to pay ₹1, ₹5, or ₹10 to initiate a refund',
      ]),
      safeActionsEn: JSON.stringify([
        'NEVER search for customer service numbers on Google Search or Google Maps',
        'Always get helpline numbers from the official app itself (Profile > Help & Support) or the back of your ATM card',
        'Official customer care never asks for money or UPI PIN to process a refund',
      ]),
      victimGuidanceEn: JSON.stringify([
        'Immediately call 1930 to freeze the stolen funds',
        'Report the fraudulent phone number on the DoT Sanchar Saathi Chakshu portal',
      ]),
      // Hindi
      titleHi: 'गूगल सर्च पर फर्जी कस्टमर केयर और हेल्पलाइन नंबर',
      definitionHi: 'ठग गूगल सर्च और गूगल मैप्स पर बैंकों, गैस कंपनियों या कूरियर कंपनियों के नाम से अपने फर्जी मोबाइल नंबर डाल देते हैं।',
      howItWorksHi: 'जब किसी का पेमेंट फंसता है या कूरियर नहीं आता, तो लोग गूगल पर "बैंक कस्टमर केयर नंबर" सर्च करते हैं। सबसे ऊपर ठग का नंबर दिखाई देता है। कॉल करने पर वह कहता है: "रिफंड चालू करने के लिए इस लिंक पर क्लिक करके ₹5 या ₹10 का भुगतान करें या ऐप डाउनलोड करें।" ऐसा करते ही बैंक खाता खाली हो जाता है।',
      fictionalExampleHi: 'राधा जी का ट्रेन का टिकट कैंसिल नहीं हो रहा था। उन्होंने गूगल पर सर्च करके "IRCTC हेल्पलाइन" पर फोन किया। ठग ने कहा कि ₹10 का टेस्ट पेमेंट करें तभी रिफंड आएगा। राधा जी ने पिन डाला और उनके खाते से ₹15,000 कट गए।',
      warningSignsHi: JSON.stringify([
        'कस्टमर केयर का नंबर 1800 (टोल फ्री) के बजाय सामान्य 10 अंकों का मोबाइल नंबर होना',
        'कस्टमर सपोर्ट द्वारा रिफंड देने के लिए ₹5-₹10 का ट्रांजेक्शन करने या पिन डालने को कहना',
        'हेल्पलाइन एजेंट द्वारा AnyDesk या QuickSupport ऐप डाउनलोड करने का दबाव डालना',
      ]),
      safeActionsHi: JSON.stringify([
        'गूगल सर्च या गूगल मैप्स पर कभी भी कस्टमर केयर का नंबर न खोजें',
        'हमेशा आधिकारिक ऐप (जैसे PhonePe, YONO SBI) के अंदर जाकर "Help & Support" से ही संपर्क करें',
        'एटीएम कार्ड के पीछे लिखे टोल-फ्री 1800 नंबर पर ही कॉल करें',
      ]),
      victimGuidanceHi: JSON.stringify([
        'तुरंत 1930 हेल्पलाइन पर कॉल करें',
        'संचार साथी चक्षु (Chakshu) पोर्टल पर फर्जी नंबर की रिपोर्ट दर्ज करें',
      ]),
      // Marathi
      titleMr: 'गुगल सर्चवरील बनावट कस्टमर केअर नंबर',
      definitionMr: 'भामटे गुगलवर आणि गुगल मॅप्सवर बँका, वीज वितरण किंवा गॅस कंपन्यांचे बनावट कस्टमर केअर नंबर टाकून ठेवतात.',
      howItWorksMr: 'अडचण आल्यावर लोक गुगलवर "बँक कस्टमर केअर" शोधतात. भामट्याचा नंबर लागतो. तो सांगतो: "रिफंडसाठी ₹१० पाठवा किंवा AnyDesk डाऊनलोड करा." असे करताच बँक खात्यातील पैसे लंपास होतात.',
      fictionalExampleMr: 'राधाताईंनी रेल्वे तिकिटाच्या अडचणीसाठी गुगलवरून IRCTC चा नंबर शोधला. कॉलरने ₹१० ट्रान्सफर करायला लावून पिन मागितला आणि खात्यातील ₹१५,००० काढून घेतले.',
      warningSignsMr: JSON.stringify([
        'कस्टमर केअर नंबर १८०० ऐवजी १० अंकी सामान्य मोबाईल नंबर असणे',
        'रिफंड मिळवण्यासाठी पैसे पाठवण्यास किंवा पिन टाकण्यास सांगणे',
      ]),
      safeActionsMr: JSON.stringify([
        'गुगलवर कधीही कस्टमर केअर नंबर शोधू नका',
        'नेहमी अधिकृत अॅपमधील "Help" पर्यायाचा किंवा एटीएम कार्डच्या पाठीमागील नंबरचा वापर करा',
      ]),
      victimGuidanceMr: JSON.stringify([
        'ताबडतोब १९३० हेल्पलाइनवर तक्रार करा',
        'चक्षू (Chakshu) पोर्टलवर त्या नंबरची तक्रार नोंदवा',
      ]),
      relatedSlugs: JSON.stringify(['screen-sharing-fraud', 'upi-collect-request']),
    },
    {
      slug: 'whatsapp-impersonation',
      categorySlug: 'social-media',
      severity: 'high',
      tags: JSON.stringify(['WhatsApp', 'Relative', 'Emergency', 'DP Scam']),
      order: 11,
      // English
      titleEn: 'WhatsApp Impersonation & Relative Emergency Scam',
      definitionEn: 'Fraudsters steal a friend’s or relative’s profile photo and send urgent WhatsApp messages begging for emergency medical money from a new number.',
      howItWorksEn: 'The scammer puts your brother’s, nephew’s, or village sarpanch’s photo on WhatsApp. They message: "Hi uncle, I changed my number. I am in the hospital / my bike met with an accident. Please transfer ₹10,000 urgently to this QR code. I will return it tomorrow." Out of love and panic, people send the money without verifying.',
      fictionalExampleEn: 'Kishan received a WhatsApp text with his son’s photo: "Papa, my phone fell into water, this is a friend’s number. My college fee deadline is in 30 minutes, please send ₹15,000 urgently to this UPI." Kishan sent the money without calling his son’s original number.',
      warningSignsEn: JSON.stringify([
        'Message from an unknown number claiming to be a close friend or relative',
        'Desperate urgency regarding hospitalization, police custody, or urgent fees',
        'Making excuses for why they cannot speak on a normal voice call',
      ]),
      safeActionsEn: JSON.stringify([
        'ALWAYS call your friend or relative on their original, known phone number before transferring any money',
        'Never send emergency funds purely based on a WhatsApp text or photo',
        'Ask personal questions that only the real person would know to verify their identity',
      ]),
      victimGuidanceEn: JSON.stringify([
        'Report to 1930 Cybercrime Helpline',
        'Report and block the fraudulent WhatsApp profile within WhatsApp',
      ]),
      // Hindi
      titleHi: 'व्हाट्सएप पर रिश्तेदार बनकर इमरजेंसी पैसे मांगने का फ्रॉड',
      definitionHi: 'ठग आपके बेटे, भाई या किसी रिश्तेदार की फोटो व्हाट्सएप डीपी पर लगाकर नए नंबर से मैसेज करते हैं कि वे अस्पताल में हैं और तुरंत पैसे चाहिए।',
      howItWorksHi: 'ठग सोशल मीडिया से आपके रिश्तेदार की फोटो डाउनलोड कर नए नंबर पर लगाता है। फिर मैसेज भेजता है: "नमस्ते चाचाजी, यह मेरा नया नंबर है। मेरा एक्सीडेंट हो गया है या दोस्त अस्पताल में है। तुरंत इस यूपीआई पर ₹10,000 भेजें, मैं शाम को लौटा दूंगा।" घबराहट में लोग बिना असली नंबर पर कॉल किए पैसे भेज देते हैं।',
      fictionalExampleHi: 'किशन लाल जी को व्हाट्सएप पर बेटे की फोटो वाले नए नंबर से मैसेज आया: "पापा, मेरा पुराना फोन खराब हो गया है। मुझे कॉलेज फीस के लिए तुरंत ₹15,000 चाहिए, इस नंबर पर भेज दीजिए।" किशन लाल जी ने घबराकर पैसे भेज दिए। बाद में पता चला कि बेटा तो हॉस्टल में आराम से पढ़ रहा था।',
      warningSignsHi: JSON.stringify([
        'किसी नए अनजान नंबर से खुद को रिश्तेदार बताकर मैसेज आना',
        'अस्पताल, पुलिस केस या तुरंत फीस भरने की झूठी इमरजेंसी का हवाला देना',
        'फोन पर बात करने से बचना और केवल व्हाट्सएप चैट पर बात करना',
      ]),
      safeActionsHi: JSON.stringify([
        'पैसे भेजने से पहले हमेशा उस रिश्तेदार के पुराने असली नंबर पर कॉल करके पुष्टि करें',
        'केवल व्हाट्सएप डीपी में फोटो देखकर किसी को सच मानकर पैसे न भेजें',
        'कोई ऐसा सवाल पूछें जिसका जवाब केवल आपका असली रिश्तेदार ही जानता हो',
      ]),
      victimGuidanceHi: JSON.stringify([
        'तुरंत 1930 पर कॉल करके यूपीआई ट्रांजेक्शन रोकने का प्रयास करें',
        'व्हाट्सएप पर उस प्रोफाइल को "Report & Block" करें',
      ]),
      // Marathi
      titleMr: 'व्हॉट्सअॅपवर नातेवाईक असल्याचे भासवून आपत्कालीन पैशांची मागणी',
      definitionMr: 'भामटे तुमच्या नातेवाईकाचा फोटो व्हॉट्सअॅप डीपीवर लावून नव्या नंबरवरून मेसेज करतात की तातडीने दवाखान्यासाठी पैसे हवे आहेत.',
      howItWorksMr: 'नवीन नंबरवरून मेसेज येतो: "काका, माझा फोन खराब झाला आहे, मी अडचणीत आहे. या नंबरवर ₹१०,००० पाठवा." लोक न तपासता प्रेमापोटी पैसे पाठवतात आणि फसवणूक होते.',
      fictionalExampleMr: 'किशनरावांना मुलाचा फोटो असलेल्या अनोळखी नंबरवरून मेसेज आला: "बाबा, कॉलेज फीसाठी ₹१५,००० लगेच पाठवा." न तपासता पैसे पाठवल्यावर समजले की मुलाने असा कोणताही मेसेज पाठवला नव्हता.',
      warningSignsMr: JSON.stringify([
        'नवीन नंबरवरून जवळच्या नातेवाईकाचा फोटो लावून मेसेज येणे',
        'दवाखान्याची किंवा संकटाची भीती दाखवून घाई करणे',
        'व्हॉईस कॉल न घेता फक्त चॅटिंग करणे',
      ]),
      safeActionsMr: JSON.stringify([
        'पैसे पाठवण्यापूर्वी नातेवाईकाच्या जुन्या मोबाईल नंबरवर थेट कॉल करून खात्री करा',
        'फक्त फोटो पाहून कोणावरही विश्वास ठेवू नका',
      ]),
      victimGuidanceMr: JSON.stringify([
        'ताबडतोब १९३० वर सायबर तक्रार करा',
        'व्हॉट्सअॅपवर तो नंबर ब्लॉक आणि रिपोर्ट करा',
      ]),
      relatedSlugs: JSON.stringify(['upi-collect-request']),
    },
  ];

  for (const t of topicsData) {
    const categoryId = categoryMap.get(t.categorySlug);
    if (!categoryId) continue;
    await prisma.topic.create({
      data: {
        slug: t.slug,
        categoryId: categoryId,
        severity: t.severity,
        tags: t.tags,
        order: t.order,
        titleEn: t.titleEn,
        definitionEn: t.definitionEn,
        howItWorksEn: t.howItWorksEn,
        fictionalExampleEn: t.fictionalExampleEn,
        warningSignsEn: t.warningSignsEn,
        safeActionsEn: t.safeActionsEn,
        victimGuidanceEn: t.victimGuidanceEn,
        titleHi: t.titleHi,
        definitionHi: t.definitionHi,
        howItWorksHi: t.howItWorksHi,
        fictionalExampleHi: t.fictionalExampleHi,
        warningSignsHi: t.warningSignsHi,
        safeActionsHi: t.safeActionsHi,
        victimGuidanceHi: t.victimGuidanceHi,
        titleMr: t.titleMr,
        definitionMr: t.definitionMr,
        howItWorksMr: t.howItWorksMr,
        fictionalExampleMr: t.fictionalExampleMr,
        warningSignsMr: t.warningSignsMr,
        safeActionsMr: t.safeActionsMr,
        victimGuidanceMr: t.victimGuidanceMr,
        relatedSlugs: t.relatedSlugs,
      },
    });
  }
  console.log(`📚 Seeded ${topicsData.length} comprehensive fraud topics with tri-lingual content.`);

  // 5. Seed Realistic Safe vs Unsafe Scenarios (Module E)
  const scenariosData = [
    {
      titleEn: 'Caller Claiming to be Bank Manager Asking for OTP',
      titleHi: 'बैंक मैनेजर बनकर फोन पर ओटीपी पूछना',
      titleMr: 'बँक अधिकारी असल्याचे सांगून ओटीपी मागणे',
      contextEn: 'You receive an urgent call from an unknown 10-digit number.',
      contextHi: 'आपको एक अनजान 10 अंकों के मोबाइल नंबर से जरूरी कॉल आता है।',
      contextMr: 'तुम्हाला एका अनोळखी १० अंकी मोबाईल नंबरवरून कॉल येतो.',
      scenarioTextEn: 'The caller says: "Your ATM card will be blocked in 10 minutes. Tell me the 6-digit OTP sent to your phone right now to keep it active." You read out the OTP to him.',
      scenarioTextHi: 'कॉलर कहता है: "आपका एटीएम कार्ड 10 मिनट में बंद हो जाएगा। इसे चालू रखने के लिए अपने फोन पर आया 6 अंकों का OTP मुझे बताएं।" आप उसे OTP बता देते हैं।',
      scenarioTextMr: 'कॉलर सांगतो: "तुमचे एटीएम १० मिनिटात बंद होईल. ते चालू ठेवण्यासाठी आलेला ६ अंकी OTP सांगा." तुम्ही त्याला OTP सांगता.',
      isSafe: false,
      explanationEn: 'UNSAFE! Banks never ask for OTPs or PINs over the phone. Reading out the OTP gives the fraudster authorization to withdraw your money.',
      explanationHi: 'असुरक्षित (UNSAFE)! बैंक कभी भी फोन पर OTP नहीं मांगता। OTP बताते ही ठग आपके खाते से पैसे निकाल लेता है।',
      explanationMr: 'धोकादायक (UNSAFE)! बँक कधीही फोनवर OTP मागत नाही. OTP दिल्यास खात्यातील पैसे चोरीला जातात.',
      recommendationEn: 'Disconnect the call immediately and visit your local bank branch. Never share OTPs with anyone.',
      recommendationHi: 'तुरंत फोन काट दें और अपनी बैंक शाखा में जाएं। किसी के साथ भी कभी OTP शेयर न करें।',
      recommendationMr: 'लगेच फोन कट करा आणि बँकेच्या शाखेत जा. कोणालाही OTP देऊ नका.',
      relatedTopicSlug: 'fake-bank-calls',
      order: 1,
    },
    {
      titleEn: 'Entering UPI PIN to Receive Money on PhonePe',
      titleHi: 'पैसे प्राप्त करने के लिए फोनपे पर यूपीआई पिन डालना',
      titleMr: 'पैसे मिळवण्यासाठी फोनपे वर यूपीआय पिन टाकणे',
      contextEn: 'Someone is buying your farm goods online and sending money via UPI.',
      contextHi: 'कोई व्यक्ति आपका सामान खरीद रहा है और यूपीआई से पैसे भेज रहा है।',
      contextMr: 'कोणीतरी तुमचा शेतीमाल खरेदी करून यूपीआय द्वारे पैसे पाठवत आहे.',
      scenarioTextEn: 'The buyer says: "I sent a PhonePe request of ₹10,000. Open the app and enter your UPI PIN to accept the payment into your bank."',
      scenarioTextHi: 'खरीदार कहता है: "मैंने ₹10,000 की फोनपे रिक्वेस्ट भेजी है। ऐप खोलकर अपना यूपीआई पिन डालें ताकि पैसे आपके खाते में आ जाएं।"',
      scenarioTextMr: 'खरेदीदार सांगतो: "मी ₹१०,००० ची फोनपे रिक्वेस्ट पाठवली आहे. अॅप उघडून यूपीआय पिन टाका म्हणजे पैसे जमा होतील."',
      isSafe: false,
      explanationEn: 'UNSAFE! UPI PIN is ONLY entered to SEND money. When receiving money, it directly deposits into your account without entering any PIN.',
      explanationHi: 'असुरक्षित (UNSAFE)! यूपीआई पिन केवल पैसे भेजने के लिए डाला जाता है। पैसे मिलने पर पिन डालने की कोई जरूरत नहीं होती।',
      explanationMr: 'धोकादायक (UNSAFE)! UPI पिन फक्त पैसे पाठवण्यासाठी असतो. पैसे स्वीकारण्यासाठी पिनची अजिबात गरज नसते.',
      recommendationEn: 'Decline the request immediately. Remember: PIN = Paying money out.',
      recommendationHi: 'रिक्वेस्ट को तुरंत Decline (खारिज) करें। याद रखें: पिन डालना = पैसे गंवाना।',
      recommendationMr: 'ती विनंती लगेच Decline करा. लक्षात ठेवा: पिन टाकणे = पैसे वजा होणे.',
      relatedTopicSlug: 'upi-collect-request',
      order: 2,
    },
    {
      titleEn: 'Verifying Customer Care Number on Official Bank App',
      titleHi: 'आधिकारिक बैंक ऐप से कस्टमर केयर नंबर देखना',
      titleMr: 'बँकेच्या अधिकृत अॅपमधून कस्टमर केअर नंबर तपासणे',
      contextEn: 'Your transaction failed and money was debited.',
      contextHi: 'आपका ट्रांजेक्शन फेल हो गया और खाते से पैसे कट गए।',
      contextMr: 'तुमचा व्यवहार अयशस्वी झाला आणि पैसे खात्यातून वजा झाले.',
      scenarioTextEn: 'Instead of searching Google, you open your official SBI YONO app, go to Help & Support, and call the verified 1800 toll-free number displayed inside.',
      scenarioTextHi: 'गूगल पर सर्च करने के बजाय, आप अपना आधिकारिक SBI YONO ऐप खोलते हैं, हेल्प सेक्शन में जाते हैं और वहां लिखे 1800 टोल फ्री नंबर पर कॉल करते हैं।',
      scenarioTextMr: 'गुगलवर शोधण्याऐवजी तुम्ही बँकेचे अधिकृत अॅप उघडून त्यातील Help मधील १८०० टोल फ्री नंबरवर संपर्क साधता.',
      isSafe: true,
      explanationEn: 'SAFE! Always obtain customer care details directly from the official banking app or the physical ATM card.',
      explanationHi: 'सुरक्षित (SAFE)! हमेशा केवल आधिकारिक बैंकिंग ऐप या एटीएम कार्ड के पीछे लिखे नंबर से ही संपर्क करें।',
      explanationMr: 'सुरक्षित (SAFE)! नेहमी अधिकृत अॅपमधून किंवा एटीएम कार्डच्या मागूनच नंबर मिळवा.',
      recommendationEn: 'Continue this safe practice. Never trust phone numbers found on Google search or WhatsApp.',
      recommendationHi: 'यह सबसे सुरक्षित तरीका है। गूगल सर्च या व्हाट्सएप पर मिले नंबरों पर कभी भरोसा न करें।',
      recommendationMr: 'नेहमी हीच पद्धत वापरा. गुगलवरील अनोळखी नंबरवर विश्वास ठेवू नका.',
      relatedTopicSlug: 'fake-customer-care',
      order: 3,
    },
    {
      titleEn: 'Installing APK Sent on WhatsApp Disguised as Wedding Card',
      titleHi: 'व्हाट्सएप पर शादी के कार्ड के नाम से आई APK फाइल इंस्टॉल करना',
      titleMr: 'लग्नाच्या पत्रिकेच्या नावाखाली व्हॉट्सअॅपवर आलेली APK फाईल डाऊनलोड करणे',
      contextEn: 'You receive a file ending in .apk on WhatsApp.',
      contextHi: 'आपको व्हाट्सएप पर .apk फाइल प्राप्त होती है।',
      contextMr: 'तुम्हाला व्हॉट्सअॅपवर .apk असलेली फाईल मिळते.',
      scenarioTextEn: 'An unknown number sends a file named "Wedding_Invitation.apk". You click on it, enable unknown app permissions, and install it on your Android phone.',
      scenarioTextHi: 'एक अनजान नंबर से "Wedding_Invitation.apk" नाम की फाइल आती है। आप उस पर क्लिक करके फोन में Unknown Sources ऑन करके इंस्टॉल कर लेते हैं।',
      scenarioTextMr: 'अनोळखी नंबरवरून "Wedding_Invitation.apk" फाईल येते. तुम्ही परमिशन देऊन ती फोनमध्ये इन्स्टॉल करता.',
      isSafe: false,
      explanationEn: 'UNSAFE! This is Android malware. Real invitation cards are photos or PDFs, never APK applications. It secretly steals your bank OTPs.',
      explanationHi: 'असुरक्षित (UNSAFE)! यह खतरनाक वायरस ऐप है। शादी का कार्ड कभी भी APK नहीं होता। यह आपके बैंक के सारे OTP चुरा लेता है।',
      explanationMr: 'धोकादायक (UNSAFE)! हा व्हायरस आहे. लग्नाची पत्रिका कधीही अॅप नसते. हे अॅप तुमचे ओटीपी चोरते.',
      recommendationEn: 'Never install APK files received on WhatsApp. Only download apps from Google Play Store.',
      recommendationHi: 'व्हाट्सएप पर आई किसी भी APK फाइल को इंस्टॉल न करें। केवल गूगल प्ले स्टोर का उपयोग करें।',
      recommendationMr: 'व्हॉट्सअॅपवरील APK फाईल्स इन्स्टॉल करू नका. फक्त गुगल प्ले स्टोअर वापरा.',
      relatedTopicSlug: 'malicious-apk-download',
      order: 4,
    },
    {
      titleEn: 'Refusing AnyDesk App Download for Refund Assistance',
      titleHi: 'रिफंड के लिए AnyDesk ऐप डाउनलोड करने से मना करना',
      titleMr: 'रिफंडसाठी AnyDesk अॅप डाऊनलोड करण्यास नकार देणे',
      contextEn: 'A caller claiming to be an online shopping representative offers help.',
      contextHi: 'ऑनलाइन शॉपिंग का प्रतिनिधि बनकर एक व्यक्ति मदद की पेशकश करता है।',
      contextMr: 'ऑनलाइन शॉपिंग प्रतिनिधी असल्याचा दावा करणारा व्यक्ती मदत करण्याचे सांगतो.',
      scenarioTextEn: 'The caller asks you to install AnyDesk or QuickSupport to credit your ₹500 refund. You refuse, hang up the call, and report the number on Chakshu portal.',
      scenarioTextHi: 'कॉलर कहता है कि ₹500 का रिफंड देने के लिए AnyDesk या QuickSupport ऐप डालें। आप साफ मना कर देते हैं, फोन काटते हैं और चक्षु पोर्टल पर रिपोर्ट करते हैं।',
      scenarioTextMr: 'कॉलर ₹५०० रिफंडसाठी AnyDesk डाऊनलोड करायला सांगतो. तुम्ही स्पष्ट नकार देऊन फोन कट करता आणि तक्रार नोंदवता.',
      isSafe: true,
      explanationEn: 'SAFE! You protected your phone and savings. Screen sharing apps allow fraudsters to view your passwords live.',
      explanationHi: 'सुरक्षित (SAFE)! आपने अपनी मेहनत की कमाई बचा ली। स्क्रीन शेयरिंग ऐप से ठग लाइव पासवर्ड देख लेते हैं।',
      explanationMr: 'सुरक्षित (SAFE)! तुम्ही तुमचे पैसे वाचवले. स्क्रीन शेअरिंग अॅप्समुळे पासवर्ड चोरट्यांना थेट दिसतात.',
      recommendationEn: 'Always say NO to any caller asking for screen-sharing or remote-control apps.',
      recommendationHi: 'स्क्रीन शेयरिंग ऐप के लिए हमेशा सख्ती से मना करें।',
      recommendationMr: 'स्क्रीन शेअरिंग अॅप्स डाऊनलोड करण्यास नेहमी नकार द्या.',
      relatedTopicSlug: 'screen-sharing-fraud',
      order: 5,
    },
  ];

  for (const s of scenariosData) {
    await prisma.scenario.create({ data: s });
  }
  console.log(`🧩 Seeded ${scenariosData.length} interactive safe vs unsafe scenarios.`);

  // 6. Seed Quizzes & Questions (Beginner, Intermediate, Advanced)
  const quizzesData = [
    {
      slug: 'quiz-beginner',
      titleEn: 'Beginner Cyber Safety Quiz',
      titleHi: 'शुरुआती साइबर सुरक्षा प्रश्नोत्तरी',
      titleMr: 'नवशिक्या सायबर सुरक्षा प्रश्नमंजुषा',
      descriptionEn: 'Test your fundamental knowledge about UPI PIN, OTPs, and phone calls.',
      descriptionHi: 'यूपीआई पिन, ओटीपी और फोन कॉल की बुनियादी सुरक्षा की जांच करें।',
      descriptionMr: 'यूपीआय पिन, ओटीपी आणि फोन कॉल्सच्या मूलभूत सुरक्षेची चाचणी घ्या.',
      difficulty: 'beginner',
      questions: [
        {
          order: 1,
          difficulty: 'beginner',
          points: 10,
          questionEn: 'When do you need to enter your secret UPI PIN in PhonePe, Google Pay, or Paytm?',
          questionHi: 'फोनपे, गूगल पे या पेटीएम में अपना गुप्त UPI PIN कब डालना पड़ता है?',
          questionMr: 'फोनपे, गुगल पे किंवा पेटीएम मध्ये आपला गुप्त UPI PIN कधी टाकावा लागतो?',
          explanationEn: 'UPI PIN is strictly required to SEND/DEBIT money from your bank account. You NEVER enter a PIN to receive money or get cashback.',
          explanationHi: 'यूपीआई पिन केवल आपके खाते से पैसे भेजने (कटवाने) के लिए जरूरी होता है। पैसे पाने या कैशबैक के लिए कभी पिन नहीं डाला जाता।',
          explanationMr: 'UPI PIN फक्त स्वतःच्या खात्यातून पैसे पाठवण्यासाठी असतो. पैसे स्वीकारण्यासाठी किंवा कॅशबॅकसाठी कधीही पिन लागत नाही.',
          options: [
            { textEn: 'Only when sending (transferring) money from your account', textHi: 'केवल जब आप अपने खाते से किसी को पैसे भेज रहे हों', textMr: 'फक्त जेव्हा तुम्ही स्वतःच्या खात्यातून पैसे पाठवत असता', isCorrect: true },
            { textEn: 'Both for sending and receiving money', textHi: 'पैसे भेजने और पैसे पाने दोनों समय', textMr: 'पैसे पाठवताना आणि स्वीकारताना दोन्ही वेळेस', isCorrect: false },
            { textEn: 'Only when someone sends you a lottery or cashback', textHi: 'जब कोई आपको लॉटरी या कैशबैक भेजता है', textMr: 'जेव्हा कोणी बक्षीस किंवा कॅशबॅक पाठवत असेल', isCorrect: false },
            { textEn: 'To check the weather forecast', textHi: 'मौसम की जानकारी देखने के लिए', textMr: 'हवामानाचा अंदाज पाहण्यासाठी', isCorrect: false },
          ],
        },
        {
          order: 2,
          difficulty: 'beginner',
          points: 10,
          questionEn: 'If a bank manager calls asking for your 6-digit OTP to prevent account blocking, what should you do?',
          questionHi: 'यदि बैंक मैनेजर बनकर कोई फोन पर आपका 6 अंकों का OTP मांगे ताकि खाता बंद न हो, तो क्या करना चाहिए?',
          questionMr: 'बँक मॅनेजर असल्याचे सांगून कोणी खाते बंद होऊ नये म्हणून ६ अंकी OTP मागितल्यास काय करावे?',
          explanationEn: 'Real bank officials never ask for OTPs over phone calls. Disconnect immediately and never share your OTP with anyone.',
          explanationHi: 'असली बैंक कर्मचारी फोन पर कभी भी OTP नहीं मांगते। तुरंत फोन काटें और किसी से भी OTP शेयर न करें।',
          explanationMr: 'बँक कर्मचारी कधीही फोनवर OTP मागत नाहीत. लगेच फोन कट करा आणि कोणालाही OTP सांगू नका.',
          options: [
            { textEn: 'Never share the OTP, immediately disconnect the call', textHi: 'OTP कभी न बताएं, तुरंत फोन काट दें', textMr: 'कधीही OTP सांगू नका, तात्काळ फोन कट करा', isCorrect: true },
            { textEn: 'Quickly tell the OTP so your bank account stays active', textHi: 'तुरंत OTP बता दें ताकि खाता चालू रहे', textMr: 'खाते चालू राहण्यासाठी लगेच OTP सांगा', isCorrect: false },
            { textEn: 'Send the OTP via SMS to the caller', textHi: 'SMS के जरिए कॉलर को OTP भेज दें', textMr: 'त्या नंबरवर मेसेजने OTP पाठवा', isCorrect: false },
            { textEn: 'Share only the first 3 digits', textHi: 'केवल पहले 3 अंक बताएं', textMr: 'फक्त पहिले ३ अंक सांगा', isCorrect: false },
          ],
        },
        {
          order: 3,
          difficulty: 'beginner',
          points: 10,
          questionEn: 'What is the official National Cybercrime Helpline number in India?',
          questionHi: 'भारत में आधिकारिक राष्ट्रीय साइबर क्राइम हेल्पलाइन नंबर क्या है?',
          questionMr: 'भारतात अधिकृत राष्ट्रीय सायबर क्राईम हेल्पलाइन नंबर कोणता आहे?',
          explanationEn: '1930 is the dedicated 24x7 National Cybercrime Reporting toll-free helpline number in India.',
          explanationHi: '1930 भारत सरकार का 24x7 राष्ट्रीय साइबर अपराध हेल्पलाइन नंबर है।',
          explanationMr: '१९३० हा भारत सरकारचा अधिकृत राष्ट्रीय सायबर क्राईम हेल्पलाइन क्रमांक आहे.',
          options: [
            { textEn: '1930', textHi: '1930', textMr: '१९३०', isCorrect: true },
            { textEn: '100', textHi: '100', textMr: '१००', isCorrect: false },
            { textEn: '108', textHi: '108', textMr: '१०८', isCorrect: false },
            { textEn: '1947', textHi: '1947', textMr: '१९४७', isCorrect: false },
          ],
        },
      ],
    },
    {
      slug: 'quiz-intermediate',
      titleEn: 'Intermediate Digital Fraud Quiz',
      titleHi: 'मध्यम स्तर डिजिटल फ्रॉड प्रश्नोत्तरी',
      titleMr: 'मध्यम स्तर डिजिटल फसवणूक प्रश्नमंजुषा',
      descriptionEn: 'Test your ability to spot QR code traps, malicious APKs, and fake jobs.',
      descriptionHi: 'क्यूआर कोड, फर्जी एपीके फाइल और नौकरी घोटालों को पहचानने की क्षमता परखें।',
      descriptionMr: 'क्यूआर कोड, घातक एपीके फाईल्स आणि बनावट नोकरीचे आमिष ओळखण्याची चाचणी.',
      difficulty: 'intermediate',
      questions: [
        {
          order: 1,
          difficulty: 'intermediate',
          points: 15,
          questionEn: 'You receive a file named "Wedding_Card.apk" from an unknown number on WhatsApp. What is the safest action?',
          questionHi: 'व्हाट्सएप पर किसी अनजान नंबर से "Wedding_Card.apk" फाइल आती है। सबसे सुरक्षित कदम क्या है?',
          questionMr: 'व्हॉट्सअॅपवर अनोळखी नंबरवरून "Wedding_Card.apk" फाईल आल्यास सर्वात सुरक्षित कृती कोणती?',
          explanationEn: 'An .apk file is an executable Android app capable of installing malware. Real invitation cards are photos (.jpg) or PDFs. Never install unknown APK files.',
          explanationHi: '.apk फाइल एक एप्लिकेशन होती है जो फोन का डेटा चुरा सकती है। शादी का कार्ड हमेशा फोटो या पीडीएफ होता है। इसे कभी भी इंस्टॉल न करें।',
          explanationMr: '.apk ही फाईल म्हणजे एक अॅप असते जे बँक डेटा चोरू शकते. लग्नाची पत्रिका फोटो किंवा पीडीएफ असते. हे अॅप कधीही इन्स्टॉल करू नका.',
          options: [
            { textEn: 'Delete the file immediately without opening or installing it', textHi: 'बिना खोले या इंस्टॉल किए फाइल को तुरंत डिलीट कर दें', textMr: 'फाईल उघडून न बघता तात्काळ डिलीट करा', isCorrect: true },
            { textEn: 'Install it to see whose wedding it is', textHi: 'देखने के लिए इंस्टॉल करें कि किसकी शादी है', textMr: 'कोणाचे लग्न आहे हे बघण्यासाठी इन्स्टॉल करा', isCorrect: false },
            { textEn: 'Forward the file to 10 family members', textHi: 'फाइल को 10 रिश्तेदारों को फॉरवर्ड करें', textMr: '१० मित्रांना ती फाईल फॉरवर्ड करा', isCorrect: false },
            { textEn: 'Grant all permissions requested by the app', textHi: 'ऐप द्वारा मांगी गई सभी परमिशन दे दें', textMr: 'अॅपने मागितलेल्या सर्व परवानग्या द्या', isCorrect: false },
          ],
        },
        {
          order: 2,
          difficulty: 'intermediate',
          points: 15,
          questionEn: 'Someone calls claiming you won a ₹25 Lakh KBC lottery, but you must pay ₹15,000 processing fee first. What is the truth?',
          questionHi: 'फोन आता है कि आपने ₹25 लाख की केबीसी लॉटरी जीती है, लेकिन ईनाम लेने के लिए पहले ₹15,000 प्रोसेसिंग फीस भरनी होगी। सच क्या है?',
          questionMr: 'फोन येतो की तुम्हाला २५ लाखांची लॉटरी लागली आहे, पण बक्षीसासाठी आधी ₹१५,००० भरावे लागतील. खरे काय आहे?',
          explanationEn: 'This is 100% fraud. Real lotteries never require advance deposits to release prize money. You cannot win a contest you never entered.',
          explanationHi: 'यह 100% फ्रॉड है। कोई भी असली लॉटरी ईनाम देने से पहले पैसे जमा करने को नहीं कहती।',
          explanationMr: 'ही १००% फसवणूक आहे. कोणतीही अधिकृत कंपनी बक्षीस देण्यासाठी आधी पैसे मागत नाही.',
          options: [
            { textEn: 'It is a 100% scam; never pay any money', textHi: 'यह 100% फ्रॉड है; कभी कोई पैसा न दें', textMr: 'हा १००% घोटाळा आहे; कधीही पैसे भरू नका', isCorrect: true },
            { textEn: 'It is genuine because they promised ₹25 Lakhs', textHi: 'यह असली है क्योंकि उन्होंने ₹25 लाख का वादा किया है', textMr: 'हे खरे आहे कारण त्यांनी २५ लाखांचे आश्वासन दिले आहे', isCorrect: false },
            { textEn: 'Pay ₹5,000 and negotiate the rest', textHi: '₹5,000 देकर बाकी पर मोलभाव करें', textMr: '५,००० भरून उरलेल्या रकमेवर चर्चा करा', isCorrect: false },
            { textEn: 'Borrow money from neighbors to pay the fee', textHi: 'पड़ोसियों से उधार लेकर फीस भरें', textMr: 'पैसे उसने घेऊन फी भरा', isCorrect: false },
          ],
        },
      ],
    },
    {
      slug: 'quiz-advanced',
      titleEn: 'Advanced Cybercrime Defense Quiz',
      titleHi: 'विशेषज्ञ साइबर अपराध सुरक्षा प्रश्नोत्तरी',
      titleMr: 'प्रगत सायबर गुन्हा संरक्षण प्रश्नमंजुषा',
      descriptionEn: 'Master complex threats like Digital Arrest, screen-sharing apps, and evidence preservation.',
      descriptionHi: 'डिजिटल अरेस्ट, स्क्रीन शेयरिंग और कानूनी सबूत सुरक्षित रखने की गहरी समझ।',
      descriptionMr: 'डिजिटल अरेस्ट, स्क्रीन शेअरिंग आणि डिजिटल पुरावे सुरक्षित ठेवण्याची प्रगत माहिती.',
      difficulty: 'advanced',
      questions: [
        {
          order: 1,
          difficulty: 'advanced',
          points: 20,
          questionEn: 'A person on a WhatsApp video call in a police uniform claims you are under "Digital Arrest" and demands money. Is this legal under Indian law?',
          questionHi: 'व्हाट्सएप वीडियो कॉल पर पुलिस की वर्दी पहने व्यक्ति दावा करता है कि आप "डिजिटल अरेस्ट" हैं और पैसे मांगता है। क्या भारतीय कानून में यह वैध है?',
          questionMr: 'व्हॉट्सअॅप व्हिडिओ कॉलवर पोलीस गणवेशातील व्यक्ती दावा करते की तुम्ही "डिजिटल अरेस्ट" आहात आणि पैसे मागते. हे भारतीय कायद्यानुसार वैध आहे का?',
          explanationEn: 'There is NO provision of "Digital Arrest" in Indian law. Police and courts NEVER arrest or try citizens via video calls, nor do they demand money transfers.',
          explanationHi: 'भारतीय कानून में "डिजिटल अरेस्ट" का कोई प्रावधान नहीं है। पुलिस कभी भी वीडियो कॉल पर न तो गिरफ्तारी करती है और न ही पैसे मांगती है।',
          explanationMr: 'भारतीय कायद्यात "डिजिटल अरेस्ट" अशी कोणतीही तरतूद नाही. पोलीस कधीही व्हिडिओ कॉलवर अटक करत नाहीत किंवा पैसे मागत नाहीत.',
          options: [
            { textEn: 'NO! There is no "Digital Arrest" in Indian law; it is complete extortion', textHi: 'नहीं! भारतीय कानून में डिजिटल अरेस्ट नहीं होता; यह जबरन वसूली का फ्रॉड है', textMr: 'नाही! भारतीय कायद्यात अशी कोणतीही तरतूद नाही; ही खंडणीची फसवणूक आहे', isCorrect: true },
            { textEn: 'Yes, modern police use video calls for arrests', textHi: 'हाँ, आज की पुलिस वीडियो कॉल पर ही अरेस्ट करती है', textMr: 'होय, आजकाल पोलीस व्हिडिओ कॉलवर अटक करतात', isCorrect: false },
            { textEn: 'Only the Supreme Court can digitally arrest citizens', textHi: 'केवल सुप्रीम कोर्ट ही डिजिटल अरेस्ट कर सकता है', textMr: 'फक्त सुप्रीम कोर्ट डिजिटल अरेस्ट करू शकते', isCorrect: false },
            { textEn: 'You must pay whatever amount the officer demands', textHi: 'अधिकारी जितने पैसे मांगे तुरंत दे देने चाहिए', textMr: 'अधिकाऱ्याने मागितलेली रक्कम लगेच द्यावी', isCorrect: false },
          ],
        },
        {
          order: 2,
          difficulty: 'advanced',
          points: 20,
          questionEn: 'Why is reporting financial fraud on 1930 within the "Golden Hour" (first 1-2 hours) critical?',
          questionHi: 'पैसे कटने के 1-2 घंटे के भीतर (गोल्डन ऑवर) 1930 पर शिकायत दर्ज करना क्यों सबसे महत्वपूर्ण है?',
          questionMr: 'पैसे कापल्यास पहिल्या १-२ तासात (गोल्डन अवर) १९३० वर तक्रार नोंदवणे का सर्वात महत्त्वाचे आहे?',
          explanationEn: 'Reporting immediately allows the cyber police and bank nodal officers to freeze the stolen funds across intermediate accounts before the fraudsters withdraw it at an ATM.',
          explanationHi: 'तुरंत शिकायत करने से साइबर सेल और बैंक अधिकारी ठग के बैंक खाते को तुरंत फ्रीज (सील) कर देते हैं, जिससे पैसे एटीएम से निकलने से पहले बच जाते हैं।',
          explanationMr: 'लगेच तक्रार केल्याने पोलीस आणि बँक अधिकारी चोरट्यांचे खाते तात्काळ गोठवून (freeze) पैसे एटीएममधून काढण्यापूर्वी वाचवू शकतात.',
          options: [
            { textEn: 'It allows banks and cyber police to freeze the stolen funds before cash withdrawal', textHi: 'यह पुलिस और बैंक को पैसे एटीएम से निकलने से पहले ठग का खाता फ्रीज करने का मौका देता है', textMr: 'यामुळे भामट्यांनी पैसे काढण्यापूर्वी बँक खाते गोठवता (freeze) येते', isCorrect: true },
            { textEn: 'To get a cash reward from the government', textHi: 'सरकार से नकद ईनाम पाने के लिए', textMr: 'शासनाकडून बक्षीस मिळवण्यासाठी', isCorrect: false },
            { textEn: 'It automatically buys new insurance for the phone', textHi: 'यह फोन का नया बीमा अपने आप कर देता है', textMr: 'याने फोनचा विमा आपोआप होतो', isCorrect: false },
            { textEn: 'The helpline closes after 2 hours', textHi: 'हेल्पलाइन 2 घंटे बाद हमेशा के लिए बंद हो जाती है', textMr: 'हेल्पलाइन २ तासांनी बंद होते', isCorrect: false },
          ],
        },
      ],
    },
  ];

  for (const q of quizzesData) {
    const createdQuiz = await prisma.quiz.create({
      data: {
        slug: q.slug,
        titleEn: q.titleEn,
        titleHi: q.titleHi,
        titleMr: q.titleMr,
        descriptionEn: q.descriptionEn,
        descriptionHi: q.descriptionHi,
        descriptionMr: q.descriptionMr,
        difficulty: q.difficulty,
      },
    });

    for (const quest of q.questions) {
      const createdQuestion = await prisma.question.create({
        data: {
          quizId: createdQuiz.id,
          order: quest.order,
          difficulty: quest.difficulty,
          points: quest.points,
          questionEn: quest.questionEn,
          questionHi: quest.questionHi,
          questionMr: quest.questionMr,
          explanationEn: quest.explanationEn,
          explanationHi: quest.explanationHi,
          explanationMr: quest.explanationMr,
        },
      });

      for (const opt of quest.options) {
        await prisma.option.create({
          data: {
            questionId: createdQuestion.id,
            textEn: opt.textEn,
            textHi: opt.textHi,
            textMr: opt.textMr,
            isCorrect: opt.isCorrect,
          },
        });
      }
    }
  }
  console.log(`🎓 Seeded ${quizzesData.length} quizzes with questions and options.`);

  // 7. Seed Initial Community Feedback (Module J)
  await prisma.feedback.create({
    data: {
      name: 'Ramesh Patil',
      villageOrCity: 'Shirur, Maharashtra',
      rating: 5,
      category: 'cep_session',
      comment: 'गावातील ज्येष्ठांसाठी हा उपक्रम खूप फायदेशीर ठरला. फोनपे वर पिन टाकण्याबाबतची भीती आणि गैरसमज दूर झाले.',
      language: 'mr',
      isApproved: true,
    },
  });

  await prisma.feedback.create({
    data: {
      name: 'Sunita Sharma',
      villageOrCity: 'Dungarpur, Rajasthan',
      rating: 5,
      category: 'content_clarity',
      comment: 'ऑडियो और हिंदी में समझाई गई बातें बहुत ही आसान थीं। अब पता चला कि पैसे पाने के लिए कभी पिन नहीं डालना होता।',
      language: 'hi',
      isApproved: true,
    },
  });

  // 8. Seed Audit Log
  await prisma.auditLog.create({
    data: {
      action: 'SYSTEM_INITIALIZATION',
      performedBy: 'admin@suraksha.gov.in',
      details: 'Initial database seeding with tri-lingual fraud awareness curriculum completed successfully.',
      ipAddress: '127.0.0.1',
    },
  });

  console.log('✅ Digital Suraksha database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
