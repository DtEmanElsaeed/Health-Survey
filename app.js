const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyjnpR-Yjq-uSD008uBC4C4qQep42xgakGsYDPdW9uejJEfiMumZ8YlqwFzhwOl92v21A/exec";
const STATE_KEY = "nutritionPortraitStateV3";

const TEXT = {
  en: {
    brand: "Atelier Nutritionnel",
    storyTitle: "A portrait worth finishing.",
    storyCopy: "Each answer adds shape, mood, and detail to a more personal nutrition story.",
    loginTitle: "Begin your nutritional portrait",
    loginCopy: "Choose your language, then continue to your profile. Returning guests can review their saved submission before editing.",
    continueGuest: "Continue as guest",
    guestNote: "Guest mode still saves and updates by email.",
    language: "Select your language",
    english: "English",
    arabic: "العربية",
    profileTitle: "Tell us a little about yourself",
    profileCopy: "These details personalise the portrait and are also used to recognise returning users.",
    summaryTitle: "We found your previous submission",
    summaryCopy: "Review your saved details below, then choose whether you want to edit your submission.",
    summaryWelcome: name => `Welcome back, ${name}. Your saved submission is ready to review and edit.`,
    editSubmission: "Edit submission",
    useAnotherEmail: "Use another email",
    surveyTitle: "Your nutritional portrait",
    resultTitle: "Your personalised nutritional portrait",
    newPortrait: "Start new portrait",
    editAgain: "Edit again",
    checking: "Checking…",
    saving: "Saving…",
    beginPortrait: "Begin my portrait",
    continue: "Continue",
    submit: "Compose my portrait",
    back: "Back",
    skip: "Skip",
    requiredName: "Please enter your full name.",
    requiredEmail: "Please enter a valid email address.",
    requiredPhone: "Please enter your phone number.",
    requiredDob: "Please enter your date of birth.",
    requiredGender: "Please select your gender.",
    requiredChoice: "Please make a selection before continuing.",
    requiredText: "Please complete this field before continuing.",
    requiredDual: "Please complete both measurements before continuing.",
    optional: "Optional",
    unknown: "—"
  },
  ar: {
    brand: "أتولييه التغذية",
    storyTitle: "بورتريه يستحق الإكمال.",
    storyCopy: "كل إجابة تضيف شكلاً ومزاجاً وتفصيلاً لبورتريه غذائي أكثر خصوصية.",
    loginTitle: "ابدأ بورتريهك الغذائي",
    loginCopy: "اختر اللغة أولاً ثم أكمل ملفك الشخصي. وإذا كنت زائراً عائداً فستراجع بياناتك قبل التعديل.",
    continueGuest: "المتابعة كضيف",
    guestNote: "وضع الضيف ما زال يحفظ ويحدّث البيانات عبر البريد الإلكتروني.",
    language: "اختر لغتك",
    english: "English",
    arabic: "العربية",
    profileTitle: "أخبرنا قليلاً عن نفسك",
    profileCopy: "هذه البيانات تخصّص البورتريه وتُستخدم أيضاً للتعرّف على الزائر العائد.",
    summaryTitle: "وجدنا بياناتك السابقة",
    summaryCopy: "راجع ملخص بياناتك المحفوظة ثم اختر ما إذا كنت تريد تعديل إجاباتك.",
    summaryWelcome: name => `مرحباً مجدداً ${name}. بياناتك السابقة جاهزة للمراجعة والتعديل.`,
    editSubmission: "تعديل الإجابات",
    useAnotherEmail: "استخدام بريد آخر",
    surveyTitle: "بورتريهك الغذائي",
    resultTitle: "بورتريهك الغذائي المخصص",
    newPortrait: "ابدأ بورتريهاً جديداً",
    editAgain: "عد للتعديل",
    checking: "جارٍ التحقق…",
    saving: "جارٍ الحفظ…",
    beginPortrait: "ابدأ بورتريهي",
    continue: "متابعة",
    submit: "أكمل بورتريهي",
    back: "رجوع",
    skip: "تخطَّ",
    requiredName: "يرجى إدخال الاسم الكامل.",
    requiredEmail: "يرجى إدخال بريد إلكتروني صحيح.",
    requiredPhone: "يرجى إدخال رقم الهاتف.",
    requiredDob: "يرجى إدخال تاريخ الميلاد.",
    requiredGender: "يرجى اختيار الجنس.",
    requiredChoice: "يرجى اختيار إجابة قبل المتابعة.",
    requiredText: "يرجى تعبئة هذا الحقل قبل المتابعة.",
    requiredDual: "يرجى إدخال القياسين معاً قبل المتابعة.",
    optional: "اختياري",
    unknown: "—"
  }
};

