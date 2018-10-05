(function(){
  const adjectives = new Adjectives();
  const voronoi = new Voronoi();

  adjectives.start();
  voronoi.start();

  Reveal.addEventListener('slidechanged', function(e) {
    var id = e.currentSlide.getAttribute('data-id');

    switch (id) {
      case 'title':
        adjectives.start();
        voronoi.start();
        break;
      default:
        adjectives.stop();
        voronoi.stop();
        break;
    }
  });

})();
