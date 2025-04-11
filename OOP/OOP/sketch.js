let cloud = [];
let mySound;

function preload() {
  // preload() runs once
  mySound = loadSound("assets/thunder.mp3");
}

// let n = 10;
function setup() {
 let canvas = createCanvas(800, 500);
 canvas.parent("p5-canvas-container");
 // for (let i = 0; i < n; i++) {
 //   cloud[i] = new Cloud(random(width), random(height));
 // }
}
function draw() {
 background(220);
 for (let i = 0; i < cloud.length; i++) {
   cloud[i].display();
   cloud[i].update();
   for (let j = 0; j < cloud.length; j++) {
     if (i != j) {
       cloud[i].checkCollision(cloud[j]);
     }


   }
 }
 for (let i = cloud.length - 1; i >= 0; i--) {
   if (cloud[i].isGone == true) {
     cloud.splice(i, 1);
   }
 }
 console.log(cloud.length);
 // if (mouseIsPressed) {
 //   cloud.push(new Cloud(mouseX, mouseY));
 // }
}
function mousePressed() {
 cloud.push(new Cloud(mouseX, mouseY));
}
class Cloud {
 constructor(startX, startY) {
   this.x = startX;
   this.y0 = startY;
   this.y = 0;
   this.s = random(50, 100);
   this.speedX = map(this.s, 50, 100, 2, 0.5);
   this.h = random(360);
   this.isGone = false;
   this.coll = false;
 }
 //our functions or methods
 display() {
   push();
   colorMode(HSB);
   translate(this.x, this.y);
   fill(this.h, 60, 100);
   noStroke();
   circle(0, 0, this.s);
   for (let angle = 0; angle < 2 * PI; angle += PI / 5) {
     push();
     rotate(angle);
     let s2 = map(noise(angle * this.s), 0, 1, this.s * 0.1, this.s);
     circle(this.s * 0.5, 0, s2);
     pop();
   }
   pop();
 }
 update() {
   this.x = this.x + this.speedX;
   this.y = this.y0 + 100 * sin(noise(frameCount * 0.01));
   if (this.x > width * 1.1) {
     this.isGone = true;
   }
 }
 checkCollision(other) {
   let d = dist(this.x, this.y, other.x, other.y);
   if (d < (this.s + other.s) / 2) {
     this.h = random(360);
    mySound.play();
   }
 }


}
