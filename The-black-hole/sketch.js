/*
Template for IMA's Creative Coding Lab 

Project A: Generative Creatures
CCLaboratories Biodiversity Atlas 
*/

let maxRadius;  
let clickCount = 0;  
let mood = "calm";  
let particles = [];  
let eruptionParticles = [];  
let f = 400;  
let b = 250;  
let br = 100;  
let shockwaves = [];  

function setup() {  
    let canvas = createCanvas(800, 500);
    canvas.parent("p5-canvas-container");
  noStroke();  
  maxRadius = dist(0, 0, width / 2, height / 2);  
  for (let i = 0; i < 20; i++) {  
    particles.push(createParticle());  
  }  
}  

function draw() {  
  background(255);  
  drawBackground();  
  drawShockwaves();  
  drawEruptionParticles();   
  drawBlackHole();  
  drawFace();  
  updateParticles();  
  checkMood();  
  holeSize();  
}  

// ---------------- 绘制相关函数 -----------------  

// 绘制背景  
function drawBackground() {  
  let t = frameCount * 0.02;  
  for (let r = maxRadius; r > 0; r -= 4) {  
    let progress = r / maxRadius;  
    let red, green, blue;  

    if (mood === "calm") {  
      red = map(cos(t + progress * TWO_PI), -1, 1, 50, 100);  
      green = map(sin(t + progress * TWO_PI), -1, 1, 50, 150);  
      blue = map(sin(-t + progress * TWO_PI), -1, 1, 150, 255);  
    } else if (mood === "a little angry") {  
      red = map(cos(t + progress * TWO_PI), -1, 1, 100, 180);  
      green = map(sin(t + progress * TWO_PI), -1, 1, 150, 200);  
      blue = map(sin(-t + progress * TWO_PI), -1, 1, 50, 100);  
    } else if (mood === "erupt") {  
      red = map(cos(t + progress * TWO_PI), -1, 1, 160, 255);  
      green = map(sin(t + progress * TWO_PI), -1, 1, 40, 110);  
      blue = map(sin(-t + progress * TWO_PI), -1, 1, 40, 90);  
    }  

    fill(red, green, blue, 200);  
    ellipse(f, b, r * 2, r * 2);  
  }  
}  

// 绘制黑洞  
function drawBlackHole() {  
  fill(0);  
  push();  
  translate(f + (mood === "erupt" ? random(-3, 3) : 0), b + (mood === "erupt" ? random(-3, 3) : 0));  
  
  let sizeOffset = (mood === "a little angry" ? 5 : mood === "erupt" ? 10 : 0);  
  
  beginShape();  
  for (let i = 0; i < 50; i++) {  
    let angle = map(i, 0, 50, 0, TWO_PI);  
    let noiseVal = 3 * noise(cos(angle) * 0.5 + frameCount * 0.01, sin(angle) * 0.5 + frameCount * 0.01);  
    let dr = br + sizeOffset + (noiseVal * 10 - 5);  
    vertex(cos(angle) * dr, sin(angle) * dr);  
  }  
  endShape(CLOSE);  
  pop();  
}  

// 绘制冲击波  
function drawShockwaves() {  
  for (let i = shockwaves.length - 1; i >= 0; i--) {  
    let s = shockwaves[i];  
    noFill();  
    stroke(255, 0, 0, s.alpha);  
    strokeWeight(2);  
    ellipse(s.x, s.y, s.r);  
    s.r += 5;  
    s.alpha -= 10;  
    if (s.alpha <= 0) {  
      shockwaves.splice(i, 1);  
    }  
  }  
}  

// 绘制脸部表情  
function drawFace() {  
  push();  
  translate(f, b);  
  stroke(255, 165, 0);  
  strokeWeight(6);  
  noFill();  
  let yOffset = sin(frameCount * 0.2) * 5;  

  if (mood === "calm") {  
    drawCalmFace(yOffset);  
  } else if (mood === "a little angry") {  
    drawAngryFace(yOffset);  
  } else {  
    drawEruptFace(yOffset);  
  }  
  pop();  
}  

// 绘制平静表情  
function drawCalmFace(yOffset) {  
  fill(255);  
  ellipse(-20, -10 + yOffset, 12, 18);  
  ellipse(20, -10 + yOffset, 12, 18);  
  fill(0);  
  ellipse(-20, -10 + yOffset, 6, 10);  
  ellipse(20, -10 + yOffset, 6, 10);  
  arc(0, 15 + yOffset, 30, 15, 0, PI);  
}  

