
goog.require('box2d');
  var randRange=function(from, to){
    return Math.round(from + Math.random()*(from, to));
  };
  function vec(x,y)
  {
	return box2d.b2Vec2(x,y);
}
var objects;
var world;
var player;
function applyTransform(body,ctx)
{
	ctx.save();
	var bPos=body.GetPosition();
    ctx.translate( bPos.x*16, bPos.y*16 );
    ctx.rotate( body.GetAngleRadians() ); 
}
function newStaticBox(x,y,w,h,friction)
{
	x/=16;
	y/=16;
	w/=16;
	h/=16
	var bodyDef=new box2d.b2BodyDef();
	bodyDef.position.SetXY(x,y);
	var body=world.CreateBody(bodyDef);
	var shape=new box2d.b2PolygonShape();
	shape.SetAsBox(w/2,h/2);
	var fixtureDef=new box2d.b2FixtureDef();
	fixtureDef.density=0;
	fixtureDef.shape=shape;
	fixtureDef.friction=friction;
	body.CreateFixture(fixtureDef);
	body.ResetMassData();
	this.body=body;
	this.poly=shape;
	this.w=w;
	this.h=h;
	this.draw=DrawPolygon;
}
var newBox=function(x,y,w,h,friction,density)
{
	x/=16;
	y/=16;
	w/=16;
	h/=16;
	var bodyDef=new box2d.b2BodyDef();
	bodyDef.position.SetXY(x,y);
	bodyDef.type = box2d.b2BodyType.b2_dynamicBody;
	var body=world.CreateBody(bodyDef);
	var shape=new box2d.b2PolygonShape();
	shape.SetAsBox(w/2,h/2);
	var fixtureDef=new box2d.b2FixtureDef();
	fixtureDef.density=density;
	fixtureDef.shape=shape;
	fixtureDef.friction=friction;
	body.CreateFixture(fixtureDef);
	body.ResetMassData();
	this.body=body;
	this.poly=shape;
	this.w=w;
	this.h=h;
	this.draw=DrawPolygon;
	/*var moment = Shape.Box.momentFor(mass, w, h);
      var body = space.addBody( new Body(mass, moment) );
      body.setPos( new Vect(x, y) );
      
      // also almost the same as above (o:
      var shape = space.addShape( new Shape.Box( body, w, h ) );
      shape.setFriction(friction);
    // add the shape (doesn't matter if it's a circle or box (or segment or polygon)
    space.addShape(shape);
	shapes.push(shape);
	return shape;*/
};
var ai2=function(b,i)
{
	if(i.x<0)
	{
		if(i.x<-18*3)
			i.x=-18*3;
	}
	else 
	{
		if(i.x>18*3)
			i.x=18*3;
	}
	var m=b.GetMass();
	var t=(b.GetMass());
	//b.m_linearVelocity.x+=i.x;
	i.x*=t;
	/*if(i.x<0)
		i.x=-1000;
	else
		i.x=1000;*/
	b.ApplyLinearImpulse(i,b.GetWorldCenter());
	//b.ApplyForceToCenter(i,b.GetWorldCenter());
	/*if(b.m_linearVelocity.x>10)
		b.m_linearVelocity.x=10;
	if(b.m_linearVelocity.x<-10)
		b.m_linearVelocity.x=-10;*/
	//b.applyImpulse(i,new Vect(0,0));
}
var Player=function(x,y)
{
	var box=new newBox(x,y,6,32,.01,2);
	this.body=box.body;
	this.shape=box.poly;
	var shape=this.shape;
	//shape.body.setMoment(99999999999999);
	//this.body.SetAngularDamping(Math.infinity);
	this.body.SetFixedRotation(1);
	this.bod
	//this.shape.data=this;
	this.air=0;
	this.jump=0;
	this.draw=function(context,o)
	{
		applyTransform(this.body,context);
		var playerImg=document.getElementById('playerimg');
		context.drawImage(playerImg,-8,-16);
		context.restore();
	};
	this.update=function()
	{
		//this.shape.body.resetForces();
		var key=KeyboardJS.activeKeys();
		var b=this.body;
		b.SetAwake(true);
		this.body.ApplyLinearImpulse(new box2d.b2Vec2(1,0),this.body.GetWorldCenter());
		if(key.indexOf("z")!=-1)
		{
			if(this.jump<1)
			{
				//this.body.m_linearVelocity.y-=10000;
				this.body.ApplyLinearImpulse(new box2d.b2Vec2(0,this.body.GetMass()*-(13-this.jump)),this.body.GetWorldCenter());
				//this.body.ApplyForceToCenter(new box2d.b2Vec2(0,this.body.GetMass()*-Math.abs(700)));
			this.jump++;
			}
//			this.body.ApplyForceToCenter(new box2d.b2Vec2(0,-100000000),true);
			//	this.shape.body.applyImpulse(new Vect(0,-1600),new Vect(0,0));
		}
		else /*if(this.jump<10)
		
			this.jump++;
			else*/
			this.jump=0;
		if(key.indexOf("right")!=-1)
		{
			if(b.m_linearVelocity.x<-10)
				b.m_linearVelocity.x=0;
			else
				ai2(b,new box2d.b2Vec2(10-b.m_linearVelocity.x,0));
		}
		else if(key.indexOf("left")!=-1)
		{
			if(b.m_linearVelocity.x>10)
				b.m_linearVelocity.x=0;
			else
				ai2(b,new box2d.b2Vec2(-(b.m_linearVelocity.x+10),0));
		}
		else
		{
			if(Math.abs(b.m_linearVelocity.x)>400)
				ai2(b,new box2d.b2Vec2(-this.body.GetMass()*b.m_linearVelocity.x*.6,0));
			else
				b.m_linearVelocity.x=0;
		}
	};
}
var init=function()
{
	objects=new Array();
	var gravity = new box2d.b2Vec2(0, 20);
	world = new box2d.b2World(gravity);
	objects.push(new newStaticBox(400,550,600,50,.5));
  objects.push(player=new Player(500,500));
	/*space=new Space();
	staticBody=space.getStaticBody();
	space.setGravity(new Vect(0,900));
	
  var friction = 0.5; // friction we'll use for all shapes here.
  var mass = 10; // mass used for non static shapes
	// create a segment line as floor
  var ground = new Shape.Segment( 
                                space.staticBody,  // static body = infinite mass and should not move -> (ignores gravity)
                                new Vect(100, 550),  // first endpoint in the lower left corner
                                new Vect(700, 550),  // second endpoint in the lower right corner
                                2  // width of line
                              );
  ground.setFriction(friction);
  // create one wall on the left side 
  var wall1 = new Shape.Segment(space.staticBody, new Vect(0, 0), new Vect(0, 500), 2);
  wall1.setFriction(friction);
  // create one wall on the right side
  var wall2 = new Shape.Segment(space.staticBody, new Vect(500, 0), new Vect(500, 500), 2);
  wall2.setFriction(friction);
  
  
  space.addShape(ground);
  shapes.push(ground);
 // space.addShape(wall1);
 // space.addShape(wall2);
*/
  
  // drop some shapes in the space. All bodies get the same mass
  for( var i = 0; i < 20; ++i ){

    var shape;
      var width = randRange(8,32);
      var height = randRange(8,23);
      var xpos = randRange( 100, 200 );
      var ypos = randRange( 200, 250 );
      shape=new newBox(xpos,ypos,width,height,.5,5);
	  objects.push(shape);
  }
  
  //this.update=update;
  //this.draw=draw;
  //this.addParticle=addParticle;
  
  //var loop = new Loop(60, update, draw);
  //loop.start();
	currentUpdate=window.setInterval("update();", 16);
};
var update=function()
{
	//document.getElementById('console').innerHTML+="<br />"+shapes[1].body.getPos().y;
	/*for(var i=0;i<shapes.length;i++)
	{
		if(shapes[i].data)
			shapes[i].data.update();
	}
	space.step(1/60);*/
	world.ClearForces();
	for(var i=0;i<objects.length;i++)
	{
		if(objects[i].update)
			objects[i].update();
	}
	world.Step(1/60,6,2);
	draw();
};
/*
function drawShape ( shape, canvas ){
      //canvas.pen.save();
	  if(shape.data)
		shape.data.draw(canvas);
		else
      if( shape instanceof Shape.Circle ){
        drawCircle(shape,canvas);
      }else if( shape instanceof Shape.Segment ){
        drawSegment(shape,canvas);
      }else if( shape instanceof Shape.Poly){
        drawPolygon(shape,canvas);
      }
    }
    
   function drawCircle (shape,canvas){
        var ballBody = shape.body;
        var cPos = ballBody.getPos();
        canvas.strokeStyle = 'black';
        canvas.translate( cPos.x, cPos.y );
        canvas.rotate( ballBody.getAngle() ); 
        canvas.translate( -cPos.x, -cPos.y );
        canvas.beginPath();
        canvas.arc(cPos.x,cPos.y, shape.getRadius(), 0, Math.PI*2,true); // x,y, radius, angles...
        canvas.lineTo( cPos.x, cPos.y );
        canvas.fill();
        canvas.stroke();
    }
    
   function drawSegment(shape,canvas){
      var segPosA = shape.getA();
      var segPosB = shape.getB();
      
      canvas.lineWidth = Math.max(1, shape.getRadius())*2;
      
      var pos = shape.body.getPos();
      canvas.translate( pos.x, pos.y );
      canvas.rotate( shape.body.getAngle() );
      
      canvas.beginPath();
      canvas.moveTo( (~~segPosA.x), (~~segPosA.y) );
      canvas.lineTo( (~~segPosB.x), (~~segPosB.y) );
      canvas.fill();
      canvas.stroke();
    }
    
   function drawPolygon(shape,canvas){
      var boxBody = shape.body;
      var bPos = boxBody.getPos();
	  canvas.save();
      canvas.translate( bPos.x, bPos.y );
      canvas.rotate( boxBody.getAngle() ); 
      
      var numVerts = shape.getNumVerts();
      var pos1 = shape.getVert(0);
      canvas.beginPath();
      canvas.moveTo( (~~pos1.x), (~~pos1.y) );
      for( var i = 1; i < numVerts; ++i ){
        var pos = shape.getVert(i);
        canvas.lineTo( (~~pos.x), (~~pos.y) );
      }
      canvas.closePath();
      canvas.fill();
      canvas.stroke();
	  canvas.restore();
    }*/
var draw=function()
{
var canvas = document.getElementById('screen');
        var context = canvas.getContext('2d');
	var html=""+objects.length;
        context.fillStyle = '#DDDDDD';
        context.fillRect(0,0,800,600);
	for(var i=0;i<objects.length;i++)
	{
		var o=objects[i];
		//var body=s.body;
		//var p=body.getPos();
        //context.fillRect(p.x,p.y,20,20);
		//drawShape(s,context);
		if(o.draw)
			o.draw(context,o);
	}
	document.getElementById('screend').innerHTML=html;

};
var DrawPolygon = function (context,o)
{
	var poly=o.poly;
	var vertices=poly.m_vertices;
	var vertexCount=poly.m_count;
	if (!vertexCount) return;

	var ctx = context;
	applyTransform(o.body,ctx);
	ctx.beginPath();
	ctx.moveTo(vertices[0].x*16, vertices[0].y*16);
	for (var i = 1; i < vertexCount; i++)
	{
		ctx.lineTo(vertices[i].x*16, vertices[i].y*16);
	}
	ctx.closePath();
	ctx.strokeStyle = "#000000";
	ctx.stroke();
	ctx.restore();
};