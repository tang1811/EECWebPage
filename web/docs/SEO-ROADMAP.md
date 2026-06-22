# SEO Roadmap — วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง

> เป้าหมายหลัก: ให้ผู้ปกครอง/นักเรียนในชลบุรี–ศรีราชา–แหลมฉบัง–EEC หาเจอเมื่อค้น "เรียนอาชีวะ", "ปวช./ปวส.", ชื่อสาขา, และชื่อวิทยาลัย → เพิ่มยอดสมัครเรียน (conversion = ปุ่มสมัคร/โทร)

สถานะเว็บ: Next.js 16 (App Router, SSG) — โครงสร้าง SEO ฐานดีอยู่แล้ว

---

## 0) สถานะปัจจุบัน (มีแล้ว ✅ / ต้องแก้ ⚠️)

| รายการ | สถานะ |
|---|---|
| `metadata` ทุกหน้า (title/description/keywords/canonical) | ✅ |
| `lang="th"`, `metadataBase` | ✅ |
| JSON-LD: Organization (layout), Course (courses) | ✅ |
| `sitemap.ts`, `robots.ts` | ✅ |
| OpenGraph/Twitter card | ✅ (แต่ใช้ logo เป็น OG image) ⚠️ |
| **โดเมนจริง** | ⚠️ ยังเป็น placeholder `https://eec.example` → ต้องเป็น `https://www.eec.ac` |
| OG image เฉพาะ (1200×630) | ⚠️ ยังไม่มี |
| Google Search Console / Analytics | ⚠️ ยังไม่ตั้ง |
| Google Business Profile (Maps) | ⚠️ ต้องทำ (สำคัญมากสำหรับ local) |
| Structured data: LocalBusiness/School, Breadcrumb, FAQ | ⚠️ ยังไม่ครบ |

---

## เทคนิค SEO 6 เสา (Pillars)

### 1. Technical SEO (ฐานเทคนิค)
- โดเมนจริง + HTTPS (host ออก TLS ฟรี — Vercel/Cloudflare)
- `sitemap.xml` + `robots.txt` ชี้ sitemap (มีแล้ว — แค่เปลี่ยนโดเมน)
- Canonical ทุกหน้า กัน duplicate (มีแล้ว)
- Mobile-first, responsive (มีแล้ว) — 80%+ ผู้ใช้ไทยมือถือ
- Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms
- ใช้ `next/image` แทน `<img>` (lazy + AVIF/WebP + ป้องกัน CLS) — **ปรับปรุงได้**
- ไม่มี broken link / 404 (เช็ค nav กับ route จริง)
- ความเร็ว: SSG อยู่แล้ว (prerender 34 หน้า) ✅

### 2. On-Page SEO
- **1 หน้า = 1 keyword หลัก** (title มี keyword + แบรนด์)
- Title 50–60 ตัวอักษร, Description 150–160, ชวนคลิก (มีวันรับสมัคร/CTA)
- H1 เดียวต่อหน้า, ลำดับ H2/H3 มีความหมาย
- alt ทุกรูป (ใส่ชื่อสาขา/บริบท) — **เพิ่มให้ครบ**
- Internal linking: หน้าแรก → สาขา → สมัคร, แทรกลิงก์ระหว่างเนื้อหา
- URL สั้น มีความหมาย (`/courses/yon`) ✅
- ภาษาไทยเป็นหลัก + คำค้นที่คนใช้จริง (ไม่ใช่ศัพท์ราชการ)

### 3. Structured Data (Schema.org) — ให้ Google เข้าใจ + rich results
- `EducationalOrganization` / `CollegeOrUniversity` (layout) — เพิ่ม address, geo, telephone, openingHours
- `LocalBusiness` (สำหรับ Maps/local pack)
- `Course` ต่อสาขา (มีแล้ว) — เพิ่ม provider, hasCourseInstance, ค่าเทอม (offers)
- `BreadcrumbList` ทุกหน้าย่อย
- `FAQPage` ในหน้า FAQ/สมัครเรียน → ได้ rich snippet
- `VideoObject` สำหรับวิดีโอรีวิวแผนก
- ทดสอบด้วย Google Rich Results Test

### 4. Local SEO (สำคัญสุดสำหรับวิทยาลัย)
- **Google Business Profile** — ตั้ง/ยืนยัน, หมวด "วิทยาลัยอาชีวศึกษา", รูป, เวลาทำการ, โทร, รีวิว
- ข้อมูล **NAP** (Name/Address/Phone) ตรงกันทุกที่ (เว็บ/GBP/เพจ/ไดเรกทอรี)
- ฝัง Google Map + ที่อยู่ในหน้า /contact (มีแล้ว) ✅
- คำค้น local: "อาชีวะ ศรีราชา", "ปวช ชลบุรี", "เรียนช่าง แหลมฉบัง", "วิทยาลัยเทคโนโลยี EEC"
- ลงไดเรกทอรีการศึกษา + เว็บ สอศ./อาชีวะเอกชน
- เก็บรีวิว Google จากนักศึกษา/ผู้ปกครอง

