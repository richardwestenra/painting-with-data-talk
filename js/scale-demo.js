function ScaleDemo(){
  let play = false;
  let height = window.innerHeight;
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

  const hue = (y) => Math.round(d3.scaleLinear()
    .domain([0, height])
    .range([0, 360])(y));

  const colour = d => `hsl(${hue(d)}, 70%, 70%)`;

  function update(y){
    el.body.style('background', colour(y));
    el.inputValue.text(y);
    el.outputValue.text(hue(y));
    el.outputColour.text(colour(y));
    el.domain.text(`[0, ${height}]`);
    el.range.text(`[${hue(0)}, ${hue(height)}]`);
    const lineY = (y / height) * window.innerHeight;
    el.line.style('opacity', 1)
      .style('transform', `translateY(${lineY}px)`);
  }

  el.window.on('mousemove', function() {
    if (play) {
      const { y } = d3.event;
      update(y);
      height = window.innerHeight;
    }
  });
	el.window.on('message', function() {
    if (play) {
      var data = JSON.parse(d3.event.data);
      if (data.method === 'triggerMouse') {
        height = data.height;
        update(data.y);
      }
		}
	});


  this.start = function() {
    play = true;
    update(0);
  };

  this.stop = function() {
    play = false;
    el.body.style('background', null);
    el.line.style('opacity', 0);
  };
}
