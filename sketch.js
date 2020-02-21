
var offset;

var counter = 100;

var speedMultiplier = 1
var distanceScaler = 1000
var sunGravityScaler = 1

planets = []
suns = []

sunData = []
planetData = []

var analysisMode = false

var spawnplanets = true

function setup() {
  createCanvas(1920, 1080)
  background(255)

  // suns.push(new sun(400, 200, 10))
  // suns.push(new sun(600, 200, 10))
  // suns.push(new sun(500, 400, 10))

  //planets.push(new planet(330, 200, 2, -7))
  //planets.push(new planet(500, 100, 4, 6))

  for(var i = 0; i < 2; i++){
    suns.push(new sun(random(200, windowWidth - 200), random(200, windowHeight-200), random(20), false))
  }
  offset = createVector(0, 0)
}

function draw() {
  background(255);
  // if(!analysisMode){
  //   //translate(width / 2, height / 2);
  //   scale(0.8)
  // }else{
  //   scale(0.8)
  // }

  for(var i = 0; i < planets.length; i++){
    if(planets[i].destroy){
      planets.splice(i, 1)
    }
  }

  for(var i = 0; i < planets.length; i++){
    planets[i].update()
    //planets[i].edges()
    //planets[i].display()
    planets[i].showAsCircle();
  }

  for(var i = 0; i < suns.length; i++){
    suns[i].display()
    suns[i].applyGravity()
  }
  counter++;
  if(counter > 100){
      counter = 0
  }
   if(spawnplanets && counter % 20 == 0 && planets.length < 7){
     planets.push(new planet(random(400, windowWidth -400), random(400, windowHeight -400), random(5), random(5), false))
   }
}

function mousePressed(){
  planets.push(new planet(mouseX, mouseY, random(10), random(10), false))
}

function windowResized() {
  resizeCanvas(windowWidth -15, windowHeight - 200)
}

function analyse(){
    analysisMode = true
    suns.splice(0, suns.length)
    planets.splice(0, planets.length)
    background(255)
    spawnplanets = false;
    for(var i = 0; i < sunData.length; i++){
      let newsun = new sun(sunData[i][0].x, sunData[i][0].y, sunData[i][1], true)
      suns.push(newsun)
      suns[i].colour = sunData[i][2]
    }
    planetWaitingList = []
    for(var i = 0; i < planetData.length; i++){
      let newplanet = new planet(planetData[i][0].x, planetData[i][0].y, planetData[i][1].x, planetData[i][1].y, true)
      planetWaitingList.push(newplanet)
    }
}

function keyPressed(){
    if(keyCode == 78 && analysisMode){
      background(255)
      //Add succesful planets one at a time:
      if(planetWaitingList.length > 3){
      planets.push(planetWaitingList[0])
      planets.push(planetWaitingList[1])
      planets.push(planetWaitingList[2])
      planetWaitingList.splice(0, 3)

      //Add all succesful planets at once
      // if(planetWaitingList.length > 1){
      //  planets.push(planetWaitingList[0])
      //  console.log(planets)
      //  planetWaitingList.splice(0, 1)
      // for(var i = 0; i < planetWaitingList.length; i++){
      //   planets.push(planetWaitingList[i]);
      // }
    }else{
      for(var i = 0; i < planetWaitingList.length; i++){
        planets.push(planetWaitingList[i]);
      }
      console.log("Empty waiting list")
    }
  }else if(keyCode == 82){
    analyse()
  }
}


function planet(x, y, velX, velY, redrawn){
  this.position = createVector(x, y)
  this.velocity = createVector(velX, velY)
  this.acceleration = createVector(0, 0)
  this.maxSpeed = 10
  this.angle = 0

  const randomColour = () => {
          var red = Math.floor(random(255))
          var green = Math.floor(random(255))
          var blue = Math.floor(random(255))
          var planetColour = color (red, green, blue)
          return planetColour
  }

  this.colour = randomColour();

  this.redrawn = redrawn

  if(!this.redrawn){
  this.logged = false
  this.data = []
  this.data.push(this.position)
  if(this.position.y < 100){
    console.log("bug")
  }
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
    //this.velocity.mult(speedMultiplier)
    //this.velocity.limit(this.maxSpeed)

    this.position.add(this.velocity)
    this.acceleration.mult(0)
    this.lifetime ++
  }

  this.applyForce = function(force){
    if(force.mag() > 100 || (force.mag() != 0 && force.mag() < 0.0008)){
      this.destroy = true
    }
    this.acceleration.add(force)
  }

  this.showAsCircle = function (){
    stroke(0);
    fill(this.colour);
    ellipse(this.position.x, this.position.y, 12)
    noFill();
    stroke(this.colour)
    beginShape();
    if(this.trail.length > 2000){
      this.trail.splice(0, 5)
    }
    for(var i = 0; i < this.trail.length; i++){
      var pos = this.trail[i];
      vertex(pos.x, pos.y);
      }
      endShape();

      if(this.lifetime > 2000 && this.logged == false){
        console.log("successful orbit")
        planetData.push(this.data)
        console.log(planetData)
        this.logged = true;
      }
  }

  this.display = function(){

  //translate(offset)
  if(this.trail.length > 1){
  let index = this.trail.length - 1
  if(this.redrawn){
    stroke(this.randomColour)
  }else{
    stroke(128, 128, 128, 50)
  }

  line(this.position.x, this.position.y, this.trail[index].x, this.trail[index].y)

  if(!this.redrawn){
  if(this.lifetime < 600){
    let c = color(128, 128, 128, 50)
    stroke(c);
  }
  else if(this.lifetime > 600 && this.lifetime < 1200){
    stroke(128, 128, 128, 100)
  } else if(this.lifetime > 1200 && this.lifetime < 2000){
    stroke(128, 128, 128, 200)
  }else if(this.lifetime > 5000){
    stroke(this.randomColour)
  }
  if(this.lifetime > 5000 && this.logged == false){
    console.log("successful orbit")
    planetData.push(this.data)
    console.log(planetData)
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
