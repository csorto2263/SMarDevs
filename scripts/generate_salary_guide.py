from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.pdfgen import canvas
from reportlab.platypus.flowables import Flowable
import os

# ── Brand Colors ────────────────────────────────────────────────────────────
NAVY       = colors.HexColor('#0F172A')
NAVY_LIGHT = colors.HexColor('#1E3A5F')
BLUE       = colors.HexColor('#2563EB')
BLUE_LIGHT = colors.HexColor('#DBEAFE')
BLUE_MID   = colors.HexColor('#93C5FD')
GREEN      = colors.HexColor('#16A34A')
GREEN_LIGHT= colors.HexColor('#DCFCE7')
GRAY       = colors.HexColor('#64748B')
GRAY_LIGHT = colors.HexColor('#F1F5F9')
GRAY_LINE  = colors.HexColor('#E2E8F0')
WHITE      = colors.white
ORANGE     = colors.HexColor('#F59E0B')

OUTPUT_PATH = r'C:\Users\Admin\Documents\BigDevs\Website\public\salary-guide-2026.pdf'
os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

# ── Salary Data ──────────────────────────────────────────────────────────────
# LATAM ranges (monthly USD) based on market data — Tier 2-3 LATAM (Honduras/Colombia/Mexico)
# USA monthly midpoints from Glassdoor/Indeed/ZipRecruiter 2026

categories = [
    {
        "title": "Software Engineering",
        "icon": "</> ",
        "roles": [
            # Role, SMarDevs Jr, SMarDevs Mid, SMarDevs Sr, USA Sr, Savings
            ("Frontend Developer",    "$4,200–$4,600", "$4,750–$5,500", "$5,750–$6,500", "$14,000", "54%"),
            ("Backend Developer",     "$4,400–$4,800", "$5,200–$5,750", "$6,000–$7,000", "$15,000", "56%"),
            ("Full Stack Developer",  "$4,600–$4,750", "$5,500–$6,000", "$6,250–$7,500", "$13,000", "48%"),
            ("Mobile Developer",      "$4,600–$4,750", "$5,500–$6,250", "$6,250–$7,500", "$14,800", "52%"),
            ("Software Architect",    "—",             "$6,500–$7,000", "$7,500–$9,000", "$22,700", "63%"),
        ]
    },
    {
        "title": "QA & Testing",
        "icon": "✓ ",
        "roles": [
            ("QA Analyst (Manual)",      "$4,000–$4,250", "$4,400–$4,800", "$5,000–$5,500", "$11,000", "52%"),
            ("QA Engineer",              "$4,200–$4,500", "$5,000–$5,250", "$5,750–$6,500", "$11,000", "45%"),
            ("QA Automation Engineer",   "$4,800–$5,000", "$5,500–$6,000", "$6,250–$7,000", "$11,000", "41%"),
            ("Performance Test Engineer","$4,400–$4,750", "$5,250–$5,750", "$6,000–$6,750", "$10,500", "40%"),
        ]
    },
    {
        "title": "Cloud & DevOps",
        "icon": "⚙ ",
        "roles": [
            ("DevOps Engineer",    "$4,750–$5,000", "$5,750–$6,000", "$6,750–$7,500", "$12,500", "44%"),
            ("Cloud Engineer",     "$4,800–$5,250", "$5,750–$6,250", "$7,000–$8,000", "$13,500", "44%"),
            ("SRE",                "$4,600–$5,000", "$5,750–$6,250", "$7,000–$8,000", "$14,000", "46%"),
            ("DevSecOps Engineer", "$4,800–$5,250", "$5,750–$6,500", "$7,000–$8,000", "$13,000", "42%"),
        ]
    },
    {
        "title": "Data Engineering & AI",
        "icon": "◈ ",
        "roles": [
            ("Data Engineer",          "$4,500–$4,750", "$5,500–$6,000", "$6,500–$7,500", "$13,800", "49%"),
            ("Data Scientist",         "$4,500–$4,800", "$5,500–$6,250", "$6,500–$7,500", "$13,000", "48%"),
            ("AI / ML Engineer",       "$4,800–$5,000", "$5,750–$6,500", "$7,000–$8,500", "$15,000", "50%"),
            ("BI Analyst / Developer", "$4,200–$4,500", "$5,000–$5,500", "$6,000–$6,500", "$11,500", "47%"),
        ]
    },
    {
        "title": "Design & Product",
        "icon": "◻ ",
        "roles": [
            ("UI/UX Designer",  "$4,500–$4,800", "$5,000–$5,500", "$5,750–$6,500", "$12,700", "50%"),
            ("Product Manager", "$4,500–$4,600", "$5,250–$6,000", "$6,000–$6,500", "$12,400", "50%"),
            ("Product Designer","$4,500–$4,800", "$5,000–$5,500", "$5,750–$6,500", "$11,500", "46%"),
        ]
    },
]

