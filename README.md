# Smart Escape - Interactive Evacuation Route Simulator

- **Name / Registration no.:** <fill in>
- **Live link:** <fill in after deploying>
- **Educational simulation only - not a certified evacuation planning tool.**

## Run
```bash
npm install
npm run dev      # local dev server
npm run build    # production build in dist/ (deploy to GitHub Pages / Netlify / Vercel)
```
Import `public/building.json` or `public/building2.json` with the **Import JSON** button (or use **Load sample**).

## Implemented
- JSON import with strict validation and clear errors
- Map at supplied coordinates, node types, corridor costs
- Pick start; block/unblock rooms, junctions and corridors; close/reopen exits
- Dijkstra by summed cost; ties -> smallest exit ID, then smallest node-ID sequence
- "No route available" / "Starting location blocked"; Reset restores `initial_state`
- English and Bangla; subtle animations; Neon Maximalism UI

## Known issues
- <fill in>

## AI tools and most useful prompt
- <fill in>

## Screenshots
Add baseline route and the reroute after C2 is blocked to `screenshots/`.

## Code layout
`src/logic.js` (validation + routing), `src/data.js` (sample + translations), `src/App.jsx` (UI), `src/index.css` (theme).
