# Box2d-Collision-Plugin for ImpactJS

This plugin is allows you to get Box2d collision data in the [ImpactJS](http://impactjs.com/) engine. It is for Box2d v2.0.2.

## Version 2.0

Simply include this plugin in your main.js, and it seamleesly integrates with Impact's collision api. Both ```check``` and ```collideWith``` methods will be called as usual, and ```checkAgainst``` and ```type``` properties are both used to verify that the check method should be called. Only the ```collides``` is no longer meaningful, as Box2d uses its own collision resolution system. See the notes below regarding groupIndices and mask bits for additional info on how to use Box2d.

Finally, a big thanks to Joncom, Xatruch and pixelpusher over on the [ImpactJS forums](http://impactjs.com/forums/code/box2d-collision-plugin) for helping with the rewrite of the plugin. This code is as much theirs as it is mine.

## Version 1.0

To use the plugin, override collideEntity() within your Box2DEntity to grab info about the colliding Entity - this is comparable to Impact's collideWith(). To grab tile info, override collideTile() - this is comparable to handleMovementTrace().

Since Box2D/Impact info is so scant, let me share with you some of my research and breakdown my collision plugin.

First, all Box2D collision per frame are broken down in an array of ContactEdges. This is what the for loops is cycling through:

for (var edge = this.body.m_contactList; edge; edge = edge.next)

For every edge of contact, Box2D creates a normal force vector, which is a perpendicular unit vector pointing away from the surface of contact. The plugin grabs the normal and uses this to calculate the point of contact & to determine if the Entity is standing. You can break the normal force down on both axes like so:

if( normal.x > 0 ){
//vector points right
}
else if( normal.x < 0 ){
//vector points left
}
else{
//point.x = 0 and thus, no horizontal collision
}

if( normal.y > 0 ){
//vector points down
}
else if( normal.y < 0 ){
//vector points up
}
else{
//point.y = 0 and thus, no vertical collision
}

The final tricky bit is this:

var f1 = this.shape.m_filter, f2 = ent.shape.m_filter;
if (f1.groupIndex != f2.groupIndex || f1.groupIndex > 0 || f1.categoryBits == f2.maskBits) {
     this.collideEntity(ent, point, normal);
}


Each Shape has a filter that it uses to filter out collisions with other Shapes. It does this in two ways: groupIndices & mask bits. 

Filtering the groupIndex is a two-step process: first it checks to see if each Shape's groupIndex is equal, if so it then tests to see if it's positive or negative. If it's positive, those two Shapes will always collide; if it's negative, those two Shapes will never collide. Thus, if you have a bicycle with an Entity for each part (wheels, pedals, frame, etc.), you'll want to set the groupIndex for each to something like -8 so that the bicycle never collides with itself.

Filtering by mask bits is done by setting the categoryBits of the first Shape equal to the mask bits of the second. If those two match, the Shapes will collide. Box2D allows for 16 different categories for this type of filtering. You can read more here: http://stackoverflow.com/questions/936935/box2d-collision-groups.

groupIndex testing gets precedence over mask bits. Thus, if a groupIndex is defined, Box2D will use it over the mask bits.
