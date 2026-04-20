# Architecture Guide

## Overview

This repository contains one Angular 21 HoReCa website with a few simple pages.

The architecture should stay lightweight and fit prerendered marketing pages. Treat `AGENTS.md` as the source of truth for repo-wide defaults and use this guide for structure choices.

## Core Stack

- Angular 21
- TypeScript 5
- Angular SSR/prerender
- Tailwind CSS
- SCSS

## Project Direction

- optimize for static landing pages first
- prefer clear page composition over app-like architecture
- keep reuse practical, not abstract for its own sake
- preserve prerender safety by default

## Suggested Structure

Keep code predictable and easy to scan.

- pages: `src/app/pages/<page-name>/`
- layouts: `src/app/layouts/`
- shared UI/directives/pipes/interfaces/services: `src/app/<type>/`
- feature-specific logic only when truly needed: `src/app/feature/<feature-name>/`
- global theme tokens: `src/styles/_theme.scss`
- global styles entry: `src/styles.scss`

## Page Composition

Prefer section-based page composition.

Typical sections:
- hero
- highlights
- menu preview
- gallery
- about
- events or offers
- testimonials
- contact / map / CTA
- footer

Only extract shared sections when they are clearly reused across multiple pages.

## Routing And Prerender

- keep routes simple and crawlable
- each page should work with prerender by default
- do not assume browser-only APIs are available during build
- guard browser-specific code when necessary

## Data Strategy

For static business pages:
- prefer local constants or page-local configuration
- keep content close to the page unless reused
- avoid API/CMS integration unless explicitly required
