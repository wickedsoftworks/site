---
name: Wicked Softworks
description: A neutral, hairline-ruled developer site with near-white and near-black grounds, squared corners, and one cyan accent taken from the logo.
colors:
  bg: '#ffffff'
  surface: '#fafafa'
  surface-2: '#f4f4f5'
  line: '#e4e4e7'
  line-strong: '#d4d4d8'
  fg: '#09090b'
  fg-muted: '#52525b'
  fg-subtle: '#71717a'
  brand: '#0891b2'
  brand-text: '#0e7490'
  brand-fg: '#ffffff'
  brand-bright: '#22d3ee'
  ok: '#15803d'
  warn: '#b45309'
  info: '#1d4ed8'
  idle: '#71717a'
  dark-bg: '#08080a'
  dark-surface: '#0f0f12'
  dark-surface-2: '#17171b'
  dark-line: '#232329'
  dark-line-strong: '#33333b'
  dark-fg: '#fafafa'
  dark-fg-muted: '#a1a1aa'
  dark-fg-subtle: '#7c7c87'
  dark-brand: '#22d3ee'
  dark-brand-text: '#67e8f9'
  dark-brand-fg: '#06202a'
typography:
  display:
    fontFamily: 'Geist Variable, ui-sans-serif, system-ui, sans-serif'
    fontSize: 'clamp(2.25rem, 7vw, 4.25rem)'
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: '-0.035em'
  h1:
    fontFamily: 'Geist Variable, ui-sans-serif, system-ui, sans-serif'
    fontSize: '2.25rem'
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: '-0.02em'
  h2:
    fontFamily: 'Geist Variable, ui-sans-serif, system-ui, sans-serif'
    fontSize: '1.5rem'
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: '-0.02em'
  h3:
    fontFamily: 'Geist Variable, ui-sans-serif, system-ui, sans-serif'
    fontSize: '1.125rem'
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: '-0.02em'
  card-title:
    fontFamily: 'Geist Variable, ui-sans-serif, system-ui, sans-serif'
    fontSize: '0.9375rem'
    fontWeight: 500
    lineHeight: 1.4
  body:
    fontFamily: 'Geist Variable, ui-sans-serif, system-ui, sans-serif'
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.65
  body-sm:
    fontFamily: 'Geist Variable, ui-sans-serif, system-ui, sans-serif'
    fontSize: '0.875rem'
    fontWeight: 400
    lineHeight: 1.65
  mono:
    fontFamily: 'Geist Mono Variable, ui-monospace, monospace'
    fontSize: '0.75rem'
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: 'Geist Variable, ui-sans-serif, system-ui, sans-serif'
    fontSize: '0.6875rem'
    fontWeight: 500
    lineHeight: 1
    letterSpacing: '0.08em'
rounded:
  sm: '2px'
  md: '4px'
  lg: '6px'
  xl: '8px'
  full: '999px'
spacing:
  tight: '12px'
  card: '20px'
  card-lg: '24px'
  section: '64px'
  section-lg: '80px'
components:
  button-brand:
    backgroundColor: '{colors.brand}'
    textColor: '{colors.brand-fg}'
    rounded: '{rounded.md}'
    padding: '0 20px'
    height: '44px'
  button-outline:
    backgroundColor: 'transparent'
    borderColor: '{colors.line}'
    textColor: '{colors.fg}'
    rounded: '{rounded.md}'
    padding: '0 20px'
    height: '44px'
  panel:
    backgroundColor: '{colors.surface}'
    borderColor: '{colors.line}'
    rounded: '{rounded.md}'
    padding: '24px'
  ruled-cell:
    backgroundColor: '{colors.bg}'
    hoverBackgroundColor: '{colors.surface-2}'
    padding: '20px'
  placeholder-tag:
    borderColor: '{colors.line-strong}'
    borderStyle: 'dashed'
    textColor: '{colors.fg-subtle}'
    typography: '{typography.label}'
    rounded: '{rounded.sm}'
    padding: '2px 6px'
  nav-active:
    textColor: '{colors.fg}'
    underlineColor: '{colors.brand}'
    underlineHeight: '2px'
---

# Design System: Wicked Softworks

