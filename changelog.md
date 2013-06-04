Box2d-Collision-Plugin Changelog
================================

v2.1
- Added penetration check so that collideWith gets called on the axis where the overlap is the greatest.
- Added directions for commenting out checkEntities, when using ig.Entity and ig.Box2dEntity
- Added the contact handler to a Persist listener so that Impact's persisted collision detection is preserved.

v2.0
- Complete rewrite using b2.ContactListeners.

v1.0
- Created

Special thanks to Joncom, Xatruch and pixelpusher over on the [ImpactJS forums](http://impactjs.com/forums/code/box2d-collision-plugin) for helping with the v2.x rewrite of the plugin. This code is as much theirs as it is mine.
