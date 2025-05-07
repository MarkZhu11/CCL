let img;
let s = 20;
let npcLayer;
let npc;
let sentence = [
  "侬吃阿没？(Have you eaten yet?)",
  "俄达侬库库搜贼（Let me show you around Suzhou）",
  "达噶一牢足怎搜贼文后（Let's pass down Suzhou's culture together）",
];

function preload() {
  img = loadImage("assets/hokusai.jpg"); 
}

function setup() {
  let canvas = createCanvas(600, 400, WEBGL);
  canvas.parent("p5-canvas-container"); 
  npcLayer = createGraphics(600, 400); 
  let i = floor(random(0, sentence.length));
  npc = new NPC(300, 200, sentence[i]);
  console.log(sentence[i]);
}

function draw() {
  background(0);
  img.loadPixels();

  for (let x = 0; x < width; x += s) {
    for (let y = 0; y < height; y += s) {
      let i = (x + y * img.width) * 4;

      let r = img.pixels[i + 0];
      let g = img.pixels[i + 1];
      let b = img.pixels[i + 2];

      push();
      let blockCenterX = x - width / 2;
      let blockCenterY = y - height / 2;

      let d = dist(
        mouseX - width / 2,
        mouseY - height / 2,
        blockCenterX,
        blockCenterY
      );

      let maxDistance = 50;
      let z = map(b, 0, 255, 0, -d);

      translate(blockCenterX, blockCenterY, z);
      fill(r, g, b);
      noStroke();
      rect(0, 0, s, s);
      pop();
    }
  }

  npcLayer.clear();
  npc.checkInteraction(mouseX, mouseY);
  npc.display(npcLayer);
  image(npcLayer, -width / 2, -height / 2); 
}

function keyPressed() {
  if (key === "U" || key === "u") {
    npc.updateUnderstanding(0.1);
  }
  console.log(npc.understanding);
}

class NPC {
  constructor(x, y, sentence) {
    this.x = x;
    this.y = y;
    this.sentence = str(sentence);
    this.understanding = 0;
    this.showing = false;
  }

  updateUnderstanding(amount) {
    this.understanding += amount;
  }

  display(pg) {
    pg.push();
    pg.fill(200, 100, 100);
    pg.noStroke();
    pg.ellipse(this.x, this.y, 50, 50); 
  
    if (this.showing) {
      let displayText = this.gettext(this.sentence);
      let boxX = this.x + 40;
      let boxY = this.y - 50;
      let boxW = pg.textWidth(displayText) + 20;
      let boxH = 40;
      pg.textAlign(LEFT, TOP);
      pg.textSize(16);
      pg.textFont('sans-serif');
      pg.fill(255);
      pg.stroke(0);
      pg.strokeWeight(1);
      pg.rect(boxX, boxY, boxW, boxH, 10); 
      pg.fill(0);
      pg.text(displayText, boxX + 10, boxY + 10);
    }
  
    pg.pop();
  }
  

  gettext(sen) {
    let output = [];
    let starti = 0;
    for (let i = 0; i < sen.length; i++) {
      if (sen[i] != "(") {
        output[i] = sen[i];
        starti = i;
      } else {
        break;
      }
    }
    if (this.understanding < 0.3) {
      return "...... (......)";
    } else if (this.understanding < 0.5) {
      return output.join("") + sen.slice(starti + 1, starti + 6) + "......";
    } else {
      return sen;
    }
  }

  checkInteraction(px, py) {
    let d = dist(this.x, this.y, px, py);
    this.showing = d < 60;
  }
}