const QUESTIONS = [
  {id:"measurements", section:{en:"FOUNDATIONS",ar:"الأسس"}, type:"dual-text", q:{en:"Your physical composition",ar:"تكوينك الجسدي"}, sub:{en:"Enables precise BMI calibration and caloric architecture.",ar:"يُتيح معايرة دقيقة لمؤشر كتلة الجسم وهندسة السعرات."}, fields:[{key:"height",label:{en:"Height (cm)",ar:"الطول (سم)"},placeholder:{en:"e.g. 170",ar:"مثلاً 170"}},{key:"weight",label:{en:"Weight (kg)",ar:"الوزن (كجم)"},placeholder:{en:"e.g. 70",ar:"مثلاً 70"}}]},
  {id:"diet", section:{en:"THE PHILOSOPHY",ar:"الفلسفة"}, type:"single", q:{en:"The philosophy of your plate",ar:"فلسفة طبقك الغذائي"}, sub:{en:"Every palate is a distinct expression — no judgement, only considered curiosity.",ar:"كل ذوق هو تعبير فريد دون أحكام."}, options:[{icon:"🥩",en:"Omnivore",ar:"عادي",val:"omnivore"},{icon:"🥗",en:"Vegetarian",ar:"نباتي",val:"vegetarian"},{icon:"🌱",en:"Vegan",ar:"نباتي بالكامل",val:"vegan"},{icon:"🥓",en:"Ketogenic",ar:"كيتو",val:"keto"}]},
  {id:"activity", section:{en:"MOVEMENT & VITALITY",ar:"الحركة والحيوية"}, type:"single", q:{en:"The rhythm of your body in daily motion",ar:"إيقاع حركة جسدك اليومية"}, sub:{en:"An honest account serves your portrait best.",ar:"الصدق في الإجابة يخدم بورتريهك على أفضل وجه."}, options:[{icon:"🛋️",en:"Sedentary",ar:"خامل",val:"sedentary"},{icon:"🚶",en:"Moderately active",ar:"نشاط متوسط",val:"moderate"},{icon:"🏋️",en:"Highly active",ar:"نشاط مرتفع",val:"active"}]},
  {id:"meals", section:{en:"DAILY RITUALS",ar:"الطقوس اليومية"}, type:"single", q:{en:"The architecture of your daily meals",ar:"بنية وجباتك اليومية"}, options:[{icon:"○",en:"1 – 2 meals",ar:"وجبة أو اثنتان",val:"1-2"},{icon:"○",en:"3 meals",ar:"3 وجبات",val:"3"},{icon:"○",en:"4 or more meals & snacks",ar:"4 وجبات أو أكثر",val:"4+"}]},
  {id:"breakfast", section:{en:"DAILY RITUALS",ar:"الطقوس اليومية"}, type:"single", q:{en:"Do you faithfully observe breakfast?",ar:"هل تتناول الفطور بانتظام؟"}, options:[{icon:"☀️",en:"Always",ar:"دائماً",val:"always"},{icon:"🌤",en:"Occasionally",ar:"أحياناً",val:"sometimes"},{icon:"🌑",en:"Rarely or never",ar:"نادراً أو أبداً",val:"never"}]},
  {id:"latenight", section:{en:"DAILY RITUALS",ar:"الطقوس اليومية"}, type:"single", q:{en:"Late-night eating — an honest account",ar:"الأكل الليلي — اعتراف صادق"}, options:[{icon:"✦",en:"Never",ar:"أبداً",val:"never"},{icon:"✦",en:"Sometimes",ar:"أحياناً",val:"sometimes"},{icon:"✦",en:"Often",ar:"بشكل متكرر",val:"often"}]},
  {id:"tvsnack", section:{en:"DAILY RITUALS",ar:"الطقوس اليومية"}, type:"single", q:{en:"Does the screen invite snacking?",ar:"هل تدعوك الشاشة إلى تناول السناك؟"}, options:[{icon:"✦",en:"No",ar:"لا",val:"no"},{icon:"✦",en:"Sometimes",ar:"أحياناً",val:"sometimes"},{icon:"✦",en:"Yes",ar:"نعم",val:"yes"}]},
  {id:"sweets", section:{en:"DAILY RITUALS",ar:"الطقوس اليومية"}, type:"single", q:{en:"The frequency of your sweet indulgences",ar:"تكرار تناولك للحلويات"}, options:[{icon:"🌿",en:"Rarely",ar:"نادراً",val:"never"},{icon:"○",en:"1 – 2 times per week",ar:"مرة أو مرتان أسبوعياً",val:"1-2"},{icon:"○",en:"3 – 5 times per week",ar:"3 – 5 مرات أسبوعياً",val:"3-5"},{icon:"🍫",en:"Daily",ar:"يومياً",val:"daily"}]},
  {id:"beverages", section:{en:"LIQUID RITUALS",ar:"طقوس السوائل"}, type:"multi", q:{en:"The liquids that grace your daily table",ar:"السوائل التي ترافق يومك"}, sub:{en:"Select all that apply.",ar:"اختر كل ما ينطبق."}, options:[{icon:"☕",en:"Coffee",ar:"قهوة",val:"coffee"},{icon:"🧃",en:"Juice or regular soda",ar:"عصير أو مشروب غازي",val:"soda"},{icon:"🥤",en:"Diet soda",ar:"مشروب دايت",val:"diet"},{icon:"🍵",en:"Tea",ar:"شاي",val:"tea"},{icon:"⚡",en:"Sports or energy drinks",ar:"مشروب طاقة",val:"energy"},{icon:"💧",en:"Water only",ar:"ماء فقط",val:"water"}]},
  {id:"water", section:{en:"LIQUID RITUALS",ar:"طقوس السوائل"}, type:"single", q:{en:"Your daily relationship with water",ar:"علاقتك اليومية بالماء"}, options:[{icon:"○",en:"Under 1 litre",ar:"أقل من لتر",val:"<1"},{icon:"○",en:"1 – 2 litres",ar:"1 – 2 لتر",val:"1-2"},{icon:"○",en:"2 – 3 litres",ar:"2 – 3 لتر",val:"2-3"},{icon:"○",en:"3 or more litres",ar:"3 لترات أو أكثر",val:"3+"}]},
  {id:"conditions", section:{en:"BIOLOGICAL CONTEXT",ar:"السياق البيولوجي"}, type:"multi", q:{en:"Conditions of biological note",ar:"حالات صحية جديرة بالتوثيق"}, sub:{en:"Select all that apply.",ar:"اختر كل ما ينطبق."}, options:[{icon:"🍬",en:"Diabetes",ar:"سكري",val:"dm"},{icon:"❤️",en:"Hypertension",ar:"ضغط",val:"htn"},{icon:"🦋",en:"Thyroid disorder",ar:"اضطراب الغدة الدرقية",val:"thyroid"},{icon:"○",en:"PCOS",ar:"تكيس المبايض",val:"pcos"},{icon:"✦",en:"None",ar:"لا يوجد",val:"none"}]},
  {id:"thyroid_type", section:{en:"BIOLOGICAL CONTEXT",ar:"السياق البيولوجي"}, type:"single", q:{en:"The nature of the thyroid imbalance",ar:"طبيعة خلل الغدة الدرقية"}, options:[{icon:"🔽",en:"Hypothyroidism",ar:"خمول",val:"hypo"},{icon:"🔼",en:"Hyperthyroidism",ar:"فرط نشاط",val:"hyper"},{icon:"○",en:"Unsure",ar:"غير متأكد",val:"unsure"}], condition:state => (getAnswer(state,"conditions")?.vals || []).includes("thyroid")},
  {id:"doctor_followup", section:{en:"BIOLOGICAL CONTEXT",ar:"السياق البيولوجي"}, type:"single", q:{en:"Are you presently under medical supervision?",ar:"هل أنت تحت إشراف طبي؟"}, options:[{icon:"✦",en:"Yes",ar:"نعم",val:"yes"},{icon:"✦",en:"Sometimes",ar:"أحياناً",val:"sometimes"},{icon:"✦",en:"No",ar:"لا",val:"no"}], condition:state => { const vals = getAnswer(state,"conditions")?.vals || []; return vals.length > 0 && !vals.every(v => v === "none"); }},
  {id:"medications", section:{en:"BIOLOGICAL CONTEXT",ar:"السياق البيولوجي"}, type:"text", optional:true, q:{en:"Current medications",ar:"الأدوية الحالية"}, placeholder:{en:"e.g. Metformin 500mg",ar:"مثلاً: ميتفورمين 500 ملغ"}},
  {id:"allergies", section:{en:"BIOLOGICAL CONTEXT",ar:"السياق البيولوجي"}, type:"text", optional:true, q:{en:"Allergies or food intolerances",ar:"الحساسية أو عدم تحمل الطعام"}, placeholder:{en:"e.g. lactose, gluten, nuts",ar:"مثلاً: لاكتوز، جلوتين، مكسرات"}},
  {id:"digestive", section:{en:"BIOLOGICAL CONTEXT",ar:"السياق البيولوجي"}, type:"multi", q:{en:"Digestive notes of significance",ar:"ملاحظات هضمية مهمة"}, options:[{icon:"○",en:"Bloating",ar:"انتفاخ",val:"bloating"},{icon:"○",en:"Constipation",ar:"إمساك",val:"constipation"},{icon:"○",en:"Diarrhea",ar:"إسهال",val:"diarrhea"},{icon:"○",en:"Acid reflux",ar:"ارتجاع",val:"reflux"},{icon:"✦",en:"None",ar:"لا يوجد",val:"none"}]},
  {id:"surgery", section:{en:"BIOLOGICAL CONTEXT",ar:"السياق البيولوجي"}, type:"single", q:{en:"A history of surgical intervention",ar:"هل لديك تاريخ جراحي؟"}, options:[{icon:"✦",en:"No previous surgeries",ar:"لا",val:"no"},{icon:"○",en:"Yes",ar:"نعم",val:"yes"}]},
  {id:"surgery_details", section:{en:"BIOLOGICAL CONTEXT",ar:"السياق البيولوجي"}, type:"text", optional:true, q:{en:"Please describe the procedure(s)",ar:"يرجى وصف العملية أو العمليات"}, placeholder:{en:"e.g. Appendectomy in 2020",ar:"مثلاً: استئصال الزائدة عام 2020"}, condition:state => getAnswer(state,"surgery")?.val === "yes"},
  {id:"sleep", section:{en:"INNER LIFE",ar:"الحياة الداخلية"}, type:"single", q:{en:"The nightly retreat — its measured duration",ar:"مدة نومك المعتادة"}, options:[{icon:"○",en:"Under 5 hours",ar:"أقل من 5 ساعات",val:"<5"},{icon:"○",en:"6 – 7 hours",ar:"6 – 7 ساعات",val:"6-7"},{icon:"○",en:"8 or more hours",ar:"8 ساعات أو أكثر",val:"8+"}]},
  {id:"stress", section:{en:"INNER LIFE",ar:"الحياة الداخلية"}, type:"single", q:{en:"The current tenor of your inner life",ar:"مستوى التوتر الحالي"}, options:[{icon:"🌿",en:"Low",ar:"منخفض",val:"low"},{icon:"○",en:"Moderate",ar:"متوسط",val:"medium"},{icon:"○",en:"High",ar:"مرتفع",val:"high"}]},
  {id:"stress_eat", section:{en:"INNER LIFE",ar:"الحياة الداخلية"}, type:"single", q:{en:"Does tension draw you toward the table?",ar:"هل يدفعك التوتر نحو الطعام؟"}, options:[{icon:"✦",en:"No",ar:"لا",val:"no"},{icon:"✦",en:"Yes",ar:"نعم",val:"yes"},{icon:"✦",en:"Sometimes",ar:"أحياناً",val:"sometimes"}]},
  {id:"exercise", section:{en:"INNER LIFE",ar:"الحياة الداخلية"}, type:"single", q:{en:"The discipline of your physical practice",ar:"مستوى التمرين لديك"}, options:[{icon:"○",en:"None",ar:"لا يوجد",val:"none"},{icon:"○",en:"Light",ar:"خفيف",val:"light"},{icon:"○",en:"Moderate",ar:"متوسط",val:"moderate"},{icon:"○",en:"Intense",ar:"مكثف",val:"intense"}]},
  {id:"goal", section:{en:"YOUR ASPIRATION",ar:"طموحك"}, type:"single", q:{en:"The aspiration that brought you here today",ar:"ما الهدف الذي أتى بك اليوم؟"}, options:[{icon:"⚖️",en:"Weight reduction",ar:"خسارة الوزن",val:"lose"},{icon:"💪",en:"Muscle & body composition",ar:"بناء العضلات",val:"muscle"},{icon:"🌿",en:"Holistic wellness",ar:"عافية شاملة",val:"healthy"},{icon:"⚡",en:"Energy optimisation",ar:"رفع الطاقة",val:"energy"}]},
  {id:"dislikes", section:{en:"THE PALATE",ar:"الذوق"}, type:"text", optional:true, q:{en:"Ingredients you choose to exclude",ar:"مكونات تفضّل استبعادها"}, placeholder:{en:"e.g. olives, mushrooms",ar:"مثلاً: زيتون، فطر"}},
  {id:"weakness", section:{en:"AN ARTISANAL CONFESSION",ar:"اعتراف غذائي"}, type:"single", q:{en:"Your most celebrated indulgence",ar:"أكثر نقطة ضعف غذائية لديك"}, options:[{icon:"🍰",en:"Sweets",ar:"حلويات",val:"sweets"},{icon:"🍔",en:"Fast food",ar:"وجبات سريعة",val:"fastfood"},{icon:"🍟",en:"Snacks",ar:"سناكات",val:"snacks"},{icon:"✦",en:"None",ar:"لا شيء",val:"disciplined"}]},
  {id:"fav_meal", section:{en:"AN ARTISANAL CONFESSION",ar:"اعتراف غذائي"}, type:"text", q:{en:"Your one definitive dish",ar:"طبقك المفضل"}, placeholder:{en:"e.g. grilled fish with rice",ar:"مثلاً: سمك مشوي مع الأرز"}},
  {id:"pregnant", section:{en:"HER PORTRAIT",ar:"بورتريه المرأة"}, type:"single", q:{en:"Your current reproductive chapter",ar:"وضعك الحالي"}, note:{en:"This section appears because your profile gender is female.",ar:"هذا القسم يظهر لأن الجنس في الملف الشخصي أنثى."}, options:[{icon:"✦",en:"None of the below",ar:"لا شيء مما يلي",val:"no"},{icon:"🤰",en:"Pregnant",ar:"حامل",val:"pregnant"},{icon:"🤱",en:"Breastfeeding",ar:"مرضعة",val:"breastfeeding"}], condition:state => getCurrentGenderValue(state) === "female"},
  {id:"period", section:{en:"HER PORTRAIT",ar:"بورتريه المرأة"}, type:"single", q:{en:"The regularity of your monthly cycle",ar:"انتظام الدورة الشهرية"}, options:[{icon:"✦",en:"Regular",ar:"منتظمة",val:"yes"},{icon:"✦",en:"Irregular",ar:"غير منتظمة",val:"no"}], condition:state => getCurrentGenderValue(state) === "female"},
  {id:"past_diet", section:{en:"FINAL OBSERVATIONS",ar:"الملاحظات الختامية"}, type:"text", optional:true, q:{en:"Previous dietary chapters",ar:"تجارب الحمية السابقة"}, placeholder:{en:"e.g. Mediterranean for 6 months",ar:"مثلاً: البحر الأبيض المتوسط لمدة 6 أشهر"}},
  {id:"notes", section:{en:"FINAL OBSERVATIONS",ar:"الملاحظات الختامية"}, type:"text", optional:true, q:{en:"Any final observations for your nutritionist",ar:"ملاحظات ختامية لأخصائي التغذية"}, placeholder:{en:"Anything else worth sharing…",ar:"أي شيء إضافي يستحق الذكر…"}}
];

