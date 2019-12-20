var counter = 100;

var speedMultiplier = 1
var distanceScaler = 1000;
var planetGravityScaler = 1;

particles = []
planets = []

var spawnParticles = true;

//perlin noise variables
var xr = 0.0;
var xg = 100.0;
var xb = 2000.0;

//arbitrary values
var iR = 1000;
var iB = 100;
var iG = 1;

//rate at which perlin noise function is looped through
var speed = 0.04;

function setup() {
  createCanvas(windowWidth, windowHeight)
  background(255)

  //this can be played around with, scale is between 1 and 4, fallout is from 0 to 1. (4, 1) gives a very washed out look. (2, 0.2) seems the best so far.
  noiseDetail(2, 0.2);

  // planets.push(new planet(400, 200, 10))
  // planets.push(new planet(600, 200, 10))
  // planets.push(new planet(500, 400, 10))

  particles.push(new particle(330, 200, 2, -7))
  particles.push(new particle(500, 100, 4, 6))

  for(var i = 0; i < 4; i++){
    planets.push(new planet(random(windowWidth - 400), random(windowHeight - 400), random(20)))
  }
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
  if(spawnParticles && counter % 10 == 0){
    particles.push(new particle(random(width), random(height), random(5), random(5)))
  }
  /*
  //perlin noise
  var rx = xr + iR;
  var gx = xg + iG;
  var bx = xb + iB;
  //change these values to tint the colour
  r = map(noise(rx, 1), 0, 1, 0, 255);
  g = map(noise(gx, 1), 0, 1, 0, 255);
  b = map(noise(bx, 1), 0, 1, 0, 255);

  xr += speed;
  xg += speed;
  xb += speed;
  */
}

function windowResized() {
  resizeCanvas(windowWidth -15, windowHeight - 200)
}

function mousePressed(){
    if(mouseButton === LEFT && counter % 1 == 0){
        let newParticle = new particle(mouseX, mouseY, random(5), random(5))
        particles.push(newParticle)
    }
}


function particle(x, y, velX, velY){
  this.position = createVector(x, y)
  this.velocity = createVector(velX, velY)
  this.acceleration = createVector(0, 0)
  this.maxSpeed = 5
  this.angle = 0

  this.trail = []

  this.lifetime = 0

  this.hitedge = -2
  this.destroy = false

  this.update = function(){
    var pos = createVector(this.position.x, this.position.y)
    this.trail.push(pos)
    this.velocity.add(this.acceleration)
    this.velocity.mult(speedMultiplier)
    this.velocity.limit(this.maxSpeed)

    this.position.add(this.velocity)
    this.acceleration.mult(0)
    this.lifetime ++
  }

  this.applyForce = function(force){
    if(force.mag() > 1000){
      this.destroy = true
    }
    this.acceleration.add(force)
  }

  this.display = function(){

  /*
  var angle = this.velocity.heading() + PI / 2
  push()
  translate(this.position.x, this.position.y)
  rotate(angle)
  fill(103, 47, 138)
  stroke(103, 47, 138)
  strokeWeight(1)
  beginShape()
  vertex(0, -5)
  vertex(-2.5, 5)
  vertex(2.5, 5)
  endShape(CLOSE)
  pop()

  */
  // if(this.trail.length > 1){
  //       let index = this.trail.length - 1
  //       stroke(100, 255, 100)
  //       line(this.position.x, this.position.y, this.trail[index].x, this.trail[index].y)
  // }
  if(this.hitedge > 0){
  let index = this.trail.length - 1
  //let c = color(r, g, b)
  //stroke(c)
  if(this.lifetime < 600){
    let c = color(128, 128, 128, 100)
    stroke(c);
  }
  else if(this.lifetime > 600 && this.lifetime < 1200){
    stroke(255, 100, 100)
  } else if(this.lifetime > 1200){
    push()
    stroke(100, 255, 100)
    strokeWeight(3)
    pop()
  }
  line(this.position.x, this.position.y, this.trail[index].x, this.trail[index].y)
  }
  this.hitedge ++
}

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
