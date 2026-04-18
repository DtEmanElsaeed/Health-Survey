var SPREADSHEET_ID = "1YKj5TecslomTbYks0zq-h_lszkGc-MLsVq6c4wixuJ4";
var SHEET_NAME = "patient_Data";
var HEADERS = [
  "Timestamp", "Language",
  "Full Name", "Email", "Phone", "DOB", "Gender (Profile)", "City", "Login Via", "Age",
  "Height", "Weight", "BMI",
  "Conditions", "Conditions Other", "Thyroid Type",
  "Medications YN", "Medications",
  "Allergies",
  "Digestive", "Digestive Duration",
  "Surgery", "Surgery Details", "Injury",
  "Wake Time", "Morning Intake",
  "Breakfast YN", "Breakfast What", "Breakfast Skip Reason", "After Breakfast",
  "Lunch Time", "Lunch What",
  "Morning Snacks YN", "Morning Snacks What",
  "Dinner Time", "Dinner What",
  "After Dinner YN", "After Dinner What",
  "Meals/Day",
  "Eating Out Breakfast", "Eating Out Lunch", "Eating Out Dinner", "Eating Out Places",
  "Fruits/Day", "Veggies/Day",
  "Red Meat/Week", "Chicken/Week", "Fish/Week", "Cereal/Week",
  "Beverages", "Beverages Amount", "Water",
  "Exercise YN", "Exercise Type", "Exercise Freq", "Gym",
  "Sleep", "Stress", "Stress Eat", "TV Snack", "TV Hours",
  "Late Night", "Sweets",
  "Goal", "Goal Timeline",
  "Dislikes", "Past Diet Regime",
  "Past Diet Barrier", "Notes",
  "Pregnant", "Period",
  "Deleted",
  "Raw JSON",
  "Patient ID"
];
var DASHBOARD_CACHE_KEY = "dashboard_summary_v1";
var DASHBOARD_CACHE_TTL = 120;
var DASHBOARD_FIELDS = [
  "Timestamp", "Language", "Full Name", "Email", "Phone", "City", "Login Via",
  "Age", "BMI", "Conditions", "Goal", "Stress", "Patient ID"
];

function getSheet_() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (sheet) return sheet;

  // Fallback: search for sheet matching ignoring case and spaces
  var target = SHEET_NAME.toLowerCase().replace(/\s+/g, '');
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var s = sheets[i];
    var sName = s.getName().toLowerCase().replace(/\s+/g, '');
    if (sName === target) {
      return s;
    }
  }

  throw new Error('Sheet "' + SHEET_NAME + '" not found in spreadsheet.');
}

function rowLooksLikeAnyHeader_(row) {
  return row.some(function(cell) {
    var value = (cell || "").toString().trim();
    return value === "Email" || value === "Timestamp" || value === "Full Name" || value === "Language";
  });
}

function headersMatch_(row) {
  if (!row || row.length < HEADERS.length) return false;
  for (var i = 0; i < HEADERS.length; i++) {
    if ((row[i] || "").toString().trim() !== HEADERS[i]) return false;
  }
  return true;
}

function ensureHeaders_(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    return;
  }

  var firstRow = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), HEADERS.length)).getDisplayValues()[0];
  if (headersMatch_(firstRow)) return;

  if (rowLooksLikeAnyHeader_(firstRow)) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    return;
  }

  sheet.insertRowBefore(1);
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
}

// Run this ONCE manually to set or repair column headers
function initSheet() {
  var sheet = getSheet_();
  ensureHeaders_(sheet);
  ensurePatientIds_(sheet);
}