const ARCHETYPES = {
  performance:{emoji:"🏋️",en:"The Performance Builder",ar:"بنّاء الأداء",portrait:{en:"You respond well to structure, consistency, and measurable progress.",ar:"أنت تستجيب جيداً للهيكل الواضح والاتساق والتقدّم القابل للقياس."},tip:{en:"Prioritise protein rhythm, recovery, and meal timing.",ar:"أعطِ أولوية لإيقاع البروتين والتعافي وتوقيت الوجبات."}},
  botanical:{emoji:"🌿",en:"The Botanical Balancer",ar:"المتوازن النباتي",portrait:{en:"Your choices already lean toward calm, steady nourishment.",ar:"اختياراتك تميل بالفعل إلى تغذية هادئة ومتوازنة."},tip:{en:"Build variety around protein, iron, and B12 support.",ar:"ابنِ التنوع حول البروتين والحديد ودعم فيتامين ب12."}},
  contemplative:{emoji:"🕊️",en:"The Reflective Eater",ar:"الآكل المتأمل",portrait:{en:"Stress and appetite are closely linked in your pattern.",ar:"التوتر والشهية مرتبطان بقوة في نمطك الشخصي."},tip:{en:"Create gentle food structure before willpower is tested.",ar:"ابنِ هيكلاً غذائياً هادئاً قبل أن يختبرك الضغط."}},
  minimalist:{emoji:"⚖️",en:"The Disciplined Minimalist",ar:"المنضبط المتزن",portrait:{en:"You likely thrive with focused plans and clear targets.",ar:"أنت تزدهر غالباً مع الخطط المركزة والأهداف الواضحة."},tip:{en:"Keep the plan simple, repeatable, and easy to track.",ar:"اجعل الخطة بسيطة وقابلة للتكرار وسهلة التتبع."}},
  vital:{emoji:"⚡",en:"The Vital Optimiser",ar:"باحث الحيوية",portrait:{en:"You are chasing steadier energy, not just numbers on a scale.",ar:"أنت تطارد طاقة أكثر ثباتاً لا مجرد أرقام على الميزان."},tip:{en:"Focus on hydration, sleep rhythm, and stable meal spacing.",ar:"ركّز على الترطيب وإيقاع النوم وتباعد الوجبات بثبات."}},
  heritage:{emoji:"🍽️",en:"The Heritage Nourisher",ar:"المغتذي المتجذر",portrait:{en:"Your story suggests a practical, familiar relationship with food.",ar:"قصتك توحي بعلاقة عملية ومألوفة مع الطعام."},tip:{en:"Refine your routine step by step instead of rebuilding everything.",ar:"حسّن روتينك خطوة بخطوة بدلاً من إعادة بناء كل شيء."}}
};

