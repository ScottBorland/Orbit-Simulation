
var counter = 0
//
//
// particles = []
planets = []
majorPlanets = []

planetData = []

var offset;
var planetToFocus = 0

var zoom = 1.00;
var zMin = 0.005;
var zMax = 9.00;
var sensitivity = 0.0002;

var universeSize = 5000;

function setup() {
  frameRate(200)
  createCanvas(1920, 1080)
  background(100)
  ellipse(0, 0, 10)
  offset = createVector(width / 2, height / 2);

  majorPlanets.push(new planet(width / 2, height / 2, 0, 0, 200))
  majorPlanets[0].massToSizeScalerIndividual = 1

  for(var i = 0; i < 100; i++){
    planets.push(new planet(random(200, width - 200), random(200, height-200), random(-0.5, 0.5), random(-0.5, 0.5), random(20), false))
  }
}

function spawnPlanet(){
  //planets.push(new planet(random(200, windowWidth - 200), random(200, windowHeight-200), random(-5, 5), random(-5, 5), random(20)))
  //planets.push(new planet(random(-universeSize, universeSize), random(-universeSize, universeSize), random(-5, 5), random(-5, 5), random(20)))
  planets.push(new planet(random(-universeSize, universeSize), random(-universeSize, universeSize), random(-5, 5), random(-5, 5), random(10), false))
}

function draw() {
  background(100)

  translate(width/2, height/2)
  scale(zoom)
  translate(-width/2, -height/2)

  translate(width / 2 - offset.x, height / 2 - offset.y)

  for(var i = 0; i < majorPlanets.length; i++){
    //majorPlanets[i].update()
    majorPlanets[i].display()
    majorPlanets[i].applyGravity(planets)
  }

  for(var i = 0; i < planets.length; i++){
    planets[i].update()
    planets[i].destroyOnEdges()
    planets[i].display()
    planets[i].applyGravity(majorPlanets)
    planets[i].storeData()
  }

  focusPlanet()
  planetDestructionAndBirth()

  // if(counter % 50 == 0){
  //   spawnPlanet()
  // }
  // counter ++
}

function mouseWheel(event) {
  zoom -= sensitivity * event.delta;
  zoom = constrain(zoom, zMin, zMax);
  //uncomment to block page scrolling
  return false;
}

  function planetDestructionAndBirth(){
    for(var i = 0; i < planets.length; i++){
      if(planets[i].destroy){
        planets.splice(i, 1)
        spawnPlanet()
      }
    }
  }

function mousePressed(){
    if(mouseButton === LEFT){
        changeFocusPlanet()
    }
  }

function changeFocusPlanet(){
  //if(planetToFocus < planets.length - 1){
  if(planetToFocus < majorPlanets.length -1){
  planetToFocus += 1
}else{
  planetToFocus = 0
  }
}

function focusPlanet(){
  //if(planetToFocus < planets.length){
  if(planetToFocus < majorPlanets.length){
  //offset = createVector(planets[planetToFocus].position.x, planets[planetToFocus].position.y)
  offset = createVector(majorPlanets[planetToFocus].position.x, majorPlanets[planetToFocus].position.y)
}else{
  //offset = createVector(planets[0].position.x, planets[0].position.y)
  planetToFocus = 0
  offset = createVector(majorPlanets[planetToFocus].position.x, majorPlanets[planetToFocus].position.y)
  }
}
