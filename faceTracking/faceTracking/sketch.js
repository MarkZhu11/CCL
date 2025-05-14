// === GLOBAL VARIABLES ===
let bgImgs = [], bgTiles = [];
let kunquImgs = [], currentKunquIndex = 0, kunquTimer = 0;
let audio, audioPlayed = false;
let kunquPrevIndex = 0;
let kunquLastSwitch = 0;
let sketch = 0; // 0 = main menu, 1 = Spring, 2 = Summer, etc.

let currentAlpha = 255;
let nextAlpha = 0;
let fadeDuration = 2000;
let isFading = false;

let bgCols = 2, bgRows = 2;
let bgImgWidth = 400, bgImgHeight = 300;
let seasonLabels = ["Spring", "Summer", "Autumn", "Winter"];

let titleAlpha = 0;
let transitionProgress = 0;

let veilGraphics;
let hands = [];
let handPose, video;

let isTransitioning = false;
let transitionStartTime = 0;
let transitionDuration = 3000; // 3 seconds
let nextState = 0;

let imgs = [];
let currentImg;
let nextImg;
let index = 0;
let s = 10; // 每个像素块的大小
let state = 'idle'; // 状态控制：idle, removing, adding
let transitionSpeed = 100; // 每帧变化像素个数

function preload() {
  for (let i = 0; i < 4; i++) {
    bgImgs.push(loadImage('assets/' + i + '.jpg'));
  }
  for (let i = 4; i <= 6; i++) {
    kunquImgs.push(loadImage('assets/' + i + '.jpg'));
  }
  for (let i = 0; i < 12; i++) {
    imgs[i] = loadImage("assets/element${i}.png");
  }
  audio = loadSound("assets/kunqu.mp3");
  handPose = ml5.handPose();
}

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent("p5-canvas-container");
   frameRate(60);
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
  if (sketch == 0) {
      audio.stop()
      drawMainMenu();
  }
  else if (sketch == 1){
      drawKunquMemory();
      drawBackButton();
  }
  else if (sketch == 2){
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
  }
}

function drawMainMenu() {
  for (let tile of bgTiles) {
    tile.update();
    tile.display();
  }
}

function drawKunquMemory() {
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
}

function drawBackButton() {
  fill(255, 200);
  rect(20, 20, 100, 40, 10);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(16);
  text("Back", 70, 40);
}

function mousePressed() {
  if (sketch === 0) {
    for (let tile of bgTiles) {
      if (mouseX >= tile.x && mouseX <= tile.x + tile.w &&
          mouseY >= tile.y && mouseY <= tile.y + tile.h) {
        tile.active = true;
        if (tile.label === "Spring") {
          startTransition(1);
          if (!audioPlayed) {
            audio.play();
            audioPlayed = true;
          }
        } else if (tile.label === "Summer") {
          startTransition(2);
           if (state === 'idle') {
    state = 'removing';
  }
        } else if (tile.label === "Autumn") {
          startTransition(3);
        } else if (tile.label === "Winter") {
          startTransition(4);
        }
      }
    }
  } else if (sketch > 0) {
    if (mouseX >= 20 && mouseX <= 120 && mouseY >= 20 && mouseY <= 60) {
      startTransition(0);  // Return to main menu with fade
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
    // 保留主菜单画面时也能看到 fade
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
    sketch= nextState;
  }
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

    this.pixels = [...this.allPixels]; // 初始全显示
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