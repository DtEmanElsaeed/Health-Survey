// Run this ONCE manually to set column headers
function initSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  var headers = [
    "Timestamp", "Language",
    "Full Name", "Email", "Phone", "DOB", "Gender (Profile)", "City", "Login Via",
    "Age", "Gender", "Height", "Weight", "BMI",
    "Diet", "Activity", "Meals/Day", "Breakfast", "Late Night", "TV Snack",
    "Sweets", "Beverages", "Water", "Conditions", "Thyroid Type",
    "Doctor Followup", "Medications", "Allergies", "Digestive",
    "Surgery", "Surgery Details", "Sleep", "Stress", "Stress Eat",
    "Exercise", "Goal", "Dislikes", "Weakness", "Fav Meal",
    "Pregnant", "Period", "Past Diet", "Notes", "Raw JSON"
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
}

function buildRow(data) {
  return [
    new Date(),
    data.language || "",
    data.full_name || "",
    data.email || "",
    data.phone || "",
    data.dob || "",
    data.gender_profile || "",
    data.city || "",
    data.login_via || "",
    data.age || "",
    data.gender || "",
    data.height || "",
    data.weight || "",
    data.bmi || "",
    data.diet || "",
    data.activity || "",
    data.meals || "",
    data.breakfast || "",
    data.latenight || "",
    data.tvsnack || "",
    data.sweets || "",
    Array.isArray(data.beverages) ? data.beverages.join(", ") : (data.beverages || ""),
    data.water || "",
    Array.isArray(data.conditions) ? data.conditions.join(", ") : (data.conditions || ""),
    data.thyroid_type || "",
    data.doctor_followup || "",
    data.medications || "",
    data.allergies || "",
    Array.isArray(data.digestive) ? data.digestive.join(", ") : (data.digestive || ""),
    data.surgery || "",
    data.surgery_details || "",
    data.sleep || "",
    data.stress || "",
    data.stress_eat || "",
    data.exercise || "",
    data.goal || "",
    data.dislikes || "",
    data.weakness || "",
    data.fav_meal || "",
    data.pregnant || "",
    data.period || "",
    data.past_diet || "",
    data.notes || "",
    JSON.stringify(data)
  ];
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
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
    var values = sheet.getDataRange().getValues();
    var headers = values[0];
    var emailCol = headers.indexOf("Email");

    var filterEmail = e.parameter && e.parameter.email
      ? e.parameter.email.toLowerCase().trim()
      : null;

    if (!filterEmail) {
      var all = values.slice(1).map(function(row) {
        var obj = {};
        headers.forEach(function(h, i) { obj[h] = row[i]; });
        return obj;
      });
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, count: all.length, data: all }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    for (var i = 1; i < values.length; i++) {
      var rowEmail = (values[i][emailCol] || "").toString().toLowerCase().trim();
      if (rowEmail === filterEmail) {
        var obj = {};
        headers.forEach(function(h, idx) { obj[h] = values[i][idx]; });
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
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
    var data = JSON.parse(e.postData.contents);
    var newRow = buildRow(data);

    if (data.mode === "update" && data.email) {
      var values = sheet.getDataRange().getValues();
      var headers = values[0];
      var emailCol = headers.indexOf("Email");
      var targetEmail = data.email.toLowerCase().trim();

      for (var i = 1; i < values.length; i++) {
        var rowEmail = (values[i][emailCol] || "").toString().toLowerCase().trim();
        if (rowEmail === targetEmail) {
          sheet.getRange(i + 1, 1, 1, newRow.length).setValues([newRow]);
          return ContentService
            .createTextOutput(JSON.stringify({ success: true, mode: "updated", row: i + 1 }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    sheet.appendRow(newRow);
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