function buildRow(data) {
  var storedData = sanitizeRawJson_(data);
  return [
    new Date(),
    data.language || "",
    // Profile
    data.full_name || "",
    data.email || "",
    data.phone || "",
    data.dob || "",
    data.gender_profile || "",
    data.city || "",
    data.login_via || "",
    data.age || "",
    // Measurements
    data.height || "",
    data.weight || "",
    data.bmi || "",
    // Medical
    data.conditions || "",
    data.conditions_other || "",
    data.thyroid_type || "",
    data.medications_yn || "",
    data.medications || "",
    data.allergies || "",
    data.digestive || "",
    data.digestive_duration || "",
    data.surgery || "",
    data.surgery_details || "",
    data.injury || "",
    // Daily Routine
    data.wake_time || "",
    data.morning_intake || "",
    data.breakfast_yn || "",
    data.breakfast_what || "",
    data.breakfast_skip_reason || "",
    data.after_breakfast || "",
    data.lunch_time || "",
    data.lunch_what || "",
    data.morning_snacks_yn || "",
    data.morning_snacks_what || "",
    data.dinner_time || "",
    data.dinner_what || "",
    data.after_dinner_yn || "",
    data.after_dinner_what || "",
    // Nutrition Habits
    data.meals || "",
    data.eating_out_breakfast || "",
    data.eating_out_lunch || "",
    data.eating_out_dinner || "",
    data.eating_out_places || "",
    data.fruits_daily || "",
    data.veggies_daily || "",
    data.red_meat_weekly || "",
    data.chicken_weekly || "",
    data.fish_weekly || "",
    data.cereal_weekly || "",
    // Beverages
    data.beverages || "",
    data.beverages_amount || "",
    data.water || "",
    // Lifestyle
    data.exercise_yn || "",
    data.exercise_type || "",
    data.exercise || "",
    data.gym || "",
    data.sleep || "",
    data.stress || "",
    data.stress_eat || "",
    data.tvsnack || "",
    data.tv_hours || "",
    // Behavior
    data.latenight || "",
    data.sweets || "",
    // Goals
    data.goal || "",
    data.goal_timeline || "",
    // Preferences
    data.dislikes || "",
    data.past_diet_regime || "",
    // Open
    data.past_diet_barrier || "",
    data.notes || "",
    // Her Portrait
    data.pregnant || "",
    data.period || "",
    data.deleted || "0",
    // Raw
    JSON.stringify(storedData),
    data.patient_id || ""
  ];
}

function sanitizeRawJson_(data) {
  var copy = {};
  Object.keys(data || {}).forEach(function(key) {
    if (key === "welcome_name") return;
    copy[key] = data[key];
  });
  return copy;
}

function getHeaderIndex_(headers, name) {
  return headers.indexOf(name);
}

function generateUniquePatientId_(sheet, headers) {
  var patientIdCol = getHeaderIndex_(headers, "Patient ID");
  var existingIds = {};
  if (patientIdCol !== -1) {
    var values = sheet.getDataRange().getDisplayValues();
    for (var i = 1; i < values.length; i++) {
      var existing = (values[i][patientIdCol] || "").toString().trim();
      if (existing) existingIds[existing] = true;
    }
  }

  var candidate = "";
  do {
    candidate = "PTS-" + Utilities.getUuid().replace(/-/g, "").slice(0, 12).toUpperCase();
  } while (existingIds[candidate]);

  return candidate;
}

function ensurePatientIds_(sheet) {
  var values = sheet.getDataRange().getDisplayValues();
  if (values.length < 2) return;

  var headers = values[0];
  var patientIdCol = getHeaderIndex_(headers, "Patient ID");
  var emailCol = getHeaderIndex_(headers, "Email");
  var nameCol = getHeaderIndex_(headers, "Full Name");
  if (patientIdCol === -1) return;

  var existingIds = {};
  for (var i = 1; i < values.length; i++) {
    var existingId = (values[i][patientIdCol] || "").toString().trim();
    if (existingId) existingIds[existingId] = true;
  }

  for (var row = 1; row < values.length; row++) {
    var hasIdentity = (emailCol !== -1 && values[row][emailCol]) || (nameCol !== -1 && values[row][nameCol]);
    var currentId = (values[row][patientIdCol] || "").toString().trim();
    if (!hasIdentity || currentId) continue;

    var candidate = "";
    do {
      candidate = "PTS-" + Utilities.getUuid().replace(/-/g, "").slice(0, 12).toUpperCase();
    } while (existingIds[candidate]);

    existingIds[candidate] = true;
    sheet.getRange(row + 1, patientIdCol + 1).setValue(candidate);
    values[row][patientIdCol] = candidate;
  }
}

