// SMarDevs B2B Sales Presentation — Clean Edition
// PptxGenJS

const pptxgen = require("pptxgenjs");

const C = {
  navy:     "0A1628",
  navy2:    "0f2744",
  navy3:    "1e3a5f",
  blue:     "2563eb",
  accent:   "0ea5e9",
  white:    "FFFFFF",
  offWhite: "F8FAFF",
  light:    "DBEAFE",
  muted:    "94A3B8",
  slate:    "64748B",
  green:    "10B981",
  amber:    "F59E0B",
  dark:     "1E293B",
  border:   "E2E8F0",
};

const P = 0.55;          // global left/right padding
const W = 10 - P * 2;   // usable width

function sh() { return { type: "outer", color: "000000", blur: 10, offset: 2, angle: 135, opacity: 0.10 }; }

function footer(s) {
  s.addShape("rect", { x: 0, y: 5.4, w: 10, h: 0.225,
    fill: { color: C.navy }, line: { color: C.navy, width: 0 } });
  s.addText("smardevs.com", {
    x: P, y: 5.42, w: 3, h: 0.18, fontSize: 7.5, color: C.slate, margin: 0 });
  s.addText("Confidential — SMarDevs 2025", {
    x: 0, y: 5.42, w: 9.6, h: 0.18, fontSize: 7.5, color: C.slate, align: "right", margin: 0 });
}

function accentBar(s, color) {
  s.addShape("rect", { x: 0, y: 0, w: 10, h: 0.05,
    fill: { color: color || C.accent }, line: { color: color || C.accent, width: 0 } });
}

