let ps = [];  
let obs = [];  

function setup() {  
  let canvas = createCanvas(800, 500); 
  canvas.parent("p5-canvas-container"); 

  dna = new Dna(width / 2, height / 2);  
  for (let i = 0; i < 20; i++) {  
    obs.push(new Orb());  
  }  
}  

function draw() {  
  background(sin(frameCount * 0.02)*80, sin(frameCount * 0.02)*80, sin(frameCount * 0.02)*120);  

  dna.update();  
  dna.display();  
   
  for (let ob of obs) {  
    ob.update();  
    ob.display(dna.poss, {x: 0, y: 0});  
  }  
  
  for (let i = ps.length - 1; i >= 0; i--) {  
    let p = ps[i];  
    p.update();  
    p.display();  
    if (p.lsp <= 0) {  
      ps.splice(i, 1);  
    }  
  }  
}  

class Dna {  
  constructor(x, y) {  
    this.pos = { x: x, y: y };  
    this.rot = 0;  
    this.ang = 0;   
    this.amp = 100;  
    this.wl = 50;  
    this.poss = [];  
    this.np = 40;   
  }  

  update() {  
    this.rot += 0.002;  
    this.ang += 0.03;  
  }  

  display() {  
    this.poss = [];  
    push();  
    translate(this.pos.x, this.pos.y);  
    rotate(this.rot);   

    for (let i = 0; i < this.np; i++) {  
      let y = i * 10 - 200;   
      let wo = sin(this.ang + y / this.wl) * this.amp;  
      let xl = -wo;  
      let xr = wo;  

      this.poss.push({ x: xl, y: y });  
      this.poss.push({ x: xr, y: y });  
  
      let t = this.ang + i * 0.2;  
      let progress = frameCount % 500 / 500;  
      let red = map(cos(t + progress * TWO_PI), -1, 1, 50, 100);  
      let green = map(sin(t + progress * TWO_PI), -1, 1, 100, 150);  
      let blue = map(sin(-t + progress * TWO_PI), -1, 1, 200, 255);  

      fill(red, green, blue);  
      ellipse(xl, y, 10, 10);  
      ellipse(xr, y, 10, 10);  
   
      stroke(100, 150, 255, 100);  
      line(xl, y, xr, y);  
      noStroke();  
   
      if (frameCount % 5 === 0 && ps.length < 500) {  
        let ang = this.rot;  
        let glx = this.pos.x + xl * cos(ang) - y * sin(ang);  
        let gly = this.pos.y + xl * sin(ang) + y * cos(ang);  

        let grx = this.pos.x + xr * cos(ang) - y * sin(ang);  
        let gry = this.pos.y + xr * sin(ang) + y * cos(ang);  
        ps.push(new P(glx, gly, i));  
        ps.push(new P(grx, gry, i + 50));  
      }  
    }  

    pop();  
  }  
}  

class P {  
  constructor(x, y, so) {  
    this.x = x;  
    this.y = y;  
    this.d = random(2, 5);  
    this.lsp = 255;  
    this.so = so;  
  }  

  update() {   
    let ax = noise(frameCount * 0.01 + this.so) * TWO_PI * 2;  
    let ay = noise(frameCount * 0.01 + this.so + 1000) * TWO_PI * 2;   

    this.x += cos(ax) * 1.2;  
    this.y += sin(ay) * 1.2;  

    this.lsp -= 2;  
  }  

  display() {  
    fill(100, 200, 255, this.lsp);  
    noStroke();  
    ellipse(this.x, this.y, this.d);  
  }  
}  


class Orb {  
  constructor() {  
    this.ang = random(TWO_PI);  
    this.rad = random(120, 200);  
    this.y = random(-200, 200);  
    this.spd = random(0.01, 0.03);
    this.c = this.rad;
    this.rot = 0;  
  }  

  update() {  
    this.ang += this.spd;
    this.rad = this.c * noise(frameCount * 0.01);
    this.rot += 0.002;  
  }  

  display(dnaPoss, ctr) {
    push();
    translate(400, 250);
    rotate(this.rot);
    let x = cos(this.ang) * this.rad + ctr.x;  
    let y = this.y + ctr.y;    
    fill(25, 255, 255, 200);  
    noStroke();  
    ellipse(x, y, 10, 10);
    pop();
  }  
}