---
version: dark-v1
name: Dhaka-Bus-Finder-design
description: "ডার্ক-অনলি সম্পাদকীয় কাঠামো, মাঝে মাঝে বড় পেস্টেল রঙের ব্লক (স্টিকি নোটের মতো কালো লেখাসহ)। সব বাটন পিল। ফন্ট: বাংলায় Noto Serif Bengali, ইংরেজিতে Average Sans।"

colors:
  canvas: "#0a0a0a"
  surface: "#141414"
  surface-raised: "#1c1c1c"
  hairline: "#2a2a2a"
  hairline-soft: "#1f1f1f"
  hairline-strong: "#3a3a3a"
  ink: "#f2f2f2"
  ink-muted: "#b8b8b8"
  ink-on-block: "#000000"
  button-primary-bg: "#f2f2f2"
  button-primary-text: "#0a0a0a"
  button-primary-pressed: "#d9d9d9"
  block-lime: "#dceeb1"
  block-lilac: "#c5b0f4"
  block-cream: "#f4ecd6"
  focus-ring: "#f2f2f2"

typography:
  display:      { fontSize: 56px, fontSize-mobile: 36px, fontWeight-bn: 500, fontWeight-en: 400, lineHeight-en: 1.1, lineHeight-bn: 1.35 }
  headline:     { fontSize: 26px, fontWeight-bn: 600, fontWeight-en: 400, lineHeight-en: 1.35, lineHeight-bn: 1.5 }
  subhead:      { fontSize: 26px, fontWeight-bn: 400, fontWeight-en: 400, lineHeight-en: 1.35, lineHeight-bn: 1.5 }
  card-title:   { fontSize: 24px, fontWeight-bn: 700, fontWeight-en: 400, lineHeight-en: 1.4, lineHeight-bn: 1.5 }
  body-lg:      { fontSize: 20px, fontWeight-bn: 400, fontWeight-en: 400, lineHeight-en: 1.4, lineHeight-bn: 1.6 }
  body:         { fontSize: 18px, fontWeight-bn: 400, fontWeight-en: 400, lineHeight-en: 1.45, lineHeight-bn: 1.65 }
  body-sm:      { fontSize: 16px, fontWeight-bn: 400, fontWeight-en: 400, lineHeight-en: 1.45, lineHeight-bn: 1.65 }
  button:       { fontSize: 18px, fontWeight-bn: 500, fontWeight-en: 400, lineHeight: 1.4 }
  eyebrow:      { fontFamily: ui-monospace, fontSize: 14px, fontWeight: 400, letterSpacing-en: 0.54px, textTransform-en: uppercase }
  caption:      { fontFamily: ui-monospace, fontSize: 14px, fontWeight: 400, letterSpacing-en: 0.4px, textTransform-en: uppercase }

rounded:
  xs: 2px
  sm: 6px
  md: 8px
  lg: 24px
  pill: 50px
  full: 9999px

spacing:
  hair: 1px
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 96px

components:
  button-primary:    { backgroundColor: "{colors.button-primary-bg}", textColor: "{colors.button-primary-text}", pressedColor: "{colors.button-primary-pressed}", typography: "{colors.button}", rounded: "{rounded.pill}", padding: "10px 24px", height: 44px }
  button-secondary:  { backgroundColor: "transparent", textColor: "{colors.ink}", typography: "{typography.button}", rounded: "{rounded.pill}", padding: "10px 24px", height: 44px, border: "1px solid {colors.hairline-strong}" }
  lang-toggle:       { backgroundColor: "transparent", textColor: "{colors.ink}", rounded: "{rounded.pill}", padding: "8px 18px", height: 44px, border: "1px solid {colors.hairline}" }
  lang-toggle-selected: { backgroundColor: "{colors.button-primary-bg}", textColor: "{colors.button-primary-text}", rounded: "{rounded.pill}" }
  text-input:        { backgroundColor: "{colors.surface}", textColor: "{colors.ink}", typography: "{typography.body}", rounded: "{rounded.md}", padding: "12px 14px", height: 48px, border: "1px solid {colors.hairline}" }
  suggestion-menu:   { backgroundColor: "{colors.surface-raised}", textColor: "{colors.ink}", typography: "{typography.body-sm}", rounded: "{rounded.md}", padding: "8px", border: "1px solid {colors.hairline-strong}" }
  color-block-section: { backgroundColor: "{colors.block-lime}", textColor: "{colors.ink-on-block}", typography: "{typography.subhead}", rounded: "{rounded.lg}", padding: "48px" }
  bus-card:          { backgroundColor: "{colors.surface}", textColor: "{colors.ink}", typography: "{typography.body}", rounded: "{rounded.lg}", padding: "24px", border: "1px solid {colors.hairline}" }
  stop-row:          { backgroundColor: "transparent", textColor: "{colors.ink}", typography: "{typography.body-sm}", rounded: "{rounded.xs}", padding: "12px 0", borderBottom: "1px solid {colors.hairline-soft}" }
  notice:            { backgroundColor: "{colors.block-cream}", textColor: "{colors.ink-on-block}", typography: "{typography.body-sm}", rounded: "{rounded.md}", padding: "16px 24px" }
  top-nav:           { backgroundColor: "{colors.canvas}", textColor: "{colors.ink}", typography: "{typography.body-sm}", height: 56px, borderBottom: "1px solid {colors.hairline}" }
  footer:            { backgroundColor: "{colors.canvas}", textColor: "{colors.ink-muted}", typography: "{typography.caption}", padding: "64px 32px" }