### 5. Content SEO (ดึง traffic + สร้างความน่าเชื่อถือ)
- หน้า "ข่าว/บทความ" (blog) — ยังไม่มี → เพิ่ม
- หัวข้อตามฤดูกาลรับสมัคร: "เรียนต่อ ปวช./ปวส. ที่ไหนดี ชลบุรี", "จบอาชีวะมีงานทำไหม", "ค่าเทอมอาชีวะเอกชน", "ทวิภาคีคืออะไร"
- หน้าสาขา = เนื้อหาลึก (จบแล้วทำงานอะไร เงินเดือน บริษัทรับ) — ดึง long-tail
- E-E-A-T: ใช้ของจริง (สมศ.ดีเลิศ, ศูนย์ทดสอบ สพร., รางวัล, สถิติมีงานทำ) ✅ ทำไปแล้ว
- อัปเดตสม่ำเสมอ (ข่าวกิจกรรม, ผลงาน, รับสมัคร) — สัญญาณ freshness

### 6. Off-Page SEO (Authority)
- Backlink จาก: สอศ., เว็บพันธมิตร MOU (Honda/Siam ฯ), ข่าวท้องถิ่น, ไดเรกทอรีโรงเรียน
- โซเชียล (Facebook มีแล้ว) — ลิงก์กลับเว็บ, แชร์เนื้อหา
- โปรไฟล์ Google/Bing, YouTube (อัปวิดีโอแผนก → ฝังกลับ)

---

## 🗺️ ROADMAP (แบ่งเฟส)

### เฟส 0 — Quick Wins (สัปดาห์ที่ 1) 🔴 ทำก่อน
- [ ] เปลี่ยน `SITE_URL` → `https://www.eec.ac` (layout.tsx, sitemap.ts, robots.ts)
- [ ] สร้าง **OG image 1200×630** (โลโก้+ชื่อ+ภาพ) แทน logo.png
- [ ] ตั้ง **Google Search Console** + ยืนยันโดเมน + ส่ง sitemap
- [ ] ตั้ง **Google Analytics 4** (หรือ Plausible)
- [ ] ตั้ง/ยืนยัน **Google Business Profile**
- [ ] ใส่ `alt` รูปที่ยังขาดให้ครบ

### เฟส 1 — Technical & Schema (สัปดาห์ 2–4) 🟠
- [ ] เพิ่ม Schema: LocalBusiness/CollegeOrUniversity (address+geo+tel+hours)
- [ ] เพิ่ม BreadcrumbList ทุกหน้าย่อย
- [ ] เพิ่ม FAQPage (หน้า FAQ/สมัคร)
- [ ] เพิ่ม Course offers (ค่าเทอม) + VideoObject (วิดีโอแผนก)
- [ ] ย้าย `<img>` → `next/image` (รูปสำคัญ: hero, การ์ดสาขา)
- [ ] วัด Core Web Vitals (PageSpeed Insights) → แก้จุดช้า

### เฟส 2 — Content & Local (เดือน 2–3) 🟡
- [ ] เพิ่มหน้า **ข่าว/บทความ** (blog) + 5–8 บทความแรก (ตามคำค้นรับสมัคร)
- [ ] ขยายหน้าสาขา: "จบแล้วทำงานอะไร + เงินเดือน + บริษัทรับ"
- [ ] หน้า Landing รับสมัครตามฤดูกาล (ปวช./ปวส. 2570)
- [ ] เก็บรีวิว Google 20+ รายการ
- [ ] ลงไดเรกทอรี + ขอ backlink พันธมิตร MOU

### เฟส 3 — Authority & Scale (เดือน 3–6+) 🟢
- [ ] อัป YouTube วิดีโอแผนก + ฝังกลับเว็บ
- [ ] บทความ/ข่าว ต่อเนื่อง (2–4/เดือน)
- [ ] สร้าง backlink จากข่าวท้องถิ่น/พันธมิตร
- [ ] ติดตามอันดับ keyword + ปรับเนื้อหา (content refresh)

---

## 📊 ตัววัดผล (KPIs)
- Organic traffic (GA4) — เป้า +30% ใน 3 เดือน
- อันดับคำค้นหลัก ("อาชีวะ ชลบุรี/ศรีราชา", ชื่อวิทยาลัย, ชื่อสาขา)
- Impressions/Clicks (Search Console)
- Conversion: คลิกปุ่มสมัคร/โทร จาก organic
- Local: การดู Google Business Profile, ขอเส้นทาง, โทร
- Core Web Vitals ผ่านเกณฑ์ (เขียวทั้ง 3)

---

