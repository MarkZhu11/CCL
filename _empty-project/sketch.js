let bgImgs = [], bgTiles = [];
let kunquImgs = [], currentKunquIndex = 0, kunquTimer = 0;
let audio, audioPlayed = false;
let kunquPrevIndex = 0;
let kunquLastSwitch = 0;

let currentAlpha = 255;
let nextAlpha = 0;
let fadeDuration = 2000; 
let isFading = false;

let offsetX = 0, offsetY = 0;
let prevMouseX = 0, prevMouseY = 0;

let bgCols = 2, bgRows = 2;
let bgImgWidth = 400, bgImgHeight = 300;
let seasonLabels = ["Spring", "Summer", "Autumn", "Winter"];

let showTitle = false, titleAlpha = 0;
let transitionStart = false, transitionProgress = 0;
let inKunquScene = false;

let veilAlpha = 255;

let handPose;
let video;
let hands = [];
let pinch = 0;
let fadeAlpha = 255;
let veilGraphics;
let veilDecayRate = 1; 

function setup() {
  createCanvas(windowWidth, windowHeight);
  veilGraphics = createGraphics(width, height);
  veilGraphics.background(0);
  veilGraphics.noStroke();
  
}


function preload() {
  for (let i = 0; i < 4; i++) {
    bgImgs.push(loadImage('assets/' + i + '.jpg'));
  }
  for (let i = 4; i <= 6; i++) {
    kunquImgs.push(loadImage('assets/' + i + '.jpg'));
  }
  audio = loadSound("assets/kunqu.mp3");
  handPose = ml5.handPose();
}

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent("p5-canvas-container");

  let bgIndex = 0;
  for (let y = 0; y < bgRows; y++) {
    for (let x = 0; x < bgCols; x++) {
      let tile = new BGTile(bgImgs[bgIndex], x * bgImgWidth, y * bgImgHeight, bgImgWidth, bgImgHeight, bgIndex);
      bgTiles.push(tile);
      bgIndex++;
    }

  }

  // handpose setup
 video = createCapture(VIDEO);
  video.size(800, 600);
  video.hide();
  // Start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);

  veilGraphics = createGraphics(width, height);
  veilGraphics.background(0);
  veilGraphics.noStroke();
  }

function draw() {
  background(0);

  if (!inKunquScene) {
    for (let tile of bgTiles) {
      tile.update();
      tile.display();
    }

    if (showTitle) {
      fill(255, titleAlpha);
      textAlign(CENTER, CENTER);
      textSize(48);
      text("Memory of Spring: Kunqu Opera", width / 2, height / 2);
      if (titleAlpha < 255) titleAlpha += 2;
    }

    if (transitionStart) {
      transitionProgress += 0.01;
      fill(0, transitionProgress * 255);
      rect(0, 0, width, height);
      if (transitionProgress >= 1) {
        inKunquScene = true;
        if (!audioPlayed) {
          audio.play();
          audioPlayed = true;
        }
      }
    }
  } else {
    drawKunquMemory();
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
        veilGraphics.ellipse(x, y, 30, 30);
        veilGraphics.blendMode(BLEND);
      }
    }
  }

  tint(255);
  image(veilGraphics, 0, 0, width, height);
  noTint();
}

function mousePressed() {
  prevMouseX = mouseX;
  prevMouseY = mouseY;

  if (inKunquScene) return;

  for (let tile of bgTiles) {
    if (mouseX >= tile.x && mouseX <= tile.x + tile.w &&
        mouseY >= tile.y && mouseY <= tile.y + tile.h) {
      for (let t of bgTiles) {
        t.active = false;
        t.alpha = 0;
      }
      tile.active = true;

      if (tile.label === "Spring") {
        showTitle = true;
        setTimeout(() => {
          transitionStart = true;
        }, 3000); 
      }
    }
  }
}

function mouseDragged() {
  offsetX += mouseX - prevMouseX;
  offsetY += mouseY - prevMouseY;
  prevMouseX = mouseX;
  prevMouseY = mouseY;
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