function findRowByEmail(sheet, email) {
  var targetEmail = (email || "").toString().toLowerCase().trim();
  if (!targetEmail) return -1;

  var values = sheet.getDataRange().getValues();
  if (!values.length) return -1;

  var headers = values[0];
  var emailCol = headers.indexOf("Email");
  if (emailCol === -1) return -1;

  for (var i = 1; i < values.length; i++) {
    var rowEmail = (values[i][emailCol] || "").toString().toLowerCase().trim();
    if (rowEmail === targetEmail) return i + 1;
  }

  return -1;
}

function resolvePreferredLanguage_(data, sheet) {
  var incoming = (data && data.language || "").toString().toLowerCase().trim();
  if (incoming === "ar" || incoming === "en") return incoming;

  var email = (data && data.email || "").toString().trim();
  if (!email) return "en";

  sheet = sheet || getSheet_();
  if (!sheet) return "en";

  var rowIndex = findRowByEmail(sheet, email);
  if (rowIndex === -1) return "en";

  var values = sheet.getDataRange().getDisplayValues();
  var headers = values[0] || [];
  var languageCol = headers.indexOf("Language");
  if (languageCol === -1) return "en";

  var saved = (values[rowIndex - 1][languageCol] || "").toString().toLowerCase().trim();
  return saved === "ar" ? "ar" : "en";
}

function rowToObject_(headers, row, fields) {
  var obj = {};
  var keys = fields && fields.length ? fields : headers;
  keys.forEach(function(key) {
    var idx = headers.indexOf(key);
    if (idx !== -1) obj[key] = row[idx];
  });
  return obj;
}

function getDashboardSummaries_(sheet) {
  var cache = CacheService.getScriptCache();
  var cached = cache.get(DASHBOARD_CACHE_KEY);
  if (cached) {
    return JSON.parse(cached);
  }

  var values = sheet.getDataRange().getDisplayValues();
  if (!values.length) return [];

  var headers = values[0];
  var deletedIdx = headers.indexOf("Deleted");
  var rows = values.slice(1).filter(function(row) {
    var emailIdx = headers.indexOf("Email");
    var nameIdx = headers.indexOf("Full Name");
    var hasIdentity = (emailIdx !== -1 && row[emailIdx]) || (nameIdx !== -1 && row[nameIdx]);
    var isDeleted = deletedIdx !== -1 && String(row[deletedIdx] || "").trim() === "1";
    return hasIdentity && !isDeleted;
  }).map(function(row) {
    return rowToObject_(headers, row, DASHBOARD_FIELDS);
  });

  cache.put(DASHBOARD_CACHE_KEY, JSON.stringify(rows), DASHBOARD_CACHE_TTL);
  return rows;
}

function clearDashboardCache_() {
  CacheService.getScriptCache().remove(DASHBOARD_CACHE_KEY);
}

