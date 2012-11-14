ig.module(
    'plugins.box2d.collision'
)
.requires(
    'plugins.box2d.entity',
    'plugins.box2d.game'
)
.defines(function(){

ig.Box2DEntity.inject({

    init: function (x, y, settings) {
        this.parent(x, y, settings);
        if (!ig.global.wm) {
            this.body.entity = this;
        }
    }

});

ig.Box2DGame.inject({

    // remove impact's collision detection
    // for performance
    checkEntities: function () {},

    loadLevel: function (data) {
        this.parent(data);

        // create impact collision listener
        var listener = new b2.ContactListener();
        listener.Add = function(point){
            var a = point.shape1.GetBody().entity,
                b = point.shape2.GetBody().entity;

            // is this an entity collision?
            if (!a || !b) {
                return;
            }

            // preserve impact's entity checks even
            // though these are unnecessary
            if (a.checkAgainst & b.type) {
                a.check(b);
            }
            
            if (b.checkAgainst & a.type) {
                b.check(a);
            }

            // call impact
            if (point.normal.y) {
                a.collideWith(b, 'y');
                b.collideWith(a, 'y');
            }
            else {
                a.collideWith(b, 'x');
                b.collideWith(a, 'x');
            }
        };

        // attach to box2d world
        ig.world.SetContactListener(listener);
    }

});

});