// Run this ONCE manually to set column headers
function initSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  var headers = [
    "Timestamp", "Language",
    // Profile
    "Full Name", "Email", "Phone", "DOB", "Gender (Profile)", "City", "Login Via", "Age",
    // Measurements
    "Height", "Weight", "BMI",
    // Medical Background
    "Conditions", "Conditions Other", "Thyroid Type",
    "Medications YN", "Medications",
    "Allergies",
    "Digestive", "Digestive Duration",
    "Surgery", "Surgery Details", "Injury",
    // Daily Routine
    "Wake Time", "Morning Intake",
    "Breakfast YN", "Breakfast What", "Breakfast Skip Reason", "After Breakfast",
    "Lunch Time", "Lunch What",
    "Morning Snacks YN", "Morning Snacks What",
    "Dinner Time", "Dinner What",
    "After Dinner YN", "After Dinner What",
    // Nutrition Habits
    "Meals/Day",
    "Eating Out Breakfast", "Eating Out Lunch", "Eating Out Dinner", "Eating Out Places",
    "Fruits/Day", "Veggies/Day",
    "Red Meat/Week", "Chicken/Week", "Fish/Week", "Cereal/Week",
    // Beverages
    "Beverages", "Beverages Amount", "Water",
    // Lifestyle
    "Exercise YN", "Exercise Type", "Exercise Freq", "Gym",
    "Sleep", "Stress", "Stress Eat", "TV Snack", "TV Hours",
    // Behavior
    "Late Night", "Sweets",
    // Goals
    "Goal", "Goal Timeline",
    // Preferences
    "Dislikes", "Diet Type",
    // Open
    "Past Diet Barrier", "Notes",
    // Her Portrait
    "Pregnant", "Period",
    // Raw
    "Raw JSON"
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
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
    data.diet_type || "",
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