function defaultState() {
  return {
    lang: "en",
    userProfile: null,
    userPersonalData: null,
    answers: {},
    isEditMode: false,
    currentStep: 0,
    existingSheetRow: null,
    lastResult: null
  };
}

function loadState() {
  try {
    const raw = sessionStorage.getItem(STATE_KEY);
    if (!raw) return defaultState();
    return Object.assign(defaultState(), JSON.parse(raw));
  } catch (_) {
    return defaultState();
  }
}

function saveState(state) {
  sessionStorage.setItem(STATE_KEY, JSON.stringify(state));
}

function patchState(update) {
  const current = loadState();
  const next = Object.assign({}, current, update);
  saveState(next);
  return next;
}

function resetForNewPortrait() {
  const fresh = defaultState();
  saveState(fresh);
  return fresh;
}

function t(lang, key, ...args) {
  const value = TEXT[lang][key];
  return typeof value === "function" ? value(...args) : value;
}

function navigate(page) {
  window.location.href = page;
}

function setLanguage(lang) {
  const state = patchState({ lang });
  document.body.classList.toggle("rtl", lang === "ar");
  document.documentElement.lang = lang;
  return state;
}

function normalizeSheetValue(val) {
  return val == null ? "" : String(val).trim();
}

function deriveAgeBandFromDob(dob) {
  if (!dob) return "";
  const dt = new Date(dob);
  if (Number.isNaN(dt.getTime())) return "";
  const age = Math.floor((Date.now() - dt.getTime()) / 31557600000);
  return age < 18 ? "u18" : age <= 25 ? "18-25" : age <= 40 ? "26-40" : "40+";
}

function getCurrentGenderValue(state) {
  return state.userPersonalData?.gender || "";
}

function getAnswer(state, id) {
  const idx = QUESTIONS.findIndex(q => q.id === id);
  return idx >= 0 ? state.answers[idx] : null;
}

