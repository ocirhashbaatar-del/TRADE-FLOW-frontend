# TradeFlow Frontend Architecture

## Goals

TradeFlow is frontend-first. Pages depend on typed repository contracts rather than HTTP or mock arrays, so a backend can replace the mock implementation without changing page components.

## Runtime layers

```text
Route/page
  -> React Query hook or page query
    -> repository contract
      -> mock repository (current)
      -> API repository (future)
        -> Axios client
          -> backend API
```

### Presentation

- `src/pages`: route-level composition only.
- `src/features`: reusable domain UI such as marketplace product cards.
- `src/components/common`: reusable application patterns such as data tables, metrics, pagination, charts, loading, and empty states.
- `src/components/ui`: low-level shadcn-style primitives built on Radix UI.
- `src/layouts`: enterprise, authentication, and marketplace shells.

### Application

- `src/app/router.tsx`: lazy-loaded route tree.
- `src/app/providers.tsx`: React Query, theme, auth, real-time, and notification providers.
- `src/app/navigation.ts`: enterprise navigation configuration.
- `src/contexts`: cross-cutting client state.
- `src/hooks`: reusable UI and real-time hooks.

### Data and integration

- `src/services/contracts.ts`: repository interfaces and shared response contracts.
- `src/services/repositories.ts`: mock and API implementations selected by `VITE_USE_MOCKS`.
- `src/services/mockDatabase.ts`: centralized frontend fixtures.
- `src/api/client.ts`: Axios defaults and interceptors.
- `src/api/endpoints.ts`: backend endpoint map.

No page imports the mock database directly. Business data reaches pages through a repository.

## Replacing mock data with a backend

1. Set `VITE_USE_MOCKS=false`.
2. Set `VITE_API_BASE_URL`.
3. Match backend responses to the contracts in `src/services/contracts.ts`.
4. Extend the API repository implementations where new endpoints are required.
5. Keep page and feature components unchanged.

## Real-time integration

The UI uses `RealtimeAdapter` from `src/services/realtimeAdapter.ts`.

```text
Realtime provider
  -> RealtimeAdapter interface
    -> mock event bus (current)
    -> Socket.IO adapter (future)
```

A future adapter should implement:

- `connect()`
- `disconnect()`
- `subscribe(listener)`
- `emit(event)`

The notification center and live hooks already consume the provider. Replacing the adapter does not require changing those consumers.

## Design system

Global design tokens live in `src/styles/globals.css` and include:

- Inter typography stack
- blue brand scale
- neutral light/dark surfaces
- 12–16 px corner radii
- soft and floating shadows
- focus rings
- reduced-motion behavior
- reusable surface and page-container classes

The interactive component gallery is available at `/design-system`.

## Performance strategy

- Route-level lazy loading with React `lazy` and `Suspense`.
- TanStack Query caching with a 30-second default stale time.
- Reusable domain components instead of repeated page markup.
- Service boundaries that prevent network logic from leaking into components.
- Recharts loaded only in route chunks that use analytics components.

## Accessibility baseline

- Skip links in enterprise and marketplace layouts.
- Keyboard focus styles.
- Semantic navigation landmarks.
- Accessible names for icon-only controls.
- Screen-reader dialog and drawer titles.
- Reduced-motion media query.
- Responsive layouts beginning at 320 px.
