(function(){
  const voronoi = new Voronoi();
  const updateChart = new UpdateChart();
  const mountains = new Mountains();
  const dvdBounce = new DVDBounce();
  const webglDemo = new WebGLDemo();

  voronoi.start();

  Reveal.addEventListener('slidechanged', function(e) {
    var id = e.currentSlide.getAttribute('data-id');

    if (id === 'title') {
      voronoi.start();
    } else {
      voronoi.stop();
    }

    if (id === 'webgl') {
      webglDemo.start();
    } else {
      webglDemo.stop();
    }

    if (id === 'update') {
      updateChart.start();
    } else {
      updateChart.stop();
    }

    if (id === 'canvas') {
      dvdBounce.dontClear().start();
    } else if (id === 'canvas-clear') {
      dvdBounce.clear().start();
    } else {
      dvdBounce.stop();
    }

    if (id === 'mountains') {
      mountains.updateHue(4).start();
    } else if (id === 'mountains-2') {
      mountains.updateHue(6).start();
    } else if (id === 'mountains-3') {
      mountains.updateHue(12).start();
    } else {
      mountains.stop();
    }
  });
})();
