// Swap Puzzle Image without Empty Spot
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/165-slide-puzzle.html
// https://youtu.be/uQZLzhrzEs4

// Source image to chop up
let source;

// Tiles configuration
let tiles = [];
let cols = 4; // Number of columns
let rows = 4; // Number of rows
let tileWidth, tileHeight; // Dimensions of each tile

// Order of tiles
let board = [];

// Loading the image and resizing
function preload() {
  source = loadImage('img/IMG_8088.JPG');
}

function setup() {
  // Resize the image to fit within the canvas
  source.resize(400, 0); // Resize width to 600px, maintain aspect ratio for height

  // Set canvas size based on aspect ratio of resized image
  createCanvas(source.width, source.height);

  // Calculate dimensions of each tile
  tileWidth = width / cols;
  tileHeight = height / rows;

  // Chop up source image into tiles and initialize board
  let tileImages = []; // Array to hold sections of the source image

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * tileWidth;
      let y = j * tileHeight;
      let img = createImage(tileWidth, tileHeight);
      img.copy(source, x, y, tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);
      tileImages.push(img);
    }
  }

  // Shuffle tile images
  shuffle(tileImages, true); // true means shuffling in place

  // Initialize tiles and board
  for (let i = 0; i < cols * rows; i++) {
    let index = i;
    let tile = new Tile(index, tileImages[i]); // Ensure each tile gets a unique section of the image
    tiles.push(tile);
    board.push(index);
  }
}

// Swap two elements of an array
// Track dragging state
let dragging = false;
let dragIndex = -1;
let offsetX, offsetY;

// Move based on click or drag
function mousePressed() {
  let i = floor(mouseX / tileWidth);
  let j = floor(mouseY / tileHeight);
  let clickedIndex = i + j * cols;

  if (isValidSwap(clickedIndex)) {
    dragging = true;
    dragIndex = clickedIndex;
    offsetX = mouseX - i * tileWidth;
    offsetY = mouseY - j * tileHeight;
  }
}

function mouseDragged() {
  if (dragging) {
    let i = floor(mouseX / tileWidth);
    let j = floor(mouseY / tileHeight);
    let newIndex = i + j * cols;

    // Swap if moved to a different tile
    if (newIndex !== dragIndex && isValidSwap(newIndex)) {
      swap(board, dragIndex, newIndex);
      dragIndex = newIndex;
    }
  }
}

function mouseReleased() {
  if (dragging) {
    dragging = false;
    dragIndex = -1;
  }
}

// Swap two elements of an array
function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

// Check if a swap with an adjacent tile is valid
function isValidSwap(clickedIndex) {
  let adjacentIndex = getAdjacentTileIndex(clickedIndex);
  return adjacentIndex !== -1; // If there is an adjacent tile, it's a valid swap
}

// Get index of adjacent tile if exists, otherwise return -1
function getAdjacentTileIndex(index) {
  let left = index - 1;
  let right = index + 1;
  let above = index - cols;
  let below = index + cols;

  // Check boundaries and return valid adjacent index
  if (left >= 0 && Math.floor(left / cols) === Math.floor(index / cols)) {
    return left;
  } else if (right < cols * rows && Math.floor(right / cols) === Math.floor(index / cols)) {
    return right;
  } else if (above >= 0) {
    return above;
  } else if (below < cols * rows) {
    return below;
  }
  return -1; // No valid adjacent tile
}

// The rest of your existing code remains the same...

function draw() {
  background(0);

  // Draw the current board
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let index = board[j * cols + i];
      let x = i * tileWidth;
      let y = j * tileHeight;
      let tileImage = tiles[index].img;
      image(tileImage, x, y, tileWidth, tileHeight);
    }
  }

  // Show it as grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * tileWidth;
      let y = j * tileHeight;
      strokeWeight(2);
      noFill();
      rect(x, y, tileWidth, tileHeight);
    }
  }

  // If it is solved
  if (isSolved()) {
    console.log('SOLVED');
  }
}

// Check if solved
function isSolved() {
  for (let i = 0; i < board.length; i++) {
    if (board[i] !== i) {
      return false;
    }
  }
  return true;
}


