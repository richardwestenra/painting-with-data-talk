(function(){
  const adjectives = new Adjectives();
  const voronoi = new Voronoi();
  const updateChart = new UpdateChart();
  const mountains = new Mountains();

  adjectives.start();
  voronoi.start();

  Reveal.addEventListener('slidechanged', function(e) {
    var id = e.currentSlide.getAttribute('data-id');
    adjectives.stop();
    voronoi.stop();
    updateChart.stop();
    mountains.stop();

    switch (id) {
      case 'title':
        adjectives.start();
        voronoi.start();
        break;
      case 'update':
        updateChart.start();
        break;
      case 'mountains':
        mountains.updateHue(4).start();
        break;
      case 'mountains-2':
        mountains.updateHue(6).start();
        break;
      case 'mountains-3':
        mountains.updateHue(12).start();
        break;
    }
  });
})();