---

# DESIGN.md

এই অ্যাপটি **শুধুমাত্র ডার্ক মোডে (Dark-Only)** চলে। কোনো লাইট থিম বা থিম টগল নেই এবং `prefers-color-scheme` সুইচিং যোগ করা যাবে না। অ্যাপের রূপ হবে গাঢ় কালচে (`#0a0a0a`) সম্পাদকীয় কাঠামো, আর মাঝে মাঝে একটা বড় হালকা পেস্টেল রঙের ব্লক, যা অন্ধকার পাতার ওপর স্টিকি নোটের (sticky note) মতো কালো লেখাসহ ফুটে থাকে।

## মূল ধারণা

- চারপাশের কাঠামো ডার্ক: `#0a0a0a` পাতার জমি (`canvas`), `#141414` কার্ড ও ইনপুট (`surface`), `#f2f2f2` প্রধান লেখা (`ink`), আর উল্টানো পিল বাটন (`#f2f2f2` পটভূমিতে `#0a0a0a` লেখা)।
- হালকা পেস্টেল ব্লকগুলো (`block-lime`, `block-lilac`, `block-cream`) হালকাই থাকে এবং তার ওপর সবসময় কালো লেখা (`#000000`, `ink-on-block`) বসে। ব্লকগুলো ডেটার অর্থ বহন করে না, শুধু সাজসজ্জা ও প্রধান অংশের বিভাজন।
- কোনো গ্রেডিয়েন্ট নেই। কোনো শ্যাডো নেই (ডার্ক জমিতে শ্যাডো দেখা যায় না)। গভীরতা আসে `surface` + ১px `hairline` বর্ডার এবং সাজেশন মেনুতে `surface-raised` + ১px `hairline-strong` বর্ডার থেকে।
- মূল লেখায় কখনো খাঁটি সাদা (`#ffffff`) ব্যবহার করা যাবে না; সবসময় `#f2f2f2` (`ink`)।

## রং (Dark-Only Token System)

### Surfaces (পৃষ্ঠতল)

| টোকেন | মান | ব্যবহার |
|---|---|---|
| `canvas` | `#0a0a0a` | পুরো পাতার মূল ব্যাকগ্রাউন্ড |
| `surface` | `#141414` | বাস কার্ড, ইনপুট ফিল্ড |
| `surface-raised` | `#1c1c1c` | সাজেশন মেনু (ড্রপডাউন), ট্রান্সফার ও তথ্য চিপ |
| `hairline` | `#2a2a2a` | ১px সাধারণ বর্ডার (কার্ড, ইনপুট, নেভ) |
| `hairline-soft` | `#1f1f1f` | স্টপ তালিকার সারির বিভাজক (list row dividers) |
| `hairline-strong` | `#3a3a3a` | সেকেন্ডারি বাটন ও সাজেশন মেনুর বর্ডার |

### Text (লেখা)