// 绘制愤怒表情  
function drawAngryFace(yOffset) {    
  fill(255);  
  ellipse(-20, -10 + yOffset, 18, 22);  
  ellipse(20, -10 + yOffset, 18, 22);  
  noFill();  
  arc(-15, -25 + yOffset, 20, 10, radians(340), radians(160));   
  arc(15, -25 + yOffset, 20, 10, radians(200), radians(340));  
  noStroke();  
  fill(255, 165, 0);  
  ellipse(0, 20 + yOffset, 15, 10);  
}  

// 绘制爆发表情  
function drawEruptFace(yOffset) {   
  fill(255, 255, 0);   
  star(-15, -10 + yOffset, 8, 12, 5);   
  star(15, -10 + yOffset, 8, 12, 5);  
  fill(255, 100, 100);  
  ellipse(0, 25 + yOffset, 20, 20);  
  stroke(255, 0, 0, 150);    
}  

// ---------------- 粒子相关函数 ----------------  

// 创建粒子  
function createParticle() {  
  let angle = random(TWO_PI);  
  let radius = random(200, 300);  
  return { x: f + cos(angle) * radius, y: b + sin(angle) * radius };  
}  

// 更新粒子位置  
function updateParticles() {  
  for (let i = 0; i < 20; i++) {  
    let p = particles[i];  
    let d = dist(p.x, p.y, f, b);  
    let speed = map(d, 0, 200, 0.5, 4);  
    let dx = (f - p.x) / d * speed;  
    let dy = (b - p.y) / d * speed;  
    let rr = map(d, 0, 300, 1, 20);  
    p.x += dx;  
    p.y += dy;  
    fill(0);  
    ellipse(p.x, p.y, rr, rr);  
    if (d < 50) particles[i] = createParticle();  
  }  
}  

// 绘制喷发粒子  
function drawEruptionParticles() {  
  for (let i = eruptionParticles.length - 1; i >= 0; i--) {  
    let p = eruptionParticles[i];  
    fill(255, 100, 0, p.lifespan);  
    ellipse(p.x, p.y, 6, 6);  
    p.x += p.vx;  
    p.y += p.vy;  
    p.lifespan -= 5;  
    
    if (p.lifespan <= 0) {  
      eruptionParticles.splice(i, 1);  
    }  
  }  
}  

// ---------------- 状态检查与交互 ----------------  

// 处理鼠标点击  
function mousePressed() {  
  clickCount++;  
  shockwaves.push({ x: mouseX, y: mouseY, r: 10, alpha: 255 });  
  if (mood === "a little angry" || mood === "erupt") {  
    emitParticles(15);  
  }  
}  

// 生成粒子  
function emitParticles(num) {  
  for (let i = 0; i < num; i++) {  
    eruptionParticles.push({  
      x: f, y: b,  
      vx: random(-3, 3), vy: random(-3, 3),  
      lifespan: 255  
    });  
  }  
}  

// 检查心情状态  
function checkMood() {  
  if (clickCount >= 10) mood = "erupt";  
  else if (clickCount >= 5) mood = "a little angry";  
  else mood = "calm";  
}  

// 调整洞的大小  
function holeSize() {  
  if (mood === "erupt") {  
    br -= 0.2;  
    for (let i = 0; i < 5; i++) {  
      eruptionParticles.push({ x: f, y: b, vx: random(-2, 2), vy: random(-2, 2) });  
    }  
    if (br < 50) {  
      mood = "calm";  
      br = 100;  
      clickCount = 0;  
      eruptionParticles = [];  
    }  
  } else if (br <= 250) {  
    br += 0.1;  
  } else {  
    br = 250;  
  }  
}  

// ---------------- 工具函数 ----------------  

// 绘制星形工具函数  
function star(x, y, radius1, radius2, npoints) {  
  let angle = TWO_PI / npoints;  
  let halfAngle = angle / 2.0;  
  beginShape();  
  for (let a = 0; a < TWO_PI; a += angle) {  
    let sx = x + cos(a) * radius2;  
    let sy = y + sin(a) * radius2;  
    vertex(sx, sy);  
    sx = x + cos(a + halfAngle) * radius1;  
    sy = y + sin(a + halfAngle) * radius1;  
    vertex(sx, sy);  
  }  
  endShape(CLOSE);  
}