//This is Pupu! A cute creature created by me with the help of professor Marcela. 
//Pupu is an emotional black hole that feeds on resonance particles around it. Don’t bother it or you’ll see it gets angry and erupts!

let maxRadius;  // Maximum radius for the background effect  
let clickCount = 0;  // Count of mouse clicks  
let mood = "calm";  // Current mood of the application  
let particles = [];  // Array to hold particles  
let eruptionParticles = [];  // Array to hold particles during eruption  
let f = 400;  // X-coordinate for the center of the black hole  
let b = 250;  // Y-coordinate for the center of the black hole  
let br = 100;  // Base radius for the black hole  
let shockwaves = [];  // Array to hold shockwave effects  
let a1 = 50, a2 = 100;  // Color parameters for red channel  
let b1 = 50, b2 = 150;  // Color parameters for green channel  
let c1 = 150, c2 = 255;  // Color parameters for blue channel  
let stopRunning = false;  // Flag to check if the animation should stop  

function setup() {  
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");  
  noStroke();  // Disable stroke for shapes  
  maxRadius = dist(0, 0, width / 2, height / 2);  // Calculate the maximum radius  
  for (let i = 0; i < 20; i++) {  
    particles.push(createParticle());  // Initialize particles  
  }  
}  

function draw() {   
  if (stopRunning) {  
    noLoop();  // Stop the draw loop if the flag is set  
    return;  
  }  
  background(255);  // Set background color to white  
  drawBackground();  // Draw the animated background  
  drawShockwaves();  // Draw shockwaves  
  drawEruptionParticles();  // Draw eruption particles  
  drawBlackHole();  // Draw the black hole  
  drawFace();  // Draw the expressive face  
  updateParticles();  // Update particles' positions  
  checkMood();  // Check and update mood based on clicks  
  holeSize();  // Adjust the black hole size based on mood  
}  

// ---------------- Drawing Functions -----------------  

// Draw the dynamic background based on mood  
function drawBackground() {  
  let t = frameCount * 0.02;  // Time variable for animation  
  for (let r = maxRadius; r > 0; r -= 4) {  
    let progress = r / maxRadius;  
    let red, green, blue;   

    // Change colors based on current mood  
    if (mood === "calm") {  
      red = map(cos(t + progress * TWO_PI), -1, 1, a1, a2);  
      green = map(sin(t + progress * TWO_PI), -1, 1, b1, b2);  
      blue = map(sin(-t + progress * TWO_PI), -1, 1, c1, c2);  
    } else if (mood === "a little angry") {   
      // Adjust color parameters for "a little angry" mood  
      if (a1 <= 100) a1 += 0.004;  
      if (a2 <= 180) a2 += 0.006;  
      if (b1 <= 150) b1 += 0.004;  
      if (b2 <= 200) b2 += 0.004;  
      if (c1 >= 50) c1 -= 0.004;  
      if (c2 >= 100) c2 -= 0.006;  
      red = map(cos(t + progress * TWO_PI), -1, 1, a1, a2);  
      green = map(sin(t + progress * TWO_PI), -1, 1, b1, b2);  
      blue = map(sin(-t + progress * TWO_PI), -1, 1, c1, c2);  
    } else if (mood === "erupt") {  
      // Adjust color parameters for "erupt" mood  
      if (a1 <= 160) a1 += 0.004;  
      if (a2 <= 255) a2 += 0.006;  
      if (b1 >= 40) b1 -= 0.006;  
      if (b2 >= 110) b2 -= 0.006;  
      if (c1 >= 40) c1 -= 0.004;  
      if (c2 >= 90) c2 -= 0.004;  
      red = map(cos(t + progress * TWO_PI), -1, 1, a1, a2);  
      green = map(sin(t + progress * TWO_PI), -1, 1, b1, b2);  
      blue = map(sin(-t + progress * TWO_PI), -1, 1, c1, c2);  
    }  

    fill(red, green, blue, 200);  // Set color with transparency  
    ellipse(f, b, r * 2, r * 2);  // Draw background circle  
  }  
}  

// Draw the black hole  
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

// Draw shockwaves that spread out  
function drawShockwaves() {  
  for (let i = shockwaves.length - 1; i >= 0; i--) {  
    let s = shockwaves[i];  
    noFill();  
    stroke(255, 0, 0, s.alpha);  
    strokeWeight(2);  
    ellipse(s.x, s.y, s.r);  // Draw each shockwave  
    s.r += 5;  // Increase radius  
    s.alpha -= 10;  // Decrease transparency  
    if (s.alpha <= 0) {  
      shockwaves.splice(i, 1);  // Remove shockwave if fully transparent  
    }  
  }  
}  