function isVisible(state, idx) {
  const q = QUESTIONS[idx];
  return !q.condition || q.condition(state);
}

function visibleQuestionIndexes(state) {
  return QUESTIONS.map((_, idx) => idx).filter(idx => isVisible(state, idx));
}

function findNextVisibleStep(state, startIdx) {
  const visible = visibleQuestionIndexes(state);
  return visible.find(idx => idx >= startIdx) ?? visible[0] ?? 0;
}

function rowToSummaryItems(state) {
  const row = state.existingSheetRow || {};
  const lang = state.lang;
  return [
    { label: lang === "ar" ? "الاسم" : "Full Name", value: state.userPersonalData?.name },
    { label: lang === "ar" ? "البريد الإلكتروني" : "Email", value: state.userPersonalData?.email },
    { label: lang === "ar" ? "الهاتف" : "Phone", value: state.userPersonalData?.phone },
    { label: lang === "ar" ? "تاريخ الميلاد" : "Date of Birth", value: state.userPersonalData?.dob },
    { label: lang === "ar" ? "الجنس" : "Gender", value: state.userPersonalData?.gender },
    { label: lang === "ar" ? "المدينة" : "City", value: state.userPersonalData?.city },
    { label: lang === "ar" ? "الهدف" : "Goal", value: row["Goal"] },
    { label: lang === "ar" ? "النظام الغذائي" : "Diet", value: row["Diet"] }
  ];
}

function loadAnswersFromSheet(state, sheetRow) {
  const colToId = {
    "Diet": "diet",
    "Activity": "activity",
    "Meals/Day": "meals",
    "Breakfast": "breakfast",
    "Late Night": "latenight",
    "TV Snack": "tvsnack",
    "Sweets": "sweets",
    "Beverages": "beverages",
    "Water": "water",
    "Conditions": "conditions",
    "Thyroid Type": "thyroid_type",
    "Doctor Followup": "doctor_followup",
    "Medications": "medications",
    "Allergies": "allergies",
    "Digestive": "digestive",
    "Surgery": "surgery",
    "Surgery Details": "surgery_details",
    "Sleep": "sleep",
    "Stress": "stress",
    "Stress Eat": "stress_eat",
    "Exercise": "exercise",
    "Goal": "goal",
    "Dislikes": "dislikes",
    "Weakness": "weakness",
    "Fav Meal": "fav_meal",
    "Pregnant": "pregnant",
    "Period": "period",
    "Past Diet": "past_diet",
    "Notes": "notes"
  };

  const answers = {};
  QUESTIONS.forEach((q, idx) => {
    const colName = Object.keys(colToId).find(key => colToId[key] === q.id);
    if (!colName) return;
    const raw = normalizeSheetValue(sheetRow[colName]);
    if (!raw) return;
    if (q.type === "single") answers[idx] = { val: raw };
    else if (q.type === "multi") answers[idx] = { vals: raw.split(",").map(v => v.trim()).filter(Boolean) };
    else if (q.type === "text") answers[idx] = { text: raw };
    else if (q.type === "dual-text") answers[idx] = { fields: { height: normalizeSheetValue(sheetRow["Height"]), weight: normalizeSheetValue(sheetRow["Weight"]) } };
  });

  return Object.assign({}, state, {
    answers,
    existingSheetRow: sheetRow,
    userPersonalData: {
      name: normalizeSheetValue(sheetRow["Full Name"]) || state.userPersonalData?.name || "",
      email: normalizeSheetValue(sheetRow["Email"]) || state.userPersonalData?.email || "",
      phone: normalizeSheetValue(sheetRow["Phone"]) || state.userPersonalData?.phone || "",
      dob: normalizeSheetValue(sheetRow["DOB"]) || state.userPersonalData?.dob || "",
      gender: normalizeSheetValue(sheetRow["Gender (Profile)"]) || state.userPersonalData?.gender || "",
      city: normalizeSheetValue(sheetRow["City"]) || state.userPersonalData?.city || ""
    }
  });
}

function buildSubmissionPayload(state) {
  const payload = { language: state.lang };
  const user = state.userPersonalData || {};
  payload.full_name = user.name || "";
  payload.email = user.email || "";
  payload.phone = user.phone || "";
  payload.dob = user.dob || "";
  payload.gender_profile = user.gender || "";
  payload.city = user.city || "";
  payload.login_via = state.userProfile ? state.userProfile.via : "Guest";
  payload.mode = state.isEditMode ? "update" : "insert";
  payload.gender = user.gender || "";
  payload.age = deriveAgeBandFromDob(user.dob);

  QUESTIONS.forEach((q, idx) => {
    const ans = state.answers[idx];
    if (!ans) return;
    if (q.type === "single") payload[q.id] = ans.val || "";
    else if (q.type === "multi") payload[q.id] = (ans.vals || []).join(", ");
    else if (q.type === "text") payload[q.id] = ans.text || "";
    else if (q.type === "dual-text") {
      payload.height = ans.fields?.height || "";
      payload.weight = ans.fields?.weight || "";
    }
  });

  const h = parseFloat(payload.height);
  const w = parseFloat(payload.weight);
  payload.bmi = h && w && h > 0 && w > 0 ? (w / Math.pow(h / 100, 2)).toFixed(1) : "";
  return payload;
}

function computeBMI(state) {
  const fields = getAnswer(state, "measurements")?.fields || {};
  const h = parseFloat(fields.height);
  const w = parseFloat(fields.weight);
  if (!h || !w || h < 50) return null;
  const bmi = w / Math.pow(h / 100, 2);
  const rounded = Math.round(bmi * 10) / 10;
  let label = "Normal";
  if (bmi < 18.5) label = "Underweight";
  else if (bmi >= 25 && bmi < 30) label = "Overweight";
  else if (bmi >= 30) label = "Obese";
  return { value: rounded, label };
}

function getArchetype(state) {
  const goal = getAnswer(state, "goal")?.val;
  const diet = getAnswer(state, "diet")?.val;
  const exercise = getAnswer(state, "exercise")?.val;
  const weakness = getAnswer(state, "weakness")?.val;
  const stress = getAnswer(state, "stress")?.val;
  const stressEat = getAnswer(state, "stress_eat")?.val;

  if (goal === "muscle" && ["moderate", "intense"].includes(exercise)) return ARCHETYPES.performance;
  if (["vegan", "vegetarian"].includes(diet) && goal === "healthy") return ARCHETYPES.botanical;
  if (stress === "high" && stressEat === "yes") return ARCHETYPES.contemplative;
  if (goal === "lose" && weakness === "disciplined") return ARCHETYPES.minimalist;
  if (goal === "energy") return ARCHETYPES.vital;
  return ARCHETYPES.heritage;
}