function buildEmailHtml_(opts) {
  var isRtl   = opts.isRtl || false;
  var dir     = isRtl ? "rtl" : "ltr";
  var align   = isRtl ? "right" : "left";
  var serif   = isRtl ? "'Cairo',Arial,sans-serif" : "Georgia,'Times New Roman',serif";
  var sans    = isRtl ? "'Cairo',Arial,sans-serif" : "Arial,Helvetica,sans-serif";
  var headingStyle = isRtl ? "normal" : "italic";
  var journeyLabel = isRtl ? "رحلتك الغذائية" : "Your Nutritional Journey";
  var tagline      = isRtl ? "صورة غذائية مخصصة لك" : "A curated nutritional portrait";
  var quoteText    = opts.quote || (isRtl
    ? '"سرّ التقدم هو البدء."'
    : '"The secret of getting ahead is getting started."');
  var quoteAuthor  = opts.quoteAuthor || (isRtl ? "— مارك توين" : "— Mark Twain");
  var footerNote   = isRtl
    ? "تلقيت هذا البريد لأنه تم إرساله من لوحة التحكم الخاصة بك. لضمان وصول رسائلنا لك، يرجى إضافة هذا البريد إلى جهات الاتصال. للإلغاء، يرجى الرد بـ Unsubscribe."
    : "You are receiving this because of your assessment. To ensure delivery, please add this email to your contacts. To unsubscribe, reply 'Unsubscribe'.";

  var confettiOverlay = '';
  if (opts.confetti) {
    confettiOverlay =
      '<div style="padding:16px 24px 0;text-align:center;color:#c9993a;">' +
      '<div style="font-size:16px;line-height:1;letter-spacing:8px;">&#10023; &#10023; &#9670; &#10023; &#10023;</div>' +
      '<div style="width:120px;height:1px;background:#d8c29b;margin:12px auto 0;"></div>' +
      '</div>';
  }

  var headerLabel = opts.confetti
    ? (isRtl ? '🎉 أهلاً وسهلاً بك 🎉' : '🎉 Welcome Aboard 🎉')
    : journeyLabel;

  var header = [
    '<td style="background:linear-gradient(160deg,#1a2e10 0%,#243d17 45%,#2e4d1c 100%);padding:44px 40px 36px;text-align:center;position:relative;overflow:hidden;">',
    '  <div style="position:absolute;inset:0;opacity:.04;background-image:radial-gradient(circle,#fff 1px,transparent 1px);background-size:18px 18px;pointer-events:none;"></div>',
    '  <div style="position:absolute;top:16px;left:20px;opacity:.22;font-size:28px;color:#a0782a;line-height:1;">&#10023;</div>',
    '  <div style="position:absolute;top:16px;right:20px;opacity:.22;font-size:28px;color:#a0782a;line-height:1;transform:scaleX(-1);">&#10023;</div>',
    '  <div style="font-size:9px;letter-spacing:.32em;text-transform:uppercase;color:#8ba67a;font-family:' + sans + ';margin-bottom:18px;">' + headerLabel + '</div>',
    '  <div style="font-size:34px;margin-bottom:12px;line-height:1;">🌿</div>',
    '  <div style="font-family:' + serif + ';font-size:32px;font-weight:600;font-style:' + headingStyle + ';color:#fdfaf5;letter-spacing:.02em;line-height:1.2;margin-bottom:4px;">The First Step</div>',
    '  <div style="display:flex;align-items:center;justify-content:center;gap:10px;margin:16px auto 0;max-width:200px;">',
    '    <div style="height:1px;flex:1;background:linear-gradient(90deg,transparent,#a0782a);"></div>',
    '    <div style="color:#a0782a;font-size:10px;">&#9670;</div>',
    '    <div style="height:1px;flex:1;background:linear-gradient(90deg,#a0782a,transparent);"></div>',
    '  </div>',
    '  <div style="font-size:11px;color:#8ba67a;font-family:' + sans + ';margin-top:12px;letter-spacing:.08em;font-style:italic;">' + tagline + '</div>',
    '</td>'
  ].join('');

  var hero = [
    '<td style="padding:44px 48px 0;text-align:center;">',
    '  <div style="font-size:13px;color:#c9993a;letter-spacing:8px;margin-bottom:20px;opacity:.7;">&middot; &middot; &middot;</div>',
    '  <div style="font-family:' + serif + ';font-size:26px;font-weight:600;font-style:' + headingStyle + ';color:#1a1912;margin:0 0 8px;line-height:1.35;">' + opts.headline + '</div>',
    '  <div style="width:40px;height:2px;background:linear-gradient(90deg,#a0782a,#c9993a);margin:16px auto 0;border-radius:2px;"></div>',
    '</td>'
  ].join('');

  var body = [
    '<td style="padding:32px 48px 0;text-align:' + align + ';direction:' + dir + ';">',
    '  <div style="font-family:' + sans + ';font-size:15px;line-height:1.9;color:#3a3830;">',
    opts.bodyHtml,
    '  </div>',
    '</td>'
  ].join('');

  var quote = [
    '<td style="padding:0 48px 32px;">',
    '  <div style="background:linear-gradient(135deg,#e4ede0,#edf3e9);border-left:3px solid #a0782a;border-radius:0 4px 4px 0;padding:20px 24px;">',
    '    <div style="font-family:' + serif + ';font-size:15px;font-style:italic;color:#243d17;line-height:1.7;margin:0 0 8px;">' + quoteText + '</div>',
    '    <div style="font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#8ba67a;font-family:' + sans + ';">' + quoteAuthor + '</div>',
    '  </div>',
    '</td>'
  ].join('');

  var footer = [
    '<td style="padding:0 40px 8px;">',
    '  <div style="display:flex;align-items:center;gap:12px;">',
    '    <div style="flex:1;height:1px;background:linear-gradient(90deg,transparent,#d5ccc1);"></div>',
    '    <div style="font-size:12px;color:#c9993a;letter-spacing:6px;">&#10023; &#9670; &#10023;</div>',
    '    <div style="flex:1;height:1px;background:linear-gradient(90deg,#d5ccc1,transparent);"></div>',
    '  </div>',
    '</td>',
    '<td style="padding:20px 40px 32px;text-align:center;">',
    '  <div style="font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:#968f84;font-family:' + sans + ';margin-bottom:8px;">The First Step</div>',
    '  <div style="font-size:11px;color:#b8b2aa;font-family:' + sans + ';font-style:italic;line-height:1.6;">A curated assessment of your dietary philosophy,<br>daily rituals, and nutritional aspirations.</div>',
    '  <div style="margin-top:14px;font-size:10px;color:#c8c2ba;font-family:' + sans + ';letter-spacing:.04em;">' + footerNote + '</div>',
    '</td>'
  ].join('');

  return '<!DOCTYPE html>' +
    '<html lang="' + (isRtl ? 'ar' : 'en') + '" dir="' + dir + '">' +
    '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '</head>' +
    '<body style="margin:0;padding:0;background-color:#ede8df;">' +
    '<div style="background-color:#ede8df;padding:32px 16px;">' +
    '<div style="max-width:600px;margin:0 auto;background:#fdfaf5;border:1px solid #d5ccc1;border-radius:6px;overflow:hidden;box-shadow:0 8px 40px rgba(26,25,18,.10),0 2px 8px rgba(26,25,18,.06);position:relative;">' +
    confettiOverlay +
    '<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>' + header + '</tr></table>' +
    '<div style="height:3px;background:linear-gradient(90deg,#243d17 0%,#a0782a 50%,#243d17 100%);"></div>' +
    '<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>' + hero + '</tr></table>' +
    '<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>' + body + '</tr></table>' +
    '<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>' + quote + '</tr></table>' +
    '<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>' + footer + '</tr></table>' +
    '</div></div>' +
    '</body></html>';
}

