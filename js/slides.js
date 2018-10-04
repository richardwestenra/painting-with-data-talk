(function(){
  'use strict';

  // Config
  var interval;

  //  Utility functions

  function startInterval(callback, t){
    interval = setInterval(callback, t);
  }

  function stopInterval(){
    clearInterval(interval);
  }



  // Get some adjectives

  var i = 0;
  var arr = ['delightful','dank','diabolical','daffy','dubious','desirable','delicious','dependable','docile','dramatic','diverse','dreamy','deluxe','deceitful','disruptive','dauntless','deft','dynamic','dainty','decisive','dazzling','dastardly','decent','decorative','decadent','dicey'];

  function getNewAdjective() {
    var adj = arr[i++];
    d3.select('#adjective').text(adj);
    if (i>=arr.length) {
      i = 0;
    }
  }

  d3.select('#showNotes').on('click',function(){
    var show = d3.select(this).text() === 'Show notes';
    d3.selectAll('.notes').classed('visible', show);
    d3.select(this).text(show ? 'Hide notes' : 'Show notes');
  });

  var voronoi = new Voronoi();

  startInterval(getNewAdjective, 500);
  voronoi.start();

  Reveal.addEventListener('slidechanged', function(e) {
    var id = e.currentSlide.getAttribute('data-id');

    stopInterval();

    switch (id) {
      case 'title':
        startInterval(getNewAdjective, 500);
        voronoi.start();
        break;
      default:
        voronoi.stop();
        break;
    }
  });

})();
