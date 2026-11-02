# Scope and remaining work

## Implemented in source

- Three.js/WebGL2 world, PBR materials, environment lighting, adjustable shadows/resolution, instanced architecture, rain, smoke sprites and helicopter.
- User-triggered 14.5-second camera sequence: flyover, FPS run, gunfire, visible 3D tracers, metallic extruded SAM999 lettering, sparks/impact marks, fly-through and skip.
- Connected world camera destinations for profile, arsenal, projects, esports and contact; portfolio information remains independently accessible.
- Five modeled weapon classes with distinct stats, visible weapon switch/reload movement, recoil, ADS, ammunition/reserve, head/body raycasting, health/score HUD and minimap.
- Kinematic WASD/sprint/crouch/jump controller, axis-separated collision, stairs and rooftop floor traversal.
- Patrol/investigate/cover/flank/retreat state decisions, grid A* routes, line-of-sight firing, rifleman/rusher/marksman differences and difficulty multipliers.
- Three objective loops, pause, timeout/death/results, reset/replay and local best score.
- Mouse capture fallback, touch UI, reduced-motion/lite, audio opt-in/mute, unsupported-WebGL portfolio, email composer.

## Not completed or not verified

- **Rendered 3D gameplay and cinematic QA is unverified**: provided Chrome reports GL_VENDOR/GL_RENDERER disabled and cannot create WebGL2. No claim that the FPS is finished or polished.
- No measured stable 60 FPS, physical mobile gameplay, GPU compatibility matrix, pointer-lock playthrough or perceptual audio review.
- No photorealistic scanned/textured GLB environment, authored motion-capture characters, complex skeletal animation, advanced destruction, true volumetric simulation, motion blur or physically simulated bullet-hole deformation. Current geometry is original procedural modeling. Smoke is sprite-based; rain uses GPU-rendered points updated on CPU.
- The cinematic does not yet implement the complete requested grenade shockwave/slow-motion encounter or fully authored soldier firing animation. Its bullets/marks/sparks are effects, not mesh destruction.
- Transitions use unique destinations within the world, but not fully separate bespoke set-pieces for every page. Contact does not yet stage a landing helicopter; the world helicopter flies an orbit.
- Enemy aiming uses probabilistic hit logic with cooldown and line of sight; no animation-driven combat or squad tactics. No multiplayer or global leaderboard.
- Contact is an explicit mailto composer, not server-delivered mail.
- No supplied résumé/project records/GitHub demo links to expose. These are content gaps, not invented placeholders.

The new implementation replaces the old Canvas raycaster. The accessible portfolio remains available if WebGL fails, but the old 2D range is not misrepresented as the new FPS.