function showError(id, message) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
}

function clearError(id) {
  const el = document.getElementById(id);
  if (el) el.textContent = "";
}

function updateChrome(state, pageTitle, pageCopy, metrics = {}) {
  document.body.classList.toggle("rtl", state.lang === "ar");
  document.documentElement.lang = state.lang;
  const brand = document.getElementById("story-brand");
  const title = document.getElementById("story-title");
  const copy = document.getElementById("story-copy");
  const step = document.getElementById("story-step");
  const left = document.getElementById("story-left");
  const mode = document.getElementById("story-mode");
  const chips = document.getElementById("story-chips");
  if (brand) brand.textContent = t(state.lang, "brand");
  if (title) title.textContent = pageTitle || t(state.lang, "storyTitle");
  if (copy) copy.textContent = pageCopy || t(state.lang, "storyCopy");
  if (step) step.textContent = metrics.step ?? "—";
  if (left) left.textContent = metrics.left ?? "—";
  if (mode) mode.textContent = metrics.mode ?? (state.isEditMode ? "Edit" : "Fresh");
  if (chips) {
    const list = metrics.chips || [
      state.userPersonalData?.name || "Guest",
      state.lang === "ar" ? "رحلة مصممة" : "Tailored flow",
      state.isEditMode ? (state.lang === "ar" ? "وضع التعديل" : "Edit mode") : (state.lang === "ar" ? "بداية جديدة" : "New start")
    ];
    chips.innerHTML = list.filter(Boolean).map(item => `<span class="chip">${item}</span>`).join("");
  }
}

function initLoginPage() {
  let state = loadState();
  if (!state.lang) state = patchState({ lang: "en" });
  updateChrome(state, t(state.lang, "storyTitle"), t(state.lang, "storyCopy"), { step: "01", left: "05", mode: state.lang.toUpperCase(), chips: ["Language", "Identity", "Portrait"] });
  document.getElementById("page-title").textContent = t(state.lang, "loginTitle");
  document.getElementById("page-copy").textContent = t(state.lang, "loginCopy");
  document.getElementById("guest-btn").textContent = t(state.lang, "continueGuest");
  document.getElementById("guest-note").textContent = t(state.lang, "guestNote");
  document.getElementById("english-title").textContent = TEXT.en.english;
  document.getElementById("arabic-title").textContent = TEXT.ar.arabic;
  document.getElementById("english-copy").textContent = "Continue in English";
  document.getElementById("arabic-copy").textContent = "أكمل بالعربية";

  document.querySelectorAll("[data-lang]").forEach(card => {
    card.addEventListener("click", () => {
      setLanguage(card.getAttribute("data-lang"));
      patchState({ currentStep: 0, lastResult: null });
      navigate("profile.html");
    });
  });

  document.getElementById("guest-btn").addEventListener("click", () => navigate("profile.html"));
}

function initProfilePage() {
  let state = loadState();
  if (!state.lang) {
    navigate("login.html");
    return;
  }
  updateChrome(state, t(state.lang, "profileTitle"), t(state.lang, "profileCopy"), { step: "02", left: "04", mode: state.isEditMode ? "Edit" : "Profile", chips: ["Email lookup", "DOB → Age", "Profile first"] });

  const user = state.userPersonalData || {};
  document.getElementById("page-title").textContent = t(state.lang, "profileTitle");
  document.getElementById("page-copy").textContent = t(state.lang, "profileCopy");
  document.getElementById("name-label").textContent = state.lang === "ar" ? "الاسم الكامل" : "Full name";
  document.getElementById("email-label").textContent = state.lang === "ar" ? "البريد الإلكتروني" : "Email";
  document.getElementById("phone-label").textContent = state.lang === "ar" ? "رقم الهاتف" : "Phone";
  document.getElementById("dob-label").textContent = state.lang === "ar" ? "تاريخ الميلاد" : "Date of birth";
  document.getElementById("gender-label").textContent = state.lang === "ar" ? "الجنس" : "Gender";
  document.getElementById("city-label").textContent = state.lang === "ar" ? "المدينة" : "City";
  document.getElementById("submit-btn").textContent = t(state.lang, "beginPortrait");
  document.getElementById("back-btn").textContent = t(state.lang, "back");

  const fields = {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    dob: document.getElementById("dob"),
    gender: document.getElementById("gender"),
    city: document.getElementById("city")
  };

  fields.name.value = user.name || "";
  fields.email.value = user.email || "";
  fields.phone.value = user.phone || "";
  fields.dob.value = user.dob || "";
  fields.gender.value = user.gender || "";
  fields.city.value = user.city || "";

  document.getElementById("back-btn").addEventListener("click", () => navigate("login.html"));
  document.getElementById("profile-form").addEventListener("submit", async event => {
    event.preventDefault();
    clearError("error");
    const nextUser = {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      phone: fields.phone.value.trim(),
      dob: fields.dob.value,
      gender: fields.gender.value,
      city: fields.city.value.trim()
    };

    if (!nextUser.name) return showError("error", t(state.lang, "requiredName"));
    if (!nextUser.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextUser.email)) return showError("error", t(state.lang, "requiredEmail"));
    if (!nextUser.phone) return showError("error", t(state.lang, "requiredPhone"));
    if (!nextUser.dob) return showError("error", t(state.lang, "requiredDob"));
    if (!nextUser.gender) return showError("error", t(state.lang, "requiredGender"));

    const submitBtn = document.getElementById("submit-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = t(state.lang, "checking");

    let nextState = patchState({
      userPersonalData: nextUser,
      answers: {},
      currentStep: 0,
      existingSheetRow: null,
      lastResult: null
    });

    try {
      const res = await fetch(WEB_APP_URL + "?email=" + encodeURIComponent(nextUser.email));
      const json = await res.json();
      if (json && json.found && json.data) {
        nextState = loadAnswersFromSheet(nextState, json.data);
        nextState.isEditMode = true;
        nextState.currentStep = findNextVisibleStep(nextState, 0);
        saveState(nextState);
        navigate("returning.html");
        return;
      }
      nextState.isEditMode = false;
      nextState.currentStep = findNextVisibleStep(nextState, 0);
      saveState(nextState);
      navigate("survey.html");
    } catch (_) {
      nextState.isEditMode = false;
      nextState.currentStep = findNextVisibleStep(nextState, 0);
      saveState(nextState);
      navigate("survey.html");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = t(state.lang, "beginPortrait");
    }
  });
}

