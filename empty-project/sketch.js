let haze;
let rounds = 0;
let end = false;

let leftAnimal;
let rightAnimal = null;

let leftHP;
let leftREP;

let rightHP;
let rightREP;

let inputText = "";
let currentCommand = "";
let showTextTimer = 0;
let endingText = "";

let tintR = 255;
let tintG = 255;
let tintB = 255;

let resolving = false; // Display
let resolveTimer = 0;

let roundCooldown = 0; // Cooldown
let roundPeace = 0; //make peace



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
    rect(0,0, this.s);
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


//round
function setupRound() {
   if (rounds === 0) {
    leftAnimal = new Hawk(100, height / 2, 100, 1);
    leftHP=8;
    leftREP = 3;
    rightHP=7;
    rightREP = 6;
  }else{
  if (random() < 0.5) {
    leftAnimal = new Hawk(100, height / 2, 100, 1);
  } else {
    leftAnimal = new Dove(100, height / 2, 100, 1);
  }}

  rightAnimal = null;
}



function setup() {
  createCanvas(800, 500);
  haze = 150;
  setupRound();
}

function draw() {
  background(220);
  
  drawStats(30,30,leftHP,leftREP);
  drawStats(width-150,height-50,rightHP,rightREP);
  tint(tintR, tintG, tintB, haze);
  image(img, 0, 0, 800, 500);
  

if (end) {
  if (
    endingText == "You win the war" ||
    endingText == "You lose the war"
  ) {
    let flash = map(sin(frameCount * 0.15), -1, 1, 80, 180);
    tint(255, flash, flash, 255);
  }

  else if (endingText == "You make peace") {
    let glow = map(sin(frameCount * 0.05), -1, 1, 230, 255);
    tint(glow, glow, glow, 255);
  }

  else if (endingText == "War Fatigue") {
    let fade = map(sin(frameCount * 0.03), -1, 1, 90, 140);
    tint(fade, fade, fade, 255);
  }

  image(img, 0, 0, 800, 500);

  fill(255);
  textAlign(CENTER);
  textSize(40);
  text(endingText, width / 2, height / 2);

  return;
}
  // Display 
  if (resolving) {
  resolveTimer--;

  if (leftAnimal.type === "dove" && rightAnimal?.type === "dove") {
    leftAnimal.x -= 1;
    rightAnimal.x += 1;
  }

  if (leftAnimal.type === "hawk" && rightAnimal?.type === "hawk") {
    leftAnimal.display();
    rightAnimal.display();
  }

  else if (leftAnimal.type === "hawk" && rightAnimal?.type === "dove") {
    leftAnimal.display();
  }

  else if (leftAnimal.type === "dove" && rightAnimal?.type === "hawk") {
    rightAnimal.display();
  }

  else if (leftAnimal.type === "dove" && rightAnimal?.type === "dove") {
    leftAnimal.display();
    rightAnimal.display();
  }

  if (resolveTimer <= 0) {
    resolving = false;
    rightAnimal = null;
    roundCooldown = 60 * 3;
  }

  return;
}

  // Cooling
  if (roundCooldown > 0) {
    roundCooldown--;

    fill(255);
    textAlign(CENTER);
    textSize(30);
    text("Next round is coming...", width / 2, height / 2);

    if (roundCooldown === 0) {
      setupRound();
    }

    return;
  }


  if (rightAnimal === null) {
    fill(255);
    textAlign(CENTER);
    textSize(24);
    if (rounds === 0) {
      text("Hit WAR to save your country!", width / 2, 2 * height / 3);
    } else {
      text("Choose war and peace?", width / 2, 2 * height / 3);
    }
  }

  // Your choice?
  fill(255);
  textAlign(LEFT);
  textSize(20);
  text("Your choice: " + inputText, 20, height - 20);

  // WAR or Peace?
  if (showTextTimer > 0) {
    textAlign(CENTER);
    textSize(50);
    if (currentCommand == "war") {
      fill(255, 0, 0);
      text("WAR", width / 2, 100);
    } else if (currentCommand == "peace") {
      fill(255);
      text("PEACE", width / 2, 100);
    }

    showTextTimer--;
  }


  //  left and right animal

    leftAnimal.display();
  
  if (rightAnimal !== null) {
    leftAnimal.move();
    rightAnimal.move();
    rightAnimal.display();

    let d = dist(leftAnimal.x, leftAnimal.y, rightAnimal.x, rightAnimal.y);

    if (d < leftAnimal.s / 2 + rightAnimal.s / 2) {
      // Hawk VS Hawk: haze
      if (leftAnimal.type === "hawk" && rightAnimal.type === "hawk") {
        tintR -= 15;
        tintG -= 30;
        tintB -= 30;

        tintR = max(100, tintR);
        tintG = max(100, tintG);
        tintB = max(100, tintB);
        
        leftHP -= 1;
        rightHP -= 1;

        leftREP -= 1;
        rightREP -= 1;
        
        roundPeace =0;
      }

      // Hawk VS Dove: bleeding
      else if (
        (leftAnimal.type === "hawk" && rightAnimal.type === "dove") ||
        (leftAnimal.type === "dove" && rightAnimal.type === "hawk")
      ) {
        tintG -= 30;
        tintB -= 30;

        tintG = max(0, tintG);
        tintB = max(0, tintB);
        
        roundPeace =0;
        if(leftAnimal.type === "hawk" && rightAnimal.type === "dove"){
        leftREP -= 1;
        rightHP -= 2;
        }
        else{
        rightREP -= 1;
        leftHP -= 2;
        }
      }

      // Dove VS Dove: restoring
      else {
        tintR += 20;
        tintG += 20;
        tintB += 20;

        tintR = min(255, tintR);
        tintG = min(255, tintG);
        tintB = min(255, tintB);
        roundPeace+= 1;
        
        leftREP += 1;
        rightREP += 1;
      }

      rounds += 1;

      resolving = true;
      resolveTimer = 60; // 1秒
    }
  }
  if(rightHP==0){
    fill(255,0,0)
    textAlign(CENTER);
    endingText = "You lose the war";
    end = true;
     }
  else if(leftHP==0){
    tint(tintR, tintG, tintB, haze);
    fill(255,0,0)
    textAlign(CENTER);
    endingText = "You win the war";
    end = true;
     }
  else if(leftREP >=4 &&rightREP>=4 && roundPeace >= 2){
    tint(tintR, tintG, tintB, haze);
    fill(255);
    textAlign(CENTER);
    endingText = "You make peace";
    end = true;
  }
  else if (rounds >9) {
    tint(tintR, tintG, tintB, 30);
    fill(255);
    textAlign(CENTER);
    textSize(40);
    fill(100);
    endingText = "War Fatigue";
    end = true;
  }
}




// Hawk or Dove Input
function keyPressed() {
  if (keyCode === BACKSPACE) {
    inputText = inputText.slice(0, -1);
  } else {
    inputText += key.toLowerCase();
  }

  if (inputText === "war") {
    currentCommand = "war";
    showTextTimer = 60;
    rightAnimal = new Hawk(width - 100, height / 2, 100, -1);
    inputText = "";
  } else if (inputText === "peace") {
    currentCommand = "peace";
    showTextTimer = 60;
    rightAnimal = new Dove(width - 100, height / 2, 100, -1);
    inputText = "";
  }
}

//HP and REP bar

function drawStats(x, y, HP, rep) {

  // HP green circles
  for (let i = 0; i < HP; i++) {
    fill(0,255,0);
    noStroke();
    circle(x + i * 18, y, 12);
  }

  // REP red squares
  for (let i = 0; i < rep; i++) {
    fill(255,0,0);
    rect(x + i * 18, y + 18, 12, 12);
  }
}