# ── Canvas / Header-Footer ───────────────────────────────────────────────────
class HeaderFooterCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        canvas.Canvas.__init__(self, *args, **kwargs)
        self._saved_page_states = []
        self.page_count = 0

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        self.page_count = len(self._saved_page_states)
        for i, state in enumerate(self._saved_page_states):
            self.__dict__.update(state)
            self._current_page_num = i + 1
            self._draw_header_footer()
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def _draw_header_footer(self):
        page_num = getattr(self, '_current_page_num', 1)

        # Skip cover page (page 1)
        if page_num == 1:
            return

        W, H = letter

        # Header bar
        self.setFillColor(NAVY)
        self.rect(0, H - 36, W, 36, fill=1, stroke=0)
        self.setFillColor(WHITE)
        self.setFont("Helvetica-Bold", 9)
        self.drawString(40, H - 22, "SMarDevs")
        self.setFont("Helvetica", 8)
        self.setFillColor(BLUE_MID)
        self.drawString(100, H - 22, "LATAM Tech Salary Guide 2026")

        # Page number right
        self.setFillColor(GRAY_LINE)
        self.setFont("Helvetica", 8)
        self.drawRightString(W - 40, H - 22, f"Page {page_num}")

        # Footer
        self.setFillColor(GRAY_LIGHT)
        self.rect(0, 0, W, 28, fill=1, stroke=0)
        self.setFillColor(GRAY)
        self.setFont("Helvetica", 7)
        self.drawString(40, 10, "© 2026 SMarDevs · smardevs.com · All salary data sourced from Glassdoor, Indeed, ZipRecruiter, and Interfell 2026 reports.")
        self.setFillColor(BLUE)
        self.drawRightString(W - 40, 10, "Hire smarter at smardevs.com")


