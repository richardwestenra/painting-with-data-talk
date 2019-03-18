function ScaleDemo(){
  const width = 400;
  const height = 30;
  const input = d3.select('#input');
  const inputValue = d3.select('#inputValue');
  const output = d3.select('#output');
  const outputValue = d3.select('#outputValue');
  let interval;

  const x = d3.scaleLinear()
    .domain([20, 60])
    .range([0, width]);

  const svg = output
    .attr('width', width)
    .attr('height', height);

  svg.append('rect')
    .style('fill','#666')
    .attr('width', width)
    .attr('height', height)
    .attr('x', 0)
    .attr('y', 0);

  const bar  = svg.append('rect')
    .style('fill','darkturquoise')
    .attr('width', 0)
    .attr('height', height)
    .attr('x', 0)
    .attr('y', 0);

  function update(d){
    bar.transition()
      .duration(800)
      .attr('width',x(d));
    inputValue.text(d);
    outputValue.text( Math.round( x(d) ) );
  }

  update(40)

  input.on('change',function (){
    update(this.value);
  });

  const updateInput = () => {
    const domain = x.domain();
    const newInputValue = Math.round(Math.random() * (domain[1] - domain[0])) + domain[0];
    input.node(0).value = newInputValue;
    update(newInputValue);
  };

  this.start = function() {
    interval = window.setInterval(updateInput, 2000);
  };

  this.stop = function() {
    window.clearInterval(interval);
    interval = false;
  };
}