## Overview

**Creative direction: convention, played straight.**

This is the category standard executed at full fidelity rather than treated as a
fallback. It holds the finish level of Linear and Vercel, with the hero structure of
vite.dev. It deliberately replaces an earlier skeuomorphic machine-shop world
(enamel signs, manila job tickets, pegboard, hazard stripes) that put costume
between the visitor and the code.

The governing rule is that **nothing is decorated that is not also structural.**
Borders divide, they do not ornament. There are no textures, no gradient fields,
no drop shadows on content, and no card scatter. The page is a quiet grey scale
with hairline rules doing all the dividing; the only saturated colour in the
building is the logo's cyan, and it is spent in four places and no others.

**Key characteristics:**

- Neutral ground, one accent. Restrained colour strategy throughout.
- Hairline rules, not gaps: lists read as one ruled table, never a scatter of cards.
- Squared corners: 4px by default, nothing above 8px except the scrollbar thumb.
- Status is a dot and a word, never a coloured surface.
- Absence is marked, quietly: a dashed `PLACEHOLDER` tag, never a hazard stripe.

## Colors

### Primary

- **Brand cyan** (`{colors.brand}` light / `{colors.dark-brand}` dark): taken from
  the logo's five-point star. It appears in exactly four roles: the primary
  button fill, link and hover text, the active nav underline, and the focus ring.
  There is no fifth. `brand-bright` is the same hue one step up, and its only job
  is the hero headline's accent phrase.

### Neutral

- **Ground** (`{colors.bg}` / `{colors.dark-bg}`): the page itself.
- **Surface** (`{colors.surface}` / `{colors.dark-surface}`): closing panels and
  the footer. One step off the ground, never more.
- **Surface 2** (`{colors.surface-2}` / `{colors.dark-surface-2}`): the hover
  state of an interactive row or cell, and inline code chips.
- **Line** (`{colors.line}` / `{colors.dark-line}`): the workhorse. Every
  division on the site is this 1px value.
- **Text** (`{colors.fg}` / `{colors.fg-muted}` / `{colors.fg-subtle}`): three
  steps. Muted carries body copy at 7.4:1; subtle is for labels and captions
  only, never for prose.

### Status

Four hues (`ok`, `warn`, `info`, `idle`) used at dot scale only, as a 6px circle
beside a word. They never fill a surface, tint a border, or colour a heading.

### Named rules

**The Four Roles Rule.** Brand cyan may appear as: a primary button fill, link
text, the active nav underline, the focus ring. Anything else that wants to be
cyan is wrong.

**The Two Cyans Rule.** `brand` is a fill value and `brand-text` is a text value,
because the fill is too light to set copy in on a white ground. Setting body copy
in `brand` on light mode is the failure this split exists to prevent.

**Status Never Fills.** A status is a dot plus its word. A coloured chip, badge
background, or tinted row is out of system.

## Typography

**One family: Geist Variable.** **One mono: Geist Mono Variable.**

Geist is the face Vercel ships, which is the craft register this site was pinned
to. Mono is reserved for things that are literally code, data, or measurement:
repository paths, dependency versions, stack names, the org URL. It is never used
as a costume for "technical".

### Hierarchy

- **Display** (600, `clamp(2.25rem, 7vw, 4.25rem)`, -0.035em): the hero headline,
  once per site. Its second line is the accent phrase.
- **h1** (600, 2.25–2.5rem): the page heading on each inner route.
- **h2** (600, 1.5rem): section headings on the home page.
- **h3** (600, 1.125rem): closing-panel headings and tool category headings.
- **Card title** (500, 0.9375rem): project names, role names, tool names.
- **Body** (400, 1rem, 1.65): page leads, held to `max-w-2xl`.
- **Body small** (400, 0.875rem, 1.65): descriptions inside cells and panels.
- **Mono** (400, 0.75rem): versions, stacks, paths, skills.
- **Label** (500, 0.6875rem, 0.08em, uppercase): footer column headings only.

### Named rules

**The Tracking Floor.** Headings tighten as they grow, and never past -0.04em.
Body copy is never tracked.

**No Eyebrows.** No kicker or label sits above a heading. The heading carries its
own weight.

