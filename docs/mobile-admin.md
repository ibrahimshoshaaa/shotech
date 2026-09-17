# Mobile-first admin

ShoTech admin is designed mobile-first for phone use. The navigation becomes a fixed bottom navigation bar on small screens, forms use touch-friendly controls, dashboard stats use compact cards, and wide desktop tables remain available only where a table layout is useful.

## Admin modules

- Dashboard: quick actions, health indicators and counters.
- Hero Manager: multiple slides, Cloudinary image uploads, ordering, visibility, bilingual copy, buttons and a 2–30 second slider interval.
- Site Content: page/section editing with Hero Manager entry from the home page.
- Services: bilingual content, icon, cover image upload, ordering and visibility.
- Projects: bilingual content, multi-image gallery, cover selection, ordering, technologies, publishing and featured state.
- Messages: mobile inbox with all/unread/read filters, read state and deletion.
- Settings: company identity, contact/social links, SEO, About and Process content. Story is intentionally excluded.
- Login: mobile-friendly secure form with loading/error states and password visibility control.

## Media

Project, service and Hero uploads use the authenticated `/api/upload` endpoint with the existing Cloudinary configuration and image validation limits.

## UX rules

Small screens use touch-friendly controls, stacked forms, cards instead of wide data tables, contained scrolling only when necessary, and persistent bottom navigation. Desktop expands the same information architecture rather than defining the mobile experience.
