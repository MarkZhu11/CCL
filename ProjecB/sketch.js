// === GLOBAL VARIABLES ===
let bgImgs = [], bgTiles = [];
let kunquImgs = [], currentKunquIndex = 0, kunquTimer = 0;
let audio, audioPlayed = false;
let kunquPrevIndex = 0;
let kunquLastSwitch = 0;
let sketch = -3; 
let input1, input2;
let currentAlpha = 255;
let nextAlpha = 0;
let fadeDuration = 2000;
let isFading = false;
let introText =
  "1000 yrs later, the subject of the human hibernation \n project has yet to awaken......";
let displayText = "";
let charindex = 0;
let DT2 = "";
let id2 = 0;
let bgCols = 2, bgRows = 2;
let bgImgWidth = 400, bgImgHeight = 300;
let seasonLabels = ["Spring", "Summer", "Autumn", "Winter"];

let titleAlpha = 0;
let transitionProgress = 0;
let transitionAlpha = 255;

let veilGraphics;
let hands = [];
let handPose, video;

let isTransitioning = false;
let transitionStartTime = 0;
let transitionDuration = 3000; 
let nextState = 0;

let imgs = [];
let currentImg;
let nextImg;
let index = 0;
let s = 10; 
let state = 'idle'; 
let transitionSpeed = 80; 
let particles = [];

function preload() {
  for (let i = 0; i < 4; i++) {
    bgImgs.push(loadImage('assets/' + i + '.jpg'));
  }
  for (let i = 4; i <= 6; i++) {
    kunquImgs.push(loadImage('assets/' + i + '.jpg'));
  }
  for (let i = 0; i < 12; i++) {
    imgs[i] = loadImage(`assets/element${i}.png`);
  }
  audio = loadSound("assets/kunqu.mp3");
  audio1 = loadSound("assets/kq.mp3");
  audio2 = loadSound("assets/gd.mp3");
  handPose = ml5.handPose();
}

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent("p5-canvas-container");
  input1 = select('#input1');
  input2 = select('#input2');
  frameRate(60);
  textFont('Georgia');
  currentImg = new PixelImage(imgs[index]);
  let bgIndex = 0;
  for (let y = 0; y < bgRows; y++) {
    for (let x = 0; x < bgCols; x++) {
      let tile = new BGTile(bgImgs[bgIndex], x * bgImgWidth, y * bgImgHeight, bgImgWidth, bgImgHeight, bgIndex);
      bgTiles.push(tile);
      bgIndex++;
    }
  }

  video = createCapture(VIDEO);
  video.size(800, 600);
  video.hide();
  handPose.detectStart(video, gotHands);

  veilGraphics = createGraphics(width, height);
  veilGraphics.background(0);
  veilGraphics.noStroke();
}

function draw() {
  background(0);
  if (isTransitioning) {
    drawTransition();
    return;
  }
  if (sketch == -3){
    fill(255);
    drawIntro();
  }
  else if (sketch == -2){
    drawScientistDialogue();
  }
  else if (sketch == -1){
    drawMindEntry();
  }
  if (sketch == 0) {
      audio.stop();
      audio1.stop();
      audio2.stop();
      drawMainMenu();
  }
  else if (sketch == 1){
      
      drawKunquMemory();
      drawBackButton();
      fill(255);
       textAlign(CENTER, CENTER);
     textSize(20);
      text("use your hands to unveil", 400, 50);
      showTransitionText("Spring is time when memory germinates. \nThe city's memory starts from Kunqu Opera 600 yrs ago...")
  }
  else if (sketch == 2){
    
    for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].display();
  }
    if (currentImg) {
    currentImg.display();
  }
  if (nextImg && state === 'adding') {
    nextImg.display();
  }

  if (state === 'removing') {
    currentImg.removePixels(transitionSpeed);
    if (currentImg.isEmpty()) {
      index = (index + 1) % imgs.length;
      nextImg = new PixelImage(imgs[index]);
      state = 'adding';
    }
  } else if (state === 'adding') {
    nextImg.addPixels(transitionSpeed);
    if (nextImg.isFull()) {
      currentImg = nextImg;
      nextImg = null;
      state = 'idle';
    }
  }
  drawBackButton();
  showTransitionText("Summer is when memory flourishes. \nIn Suzhou gardens, the city’s memories bloom in every stone, corridor, and ripple of water.")
  }
  else if (sketch == 3){
    showTransitionText("Autumn is when memory bears fruit. \nThe voices of spring and summer return soft, ripe echoes of heartfelt message from mine mind.")
    kunquButton();
    gdButton();
    drawBackButton();
  }
  else if (sketch == 4){
    showTransitionText("Now it is winter. Old memories sleep under snow. \nWhat will you remember for the city? Write it down. Let it begin again.")
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(60);
  text("Draw your own memories...", 400, 300);
  drawBackButton();
  }
}

