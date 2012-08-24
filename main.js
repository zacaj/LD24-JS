define(['loop','cp/Vect', 'cp/Space', 'cp/Shape', 'cp/Body', 'cp/constraints/PivotJoint','kbjs'], function(Loop,Vect, Space, Shape, Body, PivotJoint,KeyboardJS){
  "use strict";
  var randRange=function(from, to){
    return Math.round(from + Math.random()*(from, to));
  };
var shapes;
var staticBody;
var space;
var player;
var newBox=function(x,y,w,h,friction,mass)
{
	var moment = Shape.Box.momentFor(mass, w, h);
      var body = space.addBody( new Body(mass, moment) );
      body.setPos( new Vect(x, y) );
      
      // also almost the same as above (o:
      var shape = space.addShape( new Shape.Box( body, w, h ) );
      shape.setFriction(friction);
    // add the shape (doesn't matter if it's a circle or box (or segment or polygon)
    space.addShape(shape);
	shapes.push(shape);
	return shape;
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
	b.applyImpulse(i,new Vect(0,0));
}
var Player=function(x,y)
{
	this.shape=newBox(x,y,6,32,.01,5);
	var shape=this.shape;
	shape.body.setMoment(99999999999999);
	this.shape.data=this;
	this.air=0;
	this.jump=0;
	this.draw=function(context)
	{
		var p=this.shape.body.getPos();
		var playerImg=document.getElementById('playerimg');
		context.drawImage(playerImg,p.x-8,p.y-16);
	};
	this.update=function()
	{
		this.shape.body.resetForces();
		var key=KeyboardJS.activeKeys();
		var b=this.shape.body;
		if(key.indexOf("z")!=-1)
		{
			this.jump++;
			if(this.jump<2)
				this.shape.body.applyImpulse(new Vect(0,-1600),new Vect(0,0));
		}
		else 
			this.jump=0;
		if(key.indexOf("right")!=-1)
		{
			if(b.v.x<-10)
				b.v.x=0;
			else
				ai2(b,new Vect(250-b.v.x,0));
		}
		else if(key.indexOf("left")!=-1)
		{
			if(b.v.x>10)
				b.v.x=0;
			else
				ai2(b,new Vect(-(b.v.x+250),0));
		}
		else
		{
			if(Math.abs(b.v.x)>400)
				ai2(b,new Vect(-b.v.x*.6));
			else
				b.v.x=0;
		}
	};
}
var init=function()
{
	shapes=new Array();
	space=new Space();
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
  
  player=new Player(500,500);
  
  space.addShape(ground);
  shapes.push(ground);
 // space.addShape(wall1);
 // space.addShape(wall2);

  
  // drop some shapes in the space. All bodies get the same mass
  for( var i = 0; i < 20; ++i ){

    var shape;
      var width = randRange(8,32);
      var height = randRange(8,23);
      var xpos = randRange( 100, 200 );
      var ypos = randRange( 400, 250 );
      shape=newBox(xpos,ypos,width,height,friction,mass);
  }
  
  this.update=update;
  this.draw=draw;
  //this.addParticle=addParticle;
  
  var loop = new Loop(60, update, draw);
  loop.start();
};
var update=function()
{
	//document.getElementById('console').innerHTML+="<br />"+shapes[1].body.getPos().y;
	for(var i=0;i<shapes.length;i++)
	{
		if(shapes[i].data)
			shapes[i].data.update();
	}
	space.step(1/60);
};

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
    }
var draw=function()
{
var canvas = document.getElementById('screen');
        var context = canvas.getContext('2d');
	var html=""+shapes.length;
        context.fillStyle = '#DDDDDD';
        context.fillRect(0,0,800,600);
	for(var i=0;i<shapes.length;i++)
	{
		var s=shapes[i];
		var body=s.body;
		var p=body.getPos();
        //context.fillRect(p.x,p.y,20,20);
		drawShape(s,context);
	}
	document.getElementById('screend').innerHTML=html;

};
return new init();
});