function sendWelcomeEmail(data) {
  var email = (data.email || "").toString().trim();
  if (!email) return;

  var isArabic = resolvePreferredLanguage_(data) === "ar";
  var rawName = (data.welcome_name || data.full_name || "").toString().trim();
  var firstName = rawName ? rawName.split(/\s+/)[0] : (isArabic ? "صديقي" : "there");

  var subject = isArabic
    ? "أهلاً بيك في The First Step"
    : "Welcome to The First Step";

  var plainBody = isArabic
    ? "أهلاً يا " + firstName + "،\n\nنورت The First Step.\nإحنا مبسوطين إنك بدأت الرحلة معانا، وصدقنا أول خطوة دي هي أهم خطوة فعلاً.\n\nبياناتك وصلت، ومن هنا هنبتدي نبني لك صورة غذائية تناسبك أنت، من غير تعقيد ولا كلام كبير.\n\nواحدة واحدة كده، وهتلاقي الدنيا بقت أظبط، والأكل بقى صاحبك مش خصمك.\n\nيلا بينا نبدأها بشياكة... ومن غير دراما ميزان كتير.\n\nبحب وتشجيع،\nThe First Step\n\n---\nلتحسين وصول الإيميلات، يرجى حفظ هذا الإيميل في جهات الاتصال. للإلغاء، يرجى الرد بـ Unsubscribe."
    : "Hi " + firstName + ",\n\nWelcome to The First Step.\nWe are so happy you are here.\n\nYour details are in, and that means you have already done the hardest part: you started.\n\nFrom here, we will help make things feel simpler, more personal, and a lot less overwhelming.\n\nOne small step at a time, and yes, we are cheering for you.\n\nWarmly,\nThe First Step\n\n---\nTo ensure delivery, please add this email to your contacts. To unsubscribe, reply 'Unsubscribe'.";

  var htmlBody = isArabic
    ? '<p style="margin:0 0 16px;">أهلاً يا ' + firstName + '،</p>' +
      '<p style="margin:0 0 16px;">نورت <strong style="color:#243d17;">The First Step</strong>.<br>إحنا مبسوطين قوي إنك بدأت الرحلة معانا، لأن أول خطوة دي هي أهم خطوة فعلاً.</p>' +
      '<p style="margin:0 0 16px;">بياناتك وصلت، وكل إجابة كتبتها بتساعدنا نفهمك أكتر ونجهز لك توصيات مناسبة ليك أنت.<br>من غير تعقيد، ومن غير إحساس إن الموضوع امتحان أحياء آخر السنة.</p>' +
      '<p style="margin:0 0 24px;">واحدة واحدة كده، وهتلاقي الدنيا بقت أهدى وأوضح، والأكل بقى ألطف من ما كنت متخيل.</p>' +
      '<p style="margin:0;color:#5e5a52;font-style:italic;">بحب وتشجيع،<br><strong style="color:#243d17;font-style:normal;">The First Step</strong></p>'
    : '<p style="margin:0 0 16px;">Hi ' + firstName + ',</p>' +
      '<p style="margin:0 0 16px;">Welcome to <strong style="color:#243d17;">The First Step</strong>.<br>We are genuinely excited to have you here.</p>' +
      '<p style="margin:0 0 16px;">Your details are in, and every answer helps us shape something more thoughtful and personal for you.<br>No pressure, no perfection, and definitely no need to panic over every meal.</p>' +
      '<p style="margin:0 0 24px;">You have already done the brave part by starting. We will handle the next steps together, one calm win at a time.</p>' +
      '<p style="margin:0;color:#5e5a52;font-style:italic;">Warmly,<br><strong style="color:#243d17;font-style:normal;">The First Step</strong></p>';

  var html = buildEmailHtml_({
    isRtl: isArabic,
    confetti: true,
    quote: isArabic ? '"بهدوء كده... خطوة ورا خطوة، وهتوصل."' : '"Small steps still count. They count a lot."',
    quoteAuthor: isArabic ? '— فريق The First Step' : '— The First Step Team',
    headline: isArabic ? ("أهلاً بيك، " + firstName) : ("Welcome, " + firstName),
    bodyHtml: htmlBody
  });

  var senderEmail = Session.getEffectiveUser().getEmail();
  MailApp.sendEmail({
    to: email,
    replyTo: senderEmail,
    subject: subject,
    body: plainBody,
    htmlBody: html,
    name: "The First Step | " + senderEmail
  });
}