function drawIntro() {
  if (frameCount % 4 === 0 && charindex < introText.length) {
    displayText += introText.charAt(charindex);
    charindex++;
  }
  textAlign(CENTER, CENTER);
  textSize(30);
  text(displayText, width / 2, height / 2);

  if (charindex === introText.length) {
    fill(150);
    textSize(16);
    text("Press to continue", width / 2, height / 2 + 100);
  }
}

function drawScientistDialogue() {
  background(10, 10, 30);
  fill(255);
  textAlign(LEFT, TOP);
  textSize(20);
  let dialogue =
    "The researcher：We couldn't wake him up... His consciousness is still stuck in his dreams... \n\nYou, you have to sneak into his subconsciousness and find a way to wake him up.";
  if (frameCount % 2 === 0 && id2 < dialogue.length) {
    DT2 += dialogue.charAt(id2);
    id2 += 1;
  }
  text(DT2, 100, 100, 600, 300);
  if (id2 === dialogue.length) {
    fill(180);
    textSize(16);
    text("press to continue", 100, 500);
  }
}
function drawMainMenu() {
  for (let tile of bgTiles) {
    tile.update();
    tile.display();
  }
}

function drawKunquMemory() {
  push();
    translate(width, 0); 
    scale(-1, 1);   
  let now = millis();
  if (isFading) {
    tint(255, currentAlpha);
    image(kunquImgs[kunquPrevIndex], 0, 0, width, height);
    tint(255, nextAlpha);
    image(kunquImgs[currentKunquIndex], 0, 0, width, height);
    noTint();

    let fadeStep = 255 / (fadeDuration / deltaTime);
    currentAlpha -= fadeStep;
    nextAlpha += fadeStep;
    currentAlpha = max(0, currentAlpha);
    nextAlpha = min(255, nextAlpha);

    if (currentAlpha <= 0 && nextAlpha >= 255) {
      isFading = false;
    }
  } else {
    image(kunquImgs[currentKunquIndex], 0, 0, width, height);
  }

  if (hands.length > 0) {
     
   
    for (let i = 0; i < hands.length; i++) {
      let hand = hands[i];
      for (let j = 0; j < hand.keypoints.length; j++) {
        let keypoint = hand.keypoints[j];
        let x = keypoint.x;
        let y = keypoint.y;
        veilGraphics.blendMode(REMOVE);
        veilGraphics.fill(0, 10);
        veilGraphics.ellipse(x, y, 100, 100);
        veilGraphics.blendMode(BLEND);
      }
    }
    
  }

  tint(255);
  image(veilGraphics, 0, 0, width, height);
  
  noTint();
  pop();
}

function drawBackButton() {
  fill(255, 200);
  rect(20, 20, 100, 40, 10);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(16);
  text("Back", 70, 40);
}

function kunquButton() {
  fill(255, 200);
  rect(150, 250, 200, 100, 20);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(20);
  text("Kunqu Opera", 250, 300 );
}

function gdButton() {
  fill(255, 200);
  rect(450, 250, 200, 100, 20);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(20);
  text("Suzhou Garden", 550, 300);
}

function drawMindEntry() {
  background(20, 0, 40);
  fill(255, 100, 200);
  textSize(28);
  textAlign(CENTER);
  text("You're entering his sub-consciousness……", width / 2, height / 2);

  noFill();
  stroke(255, 100);
  for (let i = 0; i < 20; i++) {
    ellipse(
      width / 2,
      height / 2,
      sin(frameCount * 0.05 + i) * 200,
      sin(frameCount * 0.05 + i) * 200
    );
  }

  fill(180);
  textSize(16);
  text("Press to continue", width / 2, height / 2 + 100);
}

function mousePressed() {
  transitionAlpha = 255;
  if (sketch == -3){
    startTransition(-2);
  }
  if (sketch ==-2){
    startTransition(-1);
  }
  if (sketch ==-1){
    startTransition(0);
  }
  if (sketch === 0) {
    for (let tile of bgTiles) {
      if (
        mouseX >= tile.x && mouseX <= tile.x + tile.w &&
        mouseY >= tile.y && mouseY <= tile.y + tile.h
      ) {
        tile.active = true;

        if (tile.label === "Spring") {
          startTransition(1);
          if (!audioPlayed) {
            audio.play();
            audioPlayed = true;
          }
        } else if (tile.label === "Summer") {
          startTransition(2);
        } else if (tile.label === "Autumn") {
          startTransition(3);
        } else if (tile.label === "Winter") {
          startTransition(4);
        }
      }
    }
  } else if (sketch > 0) {
    // Back button
    if (mouseX >= 20 && mouseX <= 120 && mouseY >= 20 && mouseY <= 60) {
      startTransition(0);
    }
    
  }

  if (sketch === 2) {
    if (state === 'idle') {
      state = 'removing';
    }
    for (let i = 0; i < 50; i++) {
    particles.push(new Particle(mouseX, mouseY));
  }
  }
  if (sketch === 3){
    if (mouseX >= 150 && mouseX <= 350 && mouseY >= 250 && mouseY <= 350) {
      audio1.play();
      document.getElementById('input1').classList.add('visible');
      audio2.stop();
    }
    if (mouseX >= 450 && mouseX <= 650 && mouseY >= 250 && mouseY <= 350) {
      audio2.play();
      document.getElementById('input2').classList.add('visible');
      audio1.stop();
    }
  }
}
function startTransition(targetState) {
  isTransitioning = true;
  transitionStartTime = millis();
  nextState = targetState;
}
function drawTransition() {
  let elapsed = millis() - transitionStartTime;
  let progress = constrain(elapsed / transitionDuration, 0, 1);
  let alpha = progress * 255;

  if (sketch === 0) {
    drawMainMenu();
  } else if (sketch === 1) {
    drawKunquMemory();
    drawBackButton();
  }

  fill(0, alpha);
  noStroke();
  rect(0, 0, width, height);

  if (progress >= 1) {
    isTransitioning = false;
    sketch = nextState;
  }
}

