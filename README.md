# SAHLAN Premium Cleaners — static website

A responsive, multi-page website with a sky-blue / navy / white visual system and restrained gold accents.

## Pages
- `index.html` — brand introduction, service cards, illustrative inspiration slider, process overview and quote CTAs
- `about.html` — company approach
- `services.html` — overview of the four listed services
- `domestic-cleaning.html`, `commercial-cleaning.html`, `post-construction.html`, `fumigation.html` — service detail pages
- `gallery.html` — illustrative reference photography (not represented as verified customer work)
- `faq.html` — common questions
- `contact.html` — validated quote request form with live summary and WhatsApp handoff
- `privacy.html` — privacy notice

## Contact and booking behaviour
The confirmed project contact details are phone/WhatsApp `0711 224 477` and Instagram `@sahlanpremiumcleaners`. The booking form builds a message and opens WhatsApp; the visitor must review and press Send. The form does not store bookings on a server and does not confirm availability. The business must confirm the appointment and price directly.

## Before public launch
1. Confirm the production hostname. Canonical links, social preview image URLs, `robots.txt`, and `sitemap.xml` currently target `https://sahlan-premium-cleaners.vercel.app`; update them if Vercel assigns a different hostname.
2. Replace illustrative stock images with SAHLAN-owned or approved images from real jobs when available; do not present stock photos as company work.
3. Confirm the advertised starting price before publishing any numerical price. The site currently uses quote-first wording.
4. Add real customer reviews, credentials, operating hours, address, and service areas only after the owner verifies them.
5. Add analytics only after the owner chooses a provider and supplies the relevant measurement ID. Contact-click events are dispatched client-side but not sent to an analytics service by default.
6. The customer portal, automated booking database, SMS/email notifications, and real availability calendar require a backend or third-party booking provider and have not been falsely represented as implemented.

## Deploy to Vercel
Static site: no build command required; set the project root to this directory. All pages are explicit `.html` files. Confirm the final domain and verify mobile navigation, images, quote form, WhatsApp, call, and sitemap after deployment.