function humanizeGoal_(goal) {
  var value = (goal || "").toString().trim().toLowerCase();
  var map = {
    lose: "weight loss",
    gain: "healthy weight gain",
    maintain: "weight maintenance",
    healthy: "better health",
    muscle: "muscle building"
  };
  return map[value] || (goal || "your goal");
}

function sendGoalReminderEmail(data) {
  var email = (data.email || "").toString().trim();
  if (!email) throw new Error("Email is required to send a reminder.");

  var isArabic = resolvePreferredLanguage_(data) === "ar";
  var rawName = (data.full_name || "").toString().trim();
  var firstName = rawName ? rawName.split(/\s+/)[0] : (isArabic ? "صديقي" : "there");
  var goalLabel = humanizeGoal_(data.goal);

  var subject = isArabic
    ? "رسالة لطيفة تفكرك بهدفك"
    : "A little reminder for your goal";

  var plainBody = isArabic
    ? "أهلاً يا " + firstName + "،\n\nبس جايين نفكرك على خفيف بهدفك الحالي: " + goalLabel + ".\nمش لازم تعمل انقلاب كوني النهارده، قرار صغير مظبوط يكفي جداً.\n\nاشرب مية زيادة، كل أكلك بهدوء، أو قاوم السناك اللي بيظهر فجأة كده من العدم.\nالاستمرار أهم من المثالية، واليوم الحلو يبدأ أحياناً من قرار بسيط جداً.\n\nيلا شد حيلك... وإحنا معاك من غير صفارة حكم.\n\nThe First Step\n\n---\nلتحسين وصول الإيميلات، يرجى حفظ هذا الإيميل في جهات الاتصال. للإلغاء، يرجى الرد بـ Unsubscribe."
    : "Hi " + firstName + ",\n\nJust a quick and friendly reminder about your current goal: " + goalLabel + ".\nYou do not need a perfect day to make progress. One good decision still counts.\n\nDrink a little more water, build one balanced meal, or ignore that dramatic snack craving for five minutes.\nConsistency beats perfection, every single time.\n\nWe are rooting for you,\nThe First Step\n\n---\nTo ensure delivery, please add this email to your contacts. To unsubscribe, reply 'Unsubscribe'.";

  var goalBadge = '<div style="text-align:center;margin:0 0 28px;"><div style="display:inline-block;background:linear-gradient(135deg,#f5ead4 0%,#fdf3e0 50%,#f5ead4 100%);border:1.5px solid #c9993a;border-radius:4px;padding:14px 32px;font-size:13px;font-weight:700;color:#a0782a;letter-spacing:0.18em;text-transform:uppercase;font-family:Arial,sans-serif;position:relative;"><span style="position:absolute;top:4px;left:6px;font-size:8px;color:#c9993a;opacity:.6;">&#9670;</span><span style="position:absolute;top:4px;right:6px;font-size:8px;color:#c9993a;opacity:.6;">&#9670;</span>' + goalLabel + '</div></div>';

  var htmlBody = isArabic
    ? '<p style="margin:0 0 16px;">أهلاً يا ' + firstName + '،</p>' +
      '<p style="margin:0 0 16px;">جايين نفكرك على خفيف بهدفك الحالي:</p>' +
      goalBadge +
      '<p style="margin:0 0 16px;">مش لازم تعمل معجزة النهارده. خطوة صغيرة بس مظبوطة تفرق جداً.</p>' +
      '<p style="margin:0 0 24px;">اشرب مية زيادة، كل بهدوء، أو سيب السناك المستعجل يزعل لوحده.<br>الاستمرار أهم من المثالية، وإحنا معاك خطوة بخطوة ومن غير أي جلد ذات.</p>' +
      '<p style="margin:0;color:#5e5a52;font-style:italic;">يلا كمّلها بشويّة حماس،<br><strong style="color:#243d17;font-style:normal;">The First Step</strong></p>'
    : '<p style="margin:0 0 16px;">Hi ' + firstName + ',</p>' +
      '<p style="margin:0 0 4px;">Here is your friendly little reminder:</p>' +
      goalBadge +
      '<p style="margin:0 0 16px;">You do not need a perfect day to stay on track. One steady choice still matters.</p>' +
      '<p style="margin:0 0 24px;">Pick one simple win today that supports your goal.<br>Drink the water, build the balanced plate, and do not let one random craving act like it runs the whole day.</p>' +
      '<p style="margin:0;color:#5e5a52;font-style:italic;">Cheering you on,<br><strong style="color:#243d17;font-style:normal;">The First Step</strong></p>';

  var html = buildEmailHtml_({
    isRtl: isArabic,
    headline: isArabic ? ("فاكرينك يا " + firstName) : ("A little reminder, " + firstName),
    bodyHtml: htmlBody
  });

  var senderEmail = Session.getEffectiveUser().getEmail();
  MailApp.sendEmail({
    to: email,
    replyTo: senderEmail,
    subject: subject,
    body: plainBody,
    htmlBody: html,
    name: "The First Step | " + senderEmail
  });
}

