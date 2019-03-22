function ScaleDemo(){
  let play = false;
  const el = {
    window: d3.select(window),
    body: d3.select('body'),
    domain: d3.select('#domain'),
    range: d3.select('#range'),
    inputValue: d3.select('#inputValue'),
    outputValue: d3.select('#outputValue'),
    outputColour: d3.select('#scale-colour'),
  };

  el.line = el.body.append('div')
    .attr('class', 'scale-line')
    .style('opacity', 0);

  const hue = d => Math.round(d3.scaleLinear()
    .domain([0, window.innerHeight])
    .range([0, 360])(d));

  const colour = d => `hsl(${hue(d)}, 70%, 70%)`;

  function update(d){
    el.body.style('background', colour(d));
    el.inputValue.text(d);
    el.outputValue.text(hue(d));
    el.outputColour.text(colour(d));
  }

  el.window.on('mousemove',function () {
    if (play) {
      const { y } = d3.event;
      update(y);
      el.line.style('opacity', 1)
        .style('transform', `translateY(${y}px)`);
    }
  });


  this.start = function() {
    play = true;
    el.domain.text(`[0, ${window.innerHeight}]`);
    el.range.text(`[${hue(0)}, ${hue(window.innerHeight)}]`);
  };

  this.stop = function() {
    play = false;
    el.body.style('background', null);
    el.line.style('opacity', 0);
  };
}
