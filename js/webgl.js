function WebGLDemo() {
  let req;

  //SET UP SCENE & CAMERA
  var scene;
  var camera;

  //SET UP SHAPES & MATERIAL
  var geometry;
  var material;
  var mesh;
  /* 
    add geomerty and material to mesh.
    mesh(geomerty, matrial)
  */

  //RENDER THE SCENE
  var renderer;

  init();

  function init() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000); /* 10000 the vanishing point(how far you can see) */

    //x,y,z. increase the camera height on the y axis
    camera.position.set(0, 5, 0);

    //looks in the center of the scene since that where we always start when creating a scene. 0,0,0
    camera.lookAt(scene.position);

    //set size to full screen
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    //add to the DOM
    renderer.domElement.classList.add('fullscreen');
    renderer.domElement.id = 'webgl-demo';
    renderer.domElement.style.opacity = 0;
    document.body.prepend(renderer.domElement);

    //increase the steps to make squares bigger. must be divisible by the size
    var size = 20,
      steps = 2;

    geometry = new THREE.Geometry();
    material = new THREE.LineBasicMaterial({
      color: 'teal'
    });

    for (var i = -size; i <= size; i += steps) {
      //draw lines one way
      geometry.vertices.push(new THREE.Vector3(-size, -0.04, i));
      geometry.vertices.push(new THREE.Vector3(size, -0.04, i));

      //draw lines the other way
      geometry.vertices.push(new THREE.Vector3(i, -0.04, -size));
      geometry.vertices.push(new THREE.Vector3(i, -0.04, size));
    }

    //THREE.LinePieces prevents connecting of vertices
    var line = new THREE.Line(geometry, material, THREE.LinePieces);

    scene.add(line);

    const boxes = [
      { color: 'rgb(195, 26, 118)', x: -1.5, height: 3 },
      { color: 'rgb(241, 147, 32)', x: -0.5, height: 2.1 },
      { color: 'rgb(157, 225, 30)', x: 0.5, height: 1.5 },
      { color: 'rgb(28, 107, 154)', x: 1.5, height: 1 },
    ];
    boxes.forEach(box => {
      var geometry = new THREE.BoxGeometry( 1, box.height, 1 );
      var material = new THREE.MeshLambertMaterial({
        color: box.color
      });
      var cube = new THREE.Mesh( geometry, material );
      cube.position.x = box.x;
      cube.position.y = box.height / 2;
      scene.add( cube );
    });

    // SPOTLIGHT
    var spotLight1 = new THREE.DirectionalLight(0xffffff);
    spotLight1.position.set(10, 12, 12);
    scene.add(spotLight1);
    var spotLight2 = new THREE.SpotLight(0xffffff);
    spotLight2.position.set(-3, -3, -3);
    scene.add(spotLight2);

    //always render the scene
    render();
  }

  function animate() {
    req = requestAnimationFrame(animate);
    render();
  }

  //resize viewport
  window.addEventListener('resize', function(){
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize( width, height);

    camera.aspect = width / height; 
    camera.updateProjectionMatrix();
  });

  function render() {
    //using timer as animation
    var speed = Date.now() * 0.0005;
    camera.position.x = Math.cos(speed) * 10;
    camera.position.z = Math.sin(speed) * 10;

    camera.lookAt(scene.position); //0,0,0
    renderer.render(scene, camera);
  }

  this.start = function() {
    animate();
    renderer.domElement.style.opacity = 1;
  };

  this.stop = function() {
    renderer.domElement.style.opacity = 0;
    cancelAnimationFrame(req);
    req = false;
  };
}