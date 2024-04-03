const NUM_OF_IMAGES = 25;
const WIDTH = 640;
const HEIGHT = 480;

let images = [];
let average;
let noiseOffsets = []; // Array to store noise offsets for each image
let cycleIndex = 0; // Index for cycling through images faintly
let cycleFrameCounter = 0; // Frame counter for cycling images

function preload() {
  for (let i = 0; i < NUM_OF_IMAGES; i++) {
    const fileName = `./test/${i}.jpg`;
    images.push(loadImage(fileName));
  }
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  pixelDensity(1);

  images = images.map(img => {
    let tmpImg = createImage(WIDTH, HEIGHT);
    let {width: sw, height: sh} = img;
    const wRatio = WIDTH / sw;
    const hRatio = HEIGHT / sh;
    const ratio = max(wRatio, hRatio);
    sw *= ratio;
    sh *= ratio;
    img.resize(sw, sh);
    const ox = (WIDTH - sw) / 2;
    const oy = (HEIGHT - sh) / 2;
    tmpImg.copy(img, 0, 0, sw, sh, ox, oy, WIDTH, HEIGHT);
    return tmpImg;
  });

  // Initialize noise offsets for each image
  for (let i = 0; i < NUM_OF_IMAGES; i++) {
    noiseOffsets.push({x: random(1000), y: random(1000)});
  }

  // Calculate the average image
  average = createImage(WIDTH, HEIGHT);
  average.loadPixels();
  images.forEach(img => {
    img.loadPixels();
    for (let i = 0; i < img.pixels.length; i += 4) {
      average.pixels[i] += img.pixels[i] / NUM_OF_IMAGES;
      average.pixels[i + 1] += img.pixels[i + 1] / NUM_OF_IMAGES;
      average.pixels[i + 2] += img.pixels[i + 2] / NUM_OF_IMAGES;
      average.pixels[i + 3] = 255; // Ensure full opacity
    }
  });
  average.updatePixels();
}

function draw() {
  background(255);
  image(average, 0, 0); // Display the average image

  for (let i = 0; i < NUM_OF_IMAGES; i++) {
    let offsetX = noise(noiseOffsets[i].x) * 30 - 15;
    let offsetY = noise(noiseOffsets[i].y) * 30 - 15;
    noiseOffsets[i].x += 0.001;
    noiseOffsets[i].y += 0.004;

    tint(255, 25);
    image(images[i], offsetX, offsetY, WIDTH, HEIGHT);
    noTint();
  }

  // Faintly cycle through each image very slowly
  if (cycleFrameCounter % 15 == 0) { // Change image every 300 frames for a slow cycle
    cycleIndex = (cycleIndex + 1) % NUM_OF_IMAGES;
  }
  cycleFrameCounter++;

  tint(255, 10); // Very faint visibility for the cycling image
  image(images[cycleIndex], 0, 0, WIDTH, HEIGHT);
  noTint();
}
