# SmartYield Landing Page Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from leading AgTech platforms (Auravant, CropX, Pasture.io) to establish credibility in the precision agriculture space. The design will blend CropX's clean data visualization aesthetic with Auravant's vibrant energy and Pasture.io's approachable interface.

## Core Design Principles
- **Trust through Clarity**: Clean layouts that communicate technological sophistication without overwhelming farmers
- **Data-Driven Visuals**: Incorporate satellite imagery, field maps, and dashboard previews to showcase platform capabilities
- **Agricultural Authenticity**: Balance modern tech aesthetics with earthy, natural elements that resonate with farming professionals

## Typography System

**Font Families**:
- Primary: Inter (clean, modern sans-serif via Google Fonts)
- Secondary: Space Grotesk for headlines (geometric, tech-forward)

**Hierarchy**:
- Hero Headline: Space Grotesk, 56-64px (desktop), 700 weight
- Section Headers: Space Grotesk, 40-48px, 600 weight  
- Subheadings: Inter, 24-28px, 500 weight
- Body Text: Inter, 16-18px, 400 weight
- Small Text/Captions: Inter, 14px, 400 weight
- CTAs: Inter, 16px, 600 weight

## Layout System

**Spacing Primitives**: Tailwind units of 4, 8, 12, 16, 20, and 32 for consistent rhythm
- Section padding: py-20 (desktop), py-12 (mobile)
- Container max-width: max-w-7xl
- Content columns: max-w-4xl for text-heavy sections
- Grid gaps: gap-8 (desktop), gap-6 (mobile)

## Component Library

### Navigation
- Sticky transparent header with blur effect on scroll
- Logo left-aligned (SmartYield branding)
- Horizontal menu: Inicio, Características, Beneficios, Testimonios, Contacto
- Primary CTA button: "Comenzar Gratis" or "Demo Gratuita"
- Mobile: Hamburger menu with slide-out drawer

### Hero Section
- Full viewport height (min-h-screen) with gradient overlay
- Hero headline: "Optimiza tu Producción Agrícola con Inteligencia Artificial"
- Subheadline describing satellite monitoring and data-driven decisions
- Dual CTA buttons: Primary "Solicitar Demo" + Secondary "Ver Video"
- Background: Large hero image of agricultural field with satellite/drone view overlay showing data visualization
- Scroll indicator at bottom

### Features Grid
- 3-column grid (desktop) showcasing core capabilities
- Each card: Icon, title, description (120-150 characters)
- Icons: Agricultural symbols (satellite, plant analytics, weather, optimization)
- Features include: Monitoreo satelital, Predicción de rendimiento, Gestión de recursos, Análisis climático
- Subtle hover lift effect on cards

### Platform Showcase
- 2-column layout alternating left/right
- Left: Large mockup image (laptop/tablet showing dashboard interface)
- Right: Feature explanation with bullet points
- Sections: Dashboard overview, Satellite imagery interface, Mobile app, Analytics reports
- Use authentic-looking UI mockups with satellite field imagery, charts, and data visualizations

### Benefits Section
- Icon + stat presentation in 4-column grid
- Key metrics: "Hasta 25% incremento en rendimiento", "Ahorro del 30% en recursos", "Monitoreo 24/7", "200+ cultivos soportados"
- Large numbers (48px) with smaller descriptive text below

### Testimonials
- 3-card carousel/grid layout
- Each card: Quote, farmer name, location, farm size
- Include small circular profile photos
- Background: Subtle pattern or light texture

### Trust Indicators
- Partner logos section: Universities, agricultural institutions, technology partners
- Award badges if applicable
- Presented in single row, grayscale with color on hover

### CTA Section
- Full-width section with contrasting background
- Centered headline: "Transforma tu Campo en una Operación Inteligente"
- Large primary button: "Comenzar Prueba Gratuita"
- Supporting text: "Sin tarjeta de crédito • Setup en 24 horas"

### Footer
- 4-column layout: Producto, Empresa, Recursos, Contacto
- Newsletter signup form integrated
- Social media icons
- Copyright and legal links

## Images

**Hero Image**: 
Aerial/satellite view of agricultural fields with color-coded zones showing different crop health levels. Overlay subtle grid lines or data points to suggest technological analysis. Image should convey scale and precision.

**Platform Mockups**:
- Desktop dashboard showing: Field map with parcels, growth charts, weather widget, task list
- Mobile app screens: Field selection, real-time monitoring, alerts
- Tablet view: Satellite imagery comparison with NDVI overlays
- All mockups should show realistic agricultural data visualizations with green/yellow/brown color schemes

**Feature Section Images**:
- Close-up of crops with technological overlay (AR-style data points)
- Satellite passing over farmland
- Farmer using tablet in field
- Data visualization charts with agricultural metrics

**Background Patterns**:
Subtle topographic line patterns or contour maps as section backgrounds (very low opacity, 0.05-0.1) to add texture without distraction

## Animations
- Subtle fade-in on scroll for section reveals
- Smooth parallax effect on hero background (minimal, 0.5 speed)
- Number counter animation for statistics
- Avoid excessive motion; prioritize performance

## Accessibility
- All images have descriptive alt text in Spanish
- Color contrast ratios meet WCAG AA standards
- Focus states clearly visible on all interactive elements
- Form labels properly associated with inputs
- Keyboard navigation fully supported

## Responsive Behavior
- Mobile-first approach with breakpoints at sm, md, lg, xl
- Hero text scales from 32px (mobile) to 64px (desktop)
- Grids collapse to single column on mobile
- Navigation transforms to hamburger menu below md breakpoint
- Touch-friendly button sizes (minimum 44x44px tap targets)