## 🎯 กลยุทธ์ที่ฟันธง (จาก brainstorm Claude × Gemini)

**หลักคิด: ชนะ "ใกล้บ้าน" ไม่ใช่ชนะ "กว้าง". อันดับเป็นผลพลอยได้ของ (1) เว็บขึ้นจริง+index (2) GBP+รีวิวครองLocal Pack (3) Money Page ไม่กี่หน้า + วัด conversion.** เลิกไล่คำกว้าง ("อาชีวะ", "เรียนช่าง") และเลิกผลิต blog ถี่ๆ

### คำค้น 3 กลุ่ม ROI สูง (ทิ้งคำกว้าง)
1. **Local+สาขา+intent:** "เรียน ปวช ช่างยนต์ แหลมฉบัง", "ต่อ ปวส ไฟฟ้า ศรีราชา", "วิทยาลัยอาชีวะ ชลบุรี"
2. **Outcome/EEC:** "เรียนช่าง จบแล้วมีงานทำ ชลบุรี", "ปวส โควตาโรงงาน EEC" (ประกบสถิติ 83%)
3. **Competitor-alternative:** "ปวช เอกชน ชลบุรี", "สมัคร ปวช ไม่ใช้คะแนน"

### ตัวงัดอันดับ 1 = Google Business Profile + รีวิว (Local Pack มาก่อน organic เสมอ)
**Playbook เก็บรีวิวแบบ compliant** (ห้ามแลกเงิน/ของ = ผิด ToS, ห้าม gate):
- **จังหวะขอ:** ตอนอารมณ์บวกสุด — พ่อแม่มอบตัวเสร็จ / เด็กเซ็นสัญญาฝึกงานโรงงาน EEC
- **ได้ keyword ธรรมชาติ:** ป้าย QR + "คำถามนำ" → "น้องเรียนสาขาอะไร? เดินทางจากแถวไหน? ได้ฝึกงานบริษัทอะไร?" → รีวิวมีคำ "ช่างยนต์/ศรีราชา/แหลมฉบัง/ฝึกงาน" เอง (ไม่บังคับคำ)
- อัด E-E-A-T ลง GBP: รูปใบ สมศ., ศูนย์ทดสอบ สพร., เด็กฝึกงาน
- Backlink เน้น **โรงงานพันธมิตร EEC** (ทำหน้า "เครือข่าย/MOU" ลิงก์หากัน) > เว็บการศึกษาใหญ่

### Money Pages (bottom-funnel — ไม่ใช่ blog)
หน้าปิดการขายตาม intent: "ค่าเทอม ปวส ช่างไฟฟ้า ชลบุรี" · "เรียนช่าง ไม่ใช้คะแนนสอบ" · "จบ ปวส ไฟฟ้า ทำงานที่ไหน"
→ ทำเป็น **Sales Page** (ตารางค่าเทอมชัด ✅, รูปเครื่องมือ/เด็กชุดช็อป ✅, Sticky CTA สมัคร/LINE) — ไม่ใช่บทความ text พืด

### Sprint 90 วัน (แข่งฤดูสมัคร ก.พ.–พ.ค.)
- **วัน 1–15 Deploy & Track:** เว็บขึ้นจริง + สมัคร GBP ทันที (รอ verify นาน) + ติด GTM+GA4 + **Conversion event: `Click_LINE_OA`, `Click_to_Call`, `Submit_Lead`** (คนไทยไม่ชอบกรอกฟอร์ม)
- **วัน 16–45 Index & Local Trust:** ส่ง sitemap เข้า GSC + อัดรูปลง GBP + เริ่ม playbook ขอรีวิวจาก**ศิษย์เก่า/เด็กปัจจุบันที่เพิ่งได้งาน** (ไม่ต้องรอเด็กใหม่)
- **วัน 46–90 Money Pages & PR:** ปล่อย Money Pages + ขอ backlink โรงงานพันธมิตร EEC

### ตัวชี้วัดเดียวที่สำคัญ
**Organic sessions ที่เกิด event `Click_LINE_OA`/`Click_to_Call` บนหน้า bottom-funnel** — ไม่ใช่ traffic กว้าง. นี่คือตัวเดียวที่บอกว่า SEO ทำให้มีคนสมัครจริง

### Schema ที่คุ้ม (เก็บ) vs ทิ้ง
เก็บ: LocalBusiness/CollegeOrUniversity, Course+offers(ค่าเทอม), **FAQ, Review/AggregateRating, VideoObject** (ได้ rich result จริง). ทิ้ง: schema ปลีกย่อยที่ไม่ได้ rich result (over-engineering)

---

## เครื่องมือ
ฟรี: Google Search Console, GA4, PageSpeed Insights, Rich Results Test, Google Business Profile, Bing Webmaster
เสริม: Ahrefs/SEMrush (keyword), Screaming Frog (audit), Plausible (analytics เบา)
