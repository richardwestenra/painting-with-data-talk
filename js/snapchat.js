// This is some old code of mine from 2015, please don't judge it too harshly
function Snapchat() {
  //--- Create Canvas ---//

  var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    W, H,
    MAX_SIZE;

  function resizeCanvas() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    MAX_SIZE = 5 + 0.02 * ((W+H)/2); // Max object radius
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  canvas.id = 'snapchat';
  canvas.classList.add('fullscreen', 'demo');
  canvas.classList.remove('demo--visible');
  document.body.prepend(canvas);

  //--- Global variables ---//

  var objects = [],
    req = false,
    MAX_T = 1000, // Max object time in ms
    MAX_F = 8796, // Max frequency
    freq = MAX_F, // Initial frequency
    aX = 0, // horizontal acceleration
    aY = 0, // vertical acceleration
    INIT_VELOCITY = 0; // Initial velocity (previously = 10)

  // Calculate interval
  function getInterval() {
    return 1000 / freq;
  }
  var interval = getInterval(); // Time between ghosts

  var tGrow = 1/4, // proportion of time spent growing
    tFade = 1/4; // proportion of time spent fading

  var oldT = 0,
    dt = 0,
    lastNewObj = 0,
    newObjOverflow = 0;

  // Test variables
  var repeat = 0; // nbed
  var frameReadings = [];



  //--- Make stuff happen ---//

  function loadImages(arr, callback) {
    var loadedImages = 0,
      arrLen = arr.length;
    images = arr.map(function(d){
      var img = new Image();
      img.src = d;
      img.onload = function() {
        if(++loadedImages >= arrLen) {
          callback();
        }
      };
      return img;
    });
  }

  var images = [];
  var imagePaths = [
    'img/emoji/ghost.png',
    'img/emoji/aubergine.png',
    'img/emoji/beers.png',
    'img/emoji/burger.png',
    'img/emoji/cat.png',
    'img/emoji/catlove.png',
    'img/emoji/couple.png',
    'img/emoji/crylaugh.png',
    'img/emoji/dancer.png',
    'img/emoji/devil.png',
    'img/emoji/doc.png',
    'img/emoji/dog.png',
    'img/emoji/eyes.png',
    'img/emoji/ladyHoldingHandUp.png',
    'img/emoji/leaves.png',
    'img/emoji/poo.png',
    'img/emoji/ghostDetail.png',
  ];

  function resetCanvas() {
      ctx.clearRect(0, 0, W, H);
  }

  function createObject(){
      objects.push({
          origin: {
            // Random initial positions:
            x: (Math.random()-0.5) * W * 2,
            y: (Math.random()-0.5) * H * 2
          },
          // Random initial velocities prior to gravity:
          velocity: {
            x: (Math.random()-0.5) * INIT_VELOCITY,
            y: (Math.random()-0.5) * INIT_VELOCITY
          },
          size: MAX_SIZE/3, // initial size
          // size: MAX_SIZE, // initial size
          alpha: 1, //opacity
          img: Math.random()>0.4 ? images[0] : sample(images),
          t: 0 // time since birth
      });
  }

  // Get random item from array:
  function sample(arr){
    return arr[ Math.floor( Math.random() * arr.length ) ];
  }

  function drawImage(x,y,r,a,img) {
    // img = img || ghost;  
    ctx.save();
    ctx.globalAlpha = a;
    ctx.drawImage(img, x, y, r, r);
    ctx.restore();
  }

  function animateDV(max, t){
    var thisT = MAX_T * t;
    var thisDT = thisT / dt;
    return max / thisDT;
  }

  function updateTimer(now){
    // Update time diff
    if (oldT === 0) {
      oldT = now;
    }
    dt = now - oldT;
    oldT = now;
  }

  var firstRun = true;
  function createObjects(now){
    var dtLastNewObj = now - lastNewObj; // Time since last object created
    if (firstRun) {
      dtLastNewObj = 0;
      lastNewObj = now;
      firstRun = false;
    }

    // Create new object
    if (dtLastNewObj > interval) {
      createObject();
      lastNewObj = now;
      newObjOverflow += dtLastNewObj - interval;
    }

    // Add extra objects to compensate where interval < framerate
    while(newObjOverflow > interval) {
      createObject();
      newObjOverflow -= interval;
    }
  }


  function run(now){
    resetCanvas();
    updateTimer(now);
    createObjects(now);

    var vGrow = animateDV(MAX_SIZE, tGrow);
    var vFade = animateDV(1, tFade);

    var objLen = objects.length;

    for (var i=0; i < objLen; i++) {
        var o = objects[i];

        // Gravity acceleration constant (?)
        o.velocity.x += aX;
        o.velocity.y += aY;

        // Get previous velocity
        o.origin.x += o.velocity.x;
        o.origin.y += o.velocity.y;

        // Apply drag force coefficient to decellerate the object over time
        // o.velocity.x *= 0.98;
        // o.velocity.y *= 0.98;


        // Bounding box: 
        // Prevent the balls escaping vertically
        if (o.origin.y < 0 || o.origin.y > H) {
          o.velocity.y = -o.velocity.y;
        }
        // Prevent the balls escaping horizontally
        if (o.origin.x < 0 || o.origin.x > W) {
          o.velocity.x = -o.velocity.x;
        }

        // Increase object timer
        o.t += dt;

        if (dt !== 0) {
          if (o.size < MAX_SIZE) {
            o.size = Math.min(o.size+vGrow, MAX_SIZE);
          } else if (o.t > MAX_T - MAX_T * tFade) {
            o.alpha = Math.max(o.alpha-vFade, 0);
          }
        }

        if (o.t < MAX_T) {
          var x = o.origin.x - o.size / 2;
          var y = o.origin.y - o.size / 2;
          // (Re)draw the circles
          drawImage(x, y, o.size, o.alpha, o.img);
        } else {
          // Kill it
          o.dead = true;
        }

    }

    objects = objects.filter(function(d){
      return !d.dead;
    });

    if (req) {
      req = requestAnimationFrame(run);
    }
  }


  //--- Initialise canvas ---//
  
  loadImages(imagePaths);

  this.start = function() {
    req = requestAnimationFrame(run);
    canvas.classList.add('demo--visible');
  };

  this.stop = function() {
    canvas.classList.remove('demo--visible');
    cancelAnimationFrame(req);
    req = false;
  };
}