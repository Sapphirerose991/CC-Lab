let haze;
let rounds = 0;
let end = false;
let intro = true;
let resolving = false; // Display
let resolveTimer = 0;

let page2 = false;
let page2Timer = 0;

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

let roundCooldown = 0; // Cooldown
let roundPeace = 0; //make peace
let alarmStarted = false; //alarm
let drumStarted = false; //drum

let cloud1;
let cloud2;

let hands = [],
  video,
  handPose;

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
    if (this.speedX < 0) {
      scale(-1, 1);
      image(imghawk, -this.s, 0, this.s, this.s);
    } else {
      image(imghawk, 0, 0, this.s, this.s);
    }
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
    if (this.speedX < 0) {
      scale(-1, 1);
      image(imgdove, -this.s, 0, this.s, this.s);
    } else {
      image(imgdove, 0, 0, this.s, this.s);
    }
    pop();
  }

  move() {
    this.x += this.speedX;
    this.y = (height / 2) * noise(frameCount / 300);
  }
}

class Mockingbird {
  constructor(x, y, flip = false) {
    this.x = x + random(-25, 25);
    this.y = y + random(-15, 15);
    this.speed = random(1, 3);
    this.drop = false;
    this.flip = flip;
  }
  display() {
    push();
    translate(this.x, this.y);
    if (this.flip) scale(-1, 1);
    if (this.drop) {
      scale(1, -1);
      tint(120, 0, 0);
      image(imgbird, -10, -10, 70, 70);
    } else {
      tint(150);
      image(imgbird, -10, -10, 70, 70);
    }

    noTint();
    pop();
  }
  move() {
    if (this.drop && this.y <= height - this.speed) {
      this.y += this.speed;
    } else {
      this.y += sin(frameCount * 0.05 + this.x) * 0.3;
    }
  }

  die() {
    this.drop = true;
  }
}

function preload() {
  img = loadImage("city.png");
  alarm = loadSound("waralarm.wav");
  imghawk = loadImage("hawk.png");
  imgdove = loadImage("dove.png");
  imgbird = loadImage("greybird.png");
  drum = loadSound("drum.mp3");
  fatigue = loadSound("fatiguecry.mp3");
  win = loadSound("youwin.mp3");
  lose = loadSound("youloseexplosion.mp3");
  peace = loadSound("peace.mp3");
  gunshot = loadSound("gunshot.mp3");
  telegram = loadSound("telegram.mp3");
  bleeding = loadSound("bleeding.mp3");
}

//round
function setupRound() {
  if (rounds == 0) {
    leftAnimal = new Hawk(100, height / 2, 100, 1);
    leftHP = 9;
    leftREP = 6;
    rightHP = 9;
    rightREP = 6;
  } else {
    if (random() < 0.5) {
      leftAnimal = new Hawk(100, height / 2, 100, 1);
    } else {
      leftAnimal = new Dove(100, height / 2, 100, 1);
    }
  }

  rightAnimal = null;
  cloud1.x = width / 2;
  cloud1.y = height / 2;

  cloud2.x = width / 2;
  cloud2.y = height / 2;

  leftBirds = [];
  rightBirds = [];

  for (let i = 0; i < leftHP; i++) {
    leftBirds.push(new Mockingbird(80, 50, true));
  }

  for (let i = 0; i < rightHP; i++) {
    rightBirds.push(new Mockingbird(720, 50));
  }
}

function killLeftBird() {
  if (leftBirds.length > 0) {
    let nBirds = leftBirds.length;
    let lastBird = nBirds - 1;

    let drop = leftBirds[lastBird];

    drop.die();
  }
}

function killRightBird() {
  if (rightBirds.length > 0) {
    let nBirds = rightBirds.length;
    let lastBird = nBirds - 1;

    let drop = rightBirds[lastBird];

    drop.die();
  }
}

function setup() {
  createCanvas(800, 500);
  haze = 150;

  cloud1 = new Cloud(width / 2, height / 2, 300, -1);
  cloud2 = new Cloud(width / 2, height / 2, 300, 1);
  setupRound();
}