// Draw the face with an expression based on mood  
function drawFace() {  
  push();  
  translate(f, b);  
  stroke(255, 165, 0);  
  strokeWeight(6);  
  noFill();  
  let yOffset = sin(frameCount * 0.2) * 5;  

  // Determine which face to draw based on mood  
  if (mouseIsPressed) {  
    drawEruptFace(yOffset);  
  } else if (mood === "calm") {  
    drawCalmFace(yOffset);  
  } else if (mood === "a little angry") {  
    drawAngryFace(yOffset);  
  } else {  
    drawEruptFace(yOffset);  
  }  
  pop();  
}  

// Draw a calm face expression  
function drawCalmFace(yOffset) {  
  fill(255);  
  ellipse(-20, -10 + yOffset, 12, 18);  
  ellipse(20, -10 + yOffset, 12, 18);  
  fill(0);  
  ellipse(-20, -10 + yOffset, 6, 10);  
  ellipse(20, -10 + yOffset, 6, 10);  
  arc(0, 15 + yOffset, 30, 15, 0, PI);  
}  

// Draw an angry face expression  
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

// Draw an erupting face expression  
function drawEruptFace(yOffset) {   
  fill(255, 255, 0);   
  star(-15, -10 + yOffset, 8, 12, 5);   
  star(15, -10 + yOffset, 8, 12, 5);  
  fill(255, 100, 100);  
  ellipse(0, 25 + yOffset, 20, 20);  
  stroke(255, 0, 0, 150);    
}  

// ---------------- Particle Functions ----------------  

// Create a new particle with random position  
function createParticle() {  
  let angle = random(TWO_PI);  
  let radius = random(200, 300);  
  return { x: f + cos(angle) * radius, y: b + sin(angle) * radius };  
}  

// Update the position of particles toward the black hole  
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
    ellipse(p.x, p.y, rr, rr);  // Draw each particle  
    if (d < 50) particles[i] = createParticle();  // Create new particle when close  
  }  
}  

// Draw particles emitted during an eruption  
function drawEruptionParticles() {  
  for (let i = eruptionParticles.length - 1; i >= 0; i--) {  
    let p = eruptionParticles[i];  
    fill(255, 100, 0, p.lifespan);  
    ellipse(p.x, p.y, 6, 6);  // Draw each eruption particle  
    p.x += p.vx;  
    p.y += p.vy;  
    p.lifespan -= 5;  // Decrease lifespan of each particle  
    
    if (p.lifespan <= 0) {  
      eruptionParticles.splice(i, 1);  // Remove particle if lifespan is over  
    }  
  }  
}  

// ---------------- Mood Check and Interaction ----------------  

// Handle mouse clicks for interactions  
function mousePressed() {  
  clickCount++;  // Increment click count  
  shockwaves.push({ x: mouseX, y: mouseY, r: 10, alpha: 255 });  // Create shockwave effect  
  if (mood === "a little angry" || mood === "erupt") {  
    emitParticles(15);  // Emit particles when in angry moods  
  }  
}  

// Generate eruption particles  
function emitParticles(num) {  
  for (let i = 0; i < num; i++) {  
    eruptionParticles.push({  
      x: f, y: b,  // Start position of particles  
      vx: random(-3, 3), vy: random(-3, 3),  // Random velocity  
      lifespan: 255  // Starting lifespan  
    });  
  }  
}  

// Check and update mood based on click count  
function checkMood() {  
  if (clickCount >= 10) mood = "erupt";  // Update mood to "erupt"  
  else if (clickCount >= 5) mood = "a little angry";  // Update mood to "angry"  
  else mood = "calm";  // Default mood  
}  

// Adjust the size of the black hole based on mood  
function holeSize() {  
  if (mood === "erupt") {  
    br -= 0.2;  // Decrease radius on eruption  
    for (let i = 0; i < 5; i++) {  
      eruptionParticles.push({ x: f, y: b, vx: random(-2, 2), vy: random(-2, 2) });  
    }  
    if (br < 50) {  
      mood = "calm";  // Reset mood after eruption  
      br = 100;  // Reset radius  
      clickCount = 0;  // Reset click count  
      eruptionParticles = [];  // Clear eruption particles  
      stopRunning = true;  // Stop the animation  
    }  
  } else if (br <= 250) {  
    br += 0.1;  // Gradually increase radius  
  } else {  
    br = 250;  // Cap radius at maximum  
  }  
}  

// ---------------- Utility Functions ----------------  

// Draw a star shape  
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