function UpdateChart(){
  let interval;

  const width = 600,
    barHeight = 15,
    maxDataCount = 20;

  var x = d3.scaleLinear()
    .range([0, width]);

  var chart = d3.select('#update')
    .html('')
    .attr('width', width)
    .attr('height', maxDataCount * barHeight);

  var text = d3.select('#updateArray');

  this.update = function () {
    var dataLength = getRandomNumber(maxDataCount);
    var data = getRandomData(50, dataLength);
    var t = 1000;

    x.domain([0, d3.max(data, function(d) { return d; })]);

    var bar = chart.selectAll('rect').data(data);

    bar.exit()
      .transition('exitFill')
      .style('fill','tomato')
      .transition('exitRemove')
      .delay(t)
      .remove();

    bar.transition('updateWidth')
      .delay((d, i) => i * 30)
      .attr('width', d => x(d))
      .transition('updateFill')
      .delay((d, i) => t - i * 30)
      .style('fill','#aaa');

    bar.enter()
      .append('rect')
      .attr('height', barHeight - 2)
      .attr('width',0)
      .attr('x', x(0))
      .attr('y', (d, i) => i * barHeight)
      .style('fill','steelblue')
      .transition('updateWidth')
      .delay((d, i) => i * 30)
      .attr('width', d => x(d))
      .transition('updateFill')
      .delay((d, i) => t - i * 30)
      .style('fill','#aaa');

    text.text('['+data.join(',')+']');
  };

  this.start = function() {
    this.update();
    interval = window.setInterval(this.update, 2000);
  };

  this.stop = function() {
    window.clearInterval(interval);
  };
}