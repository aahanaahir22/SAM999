# Validation — 1 November 2026

## Automated

- Combat suite: five distinct weapons, finite ammo/cooldown, reserve-consuming reload, cancelled reload on switching, headshot damage and one-time death, wall collision, occluded line of sight, A* routes, jumping, sprinting, stairs and elevated collision, three survival waves, marksman completion/timeout, ordered extraction objectives, AI response to noise, player death.
- World suite: actual Three.js scene construction, instanced mesh groups, valid collider/floor bounds, traversable path from spawn to intelligence terminal, all six extruded/beveled letters, real ray intersections with head geometry, all five weapon bounds/muzzle attachments, environment updates/quality toggle.
- Content suite: exact original data.js preservation, complete team chronology, internal anchor targets and form/control IDs, local dependency paths, no duplicate HTML IDs.
- Application modules parsed with `node --check`.

## Browser checks

- Desktop 1363×936: fallback hero, intro skip, section navigation, Unity tab and preserved description, arena unsupported-graphics state and exit control. No horizontal page overflow.
- Mobile 390×844 same-origin iframe: readable hero and navigation; menu-to-contact link worked; form visible. Document client and scroll widths both 375px, excluding scrollbar.
- WebGL initialization fails in the test environment with GL_VENDOR/GL_RENDERER Disabled. Fallback clearly reports unavailable 3D and disables gameplay deployment. Therefore actual rendering, intro timing/appearance, pointer-lock firing, full mission playthroughs, touch gameplay and performance cannot be reported as browser-tested.
- External social profile availability, mail application handoff/delivery, clipboard success on HTTPS and acoustic quality were not verified.

No performance target is presented as a measured result. Simulation/geometry tests are not a substitute for GPU/device playtesting. See STATUS.md for incomplete creative requirements.
