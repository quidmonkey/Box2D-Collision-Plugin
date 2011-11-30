// Written by Abraham Walters
// Box2D Collision Plugin for Box2D
// November 2011

ig.module( 
	'plugins.box2d.collision'
)
.requires(
	'plugins.box2d.entity'
)
.defines(function(){

ig.Box2DEntity.inject({
	
    init: function( x, y, settings ){
        this.parent( x, y, settings );
        this.body.entity = this;
    },
    
    collision: function(){
		
		this.standing = false;
		
		//for each contact edge
        for( var edge = this.body.m_contactList; edge; edge = edge.next ) {
			
			//grab normal force, which is the vector
			//perpendicular to the surface of contact
			var normal = edge.contact.m_manifold.normal;
			
            //if contact is an entity
			var ent = edge.other.entity;
            if( ent ){
				//test for groupIndex & mask bits
				var f1 = ent.shape.m_filter, f2 = this.shape.m_filter;
				if( f1.groupIndex != f2.groupIndex || f1.groupIndex > 0 || f1.categoryBits == f2.maskBits ){
					this.collideEntity( ent, normal );
				}
            }
			//else contact is a collision tile
            else{
				//calculate points of contact
				var x = this.pos.x + normal.x.map( 1, -1, 0, 1 ) * this.size.x;
				var y = this.pos.y + normal.y.map( 1, -1, 0, 1 ) * this.size.y;
				var tile = ig.game.collisionMap.getTile( x, y );
				var point = { x: x, y: y };
                this.collideTile( tile, point, normal );
				if( normal.y < 0 ){
					this.standing = true;
				}
            }
		}
    },
	
	//passes colliding entity & normal force
	collideEntity: function( other, normal ){},
    
	//passes the collision tile, point & normal force
    collideTile: function( tile, point, normal ){},
	
	update: function(){
		this.parent();
		this.collision();
	}
    
});

});