| টোকেন | মান | ব্যবহার |
|---|---|---|
| `ink` | `#f2f2f2` | সব মূল লেখা (বডিতে কখনো খাঁটি `#fff` নয়) |
| `ink-muted` | `#b8b8b8` | **শুধুমাত্র** ক্যাপশন, প্লেসহোল্ডার, স্টপের ক্রম নম্বর ও ফুটার (সর্বনিম্ন ১৪px) |
| `ink-on-block` | `#000000` | পেস্টেল ব্লকের (`block-lime`, `block-lilac`, `block-cream`) ওপরের সব লেখা |

### Actions & Focus (বাটন ও ফোকাস)

| টোকেন | মান | ব্যবহার |
|---|---|---|
| `button-primary` | ব্যাকগ্রাউন্ড `#f2f2f2`, লেখা `#0a0a0a`, চাপা অবস্থায় `#d9d9d9` | ইনভার্টেড পিল বাটন। প্রতি স্ক্রিনে সর্বোচ্চ একটি। |
| `button-secondary` | ব্যাকগ্রাউন্ড `transparent`, ১px `hairline-strong` (`#3a3a3a`) বর্ডার, লেখা `ink` (`#f2f2f2`) | গৌণ পিল বাটন |
| `lang-toggle` | অনির্বাচিত: `transparent` + ১px `hairline` (`#2a2a2a`) বর্ডার, লেখা `ink`; নির্বাচিত: `#f2f2f2` ব্যাকগ্রাউন্ড ও `#0a0a0a` লেখা | ভাষা পরিবর্তনের পিল |
| `focus-ring` | ২px `#f2f2f2` এবং ২px অফসেট | কীবোর্ড ও ইনপুট ফোকাস রিং (কখনো সরানো যাবে না) |

### Pastel Blocks (পেস্টেল ব্লক)

| টোকেন | মান | ব্যবহার |
|---|---|---|
| `block-lime` | `#dceeb1` | হোম পেজের সার্চ ব্লক (লেখা `#000000`) |
| `block-lilac` | `#c5b0f4` | বাসের পাতার হেডার ব্লক (লেখা `#000000`) |
| `block-cream` | `#f4ecd6` | নোটিস যেমন "ডেটা নেই" বা "ডেটা অসম্পূর্ণ হতে পারে" (লেখা `#000000`) |

নিয়ম:

- এক স্ক্রিনে একটার বেশি বড় পেস্টেল ব্লক নয় (`notice` ছোট বার্তা বলে এই গণনায় পড়ে না)।
- `block-navy` বাদ দেওয়া হয়েছে।
- নতুন রং যোগ করবে না।
- রঙ দিয়ে ডেটার মান বোঝাবে না। অবস্থা বোঝাতে স্পষ্ট লেখা ব্যবহার করো।

## WCAG AA কন্ট্রাস্ট অনুপাত (Contrast Ratios)

প্রতিটি লেখা ও ব্যাকগ্রাউন্ড জোড়া WCAG AA (বডি টেক্সট ৪.৫:১, বড় টেক্সট ২৪px+ ৩:১) মানদণ্ড পূরণ করে:

| লেখার টোকেন | ব্যাকগ্রাউন্ড টোকেন | কন্ট্রাস্ট অনুপাত | মানদণ্ড (WCAG AA) |
|---|---|---|---|
| `ink` (`#f2f2f2`) | `canvas` (`#0a0a0a`) | **17.68 : 1** | Pass (AAA / AA ≥ 4.5:1) |
| `ink` (`#f2f2f2`) | `surface` (`#141414`) | **16.45 : 1** | Pass (AAA / AA ≥ 4.5:1) |
| `ink` (`#f2f2f2`) | `surface-raised` (`#1c1c1c`) | **15.22 : 1** | Pass (AAA / AA ≥ 4.5:1) |
| `ink-muted` (`#b8b8b8`) | `canvas` (`#0a0a0a`) | **9.98 : 1** | Pass (AAA / AA ≥ 4.5:1, min 14px) |
| `ink-muted` (`#b8b8b8`) | `surface` (`#141414`) | **9.29 : 1** | Pass (AAA / AA ≥ 4.5:1, min 14px) |
| `ink-muted` (`#b8b8b8`) | `surface-raised` (`#1c1c1c`) | **8.59 : 1** | Pass (AAA / AA ≥ 4.5:1, min 14px) |
| `button-primary-text` (`#0a0a0a`) | `button-primary-bg` (`#f2f2f2`) | **17.68 : 1** | Pass (AAA / AA ≥ 4.5:1) |
| `button-primary-text` (`#0a0a0a`) | `button-primary-pressed` (`#d9d9d9`) | **14.03 : 1** | Pass (AAA / AA ≥ 4.5:1) |
| `ink-on-block` (`#000000`) | `block-lime` (`#dceeb1`) | **16.91 : 1** | Pass (AAA / AA ≥ 4.5:1) |
| `ink-on-block` (`#000000`) | `block-lilac` (`#c5b0f4`) | **10.89 : 1** | Pass (AAA / AA ≥ 4.5:1) |
| `ink-on-block` (`#000000`) | `block-cream` (`#f4ecd6`) | **17.82 : 1** | Pass (AAA / AA ≥ 4.5:1) |

