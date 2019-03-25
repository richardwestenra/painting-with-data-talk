function Mountains() {
  /**
   * Constants [current-value, [min, max]]
   */
  const config = {
    areaCount: [6, [1, 200]],
    maxY_0: [0.4, [0, 1]],
    maxY_1: [0.9, [0, 1]],
    minY_0: [0.15, [0, 1]],
    minY_1: [0.8, [0, 1]],
    walkDistance_0: [0.03, [0, 1]],
    walkDistance_1: [0.01, [0, 1]],
    updateFrequency_0: [350, [1, 2000]],
    updateFrequency_1: [600, [1, 2000]],
    tickFrequency_0: [0.0625, [0, 1]],
    tickFrequency_1: [0.125, [0, 1]],
    hue_0: [2, [0, 360]],
    hue_1: [12, [0, 360]],
    hue_change_rate_0: [4, [0, 100]],
    hue_change_rate_1: [4, [0, 100]],
    chroma_0: [45, [0, 100]],
    chroma_1: [20, [0, 100]],
    lightness_0: [30, [0, 100]],
    lightness_1: [80, [0, 100]],
    hasGradient: [false],
    blur_0: [0.6, [0, 10]],
    blur_1: [1.1, [0, 10]],
    hasBlur: [false],
    xParallax_0: [0.1, [0, 1]],
    xParallax_1: [0.01, [0, 1]],
    yParallax_0: [0.1, [0, 1]],
    yParallax_1: [0.01, [0, 1]]
  };

  /**
   * Generate RGB colour strings from HCL (hue/chroma/lightness)
   */
  const hcl = (h, c, l) => d3.hcl(h, c, l).toString();

  /**
   * Get the last datum from an array
   */
  const last = data => data[data.length - 1];

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
    const hue = areas[0].hue;
    const chroma = 18;
    if (configValues.hasGradient) {
      const lightness = [83, 100];
      const gradient = context.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, hcl(hue, chroma, lightness[0]));
      gradient.addColorStop(0.5, hcl(hue, chroma, lightness[1]));
      context.fillStyle = gradient;
    } else {
      context.fillStyle = hcl(hue, chroma, 90);
    }
    context.rect(0, 0, width, height);
    context.fill();
  };

  /**
   * Create a single area/mountain range section
   * Public methods: update, onResize and onMouseMove
   */
  class Area {
    constructor(props) {
      // Establish default values
      this.MAX_Y = 1;
      this.MIN_Y = 0;
      this.WALK_DISTANCE = 0.1;
      this.UPDATE_FREQUENCY = 1000;
      this.TICK_FREQUENCY = 0.1;
      this.HUE = 0;
      this.HUE_CHANGE_RATE = 0.3;
      this.CHROMA = 50;
      this.LIGHTNESS = 60;
      this.GRADIENT = 10;
      this.BLUR = 1;
      this.PARALLAX = { x: 0.1, y: 0.1 };

      // Override with props
      for (let prop in props) {
        this[prop] = props[prop];
      }

      // Establish mutable values
      this.hue = 0 + this.HUE;
      this.timeSinceLastRun = 0;
      this.timeSinceLastNewDatum = 0;

      // Calculate values and perform initial setup
      this.calculateDimensions();
      this.setupData();
      this.calculateRanges();
      this.createScales();
      this.populateData();
    }

    calculateDimensions() {
      const { x, y } = this.parallax();
      this.width = width + x * 2;
      this.height = height + y * 2;
    }

    parallax() {
      return {
        x: this.PARALLAX.x * width,
        y: this.PARALLAX.y * height
      };
    }

    calculateRanges() {
      const { x, y } = this.parallax();

      const offset = {
        x: dx => dx + position.x * x,
        y: dy => dy + position.y * y
      };

      this.xRange = [-x, this.width - x].map(offset.x);
      this.yRange = [this.height - y, -y].map(offset.y);
    }

    setupData() {
      const startY = (this.MAX_Y + this.MIN_Y) / 2;
      this.data = [startY];
      this.dataCount = Math.floor(this.width * this.TICK_FREQUENCY);
    }

    createScales() {
      this.x = this.xScale();
      this.y = this.yScale();
      this.area = this.areaScale();
    }

    xScale() {
      return d3
        .scaleLinear()
        .domain([0, this.dataCount - 1])
        .range(this.xRange);
    }

    yScale() {
      return d3
        .scaleLinear()
        .domain([0, 1])
        .range(this.yRange);
    }

    areaScale() {
      return d3
        .area()
        .x((d, i) => this.x(i))
        .y0(this.y(0))
        .y1((d, i) => this.y(d))
        .context(this.context);
    }

    randomNextDatum(previous) {
      let randomWalk = (Math.random() - 0.5) * this.WALK_DISTANCE * 2;
      const boundsExceeded = {
        max: previous + randomWalk > this.MAX_Y,
        min: previous + randomWalk < this.MIN_Y
      };
      if (boundsExceeded.max || boundsExceeded.min) {
        randomWalk = -randomWalk;
      }
      return previous + randomWalk;
    }

    addNewDatum() {
      const nextDatum = this.randomNextDatum(last(this.data));
      this.data.push(nextDatum);
    }

    populateData() {
      this.addNewDatum();
      if (this.data.length < this.dataCount) {
        this.populateData();
      }
    }

    updateData() {
      this.timeSinceLastNewDatum += this.timeSinceLastRun;

      while (this.timeSinceLastNewDatum > this.UPDATE_FREQUENCY) {
        this.timeSinceLastNewDatum -= this.UPDATE_FREQUENCY;
        this.addNewDatum();
        this.data.shift();
      }
    }

    updateXOffset() {
      this.tickDistance = this.width / this.dataCount;
      const offsetFraction = this.timeSinceLastNewDatum / this.UPDATE_FREQUENCY;
      const xOffset = offsetFraction * this.tickDistance;
      this.x.range(this.xRange.map(d => d - xOffset));
    }

    draw() {
      this.context.beginPath();
      this.area(this.data);
      this.fill();
    }

    fill() {
      this.fillStyle();
      this.filter();
      this.context.fill();
    }

    fillStyle() {
      const hueChange = (this.HUE_CHANGE_RATE * this.timeSinceLastRun) / 100;
      const hue = (this.hue += hueChange);
      if (this.HAS_GRADIENT) {
        const gradient = this.context.createLinearGradient(0, 0, 0, height);
        [0, 1].forEach(stop => {
          const mod = stop ? 1 : -1;
          const lightness = this.LIGHTNESS + this.GRADIENT * mod;
          gradient.addColorStop(stop, hcl(hue, this.CHROMA, lightness));
        });
        this.context.fillStyle = gradient;
      } else {
        this.context.fillStyle = hcl(hue, this.CHROMA, this.LIGHTNESS);
      }
    }

    filter() {
      if (this.HAS_BLUR) {
        this.context.filter = `blur(${this.BLUR}px)`;
      } else {
        this.context.filter = 'none';
      }
    }

    onResize() {
      this.calculateDimensions();
      this.setupData();
      this.calculateRanges();
      this.createScales();
      this.populateData();
    }

    onMousemove() {
      this.calculateRanges();
      this.x.range(this.xRange);
      this.y.range(this.yRange);
    }

    update(timeSinceLastRun) {
      this.timeSinceLastRun = timeSinceLastRun;
      this.updateData();
      this.updateXOffset();
      this.draw();
    }
  }

  /**
   * Execute a new animation frame and call the next one
   */
  const run = timestamp => {
    clearCanvas(m_context);
    const timeSinceLastRun = updateClock(timestamp);
    areas.forEach(a => a.update(timeSinceLastRun));
    context.drawImage(m_canvas, 0, 0);
    req = requestAnimationFrame(run);
  };

  /**
   * Get property value for a datum based on the given range for that prop
   * @param {Array} areaIDs IDs of areas
   */
  const areaScaleLinear = areaIDs => d3.scaleLinear()
      .domain(d3.extent(areaIDs));

  /**
   * Calculate config values for a given area
   * @param {Object} d Area datum
   */
  const getAreaConfig = (d, areaScale) => {
    const c = configValues;
    const a = range => areaScale.range(range)(d);
    
    return {
      id: d,
      context: m_context,
      MAX_Y: a([c.maxY_0, c.maxY_1]),
      MIN_Y: a([c.minY_0, c.minY_1]),
      WALK_DISTANCE: a([c.walkDistance_0, c.walkDistance_1]),
      UPDATE_FREQUENCY: a([c.updateFrequency_0, c.updateFrequency_1]),
      TICK_FREQUENCY: a([c.tickFrequency_0, c.tickFrequency_1]),
      HUE: a([c.hue_0, c.hue_1]),
      HUE_CHANGE_RATE: a([c.hue_change_rate_0, c.hue_change_rate_1]),
      CHROMA: a([c.chroma_0, c.chroma_1]),
      LIGHTNESS: a([c.lightness_0, c.lightness_1]),
      HAS_GRADIENT: c.hasGradient,
      BLUR: a([c.blur_0, c.blur_1]),
      HAS_BLUR: c.hasBlur,
      PARALLAX: {
        x: a([c.xParallax_0, c.xParallax_1]),
        y: a([c.yParallax_0, c.yParallax_1])
      }
    };
  };

  /**
   * Create instances of the Area class
   */
  const makeAreas = () => {
    const areaIDs = Array.from(Array(configValues.areaCount).keys()).reverse();
    areas = areaIDs.map(d => {
      return new Area(getAreaConfig(d, areaScaleLinear(areaIDs)));
    });
  };

  /**
   * Add event listeners
   */
  const handleEvents = () => {
    // Update/redraw on window resize
    window.addEventListener('resize', () => {
      width = window.innerWidth;
      height = window.innerHeight;
      [canvas, m_canvas].forEach(updateCanvasSize);
      areas.forEach(a => a.onResize());
    });

    // Handle parallax effect on mousemove
    document.addEventListener('mousemove', e => {
      position.y = e.clientY / height;
      position.x = e.clientX / width;
      areas.forEach(a => a.onMousemove());
    });

    // Toggle (play/pause) animation on spacebar
    document.addEventListener('keydown', e => {
      if (e.keyCode !== 32) {
        return;
      }
      if (req) {
        cancelAnimationFrame(req);
        req = false;
      } else {
        req = requestAnimationFrame(run);
      }
    });
  };

  /**
   * Start up dat.gui to provide a means to control values
   */
  const initDatGui = () => {
    const gui = new dat.GUI();
    for (let key in config) {
      const value = configValues[key];
      if (typeof value === 'boolean') {
        gui.add(configValues, key).onChange(makeAreas);
      } else {
        const action = gui
          .add(configValues, key, ...config[key][1])
          .onChange(makeAreas);
        if (key === 'areaCount') {
          action.step(1);
        }
      }
    }
    gui.close();
  };

  const createCanvas = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    updateCanvasSize(canvas);

    return [canvas, context];
  };

  const updateCanvasSize = canvas => {
    canvas.width = width;
    canvas.height = height;
  };

  /**
   * Start animation
   */
  const initialise = () => {
    makeAreas();
    document.body.prepend(canvas);
    // req = requestAnimationFrame(run);
    handleEvents();
    // initDatGui();
  };

  // Establish some global mutable values
  let areas,
    req,
    width = window.innerWidth,
    height = window.innerHeight,
    startTime = 0,
    previousTime = 0,
    position = {
      x: 0.5,
      y: 0.5
    };

  // The canvas rendered to the page:
  const [canvas, context] = createCanvas();
  // A virtual canvas for pre-rendering, to improve perf
  // (See https://www.html5rocks.com/en/tutorials/canvas/performance/#toc-pre-render)
  const [m_canvas, m_context] = createCanvas();
  canvas.id = 'mountains';
  canvas.classList.add('fullscreen');

  // Reformat the data to just key:value pairs for use with dat.gui
  const configValues = Object.keys(config).reduce((obj, key) => {
    obj[key] = config[key][0];
    return obj;
  }, {});

  // Initialise
  initialise();

  this.start = function() {
    req = requestAnimationFrame(run);
    canvas.style.opacity = 1;
    return this;
  };

  this.updateHue = function(changeRate) {
    configValues.hue_change_rate_1 = changeRate;
    areas.forEach(area => {
      const areaIDs = areas.map(a => a.id);
      const areaConfig = getAreaConfig(area.id, areaScaleLinear(areaIDs));
      area.HUE_CHANGE_RATE = areaConfig.HUE_CHANGE_RATE;
    });
    return this;
  };

  this.stop = function() {
    cancelAnimationFrame(req);
    req = false;
    canvas.style.opacity = 0;
    return this;
  };
}
