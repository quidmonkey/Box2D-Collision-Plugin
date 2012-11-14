// Written by Abraham Walters
// Box2D Collision Plugin for Impact
// November 2011
ig.module(
    'plugins.box2d.collision'
)
.requires(
    'plugins.box2d.entity'
)
.defines(function () {

    ig.Box2DEntity.inject({

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.body.entity = this;
            this.shape = this.body.m_shapeList;
        },

        collision: function () {

            this.standing = false;

            //for each contact edge
            for (var edge = this.body.m_contactList; edge; edge = edge.next) {

                //grab normal force, which is the vector
                //perpendicular to the surface of contact
                var normal = edge.contact.m_manifold.normal;

                //calculate point of contact
                var x = this.pos.x + normal.x.map(1, -1, 0, 1) * this.size.x;
                var y = this.pos.y + normal.y.map(1, -1, 0, 1) * this.size.y;
                var point = {
                    x: x,
                    y: y
                };

                //if contact is an entity
                var ent = edge.other.entity;
                if (ent) {
                    //test for groupIndex & mask bits
                    var f1 = this.shape.m_filter,
                        f2 = ent.shape.m_filter;
                    if (!f1.groupIndex || f1.groupIndex != f2.groupIndex || f1.groupIndex > 0 || f1.categoryBits == f2.maskBits) {
                        this.collideEntity(ent, point, normal);
                    }
                }
                //else contact is a collision tile
                else {
                    //calculate tile
                    var tile = ig.game.collisionMap.getTile(x, y);
                    this.collideTile(tile, point, normal);

                    //if normal force is straight up
                    //entity is standing
                    if (normal.y < 0) {
                        this.standing = true;
                    }

                }
            }
        },

        //passes collision entity, point & normal force
        collideEntity: function (other, point, normal) {},

        //passes the collision tile, point & normal force
        collideTile: function (tile, point, normal) {},

        update: function () {
            this.parent();
            this.collision();
        }

    });

});