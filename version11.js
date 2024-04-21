let creatures = [];
let food = [];
let predators = [];
let populationLimit = 400;
let limitReached = false;
let creatureCountInput;
let foodSlider;
let addCreatureButton;
let predatorCountInput;
let addPredatorButton;
let boundaryWrapCheckbox;
let startTime;
let populationHistory = [];
let foodHistory = [];
let predatorHistory = [];

function setup() {
  createCanvas(800, 800);
  startTime = millis(); // Start the timer

  for (let i = 0; i < 10; i++) {
    creatures.push(new Creature(random(width), random(height)));
  }

  // Create number input field for creatures
  creatureCountInput = createInput('10', 'number');
  creatureCountInput.position(10, 10);

  // Create button to add creatures
  addCreatureButton = createButton('Add Creature');
  addCreatureButton.position(140, 10);
  addCreatureButton.mousePressed(addCreature);

  // Create food slider
  foodSlider = createSlider(0, 100, 50);
  foodSlider.position(10, 30);
  foodSlider.style('width', '80px');

  // Create number input field for predators
  predatorCountInput = createInput('0', 'number');
  predatorCountInput.position(10, 50);

  // Create button to add predators
  addPredatorButton = createButton('Add Predator');
  addPredatorButton.position(140, 50);
  addPredatorButton.mousePressed(addPredator);

  // Create checkbox for boundary wrap
  boundaryWrapCheckbox = createCheckbox('Boundary Wrap', false);
  boundaryWrapCheckbox.position(10, 70);
}

function draw() {
  background(220);

  // Check if 30 seconds have elapsed
  if (millis() - startTime > 30000) {
    noLoop(); // Stop the simulation
    createGraph(); // Create the graph
    return;
  }

  // Display timer at the top right corner
  let elapsedTime = Math.floor((millis() - startTime) / 1000);
  fill(0);
  textSize(20);
  textAlign(RIGHT);
  text("Time: " + elapsedTime, width - 10, 20);

  // Update food amount
  let newFoodAmount = foodSlider.value();
  if (newFoodAmount < food.length) {
    food.splice(0, food.length - newFoodAmount);
  } else {
    for (let i = food.length; i < newFoodAmount; i++) {
      food.push(createVector(random(width), random(height)));
    }
  }

  // Update predators
  for (let i = predators.length - 1; i >= 0; i--) {
    predators[i].update();
    predators[i].display();
    if (predators[i].isDead()) {
      predators.splice(i, 1);
    }
  }

  // Update creatures
  for (let creature of creatures) {
    creature.update();
    creature.display();

    // Chance of reproduction
    if (creatures.length < populationLimit && random(1) < creature.reproductionRate) {
      let child = creature.reproduce();
      creatures.push(child);
    }

    // Check for predator
    for (let predator of predators) {
      if (dist(creature.position.x, creature.position.y, predator.position.x, predator.position.y) < creature.size) {
        creature.die();
      }
    }
  }

  // Check if population limit is reached
  if (creatures.length >= populationLimit && !limitReached) {
    limitReached = true;
    alert("Limit Reached");
  }

  // Wrap around the boundaries
  if (boundaryWrapCheckbox.checked()) {
    for (let creature of creatures) {
      creature.wrap();
    }
    for (let predator of predators) {
      predator.wrap();
    }
  }

  // Record population history
  populationHistory.push(creatures.length);
  foodHistory.push(food.length);
  predatorHistory.push(predators.length);
}

function addCreature() {
  let count = int(creatureCountInput.value());
  for (let i = 0; i < count; i++) {
    creatures.push(new Creature(random(width), random(height)));
  }
}

function addPredator() {
  let count = int(predatorCountInput.value());
  for (let i = 0; i < count; i++) {
    predators.push(new Predator(random(width), random(height)));
  }
}

function createGraph() {
  let graph = createGraphics(width, height / 2);
  graph.background(220);

  // Draw population graph
  graph.stroke(0);
  graph.noFill();
  graph.beginShape();
  for (let i = 0; i < populationHistory.length; i++) {
    let x = map(i, 0, populationHistory.length - 1, 0, width);
    let y = map(populationHistory[i], 0, populationLimit, height / 2, 0);
    graph.vertex(x, y);
  }
  graph.endShape();

  // Display graph
  image(graph, 0, height / 2);

  // Display information box
  fill(255);
  rect(0, 0, width, height / 2);

  fill(0);
  textSize(16);
  textAlign(LEFT);
  let infoX = 10;
  let infoY = 20;
  let lineHeight = 20;

  // Display timestamps
  text("Timestamps:", infoX, infoY);
  infoY += lineHeight;
  for (let i = 0; i < populationHistory.length; i++) {
    let timestamp = i * 1000; // Assuming each frame is 1 second
    text(timestamp + "ms", infoX, infoY);
    infoY += lineHeight;
  }

  // Display population numbers
  infoY += lineHeight;
  text("Population:", infoX, infoY);
  infoY += lineHeight;
  for (let i = 0; i < populationHistory.length; i++) {
    text(populationHistory[i], infoX, infoY);
    infoY += lineHeight;
  }

  // Display food numbers
  infoY += lineHeight;
  text("Food:", infoX, infoY);
  infoY += lineHeight;
  for (let i = 0; i < foodHistory.length; i++) {
    text(foodHistory[i], infoX, infoY);
    infoY += lineHeight;
  }

  // Display predator population numbers
  infoY += lineHeight;
  text("Predators:", infoX, infoY);
  infoY += lineHeight;
  for (let i = 0; i < predatorHistory.length; i++) {
    text(predatorHistory[i], infoX, infoY);
    infoY += lineHeight;
  }
}

class Creature {
  // Constructor, update, display, reproduce, die, wrap methods unchanged
}

class Predator {
  // Constructor, update, display, isDead, die, wrap methods unchanged
}
