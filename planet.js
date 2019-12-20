var strengthToSizeScaler = 3;

function planet(x, y, strength){
  this.position = createVector(x, y)
  this.strength = strength

  this.colour = color(random(255), random(255), random(255))

  this.display = function(){
    stroke(0)
    fill(this.colour)
    ellipseMode(CENTER)
    ellipse(this.position.x, this.position.y, this.strength * strengthToSizeScaler)
  }
  this.applyGravity = function (){
    for(var i = 0; i < particles.length; i++){
      var dif = p5.Vector.sub(this.position, particles[i].position)
      var dist = dif.mag()

      var mag = distanceScaler * planetGravityScaler / (dist * dist);

      dif.setMag(mag);
      particles[i].applyForce(dif);
    }
  }
}
