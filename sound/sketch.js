/*
Template for IMA's Creative Coding Lab 

Project A: Generative Creatures
CCLaboratories Biodiversity Atlas 
*/

let s;

function setup() {
    let canvas = createCanvas(800, 500);
    canvas.id("p5-canvas");
    canvas.parent("p5-canvas-container");
}

function draw() {
    background(200);
}

function preload(){
    s = loadSound{"8 (4).mp3"};
 function mp(){
    if (mouseIsPressed){
        s.play();
    }
 }
