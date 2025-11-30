# TMDB Movies SPA - Design Guidelines

## Design Approach
**Reference-Based**: Drawing inspiration from Netflix's immersive layouts, TMDB's content-first approach, and Spotify's dark aesthetic. This entertainment-focused application prioritizes visual engagement while maintaining excellent usability.

## Typography System

**Font Families** (Google Fonts via CDN):
- Primary: Inter (headings, UI elements, body text)
- Secondary: Poppins (hero titles, emphasis)

**Type Scale**:
- Hero Title: text-5xl to text-7xl, font-bold (Poppins)
- Page Headings: text-3xl to text-4xl, font-bold (Inter)
- Section Titles: text-xl to text-2xl, font-semibold
- Card Titles: text-lg, font-semibold
- Body Text: text-base, font-normal
- Metadata/Labels: text-sm to text-xs, font-medium

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-4, p-6, p-8
- Section spacing: py-12, py-16, py-20
- Grid gaps: gap-4, gap-6, gap-8
- Margins: m-2, m-4, m-8

**Container Strategy**:
- Full-width hero: w-full
- Content sections: max-w-7xl mx-auto px-4 md:px-8
- Detail pages: max-w-6xl mx-auto

## Core Components

### Navigation Bar
- Fixed top position with backdrop blur effect
- Logo on left, navigation links center, search + theme toggle + favorites on right
- Height: h-16, padding px-6
- Active state: underline decoration with offset

### Hero Section (Home Page)
- Full-width featured movie backdrop with gradient overlay
- Height: h-screen or 80vh
- Content positioned left-aligned or centered
- CTA buttons with blurred glass morphism backgrounds
- Featured movie poster thumbnail (if applicable)

### Movie Cards (Grid)
- Aspect ratio: 2:3 (poster ratio)
- Hover effect: subtle scale transform (1.05) with shadow elevation
- Rounded corners: rounded-lg
- Content: Poster image, title overlay at bottom with gradient fade, rating badge

### Search Bar
- Prominent placement in navbar
- Autocomplete dropdown: absolute positioning, max-h-96, overflow-y-auto
- Debounced input with loading indicator inside input field
- Result items: flex layout with thumbnail, title, year

### Filter & Sort Controls
- Horizontal layout on desktop, stack on mobile
- Dropdown selects with custom styling
- Genre chips/tags with active state indication
- Clear all filters button

### Movie Detail Page Layout
**Two-column layout on desktop (grid-cols-1 lg:grid-cols-3)**:
- Left column (col-span-1): Movie poster, large, sticky position
- Right column (col-span-2): Title, metadata row (year, runtime, rating), genres as badges, overview, cast/crew sections, action buttons (Add to Favorites, Watch Trailer)

### Pagination
- Centered horizontal layout
- Previous/Next buttons on ends
- Page numbers in between (show 5-7 at a time)
- Current page highlighted with distinct styling
- Disabled state for boundary pages

### Loading States
- Skeleton screens matching card layouts
- Spinner for full-page loads: centered with brand styling
- Inline loaders for search autocomplete

### Error Messages
- Card-style container with icon, message, retry button
- Centered positioning
- Non-intrusive inline errors for form validation

### Favorites Page
- Similar grid layout to Movies List
- Empty state illustration with call-to-action when no favorites
- Remove from favorites interaction on card

### Dark/Light Mode Toggle
- Icon-based switch in navbar (sun/moon icons via Heroicons)
- Smooth transition between themes
- Theme persistence indicator (optional visual feedback on switch)

## Images

**Hero Section**:
- Large backdrop image from TMDB API (backdrop_path)
- Overlay with linear gradient (bottom to top, dark to transparent)
- Optional: Featured movie poster positioned within hero

**Movie Cards**:
- Poster images (poster_path from TMDB)
- Fallback placeholder for missing images

**Detail Page**:
- Large poster image (left column)
- Backdrop image as page background with heavy blur/overlay (optional)

**Empty States**:
- Illustration for "No favorites yet"
- Illustration for "No search results"

## Responsive Breakpoints

- **Mobile** (base): Single column grids, stacked navigation
- **Tablet** (md:): 2-3 column grids, horizontal filters
- **Desktop** (lg:): 4-5 column grids, full layout with sidebars

**Grid Columns**:
- Movies Grid: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
- Detail Layout: grid-cols-1 lg:grid-cols-3

## Interactive States

**Buttons**:
- Primary: Solid with hover brightness increase
- Secondary: Outline with hover background fill
- Glass effect for hero CTAs: backdrop-blur-md with semi-transparent background

**Cards**:
- Hover: transform scale-105, shadow-xl transition
- Active/Selected: border or glow effect

**Navigation**:
- Active page: border-bottom or background highlight
- Hover: subtle opacity or underline

## Accessibility

- Focus visible states on all interactive elements (ring-2 ring-offset-2)
- Sufficient contrast ratios for both themes
- Alt text for all movie posters
- Keyboard navigation support throughout
- ARIA labels for icon-only buttons (theme toggle, favorites icon)

**Form Inputs**:
- Consistent border, padding (p-3), rounded corners (rounded-md)
- Focus states with ring utility
- Label positioning: top-aligned or floating