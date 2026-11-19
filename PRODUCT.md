# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: Next.js App Router with TypeScript, deployed to Cloudflare Workers through OpenNext; Cloudflare D1 stores the catalog and Better Auth users/sessions, and Cloudflare R2 stores product images. Keep catalog access behind a repository boundary so a future existing-system integration can replace the provider.

## Users

- Shoppers in Bolivia who want to browse products from two related retail brands.
- Authorized store staff who need to manage the public catalog without relying on the owner.

## Product Purpose

Present two retail brands and their product catalogs through one website. The first phase is for product discovery. Authorized staff should be able to maintain products, prices, and images through an administration area.

## Positioning

The website brings two distinct brands into one catalog experience: BR for school supplies, toys, kitchen articles, and jewelry; Bressy Rosse for cosmetics. The customer should be able to explore the catalog, while staff maintain it independently.

## Operating Context

- The market is Bolivia and prices are shown in bolivianos (Bs).
- Public visitors browse products only in the first phase.
- Authorized administrators sign in with a username and password to manage catalog information.
- A later phase is expected to connect the website to an existing system; integration details are undecided.

## Capabilities and Constraints

- The BR brand contains school supplies, toys, kitchen articles, and jewelry (bisutería).
- The Bressy Rosse brand contains cosmetics.
- Administrators can add and edit products, change prices, hide products from the public catalog, and upload or replace product images.
- Administrators can select products for discounts, enter original and promotional prices, and optionally schedule the promotion window, including Black Friday products.
- Public checkout, payments, inventory synchronization, delivery details, and the existing system's integration method are undecided.

## Brand Commitments

- Brand names and catalog mapping: BR (school supplies, toys, kitchen articles, and jewelry) and Bressy Rosse (cosmetics).
- Currency: bolivianos (Bs).
- No logo, color, typography, or voice guidance has been provided yet.

## Evidence on Hand

- The user supplied the brand mapping and catalog-management requirements in the conversation.
- No product catalog, product photos, logo files, testimonials, or approved product claims are present in the project workspace. Do not fabricate them.

## Product Principles

- Keep the BR and Bressy Rosse catalogs clearly identifiable.
- Let authorized staff maintain products and images without owner intervention.
- Show both the original and promotional price for discounted items.
- Treat online purchasing and system integration as later decisions, not first-phase assumptions.
