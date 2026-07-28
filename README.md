# TradeFlow Frontend

Enterprise Supply Chain Management + Multi-Vendor Marketplace frontend built first with mock repositories and backend-ready service contracts.

## Included

- React 19, Vite, TypeScript, and Tailwind CSS 4
- React Router, TanStack Query, and Axios
- React Hook Form + Zod authentication forms
- Framer Motion, Recharts, and Lucide React
- shadcn-style reusable primitives built with Radix UI
- Responsive enterprise sidebar, navbar, footer, breadcrumb, and marketplace layout
- Inter typography, design tokens, dark mode, reduced-motion support, loading skeletons, and empty states
- Dashboard with KPI cards, charts, recent orders, activity, messages, pending actions, quick actions, and live-event preview
- Authentication flow: login, register, reset, email verification, OTP, role selection, tenant selection, 401, and 403
- Marketplace: landing, catalog, categories, search, filters, product details, wishlist, cart, checkout, success, orders, reviews, recommendations, and vendor store
- Enterprise modules: inventory, warehouses, suppliers, purchase orders, finance, customers, vendors, shipping, delivery, returns, refunds, analytics, reports, notifications, settings, and billing
- Socket.IO-ready event adapter, mock event bus, real-time provider, notification provider, and typed live hooks
- Axios client, repository interfaces, mock/API implementations, and environment-based service switching
- Route-level lazy loading, accessible navigation, loading, empty, 404, and 500 states

## Requirements

- Node.js 20.19+ or 22.12+
- npm 10+

## Run

```bash
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`.

Demo login is prefilled:

- Email: `alex@tradeflow.dev`
- Password: `password`

## Commands

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
npm run preview
```

## Backend integration

Set:

```env
VITE_USE_MOCKS=false
VITE_API_BASE_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
```

The UI consumes repositories from `src/services/repositories.ts`. Replace or extend API repository implementations without changing page components.

## Architecture

```text
src/
  app/          router, providers, navigation
  layouts/      enterprise, auth, marketplace shells
  pages/        route-level UI
  components/   reusable UI and enterprise components
  features/     domain components
  contexts/     auth, theme, notifications, realtime
  services/     contracts, fixtures, repositories, event adapter
  api/          Axios client and endpoint definitions
  hooks/        reusable frontend hooks
  types/        shared domain types
  styles/       global tokens and Tailwind theme

docs/
  ARCHITECTURE.md
  ROUTES.md
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for integration boundaries and [`docs/ROUTES.md`](docs/ROUTES.md) for the complete route map.

## Notes

- Product photography uses remote Unsplash URLs as placeholder mock assets.
- No backend code or real Socket.IO connection is included.
- The mock real-time adapter emits a sample operational event every 18 seconds.
- The Google-hosted Inter stylesheet gracefully falls back to the system font stack when offline.
