/**
 * Utility to do fixed time steps with variable fps
 */
define([], function(){
  var requestAnimationFrame = window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame || 
        window.oRequestAnimationFrame || 
        window.msRequestAnimationFrame ||
        function(/* function */ callback, /* DOMElement */ element){
          window.setTimeout(callback, 1000 / 60);
        };;
  
  
  function GameLoop(fps, worker, painter){
    this.tick = createGameLoop(fps, worker, painter);
  }
  
  GameLoop.prototype = {
    start: function(){
      requestAnimationFrame(this.tick);
    },
    
    stop: function(){
      //window.requestAnimationFrame(this.tick);
    }
  };
  
  /**
   * Creates a gameloop function with the specified FPS. Once started with requestAnimationFrame, the function will continue to loop with fixed timesteps.
   */
  var createGameLoop = function(fps, worker, painter){
    
    var lastIterationTime = Date.now();
    
    return function(){
      // modelled after this (http://www.koonsolo.com/news/dewitters-gameloop/) article
      var ticksPerSecond = fps;
      var tickDuration = 1000 / ticksPerSecond;
      var maxLoops = 10;
      var loopCount = 0;
      
      var now = Date.now();
      
      while( (now > lastIterationTime+tickDuration) && (loopCount < maxLoops) ) {
        worker();
        lastIterationTime += tickDuration;
        loopCount++;
      }
      
      painter();
      requestAnimationFrame(arguments.callee);
    };
  };
  
  return GameLoop;
});
