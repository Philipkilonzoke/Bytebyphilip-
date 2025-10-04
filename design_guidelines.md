# Design Guidelines: Byte by Philip - Tech Marketplace & News Hub

## Design Approach
**System Selected:** Custom Dark Theme with Modern Tech Aesthetic
- Primary inspiration from tech-forward platforms (Linear, Stripe, Vercel)
- Dark-first design optimized for tech-savvy audience
- Clean, professional interface with strategic accent usage

## Color Palette

### Dark Mode (Primary)
- **Background:** #07070a (deep charcoal, near-black)
- **Primary Accent:** #00e0ff (cyan/electric blue) - for CTAs, links, highlights
- **Secondary Accent:** #9b59ff (vibrant purple) - for badges, hover states, secondary actions
- **Surface:** 15 8% 12% (elevated dark cards/panels)
- **Text Primary:** 0 0% 98% (near-white for headings)
- **Text Secondary:** 0 0% 70% (muted for body text)
- **Borders:** 0 0% 20% (subtle separators)

### Light Mode (Optional Toggle)
- **Background:** 0 0% 98%
- **Surface:** 0 0% 100%
- **Text:** Inverted from dark mode
- **Accents:** Same cyan and purple with adjusted saturation for light backgrounds

## Typography
- **Primary Font:** Inter or SF Pro Display via Google Fonts CDN
- **Accent Font:** Space Grotesk for headings/hero text
- **Headings:** 
  - H1: 3rem (48px) bold, tight tracking
  - H2: 2rem (32px) semibold
  - H3: 1.5rem (24px) medium
- **Body:** 1rem (16px) regular, 1.6 line-height
- **Small Text:** 0.875rem (14px) for metadata, captions

## Layout System
**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- Container max-width: 1280px (max-w-7xl)
- Section padding: py-20 desktop, py-12 mobile
- Card padding: p-6
- Grid gaps: gap-6 or gap-8

## Component Library

### Splash Screen
- Full-screen dark overlay (background: #07070a)
- Centered logo (provided file) with scale-up animation (0.8 to 1.0, 0.6s ease-out)
- Site name "Byte by Philip" below logo, fade-in after 0.3s
- Subtitle "Tech • AI • ML • Tools" with staggered fade
- "Enter Site" button appears after 1.5s, cyan accent with glow effect
- Auto-redirect after 3 seconds

### Header (Sticky)
- Height: h-16 on mobile, h-20 on desktop
- Left: Hamburger icon + small logo + "Byte by Philip" text
- Right: Search icon, cart badge (cyan background with count), theme toggle
- Background: semi-transparent dark with backdrop blur on scroll
- Bottom border: subtle 1px with accent gradient on hover over items

### Sidebar Menu
- Slide from left, overlay with backdrop blur
- Width: 280px on desktop, full-width on mobile
- Each item: icon (16px) + text, py-3 px-4
- Hover: background 0 0% 15%, left border accent
- Expandable sections with smooth accordion animation
- Category counts in cyan badges (e.g., "PDFs (12)")
- Bottom hint: small text "Admin: click to login"

### Product Cards (Grid)
- Desktop: 3 columns, Tablet: 2 columns, Mobile: 1 column
- Card structure:
  - Image: aspect-16/9, object-cover with subtle overlay gradient
  - Category tag: top-right corner, small badge with purple background
  - Title: 2 lines max with ellipsis, text-lg font-semibold
  - Short description: 2 lines, text-sm text-secondary
  - Price: large, cyan color, bold
  - Buttons: "View Details" (outline), "Add to Cart" (filled cyan)
- Hover effect: translate-y-1, shadow-xl, transition 200ms
- Rounded corners: rounded-xl
- Background: surface color with subtle border

### PDF Cards (Special)
- Include "PDF" badge icon
- Show page count if available
- "Preview 1 Page" button opens modal with first page viewer
- Thumbnail shows PDF icon or first page preview

### News Cards
- Horizontal layout: thumbnail left (120px), content right
- Source badge: small pill with provider name or "Byte by Philip"
- Time ago: text-xs, muted color
- Thumbnail: rounded-lg, object-cover
- Title: 2 lines max, font-medium
- Excerpt: 2 lines, text-sm muted
- External articles: show link icon

### Hero Section (Homepage)
- Split layout desktop (60/40), stacked mobile
- Left: Headline (text-5xl bold), subheadline (text-xl muted), dual CTAs
- Right: Featured products carousel (3 slides, auto-rotate 5s)
- Background: subtle gradient from #07070a to #0a0a0f
- CTA buttons: "Shop Products" (cyan filled), "Latest Tech News" (outline with blur)

### Category Tiles
- 4-6 tiles in grid, equal height
- Icon (32px) at top, centered
- Category name below, font-semibold
- Short descriptor text-sm
- Hover: scale-105, glow effect with accent color
- Background: gradient from surface to slightly lighter

### Cart Interface
- Item rows with thumbnail, name, quantity selector (- and + buttons)
- Price per item and subtotal on right
- Remove button (red accent on hover)
- Total section: prominent, large text, cyan highlight
- Checkout button: full-width, cyan filled, "Checkout via WhatsApp"

### Footer
- 3 columns desktop, stacked mobile
- Column 1: Logo, tagline, small "Tech, AI & ML hub"
- Column 2: Quick links in 2 sub-columns
- Column 3: Social icons (Instagram, Facebook, TikTok, WhatsApp)
- Bottom bar: copyright, secure payment note
- Background: darker than main (#050507)
- Social icons: hover glow with cyan

### Admin Dashboard
- Password gate: centered modal, dark background, cyan input focus
- Dashboard layout: left sidebar tabs, main content area
- Data tables: alternating row colors, hover highlight
- Forms: cyan focus rings, floating labels
- Action buttons: cyan primary, purple secondary, red danger
- Stats cards: gradient backgrounds, large numbers

## Animations & Interactions
**Minimal, Purposeful Motion:**
- Splash: logo scale + fade (0.6s ease-out)
- Sidebar: slide-in 250ms ease
- Product cards: lift on hover (200ms)
- Buttons: scale 0.98 on active
- Cart add: flying mini-image to cart icon
- Modals: fade + scale-up (200ms)
- NO: parallax, continuous animations, complex scroll effects

## Accessibility
- High contrast ratios (AAA for body text)
- Focus visible states with cyan outline
- Skip-to-content link
- ARIA labels on all interactive elements
- Keyboard navigation for sidebar, modals, carousels

## Images
**Logo/Splash:** Use provided logo file (PNG) for splash screen and header
**Product Images:** Aspect ratio 16:9, min 800x450px, lazy-load after fold
**News Thumbnails:** 300x200px, fallback to default-news.jpg
**Hero Background:** Subtle tech-themed pattern or gradient overlay (no busy imagery)
**PDF Previews:** First page thumbnail or generic PDF icon

## Responsive Breakpoints
- Mobile: < 768px (single column, stacked layouts)
- Tablet: 768px - 1024px (2-column grids)
- Desktop: > 1024px (3-column grids, full features)

## Special UI Patterns
- **WhatsApp Checkout Modal:** Display formatted message preview in textarea before redirect
- **RSS Feed Indicators:** Visual distinction between custom articles and RSS items (source badges)
- **Admin Mode:** Toggle visibility of delete buttons and edit icons
- **Toast Notifications:** Bottom-right, cyan accent, auto-dismiss 3s
- **Loading States:** Skeleton screens with shimmer effect, not spinners