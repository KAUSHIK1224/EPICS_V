# Bird Species AR Catalog - Design Guidelines

## Design Approach
**Reference-Based + Custom Nature Theme**: Drawing inspiration from nature conservation websites (National Geographic, Audubon, WWF) combined with modern card-based interfaces. Emphasis on clean information architecture with natural imagery prominence.

## Core Design Elements

### Typography
- **Headings**: Inter or Poppins (600-700 weight) for clear hierarchy
- **Body Text**: Inter or Open Sans (400-500 weight) for readability
- **Scientific Names**: Georgia or serif italics for authenticity
- **Sizes**: h1: text-4xl, h2: text-3xl, h3: text-xl, body: text-base

### Layout System
**Spacing Primitives**: Tailwind units of 4, 6, 8, 12, 16, 24
- Card padding: p-6
- Section spacing: py-16 or py-24
- Grid gaps: gap-6 or gap-8
- Container: max-w-7xl mx-auto px-4

### Color Strategy (Nature-Inspired)
- **Primary**: Teal/Forest Green spectrum (#0d9488 to #047857)
- **Accent**: Warm amber for CTAs (#f59e0b)
- **Status Badges**: Blue (Migratory), Green (Resident), Amber (Rare)
- **Backgrounds**: Clean whites with subtle gray tones (#f9fafb, #f3f4f6)

## Page Structure

### Homepage
**Hero Section** (h-[70vh]):
- Large nature photography background (wetlands/forest with birds)
- Centered overlay content with blur backdrop (backdrop-blur-md bg-white/90)
- Headline: "Explore AR-Enhanced Bird Species"
- Subheading and primary CTA button with amber background
- Secondary navigation breadcrumbs

**Featured Species Grid** (3-column desktop, 2-column tablet, 1-column mobile):
- Grid layout: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`
- 6-9 bird species cards initially visible
- "Load More" or "View All Species" CTA at bottom

**Quick Stats Section** (4-column):
- Total species count, AR models available, conservation status, visitor count
- Icon + number + label format

### Species Card Component
**Structure**:
- Bird image (aspect-ratio-4/3, rounded-t-lg, object-cover)
- Content padding: p-6
- Common name: text-xl font-semibold
- Scientific name: text-sm italic text-gray-600
- Status badge: rounded-full px-3 py-1, positioned top-right on image
- Quick info grid (2x2): Size, Weight, Habitat, Season with icons
- Action buttons row: "AR View" (primary teal), "Details" (secondary gray)

**Card Styling**:
- White background with shadow-lg hover:shadow-xl transition
- Rounded corners: rounded-lg
- Border: border border-gray-200

### Species Detail Page
**Layout**:
- Two-column split (lg:grid-cols-2)
- Left: Large bird image gallery (carousel/lightbox)
- Right: Comprehensive information sections

**Information Sections**:
- Header: Name, scientific name, conservation status
- Physical characteristics (collapsible accordion)
- Habitat & behavior
- Migration patterns (if applicable)
- AR Experience card (highlighted, with thumbnail and "Launch AR" button)
- Similar species suggestions

### AR View Integration
**Modal/Overlay**:
- Full-screen AR viewer interface
- Embedded iframe or AR Quick Look integration
- Controls: Close (top-right), Info (bottom), Screenshot
- Loading state with bird silhouette animation

### Admin Interface
**Dashboard Layout**:
- Sidebar navigation (Species List, Add New, AR Models, Settings)
- Main content area with data table
- Add/Edit form: Two-column layout for efficient input
- Image upload with preview
- AR model URL input with validation and test button
- Save/Publish workflow

### Navigation Header
**Structure**:
- Logo/brand left, navigation center, user actions right
- Links: Home | Species Catalog | Gallery | Visit Info | Location | Book Visit
- Sticky header with subtle shadow on scroll
- Mobile: Hamburger menu with slide-in drawer

### Footer
**Rich Footer** (3-column):
- Column 1: About, mission statement, social links
- Column 2: Quick links (navigation repeat)
- Column 3: Newsletter signup, contact info
- Bottom bar: Copyright, privacy, terms

## Images Strategy

### Primary Images Needed:
1. **Hero Background**: Wide wetland/forest landscape with birds in natural habitat (1920x1080)
2. **Species Cards**: Individual bird portraits, square format (600x600), consistent lighting
3. **Gallery Images**: Various habitat and behavior shots per species
4. **AR Model Thumbnails**: 3D preview renders (400x400)

### Image Treatment:
- Consistent aspect ratios across categories
- Subtle vignette on hero backgrounds
- Sharp, high-quality wildlife photography aesthetic

## Component Library

### Buttons
- Primary (AR View): Teal background, white text, rounded-lg, px-6 py-3
- Secondary (Details): Gray border, gray text, same size as primary
- Icon buttons: Circular, subtle hover states

### Badges
- Small rounded pills: rounded-full px-3 py-1.5 text-xs font-medium
- Color-coded by category

### Icons
**Heroicons (solid & outline)**: Camera, Map, Calendar, Ruler, Weight, Home, Menu
- Icon size: 20px (w-5 h-5) for inline, 24px (w-6 h-6) for standalone

### Forms (Admin)
- Label-above-input pattern
- Input: border-gray-300 rounded-lg focus:ring-teal-500
- File upload: Drag-and-drop zone with preview
- Validation: Inline error messages in red below fields

## Responsive Behavior
- **Desktop (lg)**: Multi-column grids, sidebar layouts
- **Tablet (md)**: 2-column grids, stacked sidebars
- **Mobile (base)**: Single column, hamburger navigation, full-width cards

## Key Interactions
- Card hover: Lift effect (transform translateY)
- Image hover: Subtle zoom (scale-105)
- Button hover: Brightness increase
- AR button: Pulse animation to draw attention

**Animation Philosophy**: Subtle, purposeful animations only on interactive elements. No distracting background effects.