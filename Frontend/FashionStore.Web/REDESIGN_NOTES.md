# FashionStore — Liquid Glass Frontend Refresh

## Visual direction

The frontend now uses a unified nocturne / liquid-glass design system: deep plum and indigo surfaces, soft lavender highlights, restrained cyan accents, layered ambient light, fine grid/noise texture, and consistent glass panels.

## Animation system

The project already depends on `motion`. The refresh uses that existing dependency to implement Animate UI-style interaction patterns without introducing another animation package:

- spring-based page transitions for customer and admin routes;
- scroll-triggered reveal for editorial sections, catalog products, and dashboard cards;
- press feedback for shared buttons;
- cursor-following spotlight highlights for glass cards;
- liquid-fill hover states for primary actions;
- subtle orbital / floating hero elements;
- reduced-motion support for the main motion components and particle canvas.

ReactBits-inspired components are implemented locally in `src/components/ui`, so the project does not need to fetch component source at runtime.

## Main files refreshed

- `src/styles/tokens.css`, `src/index.css`: design tokens, global surfaces, responsive states, compatibility styling for existing admin/customer screens.
- `src/components/ui`: `PageMotion`, `Reveal`, `ParticlesCanvas`, `SpotlightCard`, ambient grid/orb components.
- `src/components/layout`: customer header/navigation/footer and admin shell/header/sidebar.
- `src/components/common`: shared button, input, and modal styles.
- `src/components/products/ProductCard.jsx`: catalog card treatment and hover interaction.
- `src/pages/public`: homepage, product catalog, product detail image presentation, account/address/checkout/order dark-glass treatment.
- `src/pages/auth`: sign-in and sign-up glass panels and entrance transitions.
- `src/pages/admin`: dashboard card reveals and admin module preview treatment.
- `src/pages/NotFoundPage.jsx`: redesigned 404 page.

## Run locally

Use Node.js **22.22.0 or later**. The project currently depends on `react-router` 8.5.x, which declares that minimum Node version.

```bash
npm ci
npm run dev
```

Production build:

```bash
npm run build
```

The environment file is intentionally not bundled in this source archive. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to your backend API base URL.

## Scope

This is a frontend presentation refresh. API services, DTO contracts, authentication flow, cart flow, checkout flow, and backend business logic were not intentionally changed.
