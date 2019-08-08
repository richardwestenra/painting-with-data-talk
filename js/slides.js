(function(){
  const voronoi = new Voronoi();
  const updateChart = new UpdateChart();
  const mountains = new Mountains();
  const scaleDemo = new ScaleDemo();
  const dvdBounce = new DVDBounce();
  const webglDemo = new WebGLDemo();
  const snapchat = new Snapchat();

  voronoi.start();

  const darksky = document.getElementById('darksky');
  const unsure = document.getElementById('unsure');

  Reveal.addEventListener('slidechanged', function(e) {
    var id = e.currentSlide.getAttribute('data-id');

    if (id === 'title') {
      voronoi.start();
    } else {
      voronoi.stop();
    }

    if (id === 'snapchat') {
      snapchat.start();
    } else {
      snapchat.stop();
    }

    if (id === 'darksky') {
      darksky.classList.add('demo--visible');
    } else {
      darksky.classList.remove('demo--visible');
    }

    if (id === 'unsure') {
      unsure.classList.add('demo--visible');
    } else {
      unsure.classList.remove('demo--visible');
    }

    if (id === 'scale-demo') {
      scaleDemo.start();
    } else {
      scaleDemo.stop();
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
      dvdBounce.dontClear().start().handleResize();
    } else if (id === 'canvas-clear') {
      dvdBounce.clear().start();
    } else {
      dvdBounce.stop();
    }

    if (id === 'mountains') {
      mountains.updateHue(4).start();
    } else if (id === 'mountains-2') {
      mountains.updateHue(8).start();
    } else {
      mountains.stop();
    }
  });
})();
