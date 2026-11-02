# SAM999 / Sector 09

A browser-native 3D portfolio and tactical FPS implementation for Samihan Kulkarni. This is an implemented, simulation-tested upgrade, **not a claim of finished AAA production quality**. WebGL visual/playthrough QA is blocked in the available cloud browser; see QA.md and STATUS.md.

## Run

Requires a browser with WebGL2 and an HTTP server. No Node dependency installation or build step is needed:

```sh
python3 -m http.server 8080 --directory .
```

Open http://localhost:8080. Do not use file:// for ES modules. The local Three.js 0.170.0 distribution is included; the experience does not fetch JavaScript from a CDN. Fonts may load from Google Fonts with system fallbacks.

## Controls

WASD move; mouse look; left button fire; right button aim down sights; Shift sprint; C crouch; Space jump; R reload; 1–5 change weapon; E collect intelligence/extract; Escape pause. Pointer-lock failure falls back to dragging to aim and clicking to fire. Mobile has movement, fire, ADS, jump, crouch, use and weapon controls. Desktop is recommended. Physical touch playtesting remains outstanding.

- Tactical Survival: defeat three waves. Inter-wave health and reserve ammunition recovery. Four-minute time limit.
- Precision Marksman: eight moving enemies, 100-second limit, sniper start, headshot bonus and shot count. Enemies do not damage the player in this mode.
- Extraction: reach the northern terminal, press E within 3 metres, return to the southern pad and press E within 5 metres. Four-minute limit. Killing all enemies is optional.
- Death, timeout and completion lead to a replay menu. Local best score is per browser, never a global ranking or career claim.

## Architecture

- `app.js`: content, controls, cinematic entry, navigable portfolio chapters, email composer.
- `scene.js`: lazy loads the renderer and exposes a graceful unsupported-graphics state.
- `engine.js`: Three.js lifecycle, FPS camera, raycast combat, intro choreography, particles, PBR environment, quality settings.
- `world.js`: connected military compound; instanced architectural mesh batches, colliders, stairs/roofs, rain, smoke sprites, helicopter, command/arsenal/broadcast zones, extraction pad.
- `models.js`: original beveled weapon profiles, articulated soldiers, helicopter, extruded metallic title; shared geometry/materials.
- `combat.js`: DOM-independent movement, gravity, ammunition, weapons, damage, A* routing, finite-state AI, mode objectives.
- `range.js`: pointer lock, keyboard, touch, pause/replay UI and minimap.
- `audio.js`: user-activated synthesized gunshots, impacts, steps, mechanical feedback, rotor-like ambience. No imported game audio.
- `data.js`: original profile, descriptions, team chronology, profile links and explicitly unconfirmed skill taxonomy. Projects remain empty because the source portfolio supplied none.

The existing buildless architecture was retained instead of introducing a server framework solely for rendering. The gameplay engine is modular ES JavaScript, not Next.js/TypeScript/Rapier. Collision is a custom kinematic controller with height-aware AABBs and stepped floors, not full rigid-body physics.

## Validation

```sh
node tests/combat.test.mjs
node tests/world.test.mjs
node tests/content.test.mjs
```

These test logic and geometry, not the rendered visual quality or real-world frame rate. See QA.md for browser coverage.

## Deploy

Upload **the repository root** to an HTTPS static host supporting JavaScript ES modules. No API keys, server secrets, database or build command are required. On GitHub Pages, place the contents at the selected publishing root; all local imports/assets use relative paths. A full source download is included as `sam999-source.zip` in the hosted distribution.

This is the independent `aahanaahir22/SAM999` repository. Its GitHub Pages address is https://aahanaahir22.github.io/SAM999/ . It contains the actual application, not a redirect. Enable Settings → Pages → Deploy from a branch → main → /(root). No files in Aahana’s personal portfolio repository are used or modified.

## Contact and missing supplied material

The validated contact form composes a mailto draft; it does **not** send email on the server, store submissions or claim successful delivery. Visitor must send through their own email application. A server-delivered contact endpoint remains incomplete.

The original portfolio had no downloadable résumé, projects, GitHub project URLs, screenshots or project demo URLs. None were fabricated. Existing team history, education, descriptions and social links were preserved. Configure real projects/resume when supplied.
