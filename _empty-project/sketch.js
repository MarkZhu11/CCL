let c = [];
let mic;
let counter = 0;
function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  mic = new p5.AudioIn();
  mic.start();
}
function draw() {
  background(255);
  let level = mic.getLevel();
  console.log(10000*level);

  if (keyIsPressed) {
    counter++;
    counter = constrain(counter, 0, 10);
    let s = map(counter, 0, 10, 20, 300);
    c.push(new Character(key, s));
  }
  for (let i = 0; i < c.length; i++) {
    c[i].update();
    c[i].updateLifespan();
    c[i].display(level, frameCount);
    for (let j = 0; j < c.length; j++) {
      c[i].connect(c[j], level, frameCount);
    }

    if (c[i].isDone) {
      c.splice(i, 1);
    }
  }
}
function keyReleased() {
  counter = 0;
}
class Character {
  constructor(c, cs) {
    this.c = c;
    this.x = random(width);
    this.y = random(height);
    this.s = cs;
    this.lifespan = 10;
    this.lifeReduction = map(this.s, 20, 300, 0.1, 0.01);
    this.isDone = false;
  }
  display(level,  frameCount) {
    let op = map(this.lifespan, 10, 0, 255, 0);
    fill(level*sin(frameCount*0.01)*10000, level*7000, level*cos(frameCount*0.01)*10000, op);
    textSize(this.s);
    text(this.c, this.x, this.y);
  }
  update() {
    let sx = this.c.charCodeAt(0) / this.s;
    //console.log(sx);
    this.x = width * noise((frameCount * 0.01) / sx);
    this.y = height * noise(frameCount / this.s);
  }
  updateLifespan() {
    if (this.lifespan > 0) {
      this.lifespan = this.lifespan - this.lifeReduction;
    } else {
      this.lifespan = 0;
      this.isDone = true;
    }
  }
  connect(other, level, frameCount) {
    if (this.c != other.c) {
      stroke(level*sin(frameCount*0.01)*10000, level*7000, level*cos(frameCount*0.01)*10000 , 20);
      line(this.x, this.y, other.x, other.y);
    }
  }
}
