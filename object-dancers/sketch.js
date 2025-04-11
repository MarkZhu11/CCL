/*
  Check our the GOAL and the RULES of this exercise at the bottom of this file.
  
  After that, follow these steps before you start coding:

  1. rename the dancer class to reflect your name (line 35).
  2. adjust line 20 to reflect your dancer's name, too.
  3. run the code and see if a square (your dancer) appears on the canvas.
  4. start coding your dancer inside the class that has been prepared for you.
  5. have fun.
*/

let dancer;  

function setup() {  
  // no adjustments in the setup function needed...  
  let canvas = createCanvas(windowWidth, windowHeight);  
  canvas.parent("p5-canvas-container");  

  // ...except to adjust the dancer's name on the next line:  
  dancer = new Yanhan(width / 2, height / 2);  
}  

function draw() {  
  // you don't need to make any adjustments inside the draw loop  
  background(0);  
  drawFloor(); // for reference only  

  dancer.update();  
  dancer.display();  
}  

// You only code inside this class.  
// Start by giving the dancer your name, e.g. LeonDancer.  
class Yanhan {  
  constructor(startX, startY) {  
    this.x = startX;  
    this.y = startY;  
    // add properties for your dancer here:  
    //..  
    //..  
    //..  
  }  

  update() { 
    // update properties here to achieve  
    // your dancer's desired moves and behaviour  
    this.y = height/2 - 10 * sin(frameCount*0.1);
  }  

  display() {  
    // the push and pop, along with the translate   
    // places your whole dancer object at this.x and this.y.  
    // you may change its position on line 19 to see the effect.  
    push();  
    translate(this.x, this.y);  
    // circle(0,0,50)  
    // ******** //  
    // ⬇️ draw your dancer from here ⬇️  
    let angle = sin(frameCount * 0.1);  
    angle = map(angle, -1, 1, -PI / 10, PI / 10);  

    for (let i = 0; i <= 10; i++) {  
      noStroke();  
      let colorShift = sin(frameCount * 0.05) * 50;  

      let inter = map(i, 0, 10, 0, 1);  
      let baseColor = color(255, 204 + colorShift, 0);  
      let endColor = color(230, 180 + colorShift, 0);  

      let bodyColor = lerpColor(baseColor, endColor, inter);  
      let lightColor = lerpColor(bodyColor, color(255, 255, 180), 0.3);  
      let shadowColor = lerpColor(bodyColor, color(150, 120, 0), 0.3);  

      fill(lerpColor(lightColor, shadowColor, i / 10));  

      beginShape();  
      for (let a = PI / 3; a < (PI * 5) / 3; a += 0.1) {  
        let x = cos(a) * (100 - i * 2);  
        let y = sin(a) * (100 - i * 2);  
        curveVertex(x, y);  
      }  
      for (let a = (PI * 8) / 6; a > (PI * 5) / 6; a -= 0.1) {  
        let x = cos(a) * (85 - i * 2);  
        let y = sin(a) * (85 - i * 2);  
        curveVertex(x + 50, y);  
      }  
      endShape(CLOSE);  
    }  

    push();  
    rotate(PI / 3);  
    fill(40, 30, 30);  
    ellipse(-55, -70, 30, 20);  

    fill(50, 40, 40); 
    ellipse(88, 5, 27, 16);  
    pop();  
     
    let eyeX = sin(frameCount * 0.1) * 5;  
    let eyeY = cos(frameCount * 0.1) * 5;  

    fill(255);  
    ellipse(-40, -40, 30, 30);  
    fill(0);  
    ellipse(-40 + eyeX, -40 + eyeY, 15, 15);  

    fill(255);  
    ellipse(0, -45, 35, 35);  
    fill(0);  
    ellipse(0 + eyeX * 1.5, -45 + eyeY * 1.5, 20, 20);  

    let limbColor = color(200, 160, 0);  
    stroke(limbColor);  
    strokeWeight(5);  

    // 左手  
    push();  
    translate(-70, 0);  
    rotate(angle);  
    line(0, 0, 70, 0);  
    push();  
    translate(70, 0);  
    rotate(angle);  
    line(0, 0, 60, 0);  
    pop();  
    pop();  

    // 右手  
    push();  
    translate(-20, 0);  
    rotate(-angle);  
    line(0, 0, 70, 0);  
    push();  
    translate(70, 0);  
    rotate(-angle);  
    line(0, 0, 60, 0);  
    pop();  
    pop();  

    // 左腿  
    push();  
    translate(-60, 70);  
    rotate(angle * 0.6 + PI / 3);  
    line(0, 0, 50, 0);  
    push();  
    translate(50, 0);  
    rotate(-angle + PI / 2);  
    line(0, 0, 40, 0);  
    pop();  
    pop();  

    // 右腿  
    push();  
    translate(-10, 70);  
    rotate(angle * 0.6 + PI / 3);  
    line(0, 0, 50, 0);  
    push();  
    translate(50, 0);  
    rotate(-angle + PI / 2);  
    line(0, 0, 40, 0);  
    pop();  
    pop();  

    noStroke();  
    fill(220, 220, 100, 100); // 半透明灰色  
    ellipse(-80 - 10 * sin(frameCount * 0.1), 125 + 10 * sin(frameCount * 0.1), 150 + 20 * sin(frameCount * 0.1), 30);  
    
    // ⬆️ draw your dancer above ⬆️  
    // ******** //  

    // the next function draws a SQUARE and CROSS  
    // to indicate the approximate size and the center point  
    // of your dancer.  
    // it is using "this" because this function, too,   
    // is a part of your Dancer object.  
    // comment it out or delete it eventually.  
    pop();  
  }  

}  

/*  
GOAL:  
The goal is for you to write a class that produces a dancing being/creature/object/thing. In the next class, your dancer along with your peers' dancers will all dance in the same sketch that your instructor will put together.   

RULES:  
For this to work you need to follow one rule:   
  - Only put relevant code into your dancer class; your dancer cannot depend on code outside of itself (like global variables or functions defined outside)  
  - Your dancer must perform by means of the two essential methods: update and display. Don't add more methods that require to be called from outside (e.g. in the draw loop).  
  - Your dancer will always be initialized receiving two arguments:   
    - startX (currently the horizontal center of the canvas)  
    - startY (currently the vertical center of the canvas)  
  beside these, please don't add more parameters into the constructor function   
  - lastly, to make sure our dancers will harmonize once on the same canvas, please don't make your dancer bigger than 200x200 pixels.   
*/