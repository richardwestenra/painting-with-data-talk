function DVDBounce() {
  /**
  * Calculate the total elapsed time since the start of the animation
  */
  const updateClock = timestamp => {
    if (!startTime) {
      startTime = timestamp;
    }
    const totalElapsedTime = timestamp - startTime;
    const timeSinceLastRun = totalElapsedTime - previousTime;
    previousTime = totalElapsedTime;

    return timeSinceLastRun;
  };

  /**
  * Reset the canvas area for the next frame
  */
  const clearCanvas = context => {
    context.clearRect(0, 0, width, height);
  };

  const getNewPosition = (d, bounds, time) => {
    const speed = () => object.velocity[d] * time;
    const newPosition = object.position[d] + speed();
    const boundsExceeded = {
      min: newPosition < bounds[0],
      max: newPosition > bounds[1]
    };
    if (boundsExceeded.min || boundsExceeded.max) {
      object.velocity[d] = -object.velocity[d];
      object.fillStyle = `hsla(${Math.floor(Math.random()*360)}, 100%, 50%, 0.3)`;
    }
    
    return object.position[d] += speed();
  };

  const draw = (time) => {
    const x = getNewPosition('x', [0, width - object.width], time);
    const y = getNewPosition('y', [0, height - object.height], time);
    context.drawImage(object.image, x, y, object.width, object.height);
    if (object.fillStyle) {
      context.fillStyle = object.fillStyle;
      context.fillRect(x, y, object.width, object.height);
    }
  };

  /**
  * Execute a new animation frame and call the next one
  */
  const run = timestamp => {
    if (clear) {
      clearCanvas(context);
    }
    const timeSinceLastRun = updateClock(timestamp);
    draw(timeSinceLastRun);
    req = requestAnimationFrame(run);
  };

  const createCanvas = () => {
    const canvas = document.getElementById('dvd');
    const context = canvas.getContext('2d');
    updateCanvasSize(canvas);

    return [canvas, context];
  };

  const createObject = () => {
    const objVelocity = 0.3;
    const objSize = Math.round(Math.min(width, height) / 3);
    const object = {
      image: new Image(),
      width: objSize,
      height: objSize,
      position: {
        x: Math.random() * (width - objSize),
        y: Math.random() * (height - objSize)
      },
      velocity: {
        x: objVelocity,
        y: objVelocity
      }
    };
    object.image.src = `img/cat-cheese.jpg`;
    return object;
  }

  const updateCanvasSize = canvas => {
    canvas.width = width;
    canvas.height = height;
  };

  // Establish some global mutable values
  let req,
    width = window.innerWidth,
    height = window.innerHeight,
    startTime = 0,
    previousTime = 0,
    object = createObject(),
    clear = false;

  // The canvas rendered to the page:
  const [canvas, context] = createCanvas();
  canvas.classList.remove('demo--visible');

  // Update/redraw on window resize
  this.handleResize = () => {
    if (req) {
      width = window.innerWidth;
      height = window.innerHeight;
      updateCanvasSize(canvas);
      object = createObject();
    }
    return this;
  };

  window.addEventListener('resize', this.handleResize);
  window.addEventListener('keydown', e => {
    if (e.keyCode === 82) { // R
      this.handleResize();
    }
  });
	window.addEventListener('message', event => {
		var data = JSON.parse(event.data);
		if (data.method ==='triggerKey' && data.args.includes(82)) { // R
      this.handleResize();
		}
	});
  
  this.clear = function() {
    clear = true;
    return this;
  };
  
  this.dontClear = function() {
    clear = false;
    return this;
  };

  this.start = function() {
    if (!req) {
      // Update canvas dimensions if not already running
      this.handleResize();
    }
    req = requestAnimationFrame(run);
    canvas.classList.add('demo--visible');
    return this;
  };

  this.stop = function() {
    canvas.classList.remove('demo--visible');
    cancelAnimationFrame(req);
    req = false;
    return this;
  };
}
