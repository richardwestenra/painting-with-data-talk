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

  function getRandomNumber(max) {
    return Math.ceil( Math.random() * max );
  }

  function getRandomData(max, len){
    var arr = [];
    for (var i=0; i<len; i++) {
      arr.push( getRandomNumber(max) );
    }
    return arr;
  }



  // Make some charts

  function InkChart(){

    var id = '#ink',
      margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 700 - margin.left - margin.right,
      height = 415 - margin.top - margin.bottom,
      alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
      data = getRandomData(50,alphabet.length);

    var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .4)
      .domain(alphabet);

    var y = d3.scale.linear()
      .range([height, 0])
      .domain([0, d3.max(data)]);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .tickPadding(6)
      .tickSize(-height);

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .tickSize(-width)
      .tickPadding(7);

    var svg = d3.select(id)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    this.start = function(){

      svg.selectAll('*').remove();

      svg.append('image')
        .attr('xlink:href','img/cat.jpg')
        .attr('width', width)
        .attr('height', height);

      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

      svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

      svg.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', function(d,i) { return x(alphabet[i]); })
        .attr('width', x.rangeBand())
        .attr('y', height)
        .attr('height', 0)
        .transition()
        .duration(600)
        .delay(function(d,i) { return 900 + i*100; })
        .attr('y', function(d) { return y(d); })
        .attr('height', function(d) { return height - y(d); });

      svg.append('text')
        .text('Don\'t do this')
        .attr('x',width - margin.right)
        .attr('y',margin.top * 2)
        .style({
          'text-anchor':'end',
          'font-size': '26px',
          'fill': '#fff',
          'text-shadow': '0 0 8px rgba(0,0,0,0.5)'
        });
    };
  }



  function TransChart(){

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



  function UpdateChart(){

    var id = '#update',
      width = 600,
      barHeight = 20,
      max = 15;

    var x = d3.scale.linear()
      .range([0, width]);

    var chart = d3.select(id)
      .html('')
      .attr('width', width)
      .attr('height', max * barHeight);


    this.update = function () {
      var dataLength = getRandomNumber(max);
      var data = getRandomData(50, dataLength);
      var t = 1000;

      d3.select('#updateArray').text('['+data.join(',')+']');

      x.domain([0, d3.max(data, function(d) { return d; })]);

      var bar = chart.selectAll('rect')
        .data(data);

      bar.exit()
        .transition()
        .style('fill','#ff5a00')
        .transition()
        .delay(t)
        .remove();

      bar.enter()
        .append('rect')
        .attr('width',0)
        .attr('height', barHeight - 1)
        .attr('x',x(0))
        .attr('y',function(d, i) { return i * barHeight;});

      bar.transition()
        .attr('width', function(d) { return x(d); })
        .transition()
        .delay(t)
        .style('fill','#777');

    };

  }



  function ScaleChart(){

    var id = '#range',
      w = 400,
      h = 30;

    var x = d3.scale.linear()
      .domain([20, 60])
      .range([0, w]);

    var svg = d3.select(id)
      .attr('width', w)
      .attr('height', h);

    svg.append('rect')
      .style('fill','#ddd')
      .attr('width', w)
      .attr('height', h)
      .attr('x', 0)
      .attr('y', 0);

    var bar  = svg.append('rect')
      .attr('width', 0)
      .attr('height', h)
      .attr('x', 0)
      .attr('y', 0);

    var input = d3.select('#input');
    var output = d3.select('#output');

    function update(d){
      bar.transition().attr('width',x(d));
      input.text(d);
      output.text( Math.round( x(d) ) );
    }

    update(40)

    d3.select('#domain').on('change',function (){
      update(this.value);
    });
  }



  function GeoChart(){

    var width = 800,
      height = 600,
      rotation = [-11, 0],
      scale = 120,
      translation = [width/2, height/1.8];

    var proj = {
      mercator: d3.geo.mercator(),
      equirectangular: d3.geo.equirectangular(),
      azimuthalEqualArea: d3.geo.azimuthalEqualArea(),
      azimuthalEquidistant: d3.geo.azimuthalEquidistant(),
      conicEqualArea: d3.geo.conicEqualArea(),
      conicConformal: d3.geo.conicConformal(),
      conicEquidistant: d3.geo.conicEquidistant(),
      orthographic: d3.geo.orthographic(),
      stereographic: d3.geo.stereographic(),
      transverseMercator: d3.geo.transverseMercator()
    };

    var current = 'mercator';


    var svg = d3.select('#map')
      .attr('width', width)
      .attr('height', height);

    var projection = proj[current]
      .rotate(rotation)
      .scale(scale)
      .translate(translation);

    var geo, path, iss, issText;

    function long(d) { return projection([d.longitude,d.latitude])[0]; }
    function lat(d) { return projection([d.longitude,d.latitude])[1]; }

    d3.json('js/world-110m.json', function(error, world) {
      if (error) { return console.error(error); }

      var worldData = topojson.feature(world, world.objects.countries);

      geo = d3.geo.path()
        .projection(projection);

      path = svg.append('path')
        .datum(worldData)
        .attr('d', geo);

      var issW = 550.2 * 0.7,
        issH = 34.158 * 0.7;

      iss = svg.append('svg:image')
        .attr('xlink:href','img/iss.svg')
        .attr('transform','translate('+(issW/-2)+',' + (issH/-2) + ')')
        .attr('width',issW)
        .attr('height',issH)
        .attr('opacity',0);

      issText = svg.append('text')
        .attr('x', width/2)
        .attr('y', height - 10)
        .style({
          'text-anchor':'middle',
          'font-size': '18px',
          'fill': '#333',
          'text-shadow': '0 0 8px rgba(255,255,255,0.3)'
        });

    });

    svg.on('mousemove',function (){
      projection.rotate( d3.mouse(this) );
      path.attr('d', geo);
      iss.attr('x', long).attr('y', lat);
    });

    var mapButtons =  d3.select('#mapButtons');

    var button = mapButtons.selectAll('button')
      .data( d3.keys(proj) )
      .enter()
      .append('button')
      .text(function (d){ return d; })
      .on('click',function (e){
        current = d3.select(this).text();
        button.style({'background':''});
        d3.select(this).style({'background':'#444'});

        projection = proj[current]
          .rotate(rotation)
          .scale(scale)
          .translate(translation);

        geo.projection(projection);

        path.transition().attr('d', geo);
        iss.transition().attr('x', long).attr('y', lat);
      });

    button.filter(function (d,i){ return i===0; })
      .style({'background':'#444'});


    function getISSLocation(callback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET','https://api.wheretheiss.at/v1/satellites/25544');
      xhr.addEventListener('load',function(){
        if (this.status == 200) {
          var response = JSON.parse(this.responseText);
          callback(response);
        }
      });
      xhr.send();
    }



    this.updateISS = function(){
      getISSLocation(function(d){

        issText.text('Current ISS location: ('+d.latitude+', '+d.longitude+')');

        iss.datum(d)
          .attr('x', long)
          .attr('y', lat)
          .attr('opacity',1);
      });
    };

    this.updateISS();

  }




  function ForceChart(){

    // http://blog.thomsonreuters.com/index.php/mobile-patent-suits-graphic-of-the-day/
    var links = [
      {source: 'Microsoft', target: 'Amazon', type: 'licensing'},
      {source: 'Microsoft', target: 'HTC', type: 'licensing'},
      {source: 'Samsung', target: 'Apple', type: 'suit'},
      {source: 'Motorola', target: 'Apple', type: 'suit'},
      {source: 'Nokia', target: 'Apple', type: 'resolved'},
      {source: 'HTC', target: 'Apple', type: 'suit'},
      {source: 'Kodak', target: 'Apple', type: 'suit'},
      {source: 'Microsoft', target: 'Barnes & Noble', type: 'suit'},
      {source: 'Microsoft', target: 'Foxconn', type: 'suit'},
      {source: 'Oracle', target: 'Google', type: 'suit'},
      {source: 'Apple', target: 'HTC', type: 'suit'},
      {source: 'Microsoft', target: 'Inventec', type: 'suit'},
      {source: 'Samsung', target: 'Kodak', type: 'resolved'},
      {source: 'LG', target: 'Kodak', type: 'resolved'},
      {source: 'RIM', target: 'Kodak', type: 'suit'},
      {source: 'Sony', target: 'LG', type: 'suit'},
      {source: 'Kodak', target: 'LG', type: 'resolved'},
      {source: 'Apple', target: 'Nokia', type: 'resolved'},
      {source: 'Qualcomm', target: 'Nokia', type: 'resolved'},
      {source: 'Apple', target: 'Motorola', type: 'suit'},
      {source: 'Microsoft', target: 'Motorola', type: 'suit'},
      {source: 'Motorola', target: 'Microsoft', type: 'suit'},
      {source: 'Huawei', target: 'ZTE', type: 'suit'},
      {source: 'Ericsson', target: 'ZTE', type: 'suit'},
      {source: 'Kodak', target: 'Samsung', type: 'resolved'},
      {source: 'Apple', target: 'Samsung', type: 'suit'},
      {source: 'Kodak', target: 'RIM', type: 'suit'},
      {source: 'Nokia', target: 'Qualcomm', type: 'suit'}
    ];

    var nodes = {};

    // Compute the distinct nodes from the links.
    links.forEach(function(link) {
      link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
      link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
    });

    var width = 700,
        height = 500;

    var force = d3.layout.force()
      .nodes(d3.values(nodes))
      .links(links)
      .size([width, height])
      .linkDistance(60)
      .charge(-300)
      .on('tick', tick)
      .start();

    var svg = d3.select('#force')
      .attr('width', width)
      .attr('height', height);

    var path, circle, text;

    // Use elliptical arc path segments to doubly-encode directionality.
    function tick() {
      path.attr('d', linkArc);
      circle.attr('transform', transform);
      text.attr('transform', transform);
    }

    function linkArc(d) {
      var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr = Math.sqrt(dx * dx + dy * dy);
      return 'M' + d.source.x + ',' + d.source.y + 'A' + dr + ',' + dr + ' 0 0,1 ' + d.target.x + ',' + d.target.y;
    }

    function transform(d) {
      return 'translate(' + d.x + ',' + d.y + ')';
    }

    svg.selectAll('*').remove();

    // Per-type markers, as they don't inherit styles.
    svg.append('defs')
      .selectAll('marker')
      .data(['suit', 'licensing', 'resolved'])
      .enter()
      .append('marker')
      .attr('id', function(d) { return d; })
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 15)
      .attr('refY', -1.5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5');

    path = svg.append('g')
      .selectAll('path')
      .data(force.links())
      .enter()
      .append('path')
      .attr('class', function(d) { return 'link ' + d.type; })
      .attr('marker-end', function(d) { return 'url(#' + d.type + ')'; });

    circle = svg.append('g')
      .selectAll('circle')
      .data(force.nodes())
      .enter()
      .append('circle')
      .attr('r', 6)
      .call(force.drag);

    text = svg.append('g')
      .selectAll('text')
      .data(force.nodes())
      .enter()
      .append('text')
      .attr('x', 8)
      .attr('y', '.31em')
      .text(function(d) { return d.name; });
  }




  function ForceChart2(){

    var width = 600,
      height = 400;

    var nodes = d3.range(200).map(function() { return {radius: Math.random() * 7 + 3}; }),
      root = nodes[0],
      color = d3.scale.category10();

    root.radius = 0;
    root.fixed = true;

    var force = d3.layout.force()
      .gravity(0.05)
      .charge(function(d, i) { return i ? 0 : -300; })
      .nodes(nodes)
      .size([width, height]);

    force.start();

    var svg = d3.select('#force2')
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();

    svg.selectAll('circle')
      .data(nodes.slice(1))
      .enter().append('circle')
      .attr('r', function(d) { return d.radius; })
      .style('fill', function(d, i) { return color(i % 3); });

    force.on('tick', function(e) {
      var q = d3.geom.quadtree(nodes),
        i = 0,
        n = nodes.length;

      while (++i < n) q.visit(collide(nodes[i]));

      svg.selectAll('circle')
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; });
    });

    svg.on('mousemove', function() {
      var p1 = d3.mouse(this);
      root.px = p1[0];
      root.py = p1[1];
      force.resume();
    });


    d3.select('#gravity').on('change',function (){
      force.gravity(this.value).start();
      d3.select('#gravityVal').text(this.value);
    });

    d3.select('#charge').on('change',function (){
      force.charge(function(d, i) { return i ? this.value : -500; }.bind(this))
        .start();
      d3.select('#chargeVal').text(this.value);
    });

    d3.select('#friction').on('change',function (){
      force.friction(this.value).start();
      d3.select('#frictionVal').text(this.value);
    });

    function collide(node) {
      var r = node.radius + 16,
      nx1 = node.x - r,
      nx2 = node.x + r,
      ny1 = node.y - r,
      ny2 = node.y + r;
      return function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== node)) {
          var x = node.x - quad.point.x,
            y = node.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = node.radius + quad.point.radius;
          if (l < r) {
            l = (l - r) / l * .5;
            node.x -= x *= l;
            node.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      };
    }
  }



  // Get some adjectives

  var i = 0;
  var arr = ['delightful','dank','diabolical','daffy','dubious','desirable','delicious','dependable','docile','dramatic','diverse','dreamy','deluxe','deceitful','disruptive','dauntless','deft','dynamic','dainty','decisive','dazzling','dastardly','decent','decorative','decadent','dicey'];

  function getNewAdjective(){
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


  // Init
  // var ic = new InkChart();
  // var uc = new UpdateChart();
  // var tc = new TransChart();
  // var sc = new ScaleChart();
  // var gc = new GeoChart();
  // var fc = new ForceChart();

  startInterval(getNewAdjective, 500);

  Reveal.addEventListener('slidechanged', function(e) {
    var id = e.currentSlide.getAttribute('data-id');

    stopInterval();

    switch (id) {
      // case 'ink':
      //   ic.start();
      //   break;
      case 'title':
        startInterval(getNewAdjective, 500);
        break;
      // case 'update':
      //   setTimeout(function(){
      //     uc.update();
      //     startInterval(uc.update, 2000);
      //   }, 600);
      //   break;
      // case 'transitions':
      //   tc.start();
      //   break;
      // case 'map':
      //   startInterval(gc.updateISS,5000);
      //   break;
      // case 'force':
      //   setTimeout(function(){
      //     new ForceChart();
      //   }, 600);
      // case 'force2':
      //   setTimeout(function(){
      //     new ForceChart2();
      //   }, 600);
      //   break;
    }
  });

})();
