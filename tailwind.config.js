/**
 * RecruitFlow — Tailwind Config
 * Sumber acuan: Design.md (05-Design-System-RecruitFlow.md)
 * Font utama: Poppins · Font data/mono: JetBrains Mono
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // ---- 1. Color Palette (Design.md §1) ----
      colors: {
        ink: {
          50:  "#F5F6F8",
          100: "#DDE1EA",
          300: "#8D97AC",
          500: "#3D4A66",
          700: "#16233F", // brand base — teks utama, sidebar, footer
          900: "#0B111F",
        },
        canvas: {
          DEFAULT: "#F5F6F2", // latar halaman default
          surface: "#FFFFFF", // latar kartu/panel
          border:  "#E7E9E4",
        },
        amber: {
          100: "#FBEAD0",
          300: "#F1C179",
          500: "#E8A23D", // brand base — CTA primer, node aktif Stage Rail
          600: "#C98429",
          700: "#A66A1E", // dipakai utk TEKS amber (500 tidak cukup kontras)
          900: "#5F3A0F",
        },
        teal: {
          100: "#D8EEF0",
          300: "#7EC1C7",
          500: "#1F6F78", // brand base — aksen sekunder, link, nav aktif
          600: "#195A61",
          700: "#14454A",
          900: "#0A2528",
        },
        moss: {
          100: "#DCEEE4",
          300: "#8FC2AA",
          500: "#3F7D5C", // status: Hired / sukses
          600: "#336549",
          700: "#294F3A",
          900: "#142719",
        },
        coral: {
          100: "#FADFDA",
          300: "#EC9C8C",
          500: "#D8543F", // status: Rejected / error
          600: "#B33F2C",
          700: "#8C3122",
          900: "#4A1A12",
        },
      },

      // ---- 2. Typography (Design.md §2) ----
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],       // font utama — seluruh UI, heading, body
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"], // timestamp, ID, skor, activity log
      },
      fontSize: {
        "display-xl": ["52px", { lineHeight: "1.1",  letterSpacing: "-0.02em" }], // hero publik
        "display-lg": ["38px", { lineHeight: "1.15", letterSpacing: "-0.02em" }], // judul halaman publik
        "heading-lg": ["26px", { lineHeight: "1.25", letterSpacing: "-0.01em" }], // judul section dashboard
        "heading-md": ["19px", { lineHeight: "1.3"  }],                          // judul kartu/modal
        "body-lg":    ["16px", { lineHeight: "1.65" }],                          // body copy publik
        "body-md":    ["14px", { lineHeight: "1.55" }],                          // body UI dashboard (default)
        "body-sm":    ["13px", { lineHeight: "1.45", letterSpacing: "0.01em" }], // label, caption
        "mono-sm":    ["12.5px", { lineHeight: "1.4" }],                         // data presisi
      },

      // ---- 5. Elevation & Radius (Design.md §5) ----
      borderRadius: {
        sm: "6px",   // chip, badge kecil
        md: "8px",   // tombol, input (default)
        lg: "12px",  // kartu, kolom kanban
        xl: "16px",  // modal, panel besar
      },
      boxShadow: {
        xs: "0 1px 2px rgba(22,35,63,0.04)",   // batas halus kartu default
        sm: "0 2px 6px rgba(22,35,63,0.06)",   // kartu dashboard, dropdown
        md: "0 6px 16px rgba(22,35,63,0.10)",  // hover kartu, popover
        lg: "0 12px 32px rgba(22,35,63,0.16)", // modal, kanban card saat drag
      },

      // ---- 8. Spacing / Layout (Design.md §8) ----
      maxWidth: {
        container: "1200px", // container area publik
      },

      // ---- 12. Animation Rules (Design.md §12) ----
      keyframes: {
        "pulse-node": {
          "0%, 100%": { transform: "scale(1)",    opacity: "1"    },
          "50%":      { transform: "scale(1.08)", opacity: "0.85" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0"  },
        },
      },
      animation: {
        "pulse-node": "pulse-node 2s ease-in-out infinite", // node aktif Stage Rail
        shimmer: "shimmer 1.2s linear infinite",             // skeleton loading state
      },
    },
  },
  plugins: [
    // Dipakai untuk merender konten rich text (Deskripsi Lowongan, §7.17 Rich Text Toolbar)
    // secara konsisten via class `prose` — pasang paketnya saat setup project:
    // npm install -D @tailwindcss/typography
    require("@tailwindcss/typography"),
  ],
};