## ফন্ট ও ডার্ক-মোড টাইপোগ্রাফি নিয়ম

| ভাষা | ফন্ট | ওজন |
|---|---|---|
| বাংলা | Noto Serif Bengali (Variable) | সর্বনিম্ন **400**, 500, 600, 700 (কোনো হালকা/light ওজন নয়) |
| ইংরেজি | Average Sans | **শুধু 400** (`font-synthesis: none`) |
| ছোট লেবেল (eyebrow/caption) | `ui-monospace` | 400 |

Exo সম্পূর্ণ নিষিদ্ধ।

### ফন্ট ও ডার্ক-মোডের বিশেষ নিয়ম

1. **ডার্ক ব্রাউজার কন্ট্রোল:** HTML-এ `<meta name="color-scheme" content="dark">`, `<meta name="theme-color" content="#0a0a0a">` এবং CSS-এ `:root { color-scheme: dark; }` থাকবে যাতে স্ক্রলবার ও নেটিভ কন্ট্রোল ডার্ক থাকে।
2. **বাংলায় সর্বনিম্ন ওজন ৪০০:** ডার্ক জমিতে হালকা অক্ষর চিকন দেখায়, তাই বাংলায় কখনোই ৪০০-এর নিচে ওজন ব্যবহার করা যাবে না। বাংলা বডি লাইন-হাইট `1.65`, শিরোনাম কমপক্ষে `1.35`।
3. **Average Sans-এ শুধু Regular (400) আছে:** নকল বোল্ড এড়াতে `font-synthesis: none`। ইংরেজিতে হায়ারার্কি সাইজ ও লেআউট দিয়ে তৈরি হবে।
4. **বাংলায় নেগেটিভ letter-spacing নয়:** `:lang(bn)`-এ `letter-spacing: 0`।
5. **Uppercase শুধু ইংরেজিতে:** বাংলায় বড় হাতের অক্ষর নেই, তাই বাংলা eyebrow/caption সাধারণ লেখায় ১৪px।

```css
@font-face {
  font-family: "Noto Serif Bengali";
  src: url("/fonts/NotoSerifBengali-VariableFont_wdth,wght.woff2") format("woff2");
  font-weight: 400 900;
  font-display: swap;
  unicode-range: U+0980-09FF, U+200C-200D, U+0964-0965;
}
@font-face {
  font-family: "Average Sans";
  src: url("/fonts/AverageSans-Regular.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}

:root {
  color-scheme: dark;
  --font-body: "Average Sans", "Noto Serif Bengali", system-ui, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
body {
  background-color: var(--color-canvas);
  color: var(--color-ink);
  font-family: var(--font-body);
  font-synthesis: none;
  font-kerning: normal;
}

:lang(bn) { letter-spacing: 0; line-height: 1.65; font-weight: 400; }
:lang(bn) h1, :lang(bn) h2, :lang(bn) h3 { line-height: 1.35; }
:lang(en) h1 { letter-spacing: -0.02em; }
:lang(en) .eyebrow, :lang(en) .caption { text-transform: uppercase; }
```

প্রতিটি টেক্সট ব্লকে `lang="bn"` বা `lang="en"` অ্যাট্রিবিউট দিতে হবে।

## টাইপ স্কেল

