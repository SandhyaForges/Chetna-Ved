# Chetna & Ved — Wedding Website

Built with **React + Vite + Tailwind CSS**.

## Structure

```
src/
  assets/
    c2.png
    moments/             <- featured wedding photos
  components/
    Petals.jsx           # falling petal background effect
    SectionHead.jsx       # reusable kicker + title + divider
    Hero.jsx               # full-bleed hero with names/date
    Countdown.jsx           # ring-style day/hour/minute counter
    OurStory.jsx             # two-column photo + copy
    CherishedMoments.jsx      # overlapping photo collage
    LoveQuote.jsx               # centered quote band
    TimelineItem.jsx              # single alternating ritual row
    RitualsTimeline.jsx            # 5-stop vertical timeline
    Gallery.jsx                      # masonry grid + load more
    Forever.jsx                        # closing full-bleed band
    Footer.jsx                          # monogram + socials
  hooks/
    useReveal.js       # IntersectionObserver scroll-reveal
    useCountdown.js    # live days/hours/minutes calculator
  App.jsx             # composes all sections in order
  index.css           # Tailwind directives + fonts + custom keyframes
tailwind.config.js    # custom color palette, fonts, animations
```

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build -> dist/
```

## Customizing

- **Photos**: the hero uses `src/assets/c2-optimized.jpg`, derived from
  `src/assets/c2.png`; the story uses `public/6-optimized.jpg`, derived from
  `public/6.jpg`. Keep each pair in sync when replacing the photos.
  The featured moments are in `src/assets/moments/`, and gallery photos are
  loaded from the matching folders under `image/` (Engagement, Haldi,
  Mehandi, and wedding).
- **Wedding date**: change the `weddingDate` prop passed to `<Countdown />`
  in `App.jsx`.
- **Colors/fonts**: edit `tailwind.config.js` under `theme.extend.colors`
  and `theme.extend.fontFamily`.
- **Rituals**: edit the `RITUALS` array in `RitualsTimeline.jsx`.
