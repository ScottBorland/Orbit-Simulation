var worldCamera

var counter = 100;

var speedMultiplier = 1
var distanceScaler = 1000
var planetGravityScaler = 1

particles = []
planets = []

planetData = []
particleData = []

var analysisMode = false

var spawnParticles = true

//perlin noise variables
var xr = 0.0
var xg = 100.0
var xb = 2000.0

//arbitrary values
var iR = 1000
var iB = 100
var iG = 1

//rate at which perlin noise function is looped through
var speed = 0.04

function setup() {
  createCanvas(windowWidth, windowHeight)
  background(255)

  //worldCamera = new Camera()

  //this can be played around with, scale is between 1 and 4, fallout is from 0 to 1. (4, 1) gives a very washed out look. (2, 0.2) seems the best so far.
  noiseDetail(2, 0.2)

  // planets.push(new planet(400, 200, 10))
  // planets.push(new planet(600, 200, 10))
  // planets.push(new planet(500, 400, 10))

  //particles.push(new particle(330, 200, 2, -7))
  //particles.push(new particle(500, 100, 4, 6))

  for(var i = 0; i < 3; i++){
    planets.push(new planet(random(400, windowWidth - 400), random(400, windowHeight-400), random(20), false))
  }
}

function draw() {
  //translate(-worldCamera.pos.x, -worldCamera.pos.y);
  //worldCamera.draw();

  //camera(0, 0, 20 + sin(frameCount * 0.01) * 10, 0, 0, 0, 0, 1, 0);

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
    particles.push(new particle(random(400, width-400), random(400, height-400), random(5), random(5), false))
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
  translate(planets[0].x, planets[0].y)
  scale(0.5)
}

function windowResized() {
  resizeCanvas(windowWidth -15, windowHeight - 200)
}

/*function mouseDragged(){
    if(mouseButton === LEFT && counter % 1 == 0){
        let newParticle = new particle(mouseX, mouseY, random(5), random(5))
        particles.push(newParticle)
    }
}*/

function mousePressed(){
  if(mouseButton === LEFT){
    analysisMode = true
    planets.splice(0, planets.length)
    particles.splice(0, particles.length)
    background(51)
    spawnParticles = false;
    for(var i = 0; i < planetData.length; i++){
      let newPlanet = new planet(planetData[i][0].x, planetData[i][0].y, planetData[i][1], true)
      planets.push(newPlanet)
      planets[i].colour = planetData[i][2]
    }
    particleWaitingList = []
    for(var i = 0; i < particleData.length; i++){
      let newParticle = new particle(particleData[i][0].x, particleData[i][0].y, particleData[i][1].x, particleData[i][1].y, true)
      particleWaitingList.push(newParticle)
    }
  }
}

function keyPressed(){
    if(keyCode == UP_ARROW && analysisMode){
      background(51)
      planets.splice(0, planets.length)
      particles.splice(0, particles.length)
      for(var i = 0; i < planetData.length; i++){
        let newPlanet = new planet(planetData[i][0].x, planetData[i][0].y, planetData[i][1], true)
        planets.push(newPlanet)
        planets[i].colour = planetData[i][2]
      }
      if(particleWaitingList.length > 1){
      particles.push(particleWaitingList[0])
      particleWaitingList.splice(0, 1)
    }
    }
}


function particle(x, y, velX, velY, redrawn){
  this.position = createVector(x, y)
  this.velocity = createVector(velX, velY)
  this.acceleration = createVector(0, 0)
  this.maxSpeed = 10
  this.angle = 0

  this.redrawn = redrawn

  if(!this.redrawn){
  this.logged = false
  this.data = []
  this.data.push(this.position)
  this.data.push(this.velocity)
  }else{
    this.logged = true
  }

  this.trail = []
  this.randomColour = color(random(255), random(255), random(255))

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
    if(force.mag() > 100 || (force.mag() != 0 && force.mag() < 0.0003)){
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
  if(this.trail.length > 1){
  let index = this.trail.length - 1
  if(this.redrawn){
    stroke(this.randomColour)
  }else{
    stroke(128, 128, 128, 50)
  }

  line(this.position.x, this.position.y, this.trail[index].x, this.trail[index].y)
  //let c = color(r, g, b)
  //stroke(c)
  if(!this.redrawn){
  if(this.lifetime < 600){
    let c = color(128, 128, 128, 50)
    stroke(c);
  }
  else if(this.lifetime > 600 && this.lifetime < 1200){
    stroke(128, 128, 128, 100)
  } else if(this.lifetime > 1200 && this.lifetime < 2000){
    stroke(128, 128, 128, 200)
  }else if(this.lifetime > 2000){
    stroke(this.randomColour)
  }
  if(this.lifetime > 5000 && this.logged == false){
    console.log("successful orbit")
    particleData.push(this.data)
    this.logged = true;
  }
  line(this.position.x, this.position.y, this.trail[index].x, this.trail[index].y)
}else{
  stroke(this.randomColour)
    }
  }
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

class Camera {

  constructor() {
    this.pos = createVector(0, 0);
  }

    draw() {
    //I used the mouse to move the camera
    //The mouse's position is always relative to the screen and not the camera's position
    //E.g. if the mouse is at 1000,1000 then the mouse's position does not add 1000,1000 to keep up with the camera
    //if (mouseX < 100) pos.x-=5;
    //else if (mouseX > width - 100) pos.x+=5;
    // if (mouseY < 100) pos.y-=5;
    //else if (mouseY > height - 100) pos.y+=5;
    //I noticed on the web the program struggles to find the mouse so I made it key pressed
    if (keyPressed) {
      if (key == 'w') this.pos.y -= 5;
      if (key == 's') this.pos.y += 5;
      if (key == 'a') this.pos.x -= 5;
      if (key == 'd') this.pos.x += 5;
    }
  }
}
