# Project Documentation — The First Step (Nutritional Portrait Survey)

A complete record of everything built in this project, with implementation details and references for recreating each piece.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [File Structure](#2-file-structure)
3. [Feature Inventory](#3-feature-inventory)
4. [Frontend — index.html](#4-frontend--indexhtml)
5. [Backend — Code.gs (Google Apps Script)](#5-backend--codegs-google-apps-script)
6. [Screen Flow](#6-screen-flow)
7. [Design System (CSS Tokens)](#7-design-system-css-tokens)
8. [Animations & Engagement Effects](#8-animations--engagement-effects)
9. [Google Sign-In Integration](#9-google-sign-in-integration)
10. [Google Sheets Integration](#10-google-sheets-integration)
11. [Bilingual Support (EN / AR)](#11-bilingual-support-en--ar)
12. [Survey Logic & Question Engine](#12-survey-logic--question-engine)
13. [Profile Screen](#13-profile-screen)
14. [Result Screen & Archetypes](#14-result-screen--archetypes)
15. [Mobile Responsiveness](#15-mobile-responsiveness)
16. [Deployment — GitHub Pages](#16-deployment--github-pages)
17. [How to Recreate From Scratch](#17-how-to-recreate-from-scratch)

---

## 1. Project Overview

**"The First Step"** is a single-HTML-file dietary/nutritional survey web app.  
Users sign in with Google (or skip as guest), choose a language (English / Arabic), fill in personal details, complete a ~31-question survey, and receive a personalised "nutritional archetype" result. Every submission is stored in a Google Sheet and a welcome email is sent via Google Apps Script.

**Live deployment:** GitHub Pages (root `index.html`)  
**Data storage:** Google Sheets via a deployed Apps Script Web App  
**Auth:** Google Identity Services (GIS / GSI) — JWT-based, no backend required  

---

## 2. File Structure

```
index.html   — entire frontend (HTML + CSS + JS, ~2 665 lines)
Code.gs      — Google Apps Script backend (~193 lines)
```

Everything intentionally lives in two files so the app can be hosted as a static file on GitHub Pages with zero build tooling.

---

## 3. Feature Inventory

| # | Feature | Commit |
|---|---------|--------|
| 1 | Interactive dietary survey with animated transitions | `9d16193` |
| 2 | Google Sign-In (JWT / GSI) with profile pre-fill | `37f0ba4` |
| 3 | Personal details screen (Name, Email, Phone, DOB, Gender, City) | `5858ec3` |
| 4 | Google Sheets submit via Apps Script Web App | `75cff60` |
| 5 | Mobile scroll fix (html/body height:auto on ≤520 px) | `6ab85a4` |
| 6 | Profile edit flow | `0618ad4` |
| 7 | Remove age/gender survey questions (replaced by profile screen) | `378dc7f` |
| 8 | Single-page architecture restored (reverted multi-page split) | `a726970` |
| 9 | Google sign-in button polish | `a847f3c` |
| 10 | Facebook/Apple sign-in removed (Google only) | `17bac32` |
| 11 | Mobile back-button repositioned out of primary tap area | `20c864f` |
| 12 | Brand renamed to "The First Step" + patient welcome email | `70de985` |

---

## 4. Frontend — index.html

**Key sections (by line range):**

| Section | Lines (approx.) |
|---------|----------------|
| CSS design tokens & global reset | 9–43 |
| Card, button, option, progress styles | 57–213 |
| Login screen styles | 342–378 |
| Profile screen styles | 379–421 |
| Animation keyframes (ripple, float, confetti, etc.) | 423–560 |
| Story panel (left sidebar) styles | 580–730 |
| Responsive / mobile overrides | 785–1100 |
| HTML body: screens | 1688–1843 |
| `QUESTIONS` array (survey data) | 1855–1920 |
| Core JS — survey engine, submit, GSI, profile | 1923–2665 |

### External dependencies (CDN only)

```html
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:…&family=Inter:…&family=Cairo:…" rel="stylesheet"/>

<!-- Google Identity Services (GSI) -->
<script src="https://accounts.google.com/gsi/client" onload="initGSI()" async defer></script>
```

No npm, no bundler, no framework. Pure vanilla HTML/CSS/JS.

---

## 5. Backend — Code.gs (Google Apps Script)

**Reference:** [Code.gs](Code.gs)

### Functions

| Function | Purpose |
|----------|---------|
| `initSheet()` | Run once manually — writes column headers to Sheet1 |
| `buildRow(data)` | Maps JSON payload → flat array in header order |
| `sendWelcomeEmail(data)` | Sends bilingual welcome email via `MailApp` |
| `doGet(e)` | Returns all rows, or one row filtered by `?email=…` |
| `doPost(e)` | Insert new row OR update existing row (matched by email) |

### Column schema (44 columns)

```
Timestamp | Language | Full Name | Email | Phone | DOB | Gender (Profile) | City | Login Via |
Age | Gender | Height | Weight | BMI | Diet | Activity | Meals/Day | Breakfast |
Late Night | TV Snack | Sweets | Beverages | Water | Conditions | Thyroid Type |
Doctor Followup | Medications | Allergies | Digestive | Surgery | Surgery Details |
Sleep | Stress | Stress Eat | Exercise | Goal | Dislikes | Weakness | Fav Meal |
Pregnant | Period | Past Diet | Notes | Raw JSON
```

### Update vs Insert logic

```javascript
// In doPost — if mode:"update" and email matches an existing row, overwrite it.
// Otherwise append a new row.
if (data.mode === "update" && data.email) { /* find row by email, overwrite */ }
sheet.appendRow(newRow);
```

---

## 6. Screen Flow

```
Login Screen
  ↓  Google Sign-In  OR  "Continue as Guest"
Language Screen  (EN 🇬🇧 / AR 🇸🇦)
  ↓  startSurvey('en' | 'ar')
Profile Screen  (Name, Email, Phone, DOB, Gender, City)
  ↓  submitProfile()
  ├── [returning user detected via doGet?email=…]  →  Returning Screen (summary)
  └── [new user]  →  Survey Screen  (31 questions)
                        ↓  submitSurvey()  →  POST to Google Sheets
Result Screen  (Nutritional Archetype + BMI + Profile overview)
```

### Screen HTML IDs

| Screen | ID |
|--------|----|
| Login | `#login-screen` |
| Language | `#lang-screen` |
| Profile | `#profile-screen` |
| Returning user | `#returning-screen` |
| Survey | `#survey-screen` |
| Result | `#result-screen` |

Screens are shown/hidden with `.hidden` (CSS `display:none`).

---

## 7. Design System (CSS Tokens)

All colours defined as `--` variables on `:root`:

```css
:root {
  --parchment:  #ede8df;   /* page background */
  --cream:      #fdfaf5;
  --ivory:      #f8f4ed;   /* card / option backgrounds */
  --forest:     #243d17;   /* primary action colour */
  --forest-mid: #355924;
  --forest-pale:#e4ede0;
  --sage:       #8ba67a;   /* progress bar end colour */
  --gold:       #a0782a;   /* section labels */
  --gold-pale:  #f5ead4;
  --gold-border:#c9993a;
  --charcoal:   #1a1912;   /* headings */
  --stone:      #5e5a52;
  --warm-gray:  #968f84;
  --border:     #d5ccc1;
  --border-fine:#e2dbd2;
  --shadow: 0 20px 60px rgba(26,25,18,0.10), 0 4px 12px rgba(26,25,18,0.05);
  --r: 6px;                /* global border-radius */
}
```

**Fonts (Google Fonts):**

| Font | Usage |
|------|-------|
| `Playfair Display` | Headlines, question titles (EN) |
| `Inter` | Body text, buttons (EN) |
| `Cairo` | Arabic text + RTL body |

---

## 8. Animations & Engagement Effects

### Slide transitions (question-to-question)

```css
/* In CSS — index.html ~line 423 */
.slide-out-left  { animation: slideLeft  0.35s ... }
.slide-in-right  { animation: slideRight 0.35s ... }
/* mirrored for Back direction */
```

Triggered in JS via `goNext()` / `goBack()` by toggling CSS classes on the survey card.

### Option ripple + bounce

```css
.ripple-wave { animation: rippleAnim 0.55s ease-out forwards; }
.option-bounce { animation: optBounce 0.38s cubic-bezier(0.22,1,0.36,1); }
```

A `<div class="ripple-wave">` is injected on click then removed after animation.

### Floating food particles (background)

```css
.food-particle { animation: floatUp linear infinite; }
```

JS creates `<span>` elements with random food emojis (🥦🥑🍋…) at random positions and intervals.

### Milestone toasts

```css
.m-toast { position:fixed; bottom:24px; left:50%; transform:translateX(-50%) translateY(40px); }
.m-toast.show { transform: translateX(-50%) translateY(0); opacity:1; }
```

Shown at **25%, 50%, 75%** question completion. Triggered in `checkMilestone()`.

### Confetti burst

```html
<canvas id="confetti-canvas"></canvas>
```

Custom canvas-based confetti in JS at **50%** completion and on the **result screen**. Particles have random colour, size, rotation speed, and gravity.

### Progress bar glow

```css
.progress-fill.glow { animation: progressGlow 0.65s ease; }
```

`.glow` class is added/removed on each step advance.

### Checkpoint overlay

Full-screen frosted overlay shown at survey section boundaries:

```javascript
function showCheckpoint(msg, section, done) {
  // Creates a .checkpoint-overlay div, fades in for 2s, then calls done()
}
```

### Story panel (left sidebar)

- Shows user avatar, name, login method
- Live progress bar (`story-meter-fill`)
- Current step / remaining / energy level stats
- Rotating emoji illustration + caption
- Affirmation note

---

## 9. Google Sign-In Integration

**Reference:** [index.html line 1685–1686, 2099–2165](index.html)

### Setup steps

1. Go to [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Credentials
2. Create an **OAuth 2.0 Client ID** → Web application
3. Add your GitHub Pages URL to **Authorised JavaScript origins**
4. Copy the Client ID

### In `index.html`

```html
<!-- Load GSI library -->
<script src="https://accounts.google.com/gsi/client" onload="initGSI()" async defer></script>
```

```javascript
const GOOGLE_CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';

function initGSI() {
  const wrap = document.getElementById('google-btn-wrap');
  if (!wrap || typeof google === 'undefined') return;

  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleGoogleLogin,
  });

  google.accounts.id.renderButton(wrap, {
    theme: 'outline',
    size: 'large',
    width: 340,
    logo_alignment: 'left',
  });
}

function handleGoogleLogin(response) {
  // Decode JWT — no server round-trip needed for basic profile
  const payload = JSON.parse(atob(response.credential.split('.')[1]));
  // payload.name, payload.email, payload.picture, payload.sub
}
```

### What Google exposes in the ID token

| Field | Available |
|-------|-----------|
| `name` | ✅ |
| `email` | ✅ |
| `picture` | ✅ |
| `gender` | ❌ (not in ID token) |
| `birthday` | ❌ (not in ID token) |

---

## 10. Google Sheets Integration

**Reference:** [Code.gs](Code.gs), [index.html line 1851–1852, 1997–2029](index.html)

### Deploying the Apps Script

1. Open [script.google.com](https://script.google.com), create a new project
2. Paste `Code.gs` contents
3. Run `initSheet()` once to write headers
4. **Deploy → New deployment → Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the deployment URL

### Configuring in `index.html`

```javascript
const WEB_APP_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
```

### Submitting a response (POST)

```javascript
async function submitSurvey() {
  const payload = buildSubmissionPayload(); // assembles all answers + personal data
  const resp = await fetch(WEB_APP_URL, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
```

### Checking for returning user (GET)

```javascript
fetch(WEB_APP_URL + '?email=' + encodeURIComponent(email))
  .then(r => r.json())
  .then(data => {
    if (data.found) showReturningSummary(data.data);
    else showProfileScreen();
  });
```

### Updating an existing row

Send `mode: "update"` in the POST body. `doPost` matches by email and overwrites that row.

```javascript
{ ...payload, mode: "update" }
```

### Welcome email

`sendWelcomeEmail(data)` is called automatically inside `doPost` on insert (not on update).  
Uses `MailApp.sendEmail()` — no external email provider needed.  
Detects language from `data.language` and sends Arabic or English copy.

---

## 11. Bilingual Support (EN / AR)

**Reference:** [index.html ~line 2200–2310](index.html)

### How it works

- A global `let lang = 'en'` variable is set when the user picks a language
- `body.rtl` class is toggled for RTL layout
- All UI strings live in a `T` translation object:

```javascript
const T = {
  en: { next: 'Continue', back: 'Back', skip: 'Skip', err: 'Please select an option', ... },
  ar: { next: 'متابعة',   back: 'رجوع',  skip: 'تخطّ',  err: 'الرجاء اختيار خيار',    ... },
};
```

- Each question object has both `en` and `ar` fields for `q` (question text), `options`, and `section`
- Each option has both `option-en` and `option-ar` spans rendered side-by-side (en bold, ar muted under it)
- Arabic body uses `font-family: 'Cairo'` and `direction: rtl`

### Switching language

```javascript
function startSurvey(selectedLang) {
  lang = selectedLang;
  if (lang === 'ar') document.body.classList.add('rtl');
}
```

---

## 12. Survey Logic & Question Engine

**Reference:** [index.html line 1855–2090](index.html)

### Question types

| Type | Behaviour |
|------|-----------|
| `single` | One option selectable; auto-advances after selection |
| `multi` | Multiple options; "None" deselects others |
| `text` | Free-text `<textarea>` |
| `dual-text` | Two numeric fields (e.g. Height + Weight → BMI auto-calculated) |

### Conditional questions

Each question can have a `condition` function:

```javascript
{
  id: 'thyroid_type',
  condition: () => getAnswer('conditions')?.vals?.includes('thyroid'),
  // Only shown if user selected 'thyroid' in the conditions question
}
```

`totalVisible()` and `visibleIndex()` recalculate on every step to keep progress accurate.

### BMI auto-calculation

```javascript
function calcBMI() {
  const h = parseFloat(getAnswer('height')?.fields?.height_cm);
  const w = parseFloat(getAnswer('weight')?.fields?.weight_kg);
  if (!h || !w) return null;
  const bmi = (w / ((h / 100) ** 2)).toFixed(1);
  // Categorise as Underweight / Normal / Overweight / Obese
  return { value: bmi, cat: { en: '...', ar: '...', color: '...' } };
}
```

### Building the submission payload

```javascript
function buildSubmissionPayload() {
  return {
    language: lang,
    full_name: userPersonalData.name,
    email: userPersonalData.email,
    phone: userPersonalData.phone,
    dob: userPersonalData.dob,
    gender_profile: userPersonalData.gender,
    city: userPersonalData.city,
    login_via: loginMethod,    // 'Google' | 'Guest'
    age: getAnswer('age')?.val,
    gender: getAnswer('gender')?.val,
    height: getAnswer('height')?.fields?.height_cm,
    weight: getAnswer('weight')?.fields?.weight_kg,
    bmi: calcBMI()?.value,
    beverages: getAnswer('beverages')?.vals,   // Array — joined in Code.gs
    conditions: getAnswer('conditions')?.vals, // Array — joined in Code.gs
    // ... all other survey answer IDs
  };
}
```

---

## 13. Profile Screen

**Reference:** [index.html line 1763–1814](index.html)

### Fields

| Field | Input type | Auto-filled from Google? |
|-------|-----------|--------------------------|
| Full Name | `text` | ✅ |
| Email | `email` | ✅ |
| Phone | `tel` | ❌ |
| Date of Birth | `date` | ❌ |
| Gender | radio buttons | ❌ |
| City | `text` | ❌ |

### Auto-fill behaviour

After Google login, the profile form is pre-populated with name and email. Auto-filled fields get a green border to signal they came from Google.

### DOB → Age pre-answer

```javascript
// When DOB is entered, age range is calculated and pre-answered in the survey
const age = new Date().getFullYear() - new Date(dob).getFullYear();
// Maps to one of the age-range answer values
```

### Returning user detection

After profile submission, the app calls `doGet?email=…`. If the email is found in the sheet, the user sees a **Returning Screen** with a summary of their previous answers instead of the full survey.

---

## 14. Result Screen & Archetypes

**Reference:** [index.html ~line 2091, and the `ARCHETYPES` object](index.html)

### How archetype is chosen

```javascript
function getArchetype(goal, diet, exercise, weakness, stress, stressEat) {
  // Decision tree based on survey answers
  // Returns one of: 'balanced', 'sporty', 'comfort', 'mindful', 'reset', etc.
}
```

Each archetype has:
- `en` / `ar` — display name
- `emoji` — crest icon
- `portrait.en` / `portrait.ar` — one-line personality sentence
- `tip.en` / `tip.ar` — actionable insight

### Result card contents

1. Archetype crest emoji + name
2. Portrait sentence
3. BMI block (number + category + colour)
4. Overview profile rows (goal, meals, exercise, sleep, water, favourite dish)
5. Insight block
6. "New Portrait" restart button

---

## 15. Mobile Responsiveness

**Reference:** [index.html ~line 785–1100](index.html)

### Layout breakpoints

| Breakpoint | Behaviour |
|-----------|-----------|
| ≥ 900 px | Two-column: story panel left (40%) + survey card right (60%) |
| 520–899 px | Story panel collapses to top bar; card full width |
| ≤ 520 px | Single column; `html,body { height:auto }` so content scrolls |

### Mobile scroll fix (commit `6ab85a4`)

Default `height:100%; overflow:hidden` on html/body caused the nav bar to be cut off on phones. Fix:

```css
@media (max-width: 520px) {
  html { height: auto; }
  body { height: auto; overflow: auto; }
}
```

### Back button tap-area fix (commit `20c864f`)

The back button was inside the same row as the primary "Continue" button. On mobile, taps on "Continue" accidentally triggered "Back". Fix: moved the back button to a fixed position above the nav bar on small screens:

```css
@media (max-width: 520px) {
  .btn-back { position: fixed; top: 16px; left: 16px; z-index: 50; }
}
```

---

## 16. Deployment — GitHub Pages

1. Push `index.html` (and `Code.gs` for reference) to the `main` branch of a GitHub repo
2. Go to **Settings → Pages → Source: Deploy from branch → main → / (root)**
3. GitHub Pages serves `index.html` at `https://<username>.github.io/<repo>/`

The file was renamed from `dietary_survey.html` → `Health survey.html` → `index.html` specifically for GitHub Pages root serving (commit `fdac1ef`).

---

## 17. How to Recreate From Scratch

### Step 1 — Google Cloud: OAuth Client ID

1. [console.cloud.google.com](https://console.cloud.google.com) → New Project
2. APIs & Services → OAuth Consent Screen → External → fill in app name
3. Credentials → Create → OAuth 2.0 Client ID → Web application
4. Authorised JS origins: `https://<your-github-pages-url>`
5. Copy Client ID → paste into `index.html` at `const GOOGLE_CLIENT_ID = '...'`

### Step 2 — Google Sheets + Apps Script

1. Create a new Google Sheet named anything (note the Sheet tab is `Sheet1`)
2. Extensions → Apps Script → paste `Code.gs`
3. Run `initSheet()` once (grants permission; writes headers)
4. Deploy → New Deployment → Web App → Anyone → Copy URL
5. Paste URL into `index.html` at `const WEB_APP_URL = '...'`

### Step 3 — GitHub Pages

1. Create a repo, push `index.html`
2. Settings → Pages → Branch: main / root
3. Wait ~1 min → visit the Pages URL

### Step 4 — Test end-to-end

1. Open the Pages URL
2. Sign in with Google → complete survey
3. Open your Google Sheet → confirm row was added
4. Check the email inbox used during sign-in → confirm welcome email arrived

### Checklist of things to customise

- [ ] `GOOGLE_CLIENT_ID` — your own OAuth client ID
- [ ] `WEB_APP_URL` — your own Apps Script deployment URL
- [ ] Brand name — search-replace `The First Step` throughout `index.html`
- [ ] `QUESTIONS` array — add/remove/edit survey questions
- [ ] `ARCHETYPES` object — update result personalities
- [ ] Welcome email copy in `sendWelcomeEmail()` in `Code.gs`
- [ ] Column headers in `initSheet()` if you add/remove questions
- [ ] `buildRow()` mapping in `Code.gs` to match any new columns
- [ ] `buildSubmissionPayload()` in `index.html` to include new fields

---

*Generated 2026-04-16. All code lives in [index.html](index.html) and [Code.gs](Code.gs).*