| নাম | সাইজ | বাংলা ওজন | ইংরেজি ওজন | ব্যবহার |
|---|---|---|---|---|
| `display` | 56px (মোবাইল 36px) | 500 | 400 | পাতার শিরোনাম, পাতায় একবার |
| `headline` | 26px | 600 | 400 | ব্লকের ভেতরের শিরোনাম |
| `subhead` | 26px | 400 | 400 | ব্লকের ভেতরের ভূমিকা-লেখা |
| `card-title` | 24px | 700 | 400 | বাসের নাম |
| `body-lg` | 20px | 400 | 400 | ইনপুটের লেবেল, ভূমিকা |
| `body` | 18px | 400 | 400 | সাধারণ লেখা |
| `body-sm` | 16px | 400 | 400 | স্টপ তালিকা, কার্ডের ছোট তথ্য |
| `button` | 18px | 500 | 400 | সব পিল বাটন |
| `eyebrow` | 14px | 400 | 400 | বিভাগের ছোট লেবেল (mono) |
| `caption` | 14px | 400 | 400 | ফুটার, ক্যাপশন, ক্রম নম্বর (`ink-muted` সর্বনিম্ন ১৪px) |

## দূরত্ব ও আকার

- বেস ইউনিট ৮px। ধাপ: 4, 8, 12, 16, 24, 32, 48, 96।
- সেকশনের মাঝে `96px` (ট্যাবলেটে 64px, ফোনে 48px)।
- রঙের ব্লকের ভেতরে প্যাডিং `48px` (ফোনে 24px)।
- কার্ডের ভেতরে `24px`। ইনপুটে `12px 14px`।
- সর্বোচ্চ কন্টেন্ট প্রস্থ `1280px`। ফলাফল ও স্টপ তালিকার কলাম `720px`, মাঝখানে।

## আকৃতি

| টোকেন | মান | কোথায় |
|---|---|---|
| `pill` | 50px | সব টেক্সট বাটন, ভাষা টগল |
| `full` | 9999px | গোল আইকন বাটন |
| `lg` | 24px | বাস কার্ড, পেস্টেল রঙের ব্লক |
| `md` | 8px | ইনপুট, সাজেশন মেনু, নোটিস |
| `sm` | 6px | ছোট চিপ (`surface-raised`) |
| `xs` | 2px | লিংক/সারির কোণ |

চৌকো বাটন নয়।

## গভীরতা (Elevation)

কোনো বক্স-শ্যাডো নেই (ডার্ক জমিতে শ্যাডো অদৃশ্য)।

| স্তর | কীভাবে | কোথায় |
|---|---|---|
| ০ ফ্ল্যাট | কিছু নেই | পেস্টেল ব্লক (`block-*`), ফুটার |
| ১ সারফেস | `surface` (`#141414`) + ১px `hairline` (`#2a2a2a`) | ইনপুট, বাস কার্ড |
| ২ রেইজড | `surface-raised` (`#1c1c1c`) + ১px `hairline-strong` (`#3a3a3a`) | স্টপ-সাজেশন ড্রপডাউন মেনু, চিপ |

## কম্পোনেন্ট

**`button-primary`:** ইনভার্টেড পিল: ব্যাকগ্রাউন্ড `#f2f2f2`, লেখা `#0a0a0a`, চাপা অবস্থায় `#d9d9d9`, উচ্চতা ৪৪px। যেমন "খুঁজুন / Search"। এক স্ক্রিনে একটার বেশি প্রাইমারি বাটন রাখবে না।

**`button-secondary`:** স্বচ্ছ (`transparent`), লেখা `#f2f2f2` (`ink`), ১px `hairline-strong` (`#3a3a3a`) সীমা, পিল, উচ্চতা ৪৪px।

**`lang-toggle`:** "বাংলা | English", দুই পিল। অনির্বাচিত অবস্থায় `transparent` + ১px `hairline` (`#2a2a2a`) বর্ডার ও `ink` লেখা; নির্বাচিত অবস্থায় `#f2f2f2` ব্যাকগ্রাউন্ড ও `#0a0a0a` লেখা।

**`text-input`:** ব্যাকগ্রাউন্ড `surface` (`#141414`), লেখা `ink` (`#f2f2f2`), প্লেসহোল্ডার `ink-muted` (`#b8b8b8`, কমপক্ষে ১৪px), ১px `hairline` (`#2a2a2a`), কোণ ৮px, উচ্চতা ৪৮px। ফোকাসে ২px `#f2f2f2` রিং ও ২px অফসেট।

