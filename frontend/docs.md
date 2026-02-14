# Blogging Frontend — Walkthrough

## Overview

Built a premium, Indian-essence-inspired blogging frontend using **React 18 + Vite + TypeScript + TailwindCSS v4 + Framer Motion**. The frontend connects to the existing Fastify backend at `/api/v1`.

## Project Structure

```
frontend/
├── index.html              ← Google Fonts, SEO meta, dark mode
├── vite.config.ts           ← TailwindCSS plugin, @/ alias, API proxy
├── tsconfig.app.json        ← Path aliases (@/*)
├── src/
│   ├── main.tsx             ← Entry point
│   ├── App.tsx              ← Router + AnimatePresence transitions
│   ├── index.css            ← Theme tokens, scrollbar, glass, blobs, mandala
│   ├── types/index.ts       ← TS interfaces (User, Article, Comment)
│   ├── lib/
│   │   ├── api.ts           ← Axios instance + JWT interceptor
│   │   └── utils.ts         ← cn(), formatDate(), readingTime(), etc.
│   ├── context/
│   │   └── AuthContext.tsx   ← Auth provider (login/register/logout)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx    ← Glassmorphic, search overlay, mobile menu
│   │   │   ├── Footer.tsx    ← Mandala bg, Devanagari accent
│   │   │   └── Layout.tsx    ← Navbar + Outlet + Footer wrapper
│   │   ├── BlogCard.tsx      ← Animated card with hover effects
│   │   ├── LikeButton.tsx    ← whileTap/whileHover micro-interactions
│   │   └── CursorGlow.tsx    ← Mouse-following glow (desktop only)
│   └── pages/
│       ├── LandingPage.tsx   ← Hero, gradient blobs, featured, Why, CTA
│       ├── BlogListPage.tsx  ← Editorial grid, search, tag filters
│       ├── BlogReadingPage.tsx ← Scroll progress, prose, Samvaad comments
│       ├── ProfilePage.tsx   ← Cover, avatar, stats, tabs, blog grid
│       ├── FeedPage.tsx      ← Timeline with alternating cards
│       ├── LoginPage.tsx     ← Email/password form with validation
│       └── RegisterPage.tsx  ← Name/username/email/password form
```

## Key Design Decisions

| Decision | Rationale |
|---|---|
| TailwindCSS v4 `@theme` | Native CSS custom properties for the Indian Essence palette |
| Vite API proxy | Avoids CORS issues; frontend at `:5173` proxies `/api` to backend `:3000` |
| `AnimatePresence` on routes | Smooth page transitions without SPA jank |
| Prose typography plugin | Clean article rendering with dark-mode overrides |
| Mandala SVG as inline data URI | No external asset dependency, 5% opacity for subtlety |

## Theme: Indian Essence

- **Dark backgrounds**: `#0f0e13` → `#17161c` → `#1f1d26`
- **Accents**: Royal Indigo `#4338CA`, Muted Saffron `#F59E0B`, Deep Maroon `#7F1D1D`, Emerald Silk `#047857`
- **Typography**: Playfair Display (headings), Inter (body), Noto Serif Devanagari (Hindi accents)
- **Hero text**: "विचार · लेखन · संवाद" → "Vichaar. Lekhan. Samvaad."

## API Integration

All API calls go through `src/lib/api.ts` Axios instance:

| Frontend Route | Backend Endpoint | Auth |
|---|---|---|
| `/` | `GET /blogs` (featured) | No |
| `/blogs` | `GET /blogs`, `GET /blogs/search` | No |
| `/blogs/:slug` | `GET /blogs/slug/:slug` | No |
| `/blogs/:slug` (like) | `POST /blogs/:id/like\|unlike` | Yes |
| `/blogs/:slug` (comment) | `POST /blogs/:id/comments` | Yes |
| `/profile/:username` | `GET /users/:username` | No |
| `/profile/:username` (follow) | `POST /users/:id/follow\|unfollow` | Yes |
| `/feed` | `GET /feed` | Yes |
| `/login` | `POST /auth/login` | No |
| `/register` | `POST /auth/register` | No |

## Verification

- **TypeScript**: `npx tsc --noEmit` → ✅ zero errors
- **Production build**: `npm run build` → ✅ 6.78s, 2186 modules
  - CSS: 57KB (9.2KB gzip)
  - JS: 451KB (143KB gzip)
- **Dev server**: `npm run dev` → ✅ running on `localhost:5173`

## How to Run

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

> [!IMPORTANT]
> The backend must be running on port 3000 for API calls to work. The Vite proxy forwards `/api` requests automatically.
