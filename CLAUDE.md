# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Star Health is a healthcare website built with React, Vite, and Tailwind CSS v4. This is a multi-page marketing website for a healthcare provider featuring sections for services, doctors, and contact information.

## Development Commands

### Setup
```bash
npm install
```

### Development
```bash
npm run dev          # Start Vite development server
```

### Build & Lint
```bash
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Architecture

### Routing Structure
The application uses React Router with the following routes (defined in `src/App.jsx`):
- `/` - Home page
- `/doctors` - Doctors listing and information
- `/contact` - Contact page with forms and FAQ
- `/menulist` - Navigation menu overlay
- `/booking` - Appointment booking form

### Component Organization

Components are organized by feature/page in `src/components/`:

```
components/
├── home/               # Home page components
│   ├── header/        # Header with hero section and form
│   ├── home_section.jsx  # Main home page container
│   ├── welcome_part.jsx
│   ├── safety.jsx
│   ├── specialized_services.jsx
│   ├── med_team.jsx
│   ├── whyus.jsx
│   └── testomonials.jsx
├── doctors/           # Doctors page components
│   ├── header/
│   ├── doctors_section.jsx  # Main doctors page container
│   ├── priorities.jsx
│   └── stories_of_hope.jsx
├── contact/           # Contact page components
│   ├── header/
│   ├── contact_section.jsx  # Main contact page container
│   └── faq_section.jsx
├── menulist/          # Mobile menu overlay
├── top_nav.jsx        # Top navigation bar (shared)
├── bottom_nav.jsx     # Bottom navigation (shared)
├── footer.jsx         # Footer (shared)
├── appoinment_form.jsx   # Standalone booking form
├── mob_view_form.jsx     # Mobile form component
├── ScrollTop.jsx         # Scroll restoration utility
└── [other shared components]
```

### Page Structure Pattern

Each major section follows a consistent pattern with a main container component that imports:
1. `Topnav` - Shared navigation header
2. `Header` - Page-specific hero section (from section's header/ subdirectory)
3. Multiple feature components (specific to each page)
4. `Whatnext` - Call-to-action component with customizable text
5. `Footer` - Shared footer

**Example** (see `src/components/home/home_section.jsx`):
```jsx
<Topnav/>
<Header/>
<WelcomePart/>
<Safety/>
<SpecializedServices/>
// ... more components
<Whatnext text={content}/>
<Footer/>
```

### Responsive Design

- Mobile-first approach using Tailwind CSS v4
- Responsive form variants:
  - Desktop forms displayed with `hidden md:block`
  - Mobile forms displayed with `block sm:hidden` or `sm:hidden`
- Custom CSS for backgrounds and gradients in `src/index.css`
- Background images stored in `src/assets/` organized by section (home, doctors, contact)

### Styling Approach

- **Tailwind CSS v4** via Vite plugin (not PostCSS)
- Custom CSS classes in `src/index.css`:
  - `.bground` - Header background image
  - `.home-header` - Mobile-specific header background
  - `.linear-text` - Gradient text effect
  - Custom marquee animations for scrolling content
  - `scroll-behavior: smooth` enabled globally
- Fonts: Inter, Merriweather, Playwrite DK Uloopet (loaded from Google Fonts)

### Vite Configuration

The `vite.config.js` uses `vite-plugin-html` to inject SEO metadata:
- Page title, description, keywords
- Open Graph tags for social sharing (image hosted at https://starhealth.sa/socialimage.png)
- Twitter card metadata

Note: There's a typo in the config - `title: "Star-Healt"` should be "Star-Health"

## Key Features

### Scroll Management
- `ScrollToTop` component wraps routes to restore scroll position on navigation
- Smooth scrolling enabled via CSS (`scroll-behavior: smooth`)
- Section anchors using `id` attributes (e.g., `#about`, `#services`)

### Forms
- Multiple form components for different contexts (desktop/mobile, home/contact/booking)
- Appointment booking accessible via `/booking` route
- Contact forms on contact page with responsive variants

### Assets
Assets organized by section in `src/assets/`:
- `home/` - Home page images
- `doctors/` - Doctor-related images
- `contact/` - Contact page images
- `Favicon.ico` - Site favicon
- `drimages.png` - Doctor images

### Internationalization (i18n)

The application supports English and Arabic language switching using **i18next** and **react-i18next**.

**Configuration:**
- i18n setup: `src/i18n.js`
- Translation files: `src/locales/en.json` and `src/locales/ar.json`
- Initialized in `src/main.jsx`

**Language Toggle:**
- Toggle button in top navigation (`src/components/top_nav.jsx`)
- Shows "AR" when English is active, "EN" when Arabic is active
- Automatically switches document direction (RTL for Arabic, LTR for English)
- Updates `document.documentElement.dir` and `document.documentElement.lang` on language change

**Usage in Components:**
```jsx
import { useTranslation } from 'react-i18next';

function Component() {
  const { t, i18n } = useTranslation();

  return <p>{t('nav.home')}</p>; // Returns "Home" or "الرئيسية"
}
```

**Adding New Translations:**
1. Add keys to both `src/locales/en.json` and `src/locales/ar.json`
2. Use `t('your.key')` in components with the `useTranslation` hook
3. Maintain consistent key structure between both files

## ESLint Configuration

Custom ESLint rules in `eslint.config.js`:
- React Hooks rules enforced
- Unused variables ignored if they match pattern `^[A-Z_]` (constants)
- React Refresh warnings for component exports

## Git Workflow

- Main branch: `main`
- Recent work includes social image updates and marquee hiding feature
- Uses GitLab for repository hosting