**`suggestion-menu`:** ইনপুটের নিচে স্টপ, গ্রুপ ও ল্যান্ডমার্কের তালিকা। ব্যাকগ্রাউন্ড `surface-raised` (`#1c1c1c`), ১px `hairline-strong` (`#3a3a3a`) বর্ডার, কোণ ৮px, কোনো শ্যাডো নেই। প্রতি সারি কমপক্ষে ৪৪px।

**`color-block-section` (সই করা উপাদান):**
- হোমে সার্চ ব্লক `block-lime` (`#dceeb1`), লেখা `ink-on-block` (`#000000`), কোণ ২৪px, প্যাডিং ৪৮px। ভেতরে শিরোনাম, দুটো ডার্ক ইনপুট (`#141414`), আর প্রাইমারি পিল বাটন।
- বাসের পাতার উপরে বাসের নামের ব্লক `block-lilac` (`#c5b0f4`), লেখা `#000000`।
- ৭৬৮px-এর নিচে কোণ বাদ (`border-radius: 0`), ব্লক স্ক্রিনের দুই ধার পর্যন্ত যাবে।

**`bus-card`:** ব্যাকগ্রাউন্ড `surface` (`#141414`), লেখা `ink` (`#f2f2f2`), ১px `hairline` (`#2a2a2a`), কোণ ২৪px, প্যাডিং ২৪px। ভেতরে: বাসের নাম (`card-title`), রুট বা লেগগুলোর স্টপ তালিকা, স্টপ সংখ্যা, ভাড়ার বার্তা ("ভাড়ার তথ্য নেই / Fare not in data"), এবং পেজ-গ্যাপ থাকলে `block-cream` নোটিস। সময়ের ঘড়ি বা আইকন নেই।

**`stop-row`:** সারির মাঝে ১px `hairline-soft` (`#1f1f1f`)। বাঁয়ে ক্রম নম্বর (`ink-muted`, ১৪px+), ডানে স্টপের নাম (`ink`)। টাইমলাইন বিন্দু বা সময় কলাম নেই।

**`notice` ("ডেটা নেই" / "ডেটা অসম্পূর্ণ হতে পারে"):** `block-cream` (`#f4ecd6`), লেখা `ink-on-block` (`#000000`), কোণ ৮px, প্যাডিং `16px 24px`, আইকন নেই। ছোট বার্তা হওয়ায় "এক স্ক্রিনে এক ব্লক" নিয়মের গণনায় ধরা হয় না।

**ট্রান্সফার ও পরামর্শ চিপ:** `surface-raised` (`#1c1c1c`) ব্যাকগ্রাউন্ড ও ১px `hairline` বর্ডারে ছোট চিপ, কোণ ৬px, লেখা `ink` (`#f2f2f2`): "ডেটা অনুযায়ী একই স্টপ / Same stop in data" অথবা "পরামর্শ, উৎস ডেটা নয় / Suggestion, not source data"।

**`top-nav`:** `canvas` (`#0a0a0a`), নিচে ১px `hairline` বর্ডার, উচ্চতা ৫৬px, বাঁয়ে নাম, ডানে `lang-toggle`।

**`footer`:** `canvas` (`#0a0a0a`), উপরে ১px `hairline` বর্ডার, `caption` টাইপ (১৪px, `ink-muted`)।

## লেআউট (হোম)

```
┌────────────────────────────────────┐
│ ঢাকা বাস                [বাংলা|EN] │  নেভ, 56px, #0a0a0a
├────────────────────────────────────┤
│  ┌──────────────────────────────┐  │
│  │ block-lime (#dceeb1), 24px   │  │
│  │ ঢাকার বাসের রুট খুঁজুন       │  │  display (#000000)
│  │ [ কোথা থেকে (#141414) ]      │  │  ইনপুট, কোণ 8px
│  │ [ কোথায় যাবেন (#141414)]     │  │
│  │ ( খুঁজুন - #f2f2f2 পিল )      │  │  প্রাইমারি পিল বাটন
│  └──────────────────────────────┘  │
│           96px ডার্ক ফাঁক           │
│  ফলাফল: বাস কার্ড (#141414, 1px)   │
├────────────────────────────────────┤
│ ফুটার (#0a0a0a, #b8b8b8 14px)      │
└────────────────────────────────────┘
```