## Layout

A single centred container at `max-width: 72rem` (`max-w-6xl`) with 16px gutters
on phones and 24px from `sm`. The hero is the one full-bleed element, bounded by
the header's rule above and its own rule below.

Rhythm: 20–24px inside a cell, 64–80px between sections, and every section after
the first opens with a `border-t` hairline rather than relying on space alone.
Pages close on a real anchor, which is a surface panel with a heading, a sentence
and one action, never a link dump.

The header is sticky, 56px, translucent with a backdrop blur, and carries a
single bottom hairline. It is the only chrome on the page.

## Elevation & Depth

**There is none, by decision.** Content sits on the ground or on a one-step
surface, separated by 1px rules. No shadows are used on content anywhere in the
system. The only depth cue is the backdrop blur on the sticky header, which is
functional rather than decorative, since it keeps scrolling content legible under the
nav.

## Shapes

Squared. 4px is the default, 2px on small chips, 6–8px on the largest panels.
Nothing rounder, with one exception: status dots and the scrollbar thumb are
fully round, because they are dots and a thumb.

## Components

### Buttons

- **Brand:** cyan fill, `brand-fg` text, 4px radius. One per view, and it is
  always the outward path to GitHub.
- **Outline:** transparent with a `line` border. Everything secondary.
- **Ghost:** used only for icon controls in the header.
- **Sizes:** `xl` (44px) in the hero, `lg` (32px) everywhere else.

### The ruled grid (signature component)

The system's defining container. A list of items is a CSS grid with a 1px gap
over a `line`-coloured parent, bordered and corner-clipped, so the cells share
exact hairlines instead of floating as separate cards. Cells carry their own
background and light up to `surface-2` on hover when they link somewhere. Column
count is set in the markup; everything else comes from the utility.

This is what keeps projects, roles and tools reading as one table each rather
than as three grids of boxes.

**The Short Row Rule.** A ruled grid must always close into a complete
rectangle. Two mechanisms together get there, and both are needed:

1. Cells draw their own top and left rules as a box-shadow, rather than the grid
   showing a rule-coloured parent through a 1px gap. Under the gap approach a
   track with no cell in it has nothing to cover the parent, and renders as a
   solid block of rule colour.
2. Because rules then only exist where cells exist, a short last row leaves them
   stopping in mid-air. Every multi-column ruled grid therefore carries
   `ruled-fill-2` or `ruled-fill-3`, matching its maximum column count, which
   widens the final cell to close the row at each breakpoint.

A multi-column `ruled` without its matching fill utility is a bug, not a style
choice. It only shows up at item counts that do not divide evenly, which is why
it survived the first two rounds of review.

### Placeholder tag

A dashed 1px outline, uppercase label type, subtle text. It marks any content
standing in for something real. Dashed on purpose: the outline of something
missing should not look like a finished chip.

### Navigation

Sticky, translucent, one hairline underneath. Links are muted at rest and
foreground on hover. The active link gets its label in foreground plus a 2px
brand underline that sits on the header's own bottom rule.

### Theme control

An icon button opening a three-item menu of Light, Dark and System, with a small
brand dot marking the current preference. The trigger icon reports the _resolved_
theme, not the stored preference, because under "System" the user wants to see
what is on screen.

## Do's and Don'ts

### Do

- **Do** divide with a 1px `line` and nothing else.
- **Do** put lists in a ruled grid so they read as one table.
- **Do** mark every placeholder visibly, and keep the real Tools data honest.
- **Do** design both modes as first-class; neither is a filter over the other.
- **Do** theme the browser surfaces: selection, caret, scrollbar, focus ring.
- **Do** keep mono for code, versions, paths and data.

### Don't

- **Don't** spend brand cyan outside its four roles.
- **Don't** add a shadow to content. There is no elevation system here.
- **Don't** exceed 8px radius on any container.
- **Don't** fill a surface with a status colour, or tint a row by state.
- **Don't** put a kicker or eyebrow above a heading.
- **Don't** introduce a second container style. `panel` and `ruled` are the two,
  and they are enough.
- **Don't** reintroduce texture, paper, enamel or any material metaphor. That
  world was deliberately replaced.
