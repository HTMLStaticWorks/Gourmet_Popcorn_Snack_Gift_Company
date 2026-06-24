# Gourmet Popcorn & Snack Gift Company Website Template

A premium, commercial-grade HTML template suited for high-end snack boutiques, holiday gift companies, and corporate gifting accounts. Designed for high-end UI/UX standards, this static template features custom glassmorphism components, full responsive grids, a global light/dark theme toggle, and elegant entrance motion curves.

## Design System & Theme Details

### Typography
- **Headings**: Playfair Display (Serif)
- **Body Text**: Inter (Sans-Serif)

### Color Palette (Gourmet Premium)
- **Primary Caramel**: `#7C2D12` (Light Mode) / `#FBBF24` (Dark Mode)
- **Secondary Popcorn**: `#B45309` (Light Mode) / `#FB923C` (Dark Mode)
- **Berry Accent**: `#DC2626` (Light Mode) / `#EF4444` (Dark Mode)
- **Warm Gold**: `#F59E0B`
- **Background Cream**: `#FFFDF8` (Light Mode) / `#1C1917` (Dark Mode)

## Interactive Features Included

1. **Persistent Cart Integration (`main.js` & `cart.html`)**:
   - Items added to basket on the shop page fly to the header cart drawer and save automatically in `localStorage`.
   - The shopping cart page (`cart.html`) and checkout (`checkout.html`) load stored list summaries dynamically.

2. **Custom Gift Tin Builder (`gift-tins.html`)**:
   - A step-by-step tin design builder letting clients choose single, 2-way, or 3-way divider partitions, click flavor slots, select satin ribbon styles, and mock logo lid files.
   - Calculates custom base rates in real-time.

3. **Discount Calculator Sliders (`bulk-orders.html` & `corporate-gifting.html`)**:
   - Volume sliders calculate tier pricing breaks (Bronze 10%, Silver 20%, Gold 30% savings) in real-time.

4. **GSAP Entrance Motions & Falls (`animations.js` & `animations.css`)**:
   - Staggered scrolls and entrance curves. Falling particle simulations trigger when items are added to the basket.

## Project Structure

```
├── index.html                  # Homepage (Classic Gourmet)
├── home-2.html                 # Homepage 2 (Seasonal & Business Focus)
├── shop.html                   # Product filters and grid
├── product-details.html        # Sizing and description tabs
├── gift-tins.html              # Tin builder UI
├── corporate-gifting.html      # Concierge solutions and calculators
├── custom-branding.html        # Brand logo templates specs
├── bulk-orders.html            # Tier pricing controllers
├── blog.html                   # Recipe and gifting journal
├── blog-details.html           # Single blog layout
├── contact.html                # Inquiry submission form
├── cart.html                   # Cart details
├── checkout.html               # Multi-step checkout fields
├── login.html                  # Luxury split auth page
├── signup.html                 # Register account page
├── 404.html                    # Error page
│
└── assets/
    ├── css/
    │   ├── bootstrap.min.css   # Bootstrap 5 Grid system
    │   ├── style.css           # Global theme styling
    │   ├── dark.css            # Dark mode variables
    │   └── animations.css      # CSS-based transitions
    ├── js/
    │   ├── main.js             # Form actions and calculators
    │   ├── theme-toggle.js     # Light/Dark mode localStorage manager
    │   └── animations.js       # Scroll reveal logic
    └── images/                 # Optimized local Unsplash pictures
```

## Setup & Running Locally

1. Simply open `index.html` in any modern web browser.
2. The CSS files utilize native custom properties; no compilation is required.
3. The dark/light mode toggle remembers settings across sessions using `localStorage`.