function showTransitionText(txt) {
  fill(255, transitionAlpha);
  textSize(20);
  textAlign(CENTER);
  text(txt, width / 2, height - 200);
  transitionAlpha -= 0.5; 
}

function gotHands(results) {
  hands = results;
}

class BGTile {
  constructor(img, x, y, w, h, index) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.index = index;

    this.pg = createGraphics(w, h);
    this.img.loadPixels();

    this.active = false;
    this.alpha = 0;
    this.label = seasonLabels[index];
  }

  update() {
    let particleCount = this.active ? 600 : 150;
    let maxSize = this.active ? 4 : 15;

    for (let n = 0; n < particleCount; n++) {
      let px = floor(random(this.w));
      let py = floor(random(this.h));
      let imgX = floor(map(px, 0, this.w, 0, this.img.width));
      let imgY = floor(map(py, 0, this.h, 0, this.img.height));
      let i = (imgX + imgY * this.img.width) * 4;

      let r = this.img.pixels[i];
      let g = this.img.pixels[i + 1];
      let b = this.img.pixels[i + 2];

      this.pg.noStroke();
      this.pg.fill(r, g, b, this.active ? 255 : 150);
      this.pg.circle(px, py, random(1, maxSize));
    }

    if (this.active && this.alpha < 255) {
      this.alpha += 2;
    }
  }

  display() {
    image(this.pg, this.x, this.y);

    if (this.active) {
      push();
      textAlign(CENTER, CENTER);
      textStyle(ITALIC);
      textSize(64);
      fill(255, this.alpha);
      textFont('Times New Roman');
      text(this.label, this.x + this.w / 2, this.y + this.h / 2);
      pop();
    }
  }
}
class PixelImage {
  constructor(originalImg) {
    this.img = createImage(800, 600);
    this.img.copy(originalImg, 0, 0, originalImg.width, originalImg.height, 0, 0, 800, 600);
    this.img.loadPixels();

    this.pixels = [];
    this.allPixels = [];

    for (let x = 0; x < this.img.width; x += s) {
      for (let y = 0; y < this.img.height; y += s) {
        let i = (x + y * this.img.width) * 4;
        let r = this.img.pixels[i];
        let g = this.img.pixels[i + 1];
        let b = this.img.pixels[i + 2];
        let c = color(r, g, b);
        this.allPixels.push({ x, y, c });
      }
    }

    this.pixels = [...this.allPixels]; 
  }

  display() {
    for (let p of this.pixels) {
      fill(p.c);
      noStroke();
      rect(p.x, p.y, s, s);
    }
  }

  removePixels(n) {
    for (let i = 0; i < n && this.pixels.length > 0; i++) {
      let idx = floor(random(this.pixels.length));
      this.pixels.splice(idx, 1);
    }
  }

  addPixels(n) {
    let currentSet = new Set(this.pixels);
    let remaining = this.allPixels.filter(p => !currentSet.has(p));
    for (let i = 0; i < n && remaining.length > 0; i++) {
      let idx = floor(random(remaining.length));
      this.pixels.push(remaining[idx]);
      remaining.splice(idx, 1);
    }
  }

  isEmpty() {
    return this.pixels.length === 0;
  }

  isFull() {
    return this.pixels.length === this.allPixels.length;
  }
}
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-2, 2);
    this.vy = random(-2, 2);
    this.ax = 0;
    this.ay = 0;
    this.size = random(5, 20);
    this.angle = random(TWO_PI);
    this.rotationSpeed = random(-0.05, 0.05);
    this.lifespan = 255;
  }

  update() {
    this.vx += this.ax;
    this.vy += this.ay;
    this.x += this.vx;
    this.y += this.vy;
    this.ax = 0;
    this.ay = 0;
    this.lifespan -= 2;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    fill(255, this.lifespan);
    noStroke();
    rectMode(CENTER);
    rect(0, 0, this.size, this.size);
    pop();
    this.angle += this.rotationSpeed;
  }
}