function draw() {
  background(220);

  if (intro) {
    initialpage();
    controlDrum(false);
    return;
  }

  let marks = "";
  for (let i = 0; i < rounds + 1; i++) {
    marks += "| ";
  }
  text(marks, width / 2, 30);

  drawStats(30, 30, leftHP, leftREP, leftBirds);
  drawStats(width - 150, 30, rightHP, rightREP, rightBirds);
  tint(tintR, tintG, tintB, haze);
  image(img, 0, 0, 800, 500);
  noTint();

  if (end) {
    controlDrum(false);
    resolveTimer++;

    push();

    if (endingText == "You win the war") {
      let flash = map(sin(frameCount * 0.15), -1, 1, 80, 180);
      tint(255, flash, flash, 255);
    } else if (endingText == "You lose the war") {
      if (resolveTimer < 10) {
        background(255);
      } else {
        background(0);
      }
    } else if (endingText == "You make peace") {
      /*for (let i = 0; i =20; i++) {
        leftBirds.push(new dove(80, 50, true));
      }

      for (let i = 0; i =20; i++) {
        rightBirds.push(new dove(720, 50));
      }*/
      let restore = frameCount / 20;
      tint(tintR + restore, tintG + restore, tintB + restore, 255);
    } else if (endingText == "War Fatigue") {
      filter(GRAY);
      tint(tintR, tintG, tintB, fade);
    }

    image(img, 0, 0, 800, 500);

    fill(255);
    textAlign(CENTER);
    textSize(40);
    text(endingText, width / 2, height / 2);
    pop();
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
    } else if (leftAnimal.type === "hawk" && rightAnimal?.type === "dove") {
      leftAnimal.display();
    } else if (leftAnimal.type === "dove" && rightAnimal?.type === "hawk") {
      rightAnimal.display();
    } else if (leftAnimal.type === "dove" && rightAnimal?.type === "dove") {
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
    controlDrum(false);

    cloud1.display();
    cloud1.move();
    cloud2.display();
    cloud2.move();
    if (!telegram.isPlaying()) {
      telegram.play();
      setTimeout(() => {
        telegram.stop();
      }, 3000);
    }

    if (roundCooldown === 0) {
      setupRound();
    }

    return;
  }
  controlDrum(true);
  if (rightAnimal === null) {
    fill(255);
    textAlign(CENTER);
    textSize(24);
    if (rounds === 0) {
      text("Hit WAR to save your country!", width / 2, (2 * height) / 3);
    } else {
      text("Choose war or peace?", width / 2, (2 * height) / 3);
    }
  }

  // Your choice?
  fill(255);
  textAlign(LEFT);
  textSize(20);
  text("Your choice: " + inputText, 600, height - 20);

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
        gunshot.play();

        tintG -= 50;
        tintB -= 50;

        tintR = max(100, tintR);
        tintG = max(100, tintG);
        tintB = max(100, tintB);

        if (rounds == 0) {
          leftHP -= 1;
          killLeftBird();
          leftREP -= 3;

          rightHP -= 2;
          killRightBird();
          killRightBird();
          rightREP -= 0;
        } else {
          leftHP -= 1;
          rightHP -= 1;
          killLeftBird();

          leftREP -= 1;
          rightREP -= 1;
          killRightBird();
        }
        roundPeace = 0;
      }

      // Hawk VS Dove: bleeding
      else if (
        (leftAnimal.type === "hawk" && rightAnimal.type === "dove") ||
        (leftAnimal.type === "dove" && rightAnimal.type === "hawk")
      ) {
        bleeding.play();
        tintG -= 50;
        tintB -= 50;

        tintG = max(0, tintG);
        tintB = max(0, tintB);

        roundPeace = 0;
        if (leftAnimal.type === "hawk" && rightAnimal.type === "dove") {
          leftREP -= 2;
          rightHP -= 2;
          killRightBird();
          killRightBird();
        } else {
          rightREP -= 2;
          leftHP -= 2;
          killLeftBird();
          killLeftBird();
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
        roundPeace += 1;

        leftREP += 1;
        rightREP += 1;
      }

      rounds += 1;

      //moral collaspe
      if (leftREP <= 0) {
        leftHP -= 1;
      }

      if (rightREP <= 0) {
        rightHP -= 1;
      }

      resolving = true;
      resolveTimer = 180;
    }
  }
  if (rightHP <= 0) {
    fill(255, 0, 0);
    textAlign(CENTER);
    endingText = "You lose the war";
    lose.play();
    resolveTimer = 0;
    end = true;
  } else if (leftHP <= 0) {
    fill(255, 0, 0);
    textAlign(CENTER);
    endingText = "You win the war";
    win.play();
    resolveTimer = 0;
    end = true;
  } else if (leftREP >= 4 && rightREP >= 4 && roundPeace >= 2) {
    fill(255);
    textAlign(CENTER);
    endingText = "You make peace";
    peace.play();
    resolveTimer = 0;
    end = true;
  } else if (rounds > 7) {
    fill(0);
    textAlign(CENTER);
    textSize(40);
    fill(100);
    endingText = "War Fatigue";
    fatigue.loop();
    resolveTimer = 0;
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
    showTextTimer = 120;
    rightAnimal = new Hawk(width - 100, height / 2, 100, -1);
    inputText = "";
  } else if (inputText === "peace") {
    currentCommand = "peace";
    showTextTimer = 120;
    rightAnimal = new Dove(width - 100, height / 2, 100, -1);
    inputText = "";
  }
}