function doGet(e) {
  try {
    var sheet = getSheet_();
    ensureHeaders_(sheet);
    ensurePatientIds_(sheet);
    var values = sheet.getDataRange().getDisplayValues();
    var headers = values[0];
    var emailCol = headers.indexOf("Email");
    var view = e.parameter && e.parameter.view ? e.parameter.view.toLowerCase().trim() : "";

    var filterEmail = e.parameter && e.parameter.email
      ? e.parameter.email.toLowerCase().trim()
      : null;

    if (view === "dashboard") {
      var summaries = getDashboardSummaries_(sheet);
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, count: summaries.length, data: summaries }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (!filterEmail) {
      var all = values.slice(1).map(function(row) {
        return rowToObject_(headers, row);
      });
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, count: all.length, data: all }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    for (var i = 1; i < values.length; i++) {
      var rowEmail = (values[i][emailCol] || "").toString().toLowerCase().trim();
      if (rowEmail === filterEmail) {
        var obj = rowToObject_(headers, values[i]);
        return ContentService
          .createTextOutput(JSON.stringify({ found: true, rowIndex: i + 1, data: obj }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ found: false }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Test: run this from the Apps Script editor to verify both email types ────
function runEmailTest() {
  var to   = "muhammad9farid@gmail.com";
  var from = Session.getEffectiveUser().getEmail();
  var name = "The First Step | " + from;

  MailApp.sendEmail({
    to:      to,
    subject: "Welcome to The First Step",
    body:    "Hi Muhammad,\n\nWelcome to The First Step! Your nutritional portrait is ready.\n\nWarmly,\nThe First Step",
    name:    name
  });
  Logger.log("✓ Welcome email sent to " + to);

  MailApp.sendEmail({
    to:      to,
    subject: "A little reminder for your goal",
    body:    "Hi Muhammad,\n\nJust a friendly reminder about your weight loss goal. Keep going, one step at a time.\n\nCheering you on,\nThe First Step",
    name:    name
  });
  Logger.log("✓ Goal reminder sent to " + to);
}

function doPost(e) {
  try {
    var sheet = getSheet_();
    ensureHeaders_(sheet);
    ensurePatientIds_(sheet);
    var data = JSON.parse(e.postData.contents);
    var values = sheet.getDataRange().getDisplayValues();
    var headers = values[0];
    var deletedCol = getHeaderIndex_(headers, "Deleted");
    var patientIdCol = getHeaderIndex_(headers, "Patient ID");

    if (data.action === "send_goal_reminder") {
      sendGoalReminderEmail(data);
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, mode: "goal_reminder_sent" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (data.action === "send_welcome_email") {
      sendWelcomeEmail(data);
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, mode: "welcome_email_sent" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var existingRow = findRowByEmail(sheet, data.email);

    if (data.action === "delete_patient") {
      if (existingRow === -1) {
        return ContentService
          .createTextOutput(JSON.stringify({ success: false, message: "Patient not found." }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      if (deletedCol === -1) {
        throw new Error('Deleted column was not found.');
      }
      sheet.getRange(existingRow, deletedCol + 1).setValue("1");
      clearDashboardCache_();
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, mode: "deleted", row: existingRow }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (deletedCol !== -1 && !data.deleted) {
      if (existingRow !== -1) {
        data.deleted = values[existingRow - 1][deletedCol] || "0";
      } else {
        data.deleted = "0";
      }
    }

    if (patientIdCol !== -1 && !data.patient_id) {
      if (existingRow !== -1) {
        data.patient_id = values[existingRow - 1][patientIdCol] || generateUniquePatientId_(sheet, headers);
      } else {
        data.patient_id = generateUniquePatientId_(sheet, headers);
      }
    }

    var newRow = buildRow(data);

    // Email is the account identity, so any existing row should be updated.
    if (existingRow !== -1) {
      sheet.getRange(existingRow, 1, 1, newRow.length).setValues([newRow]);
      clearDashboardCache_();
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, mode: "updated", row: existingRow }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    sheet.appendRow(newRow);
    clearDashboardCache_();
    var welcomeSent = false;
    var welcomeError = "";
    try {
      sendWelcomeEmail(data);
      welcomeSent = true;
    } catch (mailErr) {
      welcomeError = String(mailErr);
      Logger.log("Welcome email skipped: " + welcomeError);
    }
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        mode: "inserted",
        welcome_email_sent: welcomeSent,
        welcome_email_error: welcomeError
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
