# Exhibition Data Organizer 🎨

An automated tool designed for curators and galleries, allowing you to transform raw text (from Word files or copy-paste) into organized data ready for direct entry into Content Management Systems (like Wix CMS).

## ✨ Key Features
- **Automatic Parsing:** Identification of artist names, curators, opening and closing dates.
- **Draggable Sorting:** Reorder artists easily for CMS entry.
- **Smart Formatting:** Automatic removal of trailing dots and specific formatting for gallery captions (Hebrew and English).
- **Curator Customization:** Toggle between "Curator" and "Curatress" (אוצר/אוצרת) labels.
- **English Support:** Automatic capitalization for English titles and dedicated translation fields.
- **File Support:** Upload `.docx` (Word) or `.txt` files directly in the browser.
- **CMS Ready Interface:** Quick copy buttons for formatted values like Slugs or Catalog Order (YYMMDD).

---

## 🚀 Local Setup

To run this project locally on your machine:

1. **Prerequisites:** Ensure you have [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/) installed.
2. **Install Dependencies:**
   ```bash
   pnpm install
   ```
3. **Run in Development Mode:**
   ```bash
   pnpm dev
   ```
4. **View App:** Open your browser at: `http://localhost:8080`

---

## 🌐 Deployment to GitHub Pages

1. **Preparation:** Ensure the `base` in `vite.config.ts` matches your repository name.
2. **Deploy:**
   ```bash
   pnpm deploy
   ```

---

## 🛠 Technologies
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **Icons:** Lucide React
- **Parsing:** Mammoth.js (for Word files)
- **Deployment:** GitHub Pages

---
**Developed for curators and galleries to save valuable time and reduce human error in data entry.**