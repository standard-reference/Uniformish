# Agent notes

Project context, brand rules and storefront conventions live in **`CLAUDE.md`** —
read that first. This file only covers the Shopify-specific tooling.

This is a Shopify Hydrogen storefront (Hydrogen 2026.4, React Router 7, deployed
to Oxygen). For Shopify API and platform work, use the
[Shopify AI Toolkit](https://shopify.dev/docs/apps/build/ai-toolkit); if it is
missing, install it in the agent host per that page.

Always run `npm run codegen` after changing a GraphQL query or fragment —
`storefrontapi.generated.d.ts` is generated, not hand-edited, and `npm run
typecheck` will fail until it is regenerated.
