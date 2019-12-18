// Adapted from:
// https://github.com/mrdoob/three.js/blob/dev/examples/webgl_interactive_cubes_gpu.html


function loadFile(filePath) {
  var result = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", filePath, false);
  xmlhttp.send();
  if (xmlhttp.status==200) {
    result = xmlhttp.responseText;
  }
  return result;
}

hash = document.location.hash

max = 0
min = 0
var values = null

if (hash == "#angles") {
  values = loadFile("https://raw.githubusercontent.com/mousebaiker/integral-visualization/master/docs/angles.txt")
  values = values.split('\n').slice(0, 8000)
  max = 0
  min = values[0]
  for (i = 0; i < values.length; i++) {
    values[i] = parseFloat(values[i]);
    if (values[i] > max) {
      max = values[i];
    }
    if (values[i] < min) {
      min = values[i];
    }
  }
} else {
  values = loadFile("https://raw.githubusercontent.com/mousebaiker/integral-visualization/master/docs/abses.txt")
  values = values.split('\n').slice(0, 8000)
  max = 0
  min = 0
  for (i = 0; i < values.length; i++) {
    values[i] = parseFloat(values[i]);
    if (values[i] > max) {
      max = values[i];
    }
  }
}





var camera, scene, renderer;
var geometry, material, mesh;

init();
animate();


var mouse = new THREE.Vector2();
var offset = new THREE.Vector3( 10, 10, 10 );

function init() {
				container = document.getElementById( "container" );
				camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
				camera.position.z = 1000;
				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xCCCCCC );
				scene.add( new THREE.AmbientLight( 0x555555 ) );
				var light = new THREE.SpotLight( 0xffffff, 1.5 );
				light.position.set( 0, 500, 2000 );
        scene.add( light );

        var spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( 0, -500, -2000);

				scene.add( spotLight );
				var defaultMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true, vertexColors: THREE.VertexColors, shininess: 0	} );
				function applyVertexColors( geometry, color ) {
					var position = geometry.attributes.position;
					var colors = [];
					for ( var i = 0; i < position.count; i ++ ) {
						colors.push( color.r, color.g, color.b );
					}
					geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
				}
				var geometriesDrawn = [];
				var matrix = new THREE.Matrix4();
				var quaternion = new THREE.Quaternion();
				var color = new THREE.Color();
				for ( var i = 0; i < 20; i ++ ) {
          for (var j = 0; j < 20; j++) {
            for (var k = 0; k < 20; k++) {
              var geometry = new THREE.BoxBufferGeometry();
              var position = new THREE.Vector3();
              position.x = 22 * (i - 11);
              position.y = 22 * (j - 11);
              position.z = 22 * (k - 11);
              var rotation = new THREE.Euler();
              rotation.x = Math.random() * 2 * Math.PI;
              rotation.y = Math.random() * 2 * Math.PI;
              rotation.z = Math.random() * 2 * Math.PI;
              var scale = new THREE.Vector3();
              scale.x =  10;
              scale.y =  10;
              scale.z =  10;
              quaternion.setFromEuler( rotation );
              matrix.compose( position, quaternion, scale );
              geometry.applyMatrix( matrix );
              // give the geometry's vertices a random color, to be displayed

              absy = (values[i * 400 + j * 20 + k] - min) / (max - min);
              applyVertexColors( geometry, color.setHex(0x1f81f2).lerpHSL(new THREE.Color(0xff0000), absy));
              geometriesDrawn.push( geometry );
              geometry = geometry.clone();
              // give the geometry's vertices a color corresponding to the "id"

            }
          }
        }

				var objects = new THREE.Mesh( THREE.BufferGeometryUtils.mergeBufferGeometries( geometriesDrawn ), defaultMaterial );
				scene.add( objects );

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );
				controls = new THREE.TrackballControls( camera, renderer.domElement );
				controls.rotateSpeed = 1.0;
				controls.zoomSpeed = 1.2;
				controls.panSpeed = 0.8;
				controls.noZoom = false;
				controls.noPan = false;
				controls.staticMoving = true;
				controls.dynamicDampingFactor = 0.3;
				renderer.domElement.addEventListener( 'mousemove', onMouseMove );
}

function onMouseMove( e ) {
	mouse.x = e.clientX;
	mouse.y = e.clientY;
}

function animate() {

	requestAnimationFrame( animate );

  controls.update();
	renderer.render( scene, camera );

}
