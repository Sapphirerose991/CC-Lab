let theta;

let drawing1;
let drawing2;
let drawing3;
let drawing4;
let activeDrawing;
let fadingDrawing = null;

let shellcolor; 
let buoyancyY = 0;
let shellsize = 1;
let lightX, lightY;
function setup() {
    let canvas = createCanvas(800, 500);
    canvas.parent("p5-canvas-container");
    rectMode(CENTER);
    colorMode(HSB, 360, 100, 100);
    theta = 0;
    drawing1 = createGraphics(width,height+300);
    drawing2 = createGraphics(width,height+300);
    drawing3 = createGraphics(width,height+300);
    drawing4 = createGraphics(width,height+300);
    activeDrawing = drawing1;
    shellcolor = random(100, 180);
    lightX = 2 * width / 3;
    lightY = 2 * height / 3;
}

function draw() {
  let Brightness = map(lightY, height, 0, 0, 1);
  buoyancyY = map(Brightness, 0, 1,-200, 200);
  Background();
  drawCreature(mouseX,mouseY);
  noStroke();
  fill(60, 20, 100, 0.4);
  circle(lightX, lightY, 100);

  if (fadingDrawing != null) {
    fadingDrawing.erase(10);
    fadingDrawing.rect(0, 0, fadingDrawing.width, fadingDrawing.height);
    fadingDrawing.noErase();
  }
}

function drawCreature(x, y) {
  let followX = map(lightX, 0, width, -100, 100);
  let a = 5*shellsize;
  let b = 0.15;
  let finalTheta = 7 * PI;
  let finalR = a * exp(b * finalTheta);
  if(mouseIsPressed == true && theta<=7*PI){
  let r = a * exp(b * theta);
  let nx = mouseX + cos(theta)*r;
  let ny = mouseY + sin(theta) * r;
  activeDrawing.push();
  activeDrawing.translate(x,y);
  activeDrawing.rotate(theta);
  activeDrawing.fill(random(0,360),100,random(0,255));
  activeDrawing.arc(0, 0, r, r, -PI,-0.5*PI,PIE);
  activeDrawing.pop();
  theta +=0.3;
  let off = noise(frameCount/20) * 5;
  if (theta > 7 * PI) {
    drawHead(x, y, a, b,off);
  }
  }
  image(drawing1, followX*2 + noise(frameCount/20)*5 + sin(frameCount/20)*30, buoyancyY + sin(frameCount/20)*10);
image(drawing2, followX*2 + noise(frameCount/20)*5 + sin(frameCount/20)*10, buoyancyY + sin(frameCount/20)*20);
image(drawing3, followX*2 + noise(frameCount/20)*5 + sin(frameCount/20)*15,  buoyancyY + sin(frameCount/20));
image(drawing4, followX*2 + noise(frameCount/20)*5 + sin(frameCount/20)*20, buoyancyY + sin(frameCount/20)*30);
}

function drawHead(cx, cy, a, b,off){

  let finalTheta = 7 * PI;
  let r = a * exp(b * finalTheta);
  let headX = cx;
  let headY = cy + r * 0.3+buoyancyY;
  let d = dist(lightX, lightY, headX, headY);

  activeDrawing.push();
  activeDrawing.translate(cx, cy);

  activeDrawing.noStroke();
  let headcolor=random(0,255);
  activeDrawing.fill(headcolor, 50, 100);
  activeDrawing.circle(0, r*0.3, r * 0.5);
  
  let eyeX = -r * 0.1;
  let eyeY =  r * 0.3;
  activeDrawing.fill(360);
  activeDrawing.circle(eyeX,eyeY,r*0.2);

  activeDrawing.fill(100);
  activeDrawing.circle(-r*0.1,r*0.3,r*0.1);

  drawLegs(r);
  activeDrawing.pop();
}

function drawLegs(r){
  activeDrawing.push();
  activeDrawing.stroke(random(0,360),100,random(0,255));
  activeDrawing.strokeWeight(4);
  activeDrawing.noFill();
  for(let i = -1; i <= 1; i++){
    activeDrawing.beginShape();
    for(let t = 0; t < 1; t += 0.1){
      let wave = sin(frameCount * 0.1 + t * 10 + i) * r * 0.05;
      let lx = 25+t * r * 0.5;
      let ly = i * r * 0.1 + wave -0.25 *r;
      activeDrawing.vertex(-lx, -ly);
    }
    activeDrawing.endShape();
  }
  
  activeDrawing.pop();
}

function mousePressed(){
  console.log('mousePressed fuction');
  theta=0;
  shellsize = random(0.5, 1)
}


function Background(){
let dayNight = map(lightY, height, 0, 80, 0);
background(dayNight);
let s =12;
  background(0);
  let offx = noise(frameCount/20)*5;
  let offy = noise(frameCount/20)*5;
  for (let x=0;x<=width;x+=s){
    for (let y =0; y<=width; y+=s){
      let noiseVal = noise(x + frameCount/200, y);
      let s2 = map(noiseVal, 0, 1, 1,1.5*s);
      let d = dist(lightX, lightY, x, y)
      square(x,y,s2);
      let Brightness = map(lightY, height, 0, 20, 100);
      fill(map(noiseVal, 0, 1, 180, 250), d-50,Brightness);
      //fill(map(noiseVal, 0, 1, 180,250),100, map(cos(frameCount * 0.005), -1, 1, 20, 100));
    }

}
}

function keyPressed(){
  let step = 20;
  if(keyCode === LEFT_ARROW)  lightX -= step;
  if(keyCode === RIGHT_ARROW) lightX += step;
  if(keyCode === UP_ARROW)    lightY -= step;
  if(keyCode === DOWN_ARROW)  lightY += step;
}

function mouseReleased() {
  console.log("mouse released");
  if (activeDrawing == drawing1) {
    activeDrawing = drawing2;
    fadingDrawing = drawing3;
  } else if (activeDrawing == drawing2) {
    activeDrawing = drawing3;
    fadingDrawing = drawing4;
  } else if (activeDrawing == drawing3) {
    activeDrawing = drawing4;
    fadingDrawing = drawing1;
  } else if (activeDrawing == drawing4) {
    activeDrawing = drawing1;
    fadingDrawing = drawing2;
  }
}