def build_pdf():
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=letter,
        rightMargin=0.5*inch,
        leftMargin=0.5*inch,
        topMargin=0.6*inch,
        bottomMargin=0.5*inch,
    )

    styles = getSampleStyleSheet()

    # Custom styles
    s_cover_tag = ParagraphStyle('cover_tag', fontSize=11, textColor=BLUE_MID,
                                  fontName='Helvetica', spaceAfter=8, alignment=TA_LEFT)
    s_cover_title = ParagraphStyle('cover_title', fontSize=38, textColor=WHITE,
                                    fontName='Helvetica-Bold', leading=44, spaceAfter=12)
    s_cover_sub = ParagraphStyle('cover_sub', fontSize=14, textColor=BLUE_MID,
                                  fontName='Helvetica', spaceAfter=20, leading=20)
    s_cover_body = ParagraphStyle('cover_body', fontSize=10, textColor=colors.HexColor('#CBD5E1'),
                                   fontName='Helvetica', leading=15, spaceAfter=6)
    s_section_title = ParagraphStyle('section_title', fontSize=16, textColor=NAVY,
                                      fontName='Helvetica-Bold', spaceAfter=4, spaceBefore=16)
    s_section_sub = ParagraphStyle('section_sub', fontSize=9, textColor=GRAY,
                                    fontName='Helvetica', spaceAfter=8)
    s_intro_title = ParagraphStyle('intro_title', fontSize=20, textColor=NAVY,
                                    fontName='Helvetica-Bold', spaceAfter=8)
    s_intro_body = ParagraphStyle('intro_body', fontSize=10, textColor=colors.HexColor('#374151'),
                                   fontName='Helvetica', leading=15, spaceAfter=8)
    s_cta_title = ParagraphStyle('cta_title', fontSize=26, textColor=WHITE,
                                  fontName='Helvetica-Bold', alignment=TA_CENTER, spaceAfter=12)
    s_cta_body = ParagraphStyle('cta_body', fontSize=12, textColor=BLUE_MID,
                                 fontName='Helvetica', alignment=TA_CENTER, spaceAfter=8)
    s_note = ParagraphStyle('note', fontSize=8, textColor=GRAY,
                             fontName='Helvetica-Oblique', leading=12)

    story = []
    W, H = letter

    # ═══════════════════════════════════════════════════════════════════════
    # PAGE 1 — COVER
    # ═══════════════════════════════════════════════════════════════════════
    class CoverPage(Flowable):
        def wrap(self, w, h):
            return w, h

        def draw(self):
            c = self.canv
            pw = W - inch  # content width

            # Dark navy background
            c.setFillColor(NAVY)
            c.rect(0, 0, pw, H, fill=1, stroke=0)

            # Blue accent stripe left
            c.setFillColor(BLUE)
            c.rect(0, 0, 6, H, fill=1, stroke=0)

            # Top gradient band
            c.setFillColor(NAVY_LIGHT)
            c.rect(0, H - 120, pw, 120, fill=1, stroke=0)

            # Logo area
            c.setFillColor(BLUE)
            c.roundRect(30, H - 90, 44, 44, 8, fill=1, stroke=0)
            c.setFillColor(WHITE)
            c.setFont("Helvetica-Bold", 22)
            c.drawCentredString(52, H - 72, "S")

            c.setFillColor(WHITE)
            c.setFont("Helvetica-Bold", 18)
            c.drawString(84, H - 72, "SMar")
            c.setFillColor(BLUE_MID)
            c.drawString(126, H - 72, "Devs")

            # Tag
            c.setFillColor(BLUE)
            c.roundRect(28, H - 168, 120, 24, 4, fill=1, stroke=0)
            c.setFillColor(WHITE)
            c.setFont("Helvetica-Bold", 9)
            c.drawString(38, H - 152, "LATAM TECH TALENT")

            # Year badge
            c.setFillColor(colors.HexColor('#1D4ED8'))
            c.roundRect(pw - 100, H - 168, 70, 24, 4, fill=1, stroke=0)
            c.setFillColor(WHITE)
            c.setFont("Helvetica-Bold", 10)
            c.drawCentredString(pw - 65, H - 152, "2026")

            # Main title
            c.setFillColor(WHITE)
            c.setFont("Helvetica-Bold", 36)
            c.drawString(30, H - 240, "LATAM Tech")
            c.setFont("Helvetica-Bold", 36)
            c.drawString(30, H - 282, "Salary Guide")

            # Subtitle
            c.setFillColor(BLUE_MID)
            c.setFont("Helvetica", 13)
            c.drawString(30, H - 316, "All-in rates for hiring pre-vetted remote engineers")
            c.drawString(30, H - 334, "via SMarDevs — compared to US equivalent salaries")

            # Divider
            c.setStrokeColor(BLUE)
            c.setLineWidth(2)
            c.line(30, H - 356, pw - 30, H - 356)

            # Stats row
            stats = [
                ("10+", "Roles Covered"),
                ("3", "Seniority Levels"),
                ("50%+", "Avg. Client Savings"),
                ("2026", "Data Updated"),
            ]
            box_w = (pw - 60) / 4
            for i, (val, label) in enumerate(stats):
                x = 30 + i * box_w
                c.setFillColor(colors.HexColor('#1E3A5F'))
                c.roundRect(x + 4, H - 430, box_w - 8, 60, 6, fill=1, stroke=0)
                c.setFillColor(BLUE_MID)
                c.setFont("Helvetica-Bold", 20)
                c.drawCentredString(x + box_w/2, H - 398, val)
                c.setFillColor(colors.HexColor('#94A3B8'))
                c.setFont("Helvetica", 8)
                c.drawCentredString(x + box_w/2, H - 415, label)

            # Description
            c.setFillColor(colors.HexColor('#CBD5E1'))
            c.setFont("Helvetica", 10)
            lines = [
                "This guide provides accurate 2026 salary benchmarks for US companies hiring",
                "remote tech talent from Latin America. Each role shows LATAM market ranges",
                "by seniority level alongside US equivalents — so you know exactly what you",
                "save without sacrificing quality.",
            ]
            y = H - 468
            for line in lines:
                c.drawString(30, y, line)
                y -= 16

            # How to use box
            c.setFillColor(colors.HexColor('#1E293B'))
            c.roundRect(28, H - 580, pw - 56, 88, 8, fill=1, stroke=0)
            c.setFillColor(BLUE_MID)
            c.setFont("Helvetica-Bold", 10)
            c.drawString(44, H - 510, "HOW TO READ THIS GUIDE")
            items = [
                "• via SMarDevs = all-in monthly rate you pay (no hidden fees)",
                "• USA Midpoint = average monthly salary for same role in the US",
                "• Savings % = how much less you pay SMarDevs vs. hiring in the US",
            ]
            c.setFillColor(colors.HexColor('#94A3B8'))
            c.setFont("Helvetica", 9)
            y2 = H - 528
            for item in items:
                c.drawString(44, y2, item)
                y2 -= 15

            # Footer bar
            c.setFillColor(BLUE)
            c.rect(0, 0, pw, 50, fill=1, stroke=0)
            c.setFillColor(WHITE)
            c.setFont("Helvetica-Bold", 11)
            c.drawString(30, 20, "Ready to hire? Schedule a free call at")
            c.setFillColor(BLUE_MID)
            c.drawString(280, 20, "smardevs.com/contact")
            c.setFillColor(colors.HexColor('#BFDBFE'))
            c.setFont("Helvetica", 8)
            c.drawRightString(pw - 30, 20, "© 2026 SMarDevs. For reference only.")

    story.append(CoverPage())
    story.append(PageBreak())

    # ═══════════════════════════════════════════════════════════════════════
    # PAGE 2 — ABOUT THIS GUIDE
    # ═══════════════════════════════════════════════════════════════════════
    story.append(Spacer(1, 0.1*inch))
    story.append(Paragraph("About This Guide", s_intro_title))
    story.append(HRFlowable(width="100%", thickness=2, color=BLUE, spaceAfter=10))

    intro_text = [
        ("Why LATAM?",
         "Latin America has emerged as the premier nearshore talent destination for US companies. Engineers in "
         "countries like Honduras, Colombia, Mexico, and Argentina work in US-compatible time zones, speak strong "
         "English, and hold technical skills that match or exceed global standards — at a fraction of US hiring costs."),
        ("Data Sources",
         "US salary figures are derived from Glassdoor, Indeed, ZipRecruiter, and Levels.fyi 2026 reports. "
         "LATAM ranges are based on 2026 market data from Interfell, Simera, and SMarDevs' own talent network. "
         "All figures represent monthly base compensation in USD for remote/contractor roles."),
        ("Seniority Levels",
         "Junior: 0–2 years experience, works under supervision. "
         "Mid-Level: 2–5 years, works independently on most tasks. "
         "Senior: 5+ years, leads technical decisions, mentors others."),
        ("SMarDevs Model",
         "SMarDevs handles sourcing, vetting, and ongoing management. Our engineers are pre-screened across "
         "technical skills, English proficiency, and cultural alignment — so you get production-ready talent "
         "without the hiring overhead. Typical time-to-hire: 5–7 business days."),
    ]

    for title, body in intro_text:
        t = Table(
            [[Paragraph(f"<b>{title}</b>", ParagraphStyle('it', fontSize=11, textColor=BLUE,
                        fontName='Helvetica-Bold', spaceAfter=2)),
              Paragraph(body, ParagraphStyle('ib', fontSize=9.5, textColor=colors.HexColor('#374151'),
                        fontName='Helvetica', leading=14))]],
            colWidths=[1.3*inch, 5.8*inch]
        )
        t.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 10),
            ('TOPPADDING', (0,0), (-1,-1), 4),
        ]))
        story.append(t)
        story.append(HRFlowable(width="100%", thickness=0.5, color=GRAY_LINE, spaceAfter=4))

    # Quick comparison callout
    story.append(Spacer(1, 0.15*inch))
    callout_data = [
        [Paragraph("<b>Example: Senior Full Stack Developer</b>", ParagraphStyle('ch', fontSize=11,
            textColor=NAVY, fontName='Helvetica-Bold'))],
        [Table([
            [
                Paragraph("<b>Via SMarDevs (all-in)</b>", ParagraphStyle('cl', fontSize=10, textColor=BLUE,
                    fontName='Helvetica-Bold', alignment=TA_CENTER)),
                Paragraph("", styles['Normal']),
                Paragraph("<b>US Hire</b>", ParagraphStyle('cu', fontSize=10, textColor=GRAY,
                    fontName='Helvetica-Bold', alignment=TA_CENTER)),
            ],
            [
                Paragraph("$6,250–$7,500 / mo", ParagraphStyle('cv', fontSize=18, textColor=GREEN,
                    fontName='Helvetica-Bold', alignment=TA_CENTER)),
                Paragraph("<b>vs.</b>", ParagraphStyle('cvs', fontSize=14, textColor=GRAY,
                    fontName='Helvetica-Bold', alignment=TA_CENTER)),
                Paragraph("~$13,000 / mo", ParagraphStyle('cu2', fontSize=18, textColor=GRAY,
                    fontName='Helvetica-Bold', alignment=TA_CENTER)),
            ],
            [
                Paragraph("You save up to <b>$6,750/month</b> per engineer", ParagraphStyle('cs', fontSize=10,
                    textColor=GREEN, fontName='Helvetica', alignment=TA_CENTER)),
                Paragraph("", styles['Normal']),
                Paragraph("$81,000/year savings per hire", ParagraphStyle('cs2', fontSize=10,
                    textColor=GRAY, fontName='Helvetica', alignment=TA_CENTER)),
            ]
        ], colWidths=[2.8*inch, 0.7*inch, 2.8*inch],
        style=TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
            ('TOPPADDING', (0,0), (-1,-1), 8),
        ]))]
    ]

    callout_table = Table(callout_data, colWidths=[6.5*inch])
    callout_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BLUE_LIGHT),
        ('ROUNDEDCORNERS', [8]),
        ('BOX', (0,0), (-1,-1), 1.5, BLUE),
        ('TOPPADDING', (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ('LEFTPADDING', (0,0), (-1,-1), 16),
        ('RIGHTPADDING', (0,0), (-1,-1), 16),
    ]))
    story.append(callout_table)
    story.append(PageBreak())

    # ═══════════════════════════════════════════════════════════════════════
    # SALARY TABLES — one category per section
    # ═══════════════════════════════════════════════════════════════════════
    TABLE_HEADER = ["Role", "Junior\n(via SMarDevs/mo)", "Mid-Level\n(via SMarDevs/mo)", "Senior\n(via SMarDevs/mo)",
                    "Senior\n(USA/mo)", "Savings"]

    h_style = ParagraphStyle('th', fontSize=8, textColor=WHITE, fontName='Helvetica-Bold',
                              alignment=TA_CENTER, leading=11)
    td_role = ParagraphStyle('tdr', fontSize=9, textColor=NAVY, fontName='Helvetica-Bold',
                              leading=12)
    td_cell = ParagraphStyle('tdc', fontSize=8.5, textColor=colors.HexColor('#1E3A5F'),
                              fontName='Helvetica', alignment=TA_CENTER, leading=12)
    td_usa  = ParagraphStyle('tdu', fontSize=8.5, textColor=GRAY, fontName='Helvetica',
                              alignment=TA_CENTER, leading=12)
    td_save = ParagraphStyle('tds', fontSize=9, textColor=GREEN, fontName='Helvetica-Bold',
                              alignment=TA_CENTER, leading=12)

    for cat in categories:
        # Section title
        story.append(Spacer(1, 0.05*inch))
        title_table = Table(
            [[Paragraph(cat["title"], ParagraphStyle('st', fontSize=15, textColor=WHITE,
                         fontName='Helvetica-Bold'))]],
            colWidths=[6.5*inch]
        )
        title_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), NAVY),
            ('TOPPADDING', (0,0), (-1,-1), 10),
            ('BOTTOMPADDING', (0,0), (-1,-1), 10),
            ('LEFTPADDING', (0,0), (-1,-1), 14),
            ('ROUNDEDCORNERS', [6]),
        ]))
        story.append(title_table)
        story.append(Spacer(1, 6))

        # Table header
        header_row = [Paragraph(h, h_style) for h in TABLE_HEADER]
        data = [header_row]

        # Data rows
        for i, (role, jr, mid, sr, usa, sav) in enumerate(cat["roles"]):
            bg = WHITE if i % 2 == 0 else GRAY_LIGHT
            row = [
                Paragraph(role, td_role),
                Paragraph(jr, td_cell),
                Paragraph(mid, td_cell),
                Paragraph(sr, td_cell),
                Paragraph(usa, td_usa),
                Paragraph(sav, td_save),
            ]
            data.append(row)

        col_widths = [2.0*inch, 1.0*inch, 1.1*inch, 1.1*inch, 0.9*inch, 0.7*inch]
        t = Table(data, colWidths=col_widths, repeatRows=1)

        row_styles = [
            ('BACKGROUND', (0, 0), (-1, 0), NAVY),
            ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('LEFTPADDING', (0, 0), (0, -1), 10),
            ('LEFTPADDING', (1, 0), (-1, -1), 4),
            ('GRID', (0, 0), (-1, -1), 0.5, GRAY_LINE),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, GRAY_LIGHT]),
            # Savings column highlight
            ('BACKGROUND', (5, 1), (5, -1), GREEN_LIGHT),
            # USA column text color
            ('TEXTCOLOR', (4, 1), (4, -1), GRAY),
            ('TEXTCOLOR', (5, 1), (5, -1), GREEN),
            ('FONTNAME', (5, 1), (5, -1), 'Helvetica-Bold'),
            ('BOX', (0, 0), (-1, -1), 1, GRAY_LINE),
        ]
        t.setStyle(TableStyle(row_styles))
        story.append(KeepTogether([t]))
        story.append(Spacer(1, 0.15*inch))

    # ═══════════════════════════════════════════════════════════════════════
    # NOTES PAGE
    # ═══════════════════════════════════════════════════════════════════════
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE_LIGHT, spaceAfter=8))
    story.append(Paragraph("Methodology & Notes", ParagraphStyle('mn', fontSize=12,
        textColor=NAVY, fontName='Helvetica-Bold', spaceAfter=6)))

    notes = [
        "All 'via SMarDevs' figures are all-in monthly rates in USD — what you pay SMarDevs, with no hidden fees. Rates include talent sourcing, multi-stage vetting, onboarding support, and ongoing account management.",
        "US salary midpoints are based on national averages from Glassdoor, Indeed, ZipRecruiter, and Levels.fyi 2026 reports. They represent base salary only and exclude equity, benefits, and employer payroll taxes (typically 20–30% on top).",
        "Savings % is calculated comparing SMarDevs Senior rate midpoint vs. US Senior monthly average. Actual savings are higher when factoring in benefits, recruiting fees, and onboarding costs of US hires.",
        "Actual rates may vary based on specific technology stack, years of experience, domain expertise (e.g. fintech, healthcare), and market demand at time of engagement.",
        "SMarDevs offers a replacement guarantee: if a placed engineer is not the right fit within the first 30 days, we replace them at no additional cost.",
    ]
    for note in notes:
        story.append(Paragraph(f"• {note}", s_note))
        story.append(Spacer(1, 4))

    story.append(Spacer(1, 0.2*inch))

    # ═══════════════════════════════════════════════════════════════════════
    # CTA BLOCK
    # ═══════════════════════════════════════════════════════════════════════
    cta_data = [[
        Paragraph("Ready to Build Your Dream Team?", ParagraphStyle('ctah', fontSize=18,
            textColor=WHITE, fontName='Helvetica-Bold', alignment=TA_CENTER, spaceAfter=6)),
    ], [
        Paragraph("Get pre-vetted LATAM engineers delivered in 5–7 business days.",
            ParagraphStyle('ctab', fontSize=10, textColor=BLUE_MID, fontName='Helvetica',
            alignment=TA_CENTER, spaceAfter=4)),
    ], [
        Table([[
            Paragraph("smardevs.com/contact", ParagraphStyle('ctac', fontSize=12,
                textColor=WHITE, fontName='Helvetica-Bold', alignment=TA_CENTER)),
            Paragraph("jobs@smardevs.com", ParagraphStyle('ctae', fontSize=12,
                textColor=BLUE_MID, fontName='Helvetica', alignment=TA_CENTER)),
        ]], colWidths=[3.25*inch, 3.25*inch],
        style=TableStyle([('VALIGN',(0,0),(-1,-1),'MIDDLE'),
                          ('TOPPADDING',(0,0),(-1,-1),6),
                          ('BOTTOMPADDING',(0,0),(-1,-1),6)])),
    ]]

    cta_table = Table(cta_data, colWidths=[6.5*inch])
    cta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), NAVY),
        ('TOPPADDING', (0,0), (-1,-1), 14),
        ('BOTTOMPADDING', (0,0), (-1,-1), 14),
        ('LEFTPADDING', (0,0), (-1,-1), 20),
        ('RIGHTPADDING', (0,0), (-1,-1), 20),
        ('ROUNDEDCORNERS', [8]),
        ('BOX', (0,0), (-1,-1), 2, BLUE),
    ]))
    story.append(cta_table)

    doc.build(story, canvasmaker=HeaderFooterCanvas)
    print(f"PDF generated: {OUTPUT_PATH}")


if __name__ == "__main__":
    build_pdf()