function logo(s, x, y) {
  s.addShape("ellipse", { x, y, w: 0.42, h: 0.42,
    fill: { color: C.blue }, line: { color: C.accent, width: 2 } });
  s.addText("S", { x, y, w: 0.42, h: 0.42,
    fontSize: 13, bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
  s.addText([
    { text: "SMar", options: { color: C.white, bold: true } },
    { text: "Devs", options: { color: C.accent, bold: true } },
  ], { x: x + 0.52, y: y + 0.03, w: 1.8, h: 0.36, fontSize: 14, fontFace: "Calibri", margin: 0 });
}

// ── Slide 1: Cover ─────────────────────────────────────────────────────────────
function slide1(pres) {
  const s = pres.addSlide();
  s.background = { color: C.navy };
  accentBar(s, C.accent);

  // Right panel
  s.addShape("rect", { x: 6.2, y: 0, w: 3.8, h: 5.625,
    fill: { color: C.navy3 }, line: { color: C.navy3, width: 0 } });

  logo(s, P, 0.38);

  s.addText("Exceptional\nTech Talent.", {
    x: P, y: 1.05, w: 5.4, h: 1.85,
    fontSize: 44, bold: true, color: C.white, fontFace: "Georgia",
    margin: 0, lineSpacingMultiple: 1.15,
  });
  s.addText("Borderless Potential.", {
    x: P, y: 2.88, w: 5.4, h: 0.72,
    fontSize: 28, bold: true, color: C.accent, fontFace: "Georgia", margin: 0,
  });
  s.addText(
    "Pre-vetted LATAM engineers — aligned with your\ntime zone, your standards, ready in 48 hours.",
    { x: P, y: 3.72, w: 5.4, h: 0.85,
      fontSize: 13, color: C.light, fontFace: "Calibri", margin: 0, lineSpacingMultiple: 1.5 }
  );

  // 3 stat cards
  const stats = [
    { val: "40–50%", lbl: "Cost Savings" },
    { val: "48 hrs",  lbl: "Candidate Delivery" },
    { val: "97%",     lbl: "Retention Rate" },
  ];
  stats.forEach((st, i) => {
    const bx = P + i * 1.68;
    s.addShape("rect", { x: bx, y: 4.72, w: 1.52, h: 0.52,
      fill: { color: C.navy2 }, line: { color: C.blue, width: 1 } });
    s.addText(st.val, { x: bx, y: 4.73, w: 1.52, h: 0.26,
      fontSize: 14, bold: true, color: C.accent, align: "center", margin: 0 });
    s.addText(st.lbl, { x: bx, y: 4.99, w: 1.52, h: 0.22,
      fontSize: 8, color: C.muted, align: "center", margin: 0 });
  });

  // Right: big S + tagline
  s.addShape("ellipse", { x: 7.1, y: 1.3, w: 1.8, h: 1.8,
    fill: { color: C.blue }, line: { color: C.accent, width: 3 }, shadow: sh() });
  s.addText("S", { x: 7.1, y: 1.3, w: 1.8, h: 1.8,
    fontSize: 72, bold: true, color: C.white,
    align: "center", valign: "middle", fontFace: "Georgia", margin: 0 });
  s.addText("10+ years in\ntech recruiting", {
    x: 6.4, y: 3.35, w: 3.1, h: 0.75,
    fontSize: 13, color: C.light, align: "center", margin: 0, lineSpacingMultiple: 1.4 });

  footer(s);
}

// ── Slide 2: The Challenge ─────────────────────────────────────────────────────
function slide2(pres) {
  const s = pres.addSlide();
  s.background = { color: C.white };
  accentBar(s);

  // Left dark panel
  s.addShape("rect", { x: 0, y: 0, w: 3.6, h: 5.625,
    fill: { color: C.navy }, line: { color: C.navy, width: 0 } });

  s.addText("01", { x: 0.3, y: 0.3, w: 1, h: 0.55,
    fontSize: 32, bold: true, color: C.navy3, margin: 0 });
  s.addText("The\nHiring\nProblem", { x: 0.3, y: 1.0, w: 2.9, h: 2.1,
    fontSize: 32, bold: true, color: C.white, fontFace: "Georgia",
    margin: 0, lineSpacingMultiple: 1.2 });
  s.addText(
    "US tech hiring is slow, expensive, and increasingly unsustainable.",
    { x: 0.3, y: 3.3, w: 2.9, h: 1.0,
      fontSize: 12, color: C.light, margin: 0, lineSpacingMultiple: 1.5 }
  );

  // 3 pain cards — more spacing, less text
  const pains = [
    { emoji: "💸", title: "Excessive Cost",     body: "Senior US engineers cost $150K–$220K+ before benefits and overhead." },
    { emoji: "⏳", title: "Slow Time-to-Hire",  body: "Average 45+ days to fill a technical role, stalling product roadmaps." },
    { emoji: "🔍", title: "Shrinking Pool",      body: "Top candidates receive multiple offers within days — and disappear fast." },
  ];
  pains.forEach((p, i) => {
    const cy = 0.55 + i * 1.62;
    s.addShape("rect", { x: 3.9, y: cy, w: 5.75, h: 1.35,
      fill: { color: C.offWhite }, line: { color: C.border, width: 1 }, shadow: sh() });
    s.addShape("rect", { x: 3.9, y: cy, w: 0.06, h: 1.35,
      fill: { color: C.blue }, line: { color: C.blue, width: 0 } });
    s.addText(p.emoji, { x: 4.1, y: cy + 0.2, w: 0.6, h: 0.6, fontSize: 26, margin: 0 });
    s.addText(p.title, { x: 4.85, y: cy + 0.18, w: 4.6, h: 0.38,
      fontSize: 14, bold: true, color: C.dark, fontFace: "Calibri", margin: 0 });
    s.addText(p.body, { x: 4.85, y: cy + 0.6, w: 4.6, h: 0.6,
      fontSize: 11, color: C.slate, fontFace: "Calibri",
      margin: 0, lineSpacingMultiple: 1.4 });
  });

  footer(s);
}

// ── Slide 3: Why SMarDevs ──────────────────────────────────────────────────────
function slide3(pres) {
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  accentBar(s, C.blue);

  s.addText("02", { x: P, y: 0.28, w: 1, h: 0.45,
    fontSize: 28, bold: true, color: C.border, margin: 0 });
  s.addText("Why SMarDevs?", { x: P, y: 0.26, w: 8, h: 0.5,
    fontSize: 30, bold: true, color: C.navy, fontFace: "Georgia", margin: 0 });
  s.addText("Four advantages that consistently set us apart.", {
    x: P, y: 0.76, w: 8, h: 0.28,
    fontSize: 12, color: C.slate, fontFace: "Calibri", margin: 0 });

  const feats = [
    { title: "Top 5% Talent Only",       body: "Multi-stage vetting: coding test, system design, English fluency, cultural fit. Every time.", accent: C.blue },
    { title: "True Time-Zone Overlap",   body: "EST, CST, PST — real-time collaboration. No async lag, no overnight handoffs.", accent: C.accent },
    { title: "Profiles in 48 Hours",     body: "From discovery call to curated shortlist in two business days, every engagement.", accent: C.green },
    { title: "End-to-End Partnership",   body: "We handle payroll, compliance, and HR. Plus a 30-day replacement guarantee.", accent: C.amber },
  ];

  const pos = [
    { x: P,       y: 1.18 },
    { x: P + 4.7, y: 1.18 },
    { x: P,       y: 3.12 },
    { x: P + 4.7, y: 3.12 },
  ];

  feats.forEach((f, i) => {
    const { x, y } = pos[i];
    s.addShape("rect", { x, y, w: 4.35, h: 1.72,
      fill: { color: C.white }, line: { color: C.border, width: 1 }, shadow: sh() });
    s.addShape("rect", { x, y, w: 4.35, h: 0.05,
      fill: { color: f.accent }, line: { color: f.accent, width: 0 } });
    s.addText(f.title, { x: x + 0.22, y: y + 0.18, w: 3.9, h: 0.4,
      fontSize: 14, bold: true, color: C.navy, fontFace: "Calibri", margin: 0 });
    s.addText(f.body, { x: x + 0.22, y: y + 0.65, w: 3.9, h: 0.85,
      fontSize: 11.5, color: C.slate, fontFace: "Calibri",
      margin: 0, lineSpacingMultiple: 1.45 });
  });

  footer(s);
}

// ── Slide 4: Cost Savings ──────────────────────────────────────────────────────
function slide4(pres) {
  const s = pres.addSlide();
  s.background = { color: C.navy };
  accentBar(s, C.accent);

  // Right panel
  s.addShape("rect", { x: 6.1, y: 0, w: 3.9, h: 5.625,
    fill: { color: C.navy3 }, line: { color: C.navy3, width: 0 } });

  s.addText("03", { x: P, y: 0.28, w: 1, h: 0.45,
    fontSize: 28, bold: true, color: C.navy3, margin: 0 });
  s.addText("Smarter\nEconomics.", { x: P, y: 0.28, w: 5.4, h: 1.5,
    fontSize: 36, bold: true, color: C.white, fontFace: "Georgia",
    margin: 0, lineSpacingMultiple: 1.2 });

  // Big stat
  s.addText("40–50%", { x: P, y: 1.9, w: 5.4, h: 1.25,
    fontSize: 80, bold: true, color: C.accent, fontFace: "Georgia", margin: 0 });
  s.addText("average cost reduction vs. equivalent US hiring", {
    x: P, y: 3.12, w: 5.3, h: 0.38,
    fontSize: 13, color: C.light, fontFace: "Calibri", margin: 0 });
  s.addText("Senior-level expertise, US-standard output, LATAM economics.", {
    x: P, y: 3.62, w: 5.3, h: 0.38,
    fontSize: 12, color: C.muted, fontFace: "Calibri", margin: 0 });

  // Industry expertise (right panel)
  s.addText("WHERE OUR TALENT\nHAS DELIVERED", { x: 6.3, y: 0.3, w: 3.4, h: 0.58,
    fontSize: 8.5, bold: true, color: C.accent, charSpacing: 2,
    margin: 0, lineSpacingMultiple: 1.4 });

  const industries = [
    { emoji: "🏦", name: "Fintech & Banking",          desc: "Payment platforms, distributed ledgers, compliance-grade infrastructure." },
    { emoji: "🏥", name: "Healthcare",                  desc: "HIPAA-compliant systems, EHR integrations, patient-facing portals." },
    { emoji: "☁️",  name: "SaaS & B2B Software",        desc: "Scalable APIs, multi-tenant platforms, cloud-native architectures." },
  ];
  industries.forEach((ind, i) => {
    const cy = 1.05 + i * 1.5;
    s.addShape("rect", { x: 6.25, y: cy, w: 3.45, h: 1.28,
      fill: { color: C.navy2 }, line: { color: C.blue, width: 1 }, shadow: sh() });
    s.addText(ind.emoji, { x: 6.35, y: cy + 0.16, w: 0.55, h: 0.55, fontSize: 26, margin: 0 });
    s.addText(ind.name, { x: 7.02, y: cy + 0.14, w: 2.55, h: 0.34,
      fontSize: 11.5, bold: true, color: C.white, margin: 0 });
    s.addText(ind.desc, { x: 7.02, y: cy + 0.52, w: 2.55, h: 0.62,
      fontSize: 9.5, color: C.muted, margin: 0, lineSpacingMultiple: 1.35 });
  });

  footer(s);
}

// ── Slide 5: LATAM Advantage ───────────────────────────────────────────────────
function slide5(pres) {
  const s = pres.addSlide();
  s.background = { color: C.white };
  accentBar(s, C.blue);

  s.addText("04", { x: P, y: 0.28, w: 1, h: 0.45,
    fontSize: 28, bold: true, color: C.border, margin: 0 });
  s.addText("The LATAM Advantage", { x: P, y: 0.26, w: 8, h: 0.5,
    fontSize: 30, bold: true, color: C.navy, fontFace: "Georgia", margin: 0 });
  s.addText("Latin America's fastest-growing tech hub — in your time zone.", {
    x: P, y: 0.76, w: 8, h: 0.28,
    fontSize: 12, color: C.slate, margin: 0 });

  // 4 big stats
  const stats = [
    { val: "1.5M+",  lbl: "Tech grads per year" },
    { val: "75%+",   lbl: "English proficiency" },
    { val: "0–3hr",  lbl: "Time zone vs. US" },
    { val: "Top 5%", lbl: "From our network" },
  ];
  stats.forEach((st, i) => {
    const bx = P + i * 2.24;
    s.addShape("rect", { x: bx, y: 1.18, w: 2.0, h: 1.42,
      fill: { color: C.navy }, line: { color: C.navy, width: 0 }, shadow: sh() });
    s.addText(st.val, { x: bx, y: 1.28, w: 2.0, h: 0.68,
      fontSize: 30, bold: true, color: C.accent, align: "center",
      fontFace: "Georgia", margin: 0 });
    s.addText(st.lbl, { x: bx + 0.1, y: 2.0, w: 1.8, h: 0.45,
      fontSize: 10, color: C.light, align: "center",
      margin: 0, lineSpacingMultiple: 1.35 });
  });

  // Countries
  s.addText("COVERAGE", { x: P, y: 2.84, w: 3, h: 0.26,
    fontSize: 8.5, bold: true, color: C.blue, charSpacing: 3, margin: 0 });

  const countries = [
    { flag: "🇭🇳", name: "Honduras" },
    { flag: "🇨🇴", name: "Colombia" },
    { flag: "🇲🇽", name: "Mexico" },
    { flag: "🇦🇷", name: "Argentina" },
    { flag: "🇧🇷", name: "Brazil" },
    { flag: "🇨🇷", name: "Costa Rica" },
  ];
  countries.forEach((c, i) => {
    const bx = P + i * 1.55;
    s.addShape("rect", { x: bx, y: 3.2, w: 1.38, h: 0.88,
      fill: { color: C.offWhite }, line: { color: C.border, width: 1 } });
    s.addText(c.flag, { x: bx, y: 3.22, w: 1.38, h: 0.42,
      fontSize: 20, align: "center", margin: 0 });
    s.addText(c.name, { x: bx, y: 3.64, w: 1.38, h: 0.28,
      fontSize: 9, color: C.dark, align: "center", margin: 0 });
  });

  // TZ bar
  s.addShape("rect", { x: P, y: 4.28, w: W, h: 0.82,
    fill: { color: C.navy }, line: { color: C.navy, width: 0 }, shadow: sh() });
  s.addText("⏰  Same-day overlap with US Eastern, Central & Pacific — 9am to 5pm your time.", {
    x: P + 0.3, y: 4.32, w: W - 0.5, h: 0.74,
    fontSize: 13, color: C.light, valign: "middle", margin: 0 });

  footer(s);
}

// ── Slide 6: Services ──────────────────────────────────────────────────────────
function slide6(pres) {
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  accentBar(s, C.accent);

  s.addText("05", { x: P, y: 0.28, w: 1, h: 0.45,
    fontSize: 28, bold: true, color: C.border, margin: 0 });
  s.addText("Three Ways to Engage", { x: P, y: 0.26, w: 8, h: 0.5,
    fontSize: 30, bold: true, color: C.navy, fontFace: "Georgia", margin: 0 });
  s.addText("Choose the model that fits your team — or combine them.", {
    x: P, y: 0.76, w: 8, h: 0.28,
    fontSize: 12, color: C.slate, margin: 0 });

  const svcs = [
    {
      emoji: "👥",
      title: "Staff Augmentation",
      tag: "Most Popular",
      tagColor: C.blue,
      body: "Embed engineers into your team. They work in your tools, follow your process, and feel like local hires — without the recruitment overhead.",
      uses: ["Close skill gaps", "Accelerate sprints", "Scale seasonally"],
      accent: C.blue,
    },
    {
      emoji: "🚀",
      title: "Dedicated Teams",
      tag: "Best for Projects",
      tagColor: C.accent,
      body: "A fully managed squad — devs, QA, DevOps — built around your project with its own lead and clear delivery milestones.",
      uses: ["Greenfield builds", "Long-term products", "End-to-end delivery"],
      accent: C.accent,
    },
    {
      emoji: "🎯",
      title: "Direct Placement",
      tag: "Permanent Hire",
      tagColor: C.green,
      body: "We source, screen, and vet candidates for permanent roles. You interview only the top matches — ready for an offer.",
      uses: ["Permanent headcount", "Senior leadership", "Culture-fit hires"],
      accent: C.green,
    },
  ];

  svcs.forEach((sv, i) => {
    const bx = P + i * 3.08;
    s.addShape("rect", { x: bx, y: 1.18, w: 2.88, h: 4.0,
      fill: { color: C.white }, line: { color: C.border, width: 1 }, shadow: sh() });
    s.addShape("rect", { x: bx, y: 1.18, w: 2.88, h: 0.05,
      fill: { color: sv.accent }, line: { color: sv.accent, width: 0 } });

    s.addText(sv.emoji, { x: bx + 0.2, y: 1.3, w: 0.6, h: 0.55, fontSize: 24, margin: 0 });

    s.addShape("rect", { x: bx + 0.95, y: 1.34, w: 1.75, h: 0.28,
      fill: { color: sv.tagColor, transparency: 88 },
      line: { color: sv.tagColor, width: 1 } });
    s.addText(sv.tag, { x: bx + 0.95, y: 1.34, w: 1.75, h: 0.28,
      fontSize: 8, bold: true, color: sv.tagColor, align: "center", margin: 0 });

    s.addText(sv.title, { x: bx + 0.2, y: 1.95, w: 2.48, h: 0.45,
      fontSize: 15, bold: true, color: C.navy, fontFace: "Georgia", margin: 0 });
    s.addText(sv.body, { x: bx + 0.2, y: 2.52, w: 2.48, h: 1.2,
      fontSize: 10.5, color: C.slate, margin: 0, lineSpacingMultiple: 1.45 });

    s.addShape("rect", { x: bx + 0.2, y: 3.82, w: 2.48, h: 0.04,
      fill: { color: C.border }, line: { color: C.border, width: 0 } });
    sv.uses.forEach((u, j) => {
      s.addText(`✓  ${u}`, { x: bx + 0.2, y: 3.96 + j * 0.3, w: 2.48, h: 0.28,
        fontSize: 9.5, color: sv.accent, margin: 0 });
    });
  });

  footer(s);
}

// ── Slide 7: Process ───────────────────────────────────────────────────────────
function slide7(pres) {
  const s = pres.addSlide();
  s.background = { color: C.navy };
  accentBar(s, C.accent);

  s.addText("06", { x: P, y: 0.28, w: 1, h: 0.45,
    fontSize: 28, bold: true, color: C.navy3, margin: 0 });
  s.addText("From Request to Results in Days", { x: P, y: 0.26, w: 9, h: 0.5,
    fontSize: 30, bold: true, color: C.white, fontFace: "Georgia", margin: 0 });
  s.addText("A proven 6-step process — engineered for speed and precision.", {
    x: P, y: 0.76, w: 9, h: 0.28,
    fontSize: 12, color: C.muted, margin: 0 });

  // Connector line
  s.addShape("line", { x: 0.85, y: 2.05, w: 8.3, h: 0,
    line: { color: C.navy3, width: 2, dashType: "dash" } });

  const steps = [
    { n: "1", emoji: "📋", title: "Discovery Call",    desc: "Define role, skills & timeline." },
    { n: "2", emoji: "🔎", title: "Talent Sourcing",   desc: "Activate our pre-vetted network." },
    { n: "3", emoji: "⚙️", title: "Tech Vetting",      desc: "Coding, design & English eval." },
    { n: "4", emoji: "📨", title: "Profile Delivery",  desc: "Shortlist in 48 business hours." },
    { n: "5", emoji: "🤝", title: "Interviews",        desc: "Your schedule, your format." },
    { n: "6", emoji: "🌟", title: "Onboarding",        desc: "Contracts, payroll & support." },
  ];

  steps.forEach((st, i) => {
    const bx = P - 0.1 + i * 1.52;
    const isLate = i >= 3;

    s.addShape("ellipse", { x: bx + 0.22, y: 1.68, w: 0.74, h: 0.74,
      fill: { color: isLate ? C.accent : C.blue },
      line: { color: isLate ? C.accent : C.blue, width: 0 },
      shadow: sh() });
    s.addText(st.n, { x: bx + 0.22, y: 1.68, w: 0.74, h: 0.74,
      fontSize: 18, bold: true, color: C.white,
      align: "center", valign: "middle", margin: 0 });

    s.addText(st.emoji, { x: bx + 0.1, y: 2.58, w: 1.0, h: 0.4,
      fontSize: 20, align: "center", margin: 0 });
    s.addText(st.title, { x: bx - 0.1, y: 3.06, w: 1.4, h: 0.48,
      fontSize: 10, bold: true, color: C.white, align: "center",
      margin: 0, lineSpacingMultiple: 1.2 });
    s.addText(st.desc, { x: bx - 0.1, y: 3.6, w: 1.4, h: 0.72,
      fontSize: 9, color: C.muted, align: "center",
      margin: 0, lineSpacingMultiple: 1.35 });
  });

  footer(s);
}

// ── Slide 8: Social Proof ──────────────────────────────────────────────────────
function slide8(pres) {
  const s = pres.addSlide();
  s.background = { color: C.white };
  accentBar(s, C.blue);

  s.addText("07", { x: P, y: 0.28, w: 1, h: 0.45,
    fontSize: 28, bold: true, color: C.border, margin: 0 });
  s.addText("Proven Industry Experience", { x: P, y: 0.26, w: 8.5, h: 0.5,
    fontSize: 30, bold: true, color: C.navy, fontFace: "Georgia", margin: 0 });
  s.addText("Our talent has hands-on experience across a wide range of industries — and keeps delivering.", {
    x: P, y: 0.76, w: 8.5, h: 0.28,
    fontSize: 12, color: C.slate, margin: 0 });

  const industries = [
    { emoji: "🏦", title: "Fintech & Banking",         body: "Payment gateways, fraud detection, core banking systems, and compliance-grade infrastructure built to financial-industry standards.", color: C.blue },
    { emoji: "🏥", title: "Healthcare & Life Sciences", body: "HIPAA-compliant platforms, EHR integrations, telemedicine apps, and patient-facing portals with strict data-privacy requirements.", color: C.accent },
    { emoji: "☁️",  title: "SaaS & B2B Software",       body: "Multi-tenant platforms, scalable REST and GraphQL APIs, cloud-native microservices, and subscription billing systems.", color: C.green },
    { emoji: "🛒", title: "E-commerce & Retail",        body: "High-traffic storefronts, inventory management, recommendation engines, and seamless payment and logistics integrations.", color: C.amber },
    { emoji: "🎓", title: "EdTech",                     body: "LMS platforms, live-streaming classrooms, adaptive learning algorithms, and student analytics dashboards.", color: "8B5CF6" },
    { emoji: "🚚", title: "Logistics & Supply Chain",   body: "Real-time tracking systems, route optimization, warehouse management, and IoT-connected fleet solutions.", color: "EF4444" },
  ];

  const cols = [P, P + 3.1, P + 6.2];
  const rows = [1.18, 2.95];

  industries.forEach((ind, i) => {
    const x = cols[i % 3];
    const y = rows[Math.floor(i / 3)];
    s.addShape("rect", { x, y, w: 2.9, h: 1.58,
      fill: { color: C.offWhite }, line: { color: C.border, width: 1 }, shadow: sh() });
    s.addShape("rect", { x, y, w: 2.9, h: 0.05,
      fill: { color: ind.color }, line: { color: ind.color, width: 0 } });
    s.addText(ind.emoji, { x: x + 0.18, y: y + 0.15, w: 0.45, h: 0.42, fontSize: 20, margin: 0 });
    s.addText(ind.title, { x: x + 0.72, y: y + 0.15, w: 2.0, h: 0.44,
      fontSize: 11, bold: true, color: C.navy, margin: 0, lineSpacingMultiple: 1.2 });
    s.addText(ind.body, { x: x + 0.18, y: y + 0.66, w: 2.56, h: 0.82,
      fontSize: 9.5, color: C.slate, margin: 0, lineSpacingMultiple: 1.38 });
  });

  footer(s);
}

// ── Slide 9: Partnership Benefits ─────────────────────────────────────────────
function slide9(pres) {
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  accentBar(s, C.accent);

  s.addText("08", { x: P, y: 0.28, w: 1, h: 0.45,
    fontSize: 28, bold: true, color: C.border, margin: 0 });
  s.addText("Flexible. Guaranteed. Managed.", { x: P, y: 0.26, w: 9, h: 0.5,
    fontSize: 30, bold: true, color: C.navy, fontFace: "Georgia", margin: 0 });
  s.addText("Everything that protects your investment and keeps your team moving.", {
    x: P, y: 0.76, w: 9, h: 0.28,
    fontSize: 12, color: C.slate, margin: 0 });

  const benefits = [
    { emoji: "🔄", title: "30-Day Replacement Guarantee", body: "If a placement doesn't work out in 30 days, we replace them at no extra cost." },
    { emoji: "📋", title: "No Lock-In Contracts",          body: "Month-to-month or project-based. Scale up or down as your business evolves." },
    { emoji: "💼", title: "Fully Managed Employment",      body: "Payroll, benefits, taxes, and HR compliance handled across all LATAM countries." },
    { emoji: "📞", title: "Dedicated Account Manager",     body: "One contact who knows your team and goals — ongoing, not just at placement." },
    { emoji: "⚡", title: "Rapid Team Scaling",            body: "Pre-vetted pipeline ready to go. Grow from 1 to 20 engineers without delay." },
    { emoji: "🔒", title: "IP & Security Compliance",      body: "NDAs, IP assignments, and security requirements enforced on every engagement." },
  ];

  // 3-column x 2-row layout with more breathing room
  const cols = [P, P + 3.1, P + 6.2];
  const rows = [1.18, 2.95];

  benefits.forEach((b, i) => {
    const x = cols[i % 3];
    const y = rows[Math.floor(i / 3)];
    s.addShape("rect", { x, y, w: 2.9, h: 1.58,
      fill: { color: C.white }, line: { color: C.border, width: 1 }, shadow: sh() });
    s.addText(b.emoji, { x: x + 0.2, y: y + 0.18, w: 0.45, h: 0.42, fontSize: 20, margin: 0 });
    s.addText(b.title, { x: x + 0.76, y: y + 0.18, w: 2.0, h: 0.44,
      fontSize: 11, bold: true, color: C.navy,
      margin: 0, lineSpacingMultiple: 1.2 });
    s.addText(b.body, { x: x + 0.2, y: y + 0.68, w: 2.55, h: 0.78,
      fontSize: 10, color: C.slate, margin: 0, lineSpacingMultiple: 1.4 });
  });

  // Quote
  s.addShape("rect", { x: P, y: 4.7, w: W, h: 0.46,
    fill: { color: C.navy }, line: { color: C.navy, width: 0 }, shadow: sh() });
  s.addText(
    "\u201C We don\u2019t just place talent and disappear. We\u2019re invested in long-term success for both sides. \u201D",
    { x: P + 0.25, y: 4.72, w: W - 0.4, h: 0.4,
      fontSize: 10.5, color: C.light, italic: true, align: "center", margin: 0 }
  );

  footer(s);
}

// ── Slide 10: CTA ──────────────────────────────────────────────────────────────
function slide10(pres) {
  const s = pres.addSlide();
  s.background = { color: C.navy };
  accentBar(s, C.accent);

  // Right panel
  s.addShape("rect", { x: 6.1, y: 0, w: 3.9, h: 5.625,
    fill: { color: C.blue }, line: { color: C.blue, width: 0 } });

  logo(s, P, 0.38);

  s.addText("Ready to Build\nYour Dream\nTeam?", { x: P, y: 1.05, w: 5.3, h: 2.2,
    fontSize: 42, bold: true, color: C.white, fontFace: "Georgia",
    margin: 0, lineSpacingMultiple: 1.2 });
  s.addText(
    "Tell us what you need. We\u2019ll deliver curated\ncandidate profiles within 48 hours.\nNo commitment required.",
    { x: P, y: 3.4, w: 5.3, h: 1.0,
      fontSize: 13, color: C.light, margin: 0, lineSpacingMultiple: 1.55 }
  );

  // CTA button
  s.addShape("rect", { x: P, y: 4.58, w: 2.8, h: 0.6,
    fill: { color: C.accent }, line: { color: C.accent, width: 0 }, shadow: sh() });
  s.addText("Start a Conversation  →", { x: P, y: 4.58, w: 2.8, h: 0.6,
    fontSize: 13, bold: true, color: C.white,
    align: "center", valign: "middle", margin: 0 });

  // Right: contact
  s.addText("GET IN TOUCH", { x: 6.3, y: 0.5, w: 3.4, h: 0.28,
    fontSize: 8.5, bold: true, color: C.white, charSpacing: 3, margin: 0 });

  const contacts = [
    { emoji: "✉️", lbl: "Email",    val: "info@smardevs.com" },
    { emoji: "📞", lbl: "Phone",    val: "+1 (504) 333-1465" },
    { emoji: "🌐", lbl: "Website",  val: "smardevs.com" },
    { emoji: "💼", lbl: "LinkedIn", val: "linkedin.com/company/smardevs" },
  ];
  contacts.forEach((c, i) => {
    const cy = 1.08 + i * 1.02;
    s.addText(c.emoji, { x: 6.3, y: cy, w: 0.45, h: 0.45, fontSize: 18, margin: 0 });
    s.addText(c.lbl.toUpperCase(), { x: 6.85, y: cy, w: 2.8, h: 0.24,
      fontSize: 8, bold: true, color: "BFDBFE", charSpacing: 1.5, margin: 0 });
    s.addText(c.val, { x: 6.85, y: cy + 0.26, w: 2.8, h: 0.3,
      fontSize: 11, color: C.white, margin: 0 });
  });

  s.addText("© 2025 SMarDevs · All rights reserved.", { x: P, y: 5.42, w: 4, h: 0.18,
    fontSize: 7.5, color: C.slate, margin: 0 });
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  const pres = new pptxgen();
  pres.layout  = "LAYOUT_16x9";
  pres.author  = "SMarDevs";
  pres.title   = "SMarDevs — B2B Talent Solutions";
  pres.subject = "Premium Sales Presentation";

  slide1(pres);
  slide2(pres);
  slide3(pres);
  slide4(pres);
  slide5(pres);
  slide6(pres);
  slide7(pres);
  slide8(pres);
  slide9(pres);
  slide10(pres);

  await pres.writeFile({ fileName: "presentations/SMarDevs-B2B-Presentation.pptx" });
  console.log("✅  Saved: presentations/SMarDevs-B2B-Presentation.pptx");
}

main().catch(err => { console.error(err); process.exit(1); });
