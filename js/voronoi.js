// Based on https://bl.ocks.org/mbostock/6675193
function Voronoi () {
  const canvasD3 = d3.select("#voronoi"),
      canvas = canvasD3.node(),
      context = canvas.getContext("2d"),
      title = d3.selectAll('.title'),
      nodeCount = 100,
      velocity = 0.2,
      hueSpeed = 0.3;

  let width = canvas.width = window.innerWidth,
      height = canvas.height = window.innerHeight,
      hue = 0,
      voronoi,
      sites = [],
      play = false;
  
  resize();
  getSites();

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    voronoi = d3.voronoi().extent([[-1, -1], [width + 1, height + 1]]);
  }

  function getSites() {
    sites = d3.range(nodeCount).map((d, i) => ({
      x: Math.random() * width, // x
      y: Math.random() * height, // y
      dx: i ? getRandomNum(-velocity, velocity) : 0, // x velocity
      dy: i ? getRandomNum(-velocity, velocity) : 0, // y velocity
      colour: getRandomNum(70, 90), // colour,
    }));
  }

  // var voronoi = d3.voronoi()
  //   .extent([[-1, -1], [width + 1, height + 1]]);

  function moved() {
    var mousePos = d3.mouse(this);
    sites[0].x = mousePos[0];
    sites[0].y = mousePos[1];
    redraw();
  }

  function redraw() {
    var diagram = voronoi(sites.map(({x, y}) => [x, y])),
      links = diagram.links(),
      polygons = diagram.polygons();

    context.clearRect(0, 0, width, height);
    
    for (var i = 0, n = polygons.length; i < n; ++i) {
      context.beginPath();
      drawCell(polygons[i]);
      context.fillStyle = getRandomColour(hue, 50, sites[i].colour);
      context.fill();
    }

    title.style('color', getRandomColour(hue + 180, 70, 25));

    context.beginPath();
    for (var i = 0, n = polygons.length; i < n; ++i) drawCell(polygons[i]);
    context.strokeStyle = "rgba(0,0,0,0.05)";
    context.stroke();
  }

  function getRandomNum(min, max){
    return Math.random() * (max - min) + min;
  }

  function getRandomColour(hue, saturation, lightness){
    return `hsl(${hue},${saturation}%,${lightness}%)`;
  }

  function drawCell(cell) {
    if (!cell) return false;
    context.moveTo(cell[0][0], cell[0][1]);
    for (var j = 1, m = cell.length; j < m; ++j) {
      context.lineTo(cell[j][0], cell[j][1]);
    }
    context.closePath();
    return true;
  }

  function step(){
    sites.forEach((d) => {
      d.x += d.dx;
      d.y += d.dy;
      if (d.x < 0 || d.x > width) {
        d.dx *= -1;
      }
      if (d.y < 0 || d.y > height) {
        d.dy *= -1;
      }
    });
    redraw();
    hue += hueSpeed;
    if (play) {
      window.requestAnimationFrame(step);
    }
  }

  // Refresh if window reloads
  window.addEventListener('resize', () => {
    resize();
    getSites();
  });
  
  d3.select('.reveal').on('touchmove mousemove', moved);

  this.start = function() {
    play = true;
    window.requestAnimationFrame(step);
    canvasD3.style('opacity', 1);
  };

  this.stop = function() {
    play = false;
    canvasD3.style('opacity', 0);
  };
}