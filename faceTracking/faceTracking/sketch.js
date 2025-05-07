let state = 0;
let introText = "1000 yrs later, the subject of the human hibernation \n project has yet to awaken......";
let displayText = "";
let index = 0;

let DT2 = "";
let id2 = 0;

let transitionImg;
let transitionProgress = 0;
let isTransitioning = false;
let nextState = null;

let imgs = [];
let positions = [];
let offsetX = 0;
let offsetY = 0;
let lastMouseX = 0;
let lastMouseY = 0;
let dragging = false;

function preload() {
  for (let i = 1; i <= 6; i++) {
    imgs[i] = loadImage("assets/img" + i + ".png.png");
  }
}

function setup() {
  createCanvas(800, 600);
  textFont("Georgia");
  textSize(24);
  fill(255);
  frameRate(30);

  for (let i = 0; i < imgs.length; i++) {
    if (imgs[i]) {
      positions[i] = {
        x: random(-1000, 1000),
        y: random(-1000, 1000),
        w: imgs[i].width / 2,
        h: imgs[i].height / 2
      };
    }
  }
}

function draw() {
  if (isTransitioning) {
    drawTransition();
    return;
  }

  background(0);

  if (state === 0) {
    drawIntro();
  } else if (state === 1) {
    drawScientistDialogue();
  } else if (state === 2) {
    drawMindEntry();
  } else if (state === 3) {
    drawKunquScene(); // Memory 1: 古镇拼贴
  }
}

// ---------- 各状态绘制 ---------- //

function drawIntro() {
  if (frameCount % 4 === 0 && index < introText.length) {
    displayText += introText.charAt(index);
    index++;
  }
  textAlign(CENTER, CENTER);
  text(displayText, width / 2, height / 2);

  if (index === introText.length) {
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
    text("Press any key to continue", 100, 500);
  }
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

function drawKunquScene() {
  background(30);
  fill(255);
  textSize(24);
  textAlign(CENTER);
  text("Memory 1: The Ancient Town", width / 2, 30);

  // 显示拼贴图层，可拖动
  push();
  translate(offsetX, offsetY);
  for (let i = 0; i < imgs.length; i++) {
    if (imgs[i]) {
      image(imgs[i], positions[i].x, positions[i].y, positions[i].w, positions[i].h);
    }
  }
  pop();

  fill(200);
  textSize(16);
  text("Click anywhere to continue", width / 2, height - 40);
}

// ---------- Transition 过渡效果 ---------- //

function startTransition(toState) {
  transitionImg = get(); // capture screen
  transitionProgress = 0;
  nextState = toState;
  isTransitioning = true;
}

function drawTransition() {
  transitionProgress += 0.02;
  image(transitionImg, 0, 0);
  filter(BLUR, transitionProgress * 6);
  tint(255, 255 * (1 - transitionProgress));
  fill(255, 255 * transitionProgress);
  rect(0, 0, width, height);

  if (transitionProgress >= 1) {
    isTransitioning = false;
    state = nextState;
  }
}

// ---------- 交互逻辑 ---------- //

function mousePressed() {
  if (state === 0 && index === introText.length) {
    startTransition(1);
  } else if (state === 2) {
    startTransition(3);
  } else if (state === 3) {
    dragging = true;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}

function mouseReleased() {
  dragging = false;
}

function mouseDragged() {
  if (state === 3 && dragging) {
    offsetX += mouseX - lastMouseX;
    offsetY += mouseY - lastMouseY;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}

function keyPressed() {
  if (state === 1) {
    startTransition(2);
  }
}
