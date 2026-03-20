let scanned = [];
let skater1;
let skater2;
let skater3;


let cursk;

function preload() {
  mySound = loadSound("living-sketches/spinjump.mp3");
  for (let i = 1; i <= 3; i++) {
    scanned.push(loadImage("sk" + i + ".jpg"));
  }
}

function setup() {
  createCanvas(800, 500);

  eraseBg(scanned, 10);
  
}

function draw() {
  background(180,200,map(255,0,mouseX,200,255));
  imageMode(CENTER);
  if (mouseIsPressed == true) {
    cursk = scanned[round((frameCount / 10) % 1)];
  } else {
    cursk = scanned[2];
  }

  image(
    cursk,
    mouseX,
    height/2,
    scanned[0].width * 0.25,
    scanned[0].height * 0.25
  );

  
  
}

// You shouldn't need to modify these helper functions:

function crop(imgs, x, y, w, h) {
  let cropped = [];
  for (let i = 0; i < imgs.length; i++) {
    cropped.push(imgs[i].get(x, y, w, h));
  }
  return cropped;
}

function eraseBg(imgs, threshold = 10) {
  for (let i = 0; i < imgs.length; i++) {
    let img = imgs[i];
    img.loadPixels();
    for (let j = 0; j < img.pixels.length; j += 4) {
      let d = 255 - img.pixels[j];
      d += 255 - img.pixels[j + 1];
      d += 255 - img.pixels[j + 2];
      if (d < threshold) {
        img.pixels[j + 3] = 0;
      }
    }
    img.updatePixels();
  }
  // this function uses the pixels array
  // we will cover this later in the semester - stay tuned
}

function mousePressed() {
  userStartAudio();

  if (mySound.isPlaying()) {
    mySound.stop();
  }

  mySound.play();
}
