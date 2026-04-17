let redStrength;
let haze;
let hawk1;
let dove;
let merged = false;
class Hawk {
  constructor(x, y, s, initialSpeed) {
    this.x = x;
    this.y = y;
    this.s = s;
    this.speedX = initialSpeed;
    this.type = "hawk";
  }

  display() {
    push();
    translate(this.x, this.y);
    noStroke();
    fill(0);
    rect(0, 0, this.s);
    pop();
  }

  move() {
    this.x += this.speedX;
    this.y = (height / 4) * noise(frameCount / 300);
    
  }
}

class Dove {
  constructor(x, y, s, initialSpeed) {
    this.x = x;
    this.y = y;
    this.s = s;
    this.speedX = initialSpeed;
    this.type = "dove";
  }

  display() {
    push();
    translate(this.x, this.y);
    noStroke();
    fill(255);
    circle(0, 0, this.s);
    pop();
  }

  move() {
    this.x += this.speedX;
    this.y = (height / 2) * noise(frameCount / 300);
  }
}
function preload() {
  img = loadImage("city.png");
}
function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  haze = 150;
  hawk1 = new Hawk(100, height / 5, 100, 1);
  dove1 = new Dove(width - 100, height / 4, 100, -1);
  
  if (random() < 0.5){
    leftAnimal = new Hawk(100, height / 2, 100, 1);
  }else{
    leftAnimal = new Dove(100, height / 2, 100, 1);
  }

  if (random() < 0.5){
    rightAnimal = new Hawk(width - 100, height / 2, 100, -1);
  }else{
    rightAnimal = new Dove(width - 100, height / 2, 100, -1);
  }
}

function draw() {
  background(220);
  haze = map(mouseY, height, 0, 100, 255);
  image(img, 0, 0, 800, 500);

  let d = dist(leftAnimal.x, leftAnimal.y, rightAnimal.x, rightAnimal.y);
  if (d < leftAnimal.s / 2 + rightAnimal.s / 2) {

    // Hawk + Hawk
    if (leftAnimal.type === "hawk" && rightAnimal.type === "hawk") {
      redStrength = map(leftAnimal.x, width, 0, 255, 0);
      tint(255, 255 - redStrength, 255 - redStrength, haze);
      leftAnimal.speedX = 0;
      rightAnimal.speedX = 0;
      
    }

    // Hawk + Dove
    else if (
      (leftAnimal.type === "hawk" && rightAnimal.type === "dove") ||
      (leftAnimal.type === "dove" && rightAnimal.type === "hawk")
    ) {
      merged = true;
      redStrength = map(leftAnimal.x, width, 0, 255, 0);
      tint(255, 255 - redStrength, 255 - redStrength, haze);
      if (leftAnimal.type === "hawk") {
        leftAnimal.speedX = 0;
      } else {
        rightAnimal.speedX = 0;
      }
    }
    // Dove + Dove
    else {
      leftAnimal.speedX = -1;
      rightAnimal.speedX = 1;
    }
  }

  if (!merged) {
    leftAnimal.move();
    rightAnimal.move();
    leftAnimal.display();
    rightAnimal.display();
  } else {
    if (leftAnimal.type === "hawk") {
      leftAnimal.move();
      leftAnimal.display();
    } else {
      rightAnimal.move();
      rightAnimal.display();
    }
  }
}
