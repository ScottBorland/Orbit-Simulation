var strengthToSizeScaler = 3;

function planet(x, y, z, strength, redrawn){
  this.position = createVector(x, y, z)
  this.strength = strength

  this.redrawn = redrawn
  if(!this.redrawn){
  this.r = Math.floor(random(255))
  this.g = Math.floor(random(255))
  this.b = Math.floor(random(255))
  this.data = []
  this.data.push(this.position)
  this.data.push(this.strength)
  this.data.push(this.colour)
  planetData.push(this.data)
}


  var geometry = new THREE.SphereGeometry(5, 32, 32);
  var material = new THREE.MeshBasicMaterial();
  material.color = new THREE.Color(`rgb(${this.r},${this.g},${this.b})`)

  this.sphere = new THREE.Mesh(geometry, material);

  scene.add(this.sphere);


  this.display = function(){
    // stroke(0)
    // fill(this.colour)
    // ellipseMode(CENTER)
    // ellipse(this.position.x, this.position.y, this.strength * strengthToSizeScaler)

    this.sphere.position.x = this.position.x;
    this.sphere.position.y = this.position.y;
    this.sphere.position.z = this.position.z;
    this.sphere.radius = this.strength;

  }
  this.applyGravity = function (){
    for(var i = 0; i < particles.length; i++){
      var dif = p5.Vector.sub(this.position, particles[i].position)
      var dist = dif.mag()
      if(dif.mag() < 20){
        particles[i].applyForce(createVector(1000, 1000))
      }else{

      var mag = distanceScaler * planetGravityScaler / (dist * dist)

      dif.setMag(mag)
      particles[i].applyForce(dif)
    }
    }
  }
}
