<div align="center">

# 🖼️ Art Gallery Slider

**A cinematic, immersive art gallery experience — built with Next.js & Framer Motion**

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)

<br/>

> *Browse world-class artwork through a full-screen, ambient-lit gallery where every piece transforms the atmosphere around it.*

<br/>

[🚀 Get Started](#-getting-started) · [✨ Features](#-features) · [📂 Structure](#-project-structure) · [🎮 Controls](#-usage--controls)

---

</div>

## ✨ Overview

**Art Gallery Slider** is a full-screen, editorial-style artwork browsing experience. Each artwork takes center stage against a **dynamically-colored ambient background** — the app automatically extracts the dominant colors from each image and builds a living, breathing gradient backdrop that shifts with every slide.

Built as part of the **Hackathonix** project collection, this component demonstrates advanced animation patterns, gesture handling, and real-time image processing — all in a beautifully minimal UI.

---

## 🌟 Features

| Feature | Description |
|---|---|
| 🎨 **Dynamic Color Extraction** | Extracts 3 dominant colors from each artwork via `<canvas>` to generate a unique animated ambient background |
| 🌊 **Cinematic Transitions** | Framer Motion spring physics power fluid crossfades, scale shifts, and staggered element animations |
| ⌨️ **Keyboard Navigation** | `←` / `→` arrow keys to browse; full keyboard accessibility |
| 🖱️ **Mouse Wheel & Trackpad** | Horizontal/vertical scroll gestures with threshold-based snapping |
| 👆 **Drag & Swipe** | Click-drag on desktop or swipe on touch — feels natural on any device |
| 🔵 **Navigation Dots** | Color-tinted dot indicators (using extracted artwork color) with click-to-jump |
| 🖼️ **Artwork Cards** | Title, artist, and year displayed with graceful glassmorphism info panels |
| 🌑 **Full-screen Dark Mode** | Dark editorial canvas (`#0a0a0a`) that makes artwork colors explode |
| 📱 **Responsive Design** | Adapts from mobile to ultrawide — fluid layout and touch-optimized gestures |

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **[Next.js](https://nextjs.org/)** | 15 (App Router) | React framework & SSR |
| **[React](https://react.dev/)** | 19 | UI library |
| **[TypeScript](https://www.typescriptlang.org/)** | 5 | Type safety throughout |
| **[Framer Motion](https://www.framer.com/motion/)** | 12 | Animations & gesture handling |
| **[Tailwind CSS](https://tailwindcss.com/)** | v4 | Utility-first styling |
| **[shadcn/ui](https://ui.shadcn.com/)** | latest | Accessible Radix UI components |
| **[Lucide React](https://lucide.dev/)** | 0.454 | Clean icon set |
| **[Embla Carousel](https://www.embla-carousel.com/)** | 8.5 | Carousel primitives |

---

## 📂 Project Structure

```
art-gallery-slider/
│
├── 📁 app/
│   ├── layout.tsx            # Root layout with fonts & theme provider
│   ├── page.tsx              # Entry point — renders ArtGallerySlider
│   └── globals.css           # Global styles & design tokens
│
├── 📁 components/
│   ├── art-gallery-slider.tsx   # 🎯 Core slider — orchestrates all features
│   ├── artwork-card.tsx         # 🖼️  Individual artwork display card
│   ├── navigation-dots.tsx      # 🔵 Dot navigation with color tinting
│   ├── theme-provider.tsx       # 🌑 Dark/light theme context
│   └── ui/                      # shadcn/ui component library
│
├── 📁 data/
│   └── artworks.ts           # Curated artwork dataset
│
├── 📁 hooks/
│   ├── use-color-extraction.ts  # Canvas-based dominant color extraction
│   ├── use-slider-navigation.ts # Index state + keyboard navigation
│   ├── use-slider-drag.ts       # Pointer drag / touch swipe handling
│   ├── use-slider-wheel.ts      # Mouse wheel & trackpad handling
│   ├── use-mobile.ts            # Mobile breakpoint detection
│   └── use-toast.ts             # Toast notification hook
│
├── 📁 types/
│   └── artwork.ts            # Artwork TypeScript interface
│
└── 📁 lib/
    └── utils.ts              # Utility helpers (cn, clsx)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `>= 18.0`
- **npm** / **yarn** / **pnpm**

### Installation & Running

```bash
# 1. Clone the repository
git clone https://github.com/Pusparaj99op/hackathonix-final.git

# 2. Navigate to this project
cd hackathonix-final/art-gallery-slider

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser — the gallery loads immediately.

### Build for Production

```bash
npm run build   # Creates optimized production bundle
npm start       # Serves the production build
```

---

## 🎮 Usage & Controls

Once running, navigate the gallery using any of these inputs:

| Input | Action |
|---|---|
| `→` Arrow Key | Next artwork |
| `←` Arrow Key | Previous artwork |
| Mouse Wheel | Scroll to browse |
| Click + Drag | Drag left / right |
| 👆 Swipe (mobile) | Swipe left or right |
| Navigation Dots | Click to jump to any slide |

---

## 🖼️ Artworks

The gallery ships with **7 curated pieces** from diverse contemporary artists:

| # | Title | Artist | Year |
|---|---|---|---|
| 1 | Ethereal Dreams | Marina Solace | 2023 |
| 2 | Urban Fragments | Chen Wei | 2024 |
| 3 | Coastal Serenity | Elise Beaumont | 2022 |
| 4 | Abstract Reverie | Yuki Tanaka | 2024 |
| 5 | Digital Landscapes | Alex Reiner | 2024 |
| 6 | Whispers of Color | Lila Fontaine | 2023 |
| 7 | Metropolis | David Kross | 2022 |

> All images are sourced from [Unsplash](https://unsplash.com/) for demonstration purposes.

---

## ➕ Adding Your Own Artworks

Open [data/artworks.ts](data/artworks.ts) and append to the array:

```ts
{
  id: 9,
  title: "My Artwork Title",
  artist: "Artist Name",
  year: 2025,
  image: "https://your-image-url.com/image.jpg",
}
```

Color extraction and all animations automatically adapt — no extra configuration needed.

---

## 🎨 How Dynamic Color Extraction Works

```
Image URL → <canvas> pixel sampling → dominant color clustering
    → top 3 colors per artwork → CSS radial-gradient variables
    → Framer Motion AnimatePresence → smooth crossfade on slide change
```

1. Each image is drawn onto an off-screen `<canvas>` element
2. Pixel data is sampled to identify dominant color clusters
3. The 3 most distinct colors are stored per artwork ID
4. On each slide change, `AnimatePresence` crossfades between two `motion.div` backgrounds
5. The gradient shifts seamlessly, giving every artwork its own visual atmosphere

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local development server with hot reload |
| `npm run build` | Build optimised production bundle |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint across all source files |

---

## 🤝 Contributing

All contributions are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m "feat: describe your change"`
4. Push to the branch: `git push origin feat/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is part of the **Hackathonix** collection. See the [root repository](https://github.com/Pusparaj99op/hackathonix-final) for licensing details.

---

<div align="center">

Made with ❤️ for **Hackathonix**

Built with [Next.js](https://nextjs.org/) · Animated by [Framer Motion](https://www.framer.com/motion/) · Styled with [Tailwind CSS](https://tailwindcss.com/)

</div>