function initReturningPage() {
  const state = loadState();
  if (!state.userPersonalData || !state.isEditMode) {
    navigate("profile.html");
    return;
  }
  updateChrome(state, t(state.lang, "summaryTitle"), t(state.lang, "summaryCopy"), { step: "03", left: "03", mode: "Review", chips: ["Returning user", "Loaded answers", "Edit when ready"] });
  document.getElementById("page-title").textContent = t(state.lang, "summaryTitle");
  document.getElementById("page-copy").textContent = t(state.lang, "summaryCopy");
  document.getElementById("summary-note").textContent = t(state.lang, "summaryWelcome", state.userPersonalData.name || "");
  document.getElementById("edit-btn").textContent = t(state.lang, "editSubmission");
  document.getElementById("back-btn").textContent = t(state.lang, "useAnotherEmail");
  document.getElementById("summary-grid").innerHTML = rowToSummaryItems(state).map(item => `
    <div class="summary-item">
      <div class="summary-item-label">${item.label}</div>
      <div class="summary-item-value">${normalizeSheetValue(item.value) || t(state.lang, "unknown")}</div>
    </div>
  `).join("");

  document.getElementById("back-btn").addEventListener("click", () => {
    patchState({ isEditMode: false, existingSheetRow: null, answers: {}, currentStep: 0 });
    navigate("profile.html");
  });

  document.getElementById("edit-btn").addEventListener("click", () => {
    patchState({ currentStep: findNextVisibleStep(state, 0) });
    navigate("survey.html");
  });
}

function getCurrentQuestion(state) {
  const idx = findNextVisibleStep(state, state.currentStep || 0);
  return { idx, question: QUESTIONS[idx] };
}

function answerExists(question, answer) {
  if (!answer) return false;
  if (question.type === "single") return !!answer.val;
  if (question.type === "multi") return Array.isArray(answer.vals) && answer.vals.length > 0;
  if (question.type === "text") return !!(answer.text || "").trim();
  if (question.type === "dual-text") return !!(answer.fields?.height && answer.fields?.weight);
  return false;
}

function renderSurveyQuestion(state) {
  const { idx, question } = getCurrentQuestion(state);
  const visible = visibleQuestionIndexes(state);
  const stepNumber = visible.indexOf(idx) + 1;
  const total = visible.length;
  const answer = state.answers[idx] || null;

  document.getElementById("page-title").textContent = question.q[state.lang];
  document.getElementById("page-copy").textContent = question.sub?.[state.lang] || "";
  document.getElementById("progress-label").textContent = `${stepNumber} / ${total}`;
  document.getElementById("progress-percent").textContent = `${Math.round((stepNumber / total) * 100)}%`;
  document.getElementById("progress-fill").style.width = `${Math.round((stepNumber / total) * 100)}%`;
  document.getElementById("error").textContent = "";

  const noteEl = document.getElementById("question-note");
  if (question.note) {
    noteEl.textContent = question.note[state.lang];
    noteEl.hidden = false;
  } else if (question.optional) {
    noteEl.textContent = t(state.lang, "optional");
    noteEl.hidden = false;
  } else {
    noteEl.hidden = true;
  }

  const container = document.getElementById("question-body");
  if (question.type === "single" || question.type === "multi") {
    const cols2 = question.options.length > 3 ? " cols-2" : "";
    container.innerHTML = `<div class="option-grid${cols2}">
      ${question.options.map(option => {
        const selected = question.type === "single"
          ? answer?.val === option.val
          : (answer?.vals || []).includes(option.val);
        return `<button type="button" class="option-card${selected ? " selected" : ""}" data-option="${option.val}">
          <span class="option-icon">${option.icon}</span>
          <span class="option-text">
            <div class="option-title">${option[state.lang]}</div>
            <p class="option-sub">${option[state.lang === "en" ? "ar" : "en"] || ""}</p>
          </span>
        </button>`;
      }).join("")}
    </div>`;
    container.querySelectorAll("[data-option]").forEach(btn => {
      btn.addEventListener("click", () => {
        const value = btn.getAttribute("data-option");
        const next = loadState();
        if (question.type === "single") {
          next.answers[idx] = { val: value };
        } else {
          const current = new Set(next.answers[idx]?.vals || []);
          if (current.has(value)) current.delete(value);
          else current.add(value);
          next.answers[idx] = { vals: Array.from(current) };
        }
        saveState(next);
        renderSurveyQuestion(next);
      });
    });
  } else if (question.type === "text") {
    container.innerHTML = `<div class="field">
      <label>${question.optional ? t(state.lang, "optional") : question.section[state.lang]}</label>
      <textarea class="textarea" id="question-text" placeholder="${question.placeholder?.[state.lang] || ""}">${answer?.text || ""}</textarea>
    </div>`;
  } else if (question.type === "dual-text") {
    container.innerHTML = `<div class="dual-grid">
      ${question.fields.map(field => `
        <div class="field">
          <label>${field.label[state.lang]}</label>
          <input class="input" id="field-${field.key}" type="number" inputmode="decimal" placeholder="${field.placeholder[state.lang]}" value="${answer?.fields?.[field.key] || ""}">
        </div>
      `).join("")}
    </div>`;
  }

  const backBtn = document.getElementById("back-btn");
  const skipBtn = document.getElementById("skip-btn");
  const nextBtn = document.getElementById("next-btn");
  backBtn.textContent = t(state.lang, "back");
  skipBtn.textContent = t(state.lang, "skip");
  nextBtn.textContent = stepNumber === total ? t(state.lang, "submit") : t(state.lang, "continue");
  backBtn.disabled = stepNumber === 1;
  skipBtn.hidden = !question.optional;
}

function captureCurrentAnswer() {
  const state = loadState();
  const { idx, question } = getCurrentQuestion(state);
  if (question.type === "text") {
    const text = document.getElementById("question-text")?.value.trim() || "";
    if (text) state.answers[idx] = { text };
    else if (question.optional) delete state.answers[idx];
  } else if (question.type === "dual-text") {
    state.answers[idx] = {
      fields: {
        height: document.getElementById("field-height")?.value.trim() || "",
        weight: document.getElementById("field-weight")?.value.trim() || ""
      }
    };
  }
  saveState(state);
  return state;
}

