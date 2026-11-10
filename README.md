# AMAZ Manpower

**Amin Trade International** er jonno single-file recruitment o hishab software — passport tracking, agent / company ledger, cash & bank book, voucher, report, staff & salary. Bangladesh ar Malaysia office — shob PC te ek-i data (Cloud Sync).

🔗 **Live app:** GitHub Pages chalu korar por ekhane link boshbe → `https://<your-username>.github.io/<repo-name>/`

---

## Ki kore

- **Passport Tracker** — candidate, status, agent, company, job category; **📎 passport copy o bidesh jawar shob kagoj upload** (cloud e encrypt); Excel import / export
- **Candidate Profile** — status timeline, kagoj er meyad alert, prarthi r package o kisti, WhatsApp; **📷 Passport MRZ scan**; **✈️ Flight list / Manifest**
- **Recruitment Report** o Dashboard **Pipeline**; Agent commission o Status Report; Company Demand Note
- **Agent / Company / Loan Ledger**, **Cash & Bank** (Day Close, Reconciliation, Transfer, Split payment)
- **Voucher** (QR code + verify), **Daily Report, Profit & Loss, Monthly / Yearly report, Trial Balance, Balance Sheet**
- **Staff & Salary, Task List, Recycle Bin, Posting Lock, Login History**
- **Cloud Sync — duita option:** ⚡ Supabase ba 📗 Google Apps Script (Google Sheet + Drive)
- **Print / PDF** — shob print English e; screen Banglish / English / বাংলা
- **Offline** — shob data apnar browser e (IndexedDB); net na thakleo kaj chole

## Kivabe chalaben

- **Shorasori:** `index.html` je kono browser e (Chrome shobcheye bhalo) khulun
- **Online:** GitHub Pages link e khulun — mobile / je kono device theke. Chrome e **Install** (⊕) dile app er moto alada window e khule.

## GitHub e upload (ekbar)

1. github.com e notun repository (jemon `amaz-manpower`) — Public ba Private (Private hole Pages er jonno GitHub Pro lagte pare)
2. **Add file ▸ Upload files** — ei folder er **shob file** (`index.html`, `sw.js`, `manifest.webmanifest`, `version.json`, icon gulo, `.nojekyll`) ek shathe drag kore din → **Commit**
3. **Settings ▸ Pages ▸ Source: Deploy from a branch ▸ Branch: main / (root) ▸ Save**
4. 1–2 minute por link chalu: `https://<username>.github.io/amaz-manpower/`

## Update dewar niyom

- Notun version ashle shudhu `index.html`, `version.json` ar `sw.js` bodle **Commit** korun.
- `version.json` shob shomoy sathe upload korben — eta dekhei khola app "🆕 Notun version eshechhe → Ekhoni Update" dekhay.
- Data kokhono muche na — data browser e (ar Cloud e), file e na.

## Cloud Sync

Software er **Settings ▸ Cloud Sync** e upore duita tab:
- **⚡ Supabase** — "📜 SQL Setup Script" Supabase SQL Editor e Run → URL, anon key, Organisation ID, Org password
- **📗 Google Apps Script** — Google Sheet ▸ Extensions ▸ Apps Script e "📜 Apps Script Code" paste → TOKEN bodlan → Deploy ▸ Web app (Execute as: Me · Who has access: **Anyone**) → Web App URL ar Token din

Onno PC te prothom page er **"☁️ Cloud theke data anun"** — shob data ar user chole ashe.

## Shahajjo / Changelog

Software er bhitore **F1** — puro User Guide ar protita version er poriborton.
**Bortoman version: v4.7.0**

## Tech

- Single-file HTML + vanilla JavaScript, IndexedDB
- PDF: html2canvas + jsPDF · QR · Excel: SheetJS (CDN theke load hoy)
- PWA: `sw.js` (offline), `manifest.webmanifest` (install)

---

© Amin Trade International — shorbosshotto songrokkhito. Built by Farid Ahmad Rayhan · Powered by AMAZ ERP Solution.
