function TransitionsChart(){
  var id = '#transitions',
    width = 600,
    barHeight = 20,
    data = getRandomData(50,15);

  var x = d3.scale.linear()
    .range([0, width]);

  var chart = d3.select(id)
    .attr('width', width);

  x.domain([0, d3.max(data, function(d) { return d; })]);

  chart.attr('height', barHeight * data.length);

  this.start = function () {

    var bar = chart.html('')
      .selectAll('g')
      .data(data)
      .enter()
      .append('g')
      .attr('transform', function(d, i) { return 'translate(0,' + i * barHeight + ')'; });

    bar.append('rect')
      .attr('width',0)
      .attr('height', barHeight - 1)
      .transition()
      .duration(600)
      .delay(function (d,i){ return 800 + i * 100;})
      .attr('width', function(d) { return x(d); });

    bar.append('text')
      .attr('class', 'barLabel')
      .attr('x', 0)
      .attr('y', barHeight / 2)
      .attr('dy', '.35em')
      .text(function(d) { return d; })
      .transition()
      .duration(600)
      .delay(function (d,i){ return 800 + i * 100;})
      .attr('x', function(d) { return x(d) - 3; });
  };
}