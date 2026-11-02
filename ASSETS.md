# Original asset inventory

`dist/models.js` contains original mesh construction authored for this site: five firearm classes, an articulated armored opponent, a utility helicopter, and extruded beveled SAM999 lettering. No commercial game models, textures, brands, or maps were copied. Geometry and materials are shared between instances.

The models are procedural hard-surface and stylized character assets, **not photorealistic scanned assets or externally authored GLB files**. Receiver profiles and title letters use beveled extrusion; barrels, sight assemblies, rails, magazines, stocks, helmets, plate carriers, pouches, limbs, cockpit, skids, tail and rotors are independent meshes. Their quality should be assessed in the running scene; this file makes no AAA-production claim.

All weapon groups point along local −Z and expose `muzzle`. Soldiers face −Z, stand approximately 1.8 units tall, and expose `legL`, `legR`, `armL`, `armR`, and `head`; helmet/head meshes carry `userData.head`. Helicopter animation nodes are `rotor` and `tailRotor`. The title's meshes expose `userData.letter` and individual `letter-N` names for impacts.

Three.js is third-party software under its included MIT license. Existing fonts retain their original licensing and fallback behavior. Original mesh code is part of the delivered project source.
