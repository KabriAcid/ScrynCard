# Changelog

All notable changes to the ScrynCard project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added - March 2, 2026
- **CHANGELOG.md**: Created comprehensive changelog file to track all project updates and maintain version history
- **Font Loading Optimization**: Added preconnect hints to Google Fonts for faster typography loading

### Changed - March 2, 2026
- **Typography System Migration**: Complete overhaul from Figtree to **Plus Jakarta Sans**
  - ✅ Updated `index.html` with Google Fonts integration (weights: 400, 500, 600, 700, 800)
  - ✅ Updated `tailwind.config.ts` to use Plus Jakarta Sans as default sans-serif font
  - ✅ Updated `src/index.css` with font-family declaration and OpenType feature settings
  - ✅ Plus Jakarta Sans provides:
    - More friendly and approachable feel for citizen-facing interfaces
    - Maintains professionalism for politician and admin dashboards
    - Better suited for Nigerian market with warmer, more accessible tone
    - Excellent readability across all screen sizes
  
- **Documentation Updates**: Aligned all project documentation with new typography
  - ✅ `docs/blueprint.md`: Updated font reference from Inter to Plus Jakarta Sans
  - ✅ `docs/admin-design-system-prompt.md`: Already referenced Plus Jakarta Sans (confirmed accurate)
  - ✅ `README.md`: Updated design system section with new font information
  - ✅ `README.md`: Updated "Last Updated" date to March 2, 2026

### Technical Details
**Files Modified** (5 files, 50 insertions, 44 deletions):
1. `index.html` - Added Google Fonts preconnect and Plus Jakarta Sans import
2. `tailwind.config.ts` - Changed font family from Figtree to Plus Jakarta Sans
3. `src/index.css` - Updated @import and added font-family to body styles with OpenType features
4. `README.md` - Updated design system documentation and last modified date
5. `docs/blueprint.md` - Updated style guidelines font reference

**Font Weights Available**:
- 400 (Regular) - Body text, paragraphs
- 500 (Medium) - Labels, navigation
- 600 (Semi-Bold) - Subheadings, emphasis
- 700 (Bold) - Headings, CTAs
- 800 (Extra-Bold) - Hero text, major headings

**Performance Optimizations**:
- Preconnect to fonts.googleapis.com and fonts.gstatic.com
- display=swap for optimal font loading strategy
- OpenType features enabled: rlig (required ligatures), calt (contextual alternates)

---

## [0.1.0] - 2026-01-27

### Added
- Initial MVP implementation
- React + TypeScript + Vite setup
- Zustand state management
- Radix UI component library integration
- Tailwind CSS styling system
- Feature-based architecture (Admin, Politician, Citizen, Auth)
- Mock data layer for development
- Card security system with serial numbers and gift codes
- Network operator auto-detection (MTN, Airtel, Glo, 9Mobile)
- Airtime service abstraction layer
- Ebills API integration skeleton
- 40+ reusable UI components
- Role-based routing (Admin, Politician, Public)
- Form validation with React Hook Form + Zod
- Chart visualizations with Recharts
- Responsive design system
- Dark mode support
- Figtree font as initial typography (replaced March 2, 2026)

### Documentation
- Complete technical documentation in README.md
- Design system guidelines
- API architecture planning
- Security and fraud prevention documentation
- Implementation roadmap

---

## Project Milestones

### Phase 1: Foundation ✅ (Completed)
- [x] Project setup and architecture
- [x] Design system implementation
- [x] Mock data layer
- [x] UI component library
- [x] Typography system optimization

### Phase 2: Backend Integration 🚧 (In Progress)
- [ ] Backend API implementation
- [ ] Database schema (PostgreSQL)
- [ ] JWT authentication
- [ ] Payment gateway integration
- [ ] Real-time fraud detection
- [ ] SMS notifications
- [ ] Email service integration

### Phase 3: Production Launch 📅 (Planned Q2 2026)
- [ ] Security audit
- [ ] Load testing
- [ ] Beta launch with select politicians
- [ ] Production deployment
- [ ] Monitoring and analytics setup

---

## Typography Evolution

### March 2, 2026
**Plus Jakarta Sans** - Current font
- Rationale: Friendly yet professional, perfect for civic tech platform
- Better alignment with Nigerian market preferences
- Warmer, more approachable tone
- Excellent for both data dashboards and public-facing pages

### January 27, 2026
**Figtree** - Initial implementation
- Modern, geometric sans-serif
- Served well during early MVP development

---

**Legend:**
- ✅ Completed
- 🚧 In Progress  
- 📅 Planned
- ❌ Cancelled

---

**Last Updated**: March 2, 2026  
**Days Since Last Update**: 0 (Updated today!)  
**Time Between Updates**: 34 days (Jan 27 → Mar 2, 2026)
