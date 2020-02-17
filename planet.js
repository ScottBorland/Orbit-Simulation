var massToSizeScaler = 10

var speedMultiplier = 1
var distanceScaler = 1000
var planetGravityScaler = 1

var g = 1000
//var g = (6.67) * (10^-11)

function planet(x, y, velX, velY, mass, redrawn){
  this.position = createVector(x, y)
  this.velocity = createVector(velX, velY)
  this.mass = mass

  this.massToSizeScalerIndividual = 1

  this.acceleration = createVector(0, 0)

  this.redrawn = redrawn

  if(!this.redrawn){
  this.logged = false
  this.data = []
  this.data.push(this.position)
  this.data.push(this.velocity)
  }else{
    this.logged = true
  }

  this.lifetime = 0

  this.maxSpeed = 100
  this.destroy = false

  this.colour = color(random(255), random(255), random(255))

this.update = function(){
     var pos = createVector(this.position.x, this.position.y)
     //this.trail.push(pos)
     if(this.acceleration.mag() < 0.0002){
       console.log("destroy this")
       this.destroy = true
     }
     this.velocity.add(this.acceleration)
     this.velocity.mult(speedMultiplier)
     this.velocity.limit(this.maxSpeed)

     this.position.add(this.velocity)
     this.acceleration.mult(0)
     this.lifetime += 0.001
   }

  this.display = function(){
    push()
    //scale(0.5)
    //translate(offset.x, offset.y)
    //console.log(offset)
    //translate(width/2,height/2);
    stroke(0)
    fill(this.colour)
    ellipseMode(CENTER)
    ellipse(this.position.x, this.position.y, this.mass * massToSizeScaler * this.massToSizeScalerIndividual)
    pop()
  }

  this.storeData = function(){
    if(this.lifetime > 100 && this.lifetime < 1000){
      console.log(this.data)
    }
    if(this.lifetime > 1000 && this.lifetime > 10000){
      console.log(this.data)
    }
    if(this.lifetime > 10000){
      console.log(this.data)
    }
  }

  this.applyForce = function(force){
      // if(force.mag() > 100 || (force.mag() != 0 && force.mag() < 0.002)){
      //   this.destroy = true
      // }
      this.acceleration.add(force.div(this.mass))
    }

  this.applyGravity = function (planets){
    for(var i = 0; i < planets.length; i++){
      if(planets[i] != this){
      var dif = p5.Vector.sub(this.position, planets[i].position)
      var dist = dif.mag()
      var mag = (g * this.mass * planets[i].mass) / (dist * dist)
      if(dist < 5 || mag > 400){
        if(this.mass < planets[i].mass){
        this.destroy = true
        mag = 1
      }
    }
      //F = -GmM/r2
      //var mag = distanceScaler * planetGravityScaler / (dist * dist)
      dif.setMag(mag)
      planets[i].applyForce(dif)
      }
    }
  }
    this.edges = function(){
         if(this.position.x > universeSize){
             this.position.x = 0
         } else if (this.position.x < -universeSize){
             this.position.x = width
         }

         if(this.position.y > universeSize){
             this.position.y = 0
         } else if (this.position.y < -universeSize){
             this.position.y = height
         }
      }
      this.destroyOnEdges = function(){
           if(this.position.x > universeSize){
               this.destroy = true
           } else if (this.position.x < -universeSize){
               this.destroy = true
           }

           if(this.position.y > universeSize){
               this.destroy = true
           } else if (this.position.y < -universeSize){
               this.destroy = true
           }
        }
}