function validateCurrentAnswer(state) {
  const { idx, question } = getCurrentQuestion(state);
  const answer = state.answers[idx];
  if (question.optional && !answerExists(question, answer)) return { valid: true };
  if (question.type === "single" || question.type === "multi") return { valid: answerExists(question, answer), message: t(state.lang, "requiredChoice") };
  if (question.type === "text") return { valid: answerExists(question, answer), message: t(state.lang, "requiredText") };
  if (question.type === "dual-text") return { valid: answerExists(question, answer), message: t(state.lang, "requiredDual") };
  return { valid: true };
}

async function submitSurveyState(state) {
  const payload = buildSubmissionPayload(state);
  try {
    const resp = await fetch(WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify(payload)
    });
    const json = await resp.json();
    if (!json.success) throw new Error(json.message || "Submission error");
  } catch (error) {
    try {
      await fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify(payload)
      });
    } catch (_) {}
    console.warn("Submit used no-cors fallback:", error.message);
  }

  const next = loadState();
  next.lastResult = {
    goal: getAnswer(next, "goal")?.val || "",
    diet: getAnswer(next, "diet")?.val || "",
    exercise: getAnswer(next, "exercise")?.val || "",
    meals: getAnswer(next, "meals")?.val || "",
    sleep: getAnswer(next, "sleep")?.val || "",
    water: getAnswer(next, "water")?.val || "",
    favMeal: getAnswer(next, "fav_meal")?.text || "",
    archetype: getArchetype(next),
    bmi: computeBMI(next)
  };
  saveState(next);
}

function initSurveyPage() {
  let state = loadState();
  if (!state.userPersonalData) {
    navigate("profile.html");
    return;
  }
  state.currentStep = findNextVisibleStep(state, state.currentStep || 0);
  saveState(state);
  updateChrome(state, t(state.lang, "surveyTitle"), t(state.lang, "storyCopy"), { step: String(state.currentStep + 1).padStart(2, "0"), left: String(visibleQuestionIndexes(state).length).padStart(2, "0"), mode: state.isEditMode ? "Edit" : "Survey", chips: [state.userPersonalData.name || "Guest", state.userPersonalData.gender || "Profile", deriveAgeBandFromDob(state.userPersonalData.dob) || ""] });
  renderSurveyQuestion(state);

  document.getElementById("back-btn").addEventListener("click", () => {
    state = captureCurrentAnswer();
    const visible = visibleQuestionIndexes(state);
    const currentPos = visible.indexOf(getCurrentQuestion(state).idx);
    if (currentPos > 0) {
      state.currentStep = visible[currentPos - 1];
      saveState(state);
      renderSurveyQuestion(state);
    }
  });

  document.getElementById("skip-btn").addEventListener("click", () => {
    state = captureCurrentAnswer();
    const visible = visibleQuestionIndexes(state);
    const currentPos = visible.indexOf(getCurrentQuestion(state).idx);
    if (currentPos < visible.length - 1) {
      state.currentStep = visible[currentPos + 1];
      saveState(state);
      renderSurveyQuestion(state);
    }
  });

  document.getElementById("next-btn").addEventListener("click", async () => {
    state = captureCurrentAnswer();
    const validation = validateCurrentAnswer(state);
    if (!validation.valid) {
      showError("error", validation.message);
      return;
    }
    const visible = visibleQuestionIndexes(state);
    const currentPos = visible.indexOf(getCurrentQuestion(state).idx);
    const nextBtn = document.getElementById("next-btn");
    if (currentPos === visible.length - 1) {
      nextBtn.disabled = true;
      nextBtn.textContent = t(state.lang, "saving");
      await submitSurveyState(state);
      navigate("result.html");
      return;
    }
    state.currentStep = visible[currentPos + 1];
    saveState(state);
    renderSurveyQuestion(state);
  });
}

function initResultPage() {
  const state = loadState();
  if (!state.lastResult) {
    navigate("survey.html");
    return;
  }
  const result = state.lastResult;
  updateChrome(state, t(state.lang, "resultTitle"), result.archetype.portrait[state.lang], { step: "✓", left: "00", mode: state.isEditMode ? "Updated" : "Saved", chips: [result.goal || "Goal", result.exercise || "Exercise", result.water || "Water"] });
  document.getElementById("hero-title").textContent = result.archetype[state.lang];
  document.getElementById("hero-copy").textContent = result.archetype.portrait[state.lang];
  document.getElementById("hero-emoji").textContent = result.archetype.emoji;
  document.getElementById("insight").textContent = result.archetype.tip[state.lang];
  document.getElementById("result-grid").innerHTML = [
    ["Goal", result.goal],
    ["Meals", result.meals],
    ["Exercise", result.exercise],
    ["Sleep", result.sleep],
    ["Water", result.water],
    ["Favourite meal", result.favMeal || t(state.lang, "unknown")],
    ["BMI", result.bmi ? `${result.bmi.value} (${result.bmi.label})` : t(state.lang, "unknown")]
  ].map(([label, value]) => `
    <div class="summary-item">
      <div class="summary-item-label">${label}</div>
      <div class="summary-item-value">${normalizeSheetValue(value) || t(state.lang, "unknown")}</div>
    </div>
  `).join("");
  document.getElementById("new-btn").textContent = t(state.lang, "newPortrait");
  document.getElementById("edit-btn").textContent = t(state.lang, "editAgain");
  document.getElementById("new-btn").addEventListener("click", () => {
    resetForNewPortrait();
    navigate("login.html");
  });
  document.getElementById("edit-btn").addEventListener("click", () => {
    const next = loadState();
    next.currentStep = findNextVisibleStep(next, 0);
    saveState(next);
    navigate("survey.html");
  });
}

function initSharedPage() {
  const state = loadState();
  document.body.classList.toggle("rtl", state.lang === "ar");
  document.documentElement.lang = state.lang;
}

document.addEventListener("DOMContentLoaded", () => {
  initSharedPage();
  const page = document.body.dataset.page;
  if (page === "login") initLoginPage();
  if (page === "profile") initProfilePage();
  if (page === "returning") initReturningPage();
  if (page === "survey") initSurveyPage();
  if (page === "result") initResultPage();
});
