var worldCamera
var offset;

var counter = 100;

var speedMultiplier = 1
var distanceScaler = 1000
var planetGravityScaler = 1

particles = []
planets = []

planetData = []
particleData = []

var universeSizeX = 400;
var universeSizeY = 400;
var universeSizeZ = 400;

var analysisMode = false

var spawnParticles = true

let scene, camera, renderer, sphere, controls;

function init(){
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({antialias: true});

  var light = new THREE.AmbientLight( 0x404040 ); // soft white light
  scene.add( light );

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls( camera, renderer.domElement );

  //scene.background = new THREE.Color("rgb(255, 255, 255)");

  camera.position.z = 100;
  controls.enableKeys = true;
  controls.keys = {
	LEFT: 37, //left arrow
	UP: 38, // up arrow
	RIGHT: 39, // right arrow
	BOTTOM: 40 // down arrow
  }
  controls.zoomSpeed = 2.5;
  controls.keyPanSpeed = 25;
  controls.update();
}

window.addEventListener('resize', onWindowResize, false);

init();
animate();

function animate(){
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
  renderer.setClearColor( 0xffffff );
}

function setup() {

   planets.push(new planet(40, 80, 50, 10))
   planets.push(new planet(60, 200, 100, 10))
   planets.push(new planet(50, 400, 20, 10))

  particles.push(new particle(330, 200, 100, 0, 0, 0))
  particles.push(new particle(500, 100, 4, 0, 0, 0))
}

function draw() {

  for(var i = 0; i < particles.length; i++){
    if(particles[i].destroy){
      particles.splice(i, 1)
    }
  }

  for(var i = 0; i < particles.length; i++){
    particles[i].update()
    //particles[i].edges()
    particles[i].display()
  }

  for(var i = 0; i < planets.length; i++){
    planets[i].display()
    planets[i].applyGravity()
  }
  counter++;
  if(counter > 100){
      counter = 0
  }
  if(spawnParticles && counter % 3 == 0){
    particles.push(new particle(random(-universeSizeX, universeSizeX), random(-universeSizeY, universeSizeY), random(-universeSizeZ, universeSizeZ), random(-5, 5), random(-5, 5), random(-5, 5)))
  }
}

function onWindowResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function particle(x, y, z, velX, velY, velZ, redrawn){
  this.position = createVector(x, y, z)
  this.velocity = createVector(velX, velY, velZ)
  this.acceleration = createVector(0, 0, 0)
  this.maxSpeed = 10
  this.angle = 0

  this.newLine = false;

  // this.redrawn = redrawn
  //
  // if(!this.redrawn){
  // this.logged = false
  // this.data = []
  // this.data.push(this.position)
  // if(this.position.y < 100){
  //   console.log("bug")
  // }
  // this.data.push(this.velocity)
  // }else{
  //   this.logged = true
  // }

  this.trail = []
  this.randomColour = createVector(Math.floor(random(255)), Math.floor(random(255)), Math.floor(random(255)))

  this.lifetime = 0

  this.hitedge = -2
  this.destroy = false

  this.update = function(){
    var pos = createVector(this.position.x, this.position.y, this.position.z)
    this.trail.push(pos)
    this.velocity.add(this.acceleration)
    this.velocity.mult(speedMultiplier)
    this.velocity.limit(this.maxSpeed)

    this.position.add(this.velocity)
    if(this.velocity.mag() > 0){
          this.newLine = true;
        }else{
          this.newLine = false;
        }
    this.acceleration.mult(0)
    this.lifetime ++
  }

  this.applyForce = function(force){
    if(force.mag() > 100 || (force.mag() != 0 && force.mag() < 0.0008)){
      this.destroy = true
    }
    this.acceleration.add(force)
  }

  const generateColor = (forceMag = createVector(this.velocity.mag(), this.velocity.mag())) => {
          forceMag.setMag(0.91);
          console.log(forceMag);
            const rgbArray = [
                100 * Math.pow(forceMag.x + 0.2, 8),
                60,
                100 * Math.pow(forceMag.y + 0.2, 8)
            ]
            const [red, green, blue] = rgbArray.map(value => Math.round(value))
            var particleColour = color (red, green, blue)
            return `rgb(${red},${green},${blue})`
            }

  this.display = function(){
    if(this.destroy){
      var selectedObject = scene.getObjectByName(objName);
        scene.remove( selectedObject );
    }
    if(this.destroy == false && this.newLine){
        if(this.trail.length > 1){
        if(counter % 1 == 0){
        let index = this.trail.length - 1;

        var material = new THREE.LineBasicMaterial({color: color});

        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(this.position.x, this.position.y, this.position.z));
        geometry.vertices.push(new THREE.Vector3(this.trail[index].x, this.trail[index].y, this.trail[index].z));
        this.line = new THREE.Line(geometry, material);

        this.line.material.color = new THREE.Color(generateColor());
        //this.line.material.needsUpdate = true;
        scene.add(this.line);
        }
      }
    }

  // if(this.redrawn){
  //   stroke(this.randomColour)
  // }else{
  //   stroke(128, 128, 128, 50)
  // }



//   if(!this.redrawn){
//   if(this.lifetime < 600){
//     let c = color(128, 128, 128, 50)
//     stroke(c);
//   }
//   else if(this.lifetime > 600 && this.lifetime < 1200){
//     stroke(128, 128, 128, 100)
//   } else if(this.lifetime > 1200 && this.lifetime < 2000){
//     stroke(128, 128, 128, 200)
//   }else if(this.lifetime > 5000){
//     stroke(this.randomColour)
//   }
//   if(this.lifetime > 5000 && this.logged == false){
//     console.log("successful orbit")
//     particleData.push(this.data)
//     console.log(particleData)
//     this.logged = true;
//   }
//   line(this.position.x, this.position.y, this.trail[index].x, this.trail[index].y)
// }else{
//   stroke(this.randomColour)
//     }
//   }

  this.edges = function(){
       if(this.position.x > width){
           this.hitedge = -2
           this.position.x = 0
       } else if (this.position.x < 0){
          this.hitedge = -2
           this.position.x = width
       }

       if(this.position.y > height){
           this.position.y = 0
           this.hitedge = -2
       } else if (this.position.y < 0){
           this.position.y = height
           this.hitedge = -2
       }
    }
  }
}
