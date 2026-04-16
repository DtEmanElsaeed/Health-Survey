var SHEET_NAME = "Sheet1";
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
  "Raw JSON"
];
var DASHBOARD_CACHE_KEY = "dashboard_summary_v1";
var DASHBOARD_CACHE_TTL = 120;
var DASHBOARD_FIELDS = [
  "Timestamp", "Language", "Full Name", "Email", "Phone", "City", "Login Via",
  "Age", "BMI", "Conditions", "Goal", "Stress"
];

function getSheet_() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
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
  ensureHeaders_(getSheet_());
}

function buildRow(data) {
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
    // Raw
    JSON.stringify(data)
  ];
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
  var rows = values.slice(1).filter(function(row) {
    var emailIdx = headers.indexOf("Email");
    var nameIdx = headers.indexOf("Full Name");
    return (emailIdx !== -1 && row[emailIdx]) || (nameIdx !== -1 && row[nameIdx]);
  }).map(function(row) {
    return rowToObject_(headers, row, DASHBOARD_FIELDS);
  });

  cache.put(DASHBOARD_CACHE_KEY, JSON.stringify(rows), DASHBOARD_CACHE_TTL);
  return rows;
}

function clearDashboardCache_() {
  CacheService.getScriptCache().remove(DASHBOARD_CACHE_KEY);
}

function sendWelcomeEmail(data) {
  var email = (data.email || "").toString().trim();
  if (!email) return;

  var isArabic = (data.language || "").toString().toLowerCase() === "ar";
  var rawName = (data.full_name || "").toString().trim();
  var firstName = rawName ? rawName.split(/\s+/)[0] : (isArabic ? "صديقي" : "there");

  var subject = isArabic
    ? "مرحباً بك في The First Step"
    : "Welcome to The First Step";

  var body = isArabic
    ? [
        "مرحباً " + firstName + "،",
        "",
        "أهلاً بك في The First Step.",
        "يسعدنا أن تبدأ هذه الرحلة معنا، خطوة بخطوة، وبهدوء وثقة.",
        "",
        "لقد استلمنا بياناتك، وسنستخدمها لبناء صورة غذائية أكثر دقة وخصوصية لك.",
        "لا تقلق من كثرة الأسئلة، فكل إجابة تقرّبنا من توصيات تناسبك فعلاً.",
        "",
        "نحن سعداء بوجودك هنا، ونتطلع لمرافقتك في هذه البداية.",
        "",
        "مع أطيب التمنيات،",
        "The First Step"
      ].join("\n")
    : [
        "Hi " + firstName + ",",
        "",
        "Welcome to The First Step.",
        "We are really glad you are here and excited to be part of your journey.",
        "",
        "Your details have been received, and each answer you share helps us build a more personal and thoughtful nutritional portrait for you.",
        "There is no need to feel overwhelmed by the process. We will take it one step at a time.",
        "",
        "You have already taken the hardest part: the first step.",
        "",
        "Warmly,",
        "The First Step"
      ].join("\n");

  MailApp.sendEmail({
    to: email,
    subject: subject,
    body: body,
    name: "The First Step"
  });
}

function doGet(e) {
  try {
    var sheet = getSheet_();
    ensureHeaders_(sheet);
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

function doPost(e) {
  try {
    var sheet = getSheet_();
    ensureHeaders_(sheet);
    var data = JSON.parse(e.postData.contents);
    var newRow = buildRow(data);
    var existingRow = findRowByEmail(sheet, data.email);

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
    sendWelcomeEmail(data);
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, mode: "inserted" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
