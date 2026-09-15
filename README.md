# Uniform-ish storefront

A Shopify Hydrogen storefront for Uniform-ish — six earth tones matched to each
other, made to order in Australia.

Built on **Hydrogen 2026.4**, **React Router 7** and **Vite**, deployed to
**Oxygen**. Shopify is the backend of record (checkout, payments, tax, orders);
this app is the browsing UI in front of it, reading the Storefront API and
handing off to Shopify's hosted checkout.

For brand rules, the colour system and the conventions this codebase follows,
read [`CLAUDE.md`](./CLAUDE.md).

## Getting started

```bash
npm install
cp .env.example .env     # set SESSION_SECRET to any non-empty string locally
npm run dev              # http://localhost:3000
```

With no Shopify credentials set, Hydrogen falls back to **mock.shop** so the
site renders against sample products. The hue swatches, the duo/kit pairing and
the real product handles only light up against a real storefront — connect one
with:

```bash
npx shopify hydrogen link
npx shopify hydrogen env pull
```

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | MiniOxygen dev server, with codegen in watch mode |
| `npm run build` | Production build |
| `npm run preview` | Build, then serve the built app |
| `npm run typecheck` | `react-router typegen && tsc --noEmit` |
| `npm run codegen` | Regenerate `storefrontapi.generated.d.ts` |
| `npm run lint` | ESLint |

Run `npm run codegen` after changing any GraphQL query or fragment — the
generated types are not hand-edited and `typecheck` fails until they're rebuilt.

## Structure

```
app/
  data/          brand content: the hue system and the range
  components/    header, footer, overlays, cart, product form
  lib/           Storefront queries, variant matching, session, context
  routes/        file-based routes
  styles/        reset.css + app.css (design tokens, then blocks)
  assets/fonts/  self-hosted JetBrains Mono subsets
```

## Deploying

Oxygen deploys from CI or `npx shopify hydrogen deploy`. See the
[Hydrogen deployment docs](https://shopify.dev/docs/custom-storefronts/hydrogen/deployments).
