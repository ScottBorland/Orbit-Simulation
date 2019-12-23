var massToSizeScaler = 3

var speedMultiplier = 1
var distanceScaler = 1000
var planetGravityScaler = 1

var g = 100
//var g = (6.67) * (10^-11)

function planet(x, y, velX, velY, mass /*redrawn*/){
  this.position = createVector(x, y)
  this.velocity = createVector(velX, velY)
  this.mass = mass

  this.acceleration = createVector(0, 0)

  this.maxSpeed = 10

  // this.redrawn = redrawn
  // if(!this.redrawn){
  // this.colour = color(random(255), random(255), random(255))
  // this.data = []
  // this.data.push(this.position)
  // this.data.push(this.strength)
  // this.data.push(this.colour)
  // planetData.push(this.data)
  this.colour = color(random(255), random(255), random(255))

this.update = function(){
     var pos = createVector(this.position.x, this.position.y)
     //this.trail.push(pos)
     this.velocity.add(this.acceleration)
     this.velocity.mult(speedMultiplier)
     this.velocity.limit(this.maxSpeed)

     this.position.add(this.velocity)
     this.acceleration.mult(0)
     //this.lifetime ++
   }

  this.display = function(){
    stroke(0)
    fill(this.colour)
    ellipseMode(CENTER)
    ellipse(this.position.x, this.position.y, this.mass * massToSizeScaler)
  }

  this.applyForce = function(force){
      // if(force.mag() > 100 || (force.mag() != 0 && force.mag() < 0.002)){
      //   this.destroy = true
      // }
      this.acceleration.add(force)
    }

  this.applyGravity = function (planets){
    for(var i = 0; i < planets.length; i++){
      var dif = p5.Vector.sub(this.position, planets[i].position)
      var dist = dif.mag()

      //F = -GmM/r2
      //var mag = distanceScaler * planetGravityScaler / (dist * dist)
      var mag = (g * this.mass * planets[i].mass) / (dist * dist)
      dif.setMag(mag)
      planets[i].applyForce(dif)
      }
    }
}