//HP and REP bar

function drawStats(x, y, HP, rep, Birds) {
  // HP green circles
  for (let b of Birds) {
    b.move();
    b.display();
  }

  // REP red squares
  for (let i = 0; i < rep; i++) {
    fill(255, 0, 0);
    rect(x + i * 18, y + 18, 12, 12);
  }
}

function initialpage() {
  //Instructions

  background(map(sin(frameCount / 50), -1, 1, 80, 180));
  textAlign(CENTER);
  textSize(18);
  fill(255);
  text(
    "People’s history of war lasts from the beginning of civilization.",
    width / 2,
    height / 2
  );
  text(
    "No doubt that you from 1000 years later will face the same problem as we face today.",
    width / 2,
    height / 2 + 20
  );
  text(
    "Remember, your choices decides your own future…",
    width / 2,
    height / 2 + 40
  );

  fill(
    255,
    map(sin(frameCount * 0.15), -1, 1, 80, 180),
    map(sin(frameCount * 0.15), -1, 1, 80, 180)
  );
  noStroke();

  rect(width / 2 - 50, height / 2 + 100, 100, 50);
  fill(0);
  text("Start", width / 2, height / 2 + 130);

  if (
    mouseIsPressed &&
    mouseX <= width / 2 + 50 &&
    mouseX >= width / 2 - 50 &&
    mouseY <= height / 2 + 150 &&
    mouseY >= height / 2 + 100
  ) {
    alarm.loop();
    page2 = true;
    page2Timer = 300;
  }

  if (page2) {
    background(0);
    textAlign(CENTER);
    textSize(20);
    fill(255);

    text(
      "Hawk VS Hawk: Bleeding and cost of reputation",
      width / 2,
      height / 2
    );
    text(
      "Dove VS Hawk: Dove gets killed, Hawk costs more reputation",
      width / 2,
      height / 2 + 20
    );
    text(
      "Dove VS Dove: restore reputation.",
      width / 2,
      height / 2 + 40
    );
    text("You have 8 rounds to make own choices.", width / 2, height / 2 + 60);

    page2Timer--;

    if (page2Timer <= 0) {
      page2 = false;
      intro = false;
      alarm.stop();
    }
    return;
  }
}

function controlDrum(drumPlay) {
  if (drumPlay) {
    if (!drumStarted) {
      drum.loop();
      drumStarted = true;
    }
  } else {
    if (drumStarted) {
      drum.stop();
      drumStarted = false;
    }
  }
}

class Cloud {
  constructor(x, y, s, d) {
    this.x = x;
    this.y = y;
    this.s = s;
    this.speedX = 2;
    this.dir = d;
  }
  display() {
    push();
    translate(this.x, this.y);
    noStroke();
    fill(map(sin(frameCount / 50), -1, 1, 80, 180));
    circle(0, 0, this.s);
    for (let angle = 0; angle < 360; angle += 36) {
      push();
      rotate(radians(angle));
      let s2 = map(noise(angle), 0, 1, this.s * 0.1, this.s);
      circle(this.s / 2, 0, s2);
      pop();
    }
    pop();
  }
  move() {
    this.x = this.x + this.dir * this.speedX;
    this.y = height * noise(frameCount / 300);
  }
}

function checkHandPush() {
  for (let hand of hands) {
    let x = hand.index_finger_tip.x;
    let push = x - hand.wrist.x;
    if (x < width / 2 && push < -30) {
      cloud1.moving = true;
    }

    if (x > width / 2 && push > 30) {
      cloud2.moving = true;
    }
  }
}