## রেসপন্সিভ ও মোবাইল নেভিগেশন (Mobile Breakpoints)

| প্রস্থ | বদল |
|---|---|
| ≥ 1280px | কন্টেন্ট 1280px-এ আটকে, ফলাফল ২-কলাম গ্রিড (ম্যাপ + কার্ড) |
| ≤ 960px | ফলাফল স্প্লিট গ্রিড ১-কলামে রূপান্তর, ম্যাপের উচ্চতা ৪০০px |
| ≤ 768px | ডাইনামিক আইল্যান্ড ন্যাভবার সংকুচিত, মোবাইল বটম ফিক্সড ন্যাভবার দৃশ্যমান, সার্চ পিল ২০px কোণায় রূপান্তর |
| ≤ 560px | শিরোনাম ৩৬px, বাটন পুরো প্রস্থ, ইনপুট উল্লম্ব স্ট্যাক, পাশে ১৬px মার্জিন |

### মোবাইল স্পেসিফিকেশন:
- **বটম ন্যাভিগেশন:** `< 768px`-এ ফিক্সড বটম বার (Home, Routes, Fare, About)।
- **সার্চ বার:** মোবাইলে ওভারফ্লো মুক্ত (`scrollWidth === clientWidth = 390px`)।
- **ম্যাপ রেন্ডারিং:** মোবাইলে ম্যাপের উচ্চতা ৩৮০px এবং টাচ পিন ড্র্যাগিং অ্যাক্টিভ।
- **টাচ টার্গেট:** পিল বাটন কমপক্ষে ৪৪px উচ্চতা, ইনপুট ৪৮px, গোল আইকন বাটন ৪৪px।


## করণীয় / বর্জনীয়

**করো**
- সব পৃষ্ঠতলে ডার্ক টোকেন (`#0a0a0a`, `#141414`, `#1c1c1c`) এবং লেখায় `#f2f2f2` ব্যবহার করো।
- পেস্টেল ব্লকের ভেতরে `#000000` লেখা রাখো যাতে অন্ধকার পাতায় স্টিকি নোটের মতো স্পষ্ট দেখায়।
- ফোকাস রিং (`2px solid #f2f2f2`, `outline-offset: 2px`) সবসময় দৃশ্যমান রাখো।
- বাংলায় লাইন-হাইট `1.65` ও সর্বনিম্ন ওজন `400` রাখো, ইংরেজিতে সাইজ দিয়ে হায়ারার্কি তৈরি করো।

**করো না**
- কোনো লাইট থিম, থিম টগল বা `@media (prefers-color-scheme: light)` নিয়ম যোগ করবে না।
- বডি টেক্সটে খাঁটি `#ffffff` ব্যবহার করবে না।
- `ink-muted` (`#b8b8b8`) ১৪px-এর নিচে বা ক্যাপশন/প্লেসহোল্ডার/ক্রম নম্বর/ফুটার ছাড়া অন্য কোথাও ব্যবহার করবে না।
- গ্রেডিয়েন্ট বা বক্স-শ্যাডো ব্যবহার করবে না।
- চৌকো বাটন, ঘড়ি/সময়/ETA আইকন বা লেখা ব্যবহার করবে না।

## পরিচিত ফাঁক (Known gaps)

- ডার্ক প্যালেটটি কাস্টমভাবে তৈরি করা হয়েছে (মূল Figma রেফারেন্সে কোনো ডার্ক মোড নেই); তাই বাস্তব ফোনের স্ক্রিনে সরাসরি রোদে (direct sunlight) এর পাঠযোগ্যতা অবশ্যই যাচাই করতে হবে।
- ইনপুটের ভুল/ত্রুটির দৃশ্য আলাদা রঙিন বর্ডার দিয়ে নয়, বরং পাঠ্য বার্তা (`notice`, `block-cream`) দিয়ে দেখানো হবে।
- Average Sans ও Noto Serif Bengali পাশাপাশি ব্রাউজারে রেন্ডার করে দেখে নিতে হবে যাতে কোনো বাংলা মাত্রা বা ফলা কেটে না যায়।
