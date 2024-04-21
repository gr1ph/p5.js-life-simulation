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

function setup() {
  createCanvas(800, 800);
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

class Creature {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(1, 3));
    this.energy = 100;
    this.size = 5;
    this.reproductionRate = random(0.001, 0.01);
  }

  update() {
    // Move
    this.position.add(this.velocity);
    this.energy -= 0.1;

    // Eat food
    for (let i = food.length - 1; i >= 0; i--) {
      let f = food[i];
      if (dist(this.position.x, this.position.y, f.x, f.y) < this.size) {
        this.energy += 20;
        food.splice(i, 1);
      }
    }

    // Check energy level
    if (this.energy <= 0) {
      this.die();
    }

    // Attract predators
    for (let predator of predators) {
      let d = dist(this.position.x, this.position.y, predator.position.x, predator.position.y);
      if (d < 50) {
        let steer = p5.Vector.sub(this.position, predator.position);
        steer.setMag(0.1);
        predator.velocity.add(steer);
      }
    }
  }

  display() {
    fill(255, 0, 0);
    noStroke();
    ellipse(this.position.x, this.position.y, this.size * 2, this.size * 2);
  }

  reproduce() {
    this.energy /= 2;
    return new Creature(this.position.x, this.position.y);
  }

  die() {
    let index = creatures.indexOf(this);
    creatures.splice(index, 1);
  }

  wrap() {
    if (this.position.x < 0) this.position.x = width;
    if (this.position.x > width) this.position.x = 0;
    if (this.position.y < 0) this.position.y = height;
    if (this.position.y > height) this.position.y = 0;
  }
}

class Predator {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(1, 3));
    this.size = 10;
    this.energy = 100;
  }

  update() {
    // Move
    this.position.add(this.velocity);
    this.energy -= 0.1;

    // Check energy level
    if (this.energy <= 0) {
      this.die();
    }

    // Attract creatures
    for (let creature of creatures) {
      let d = dist(this.position.x, this.position.y, creature.position.x, creature.position.y);
      if (d < 50) {
        let steer = p5.Vector.sub(this.position, creature.position);
        steer.setMag(0.1);
        this.velocity.add(steer);
      }
    }
  }

  display() {
    fill(0, 0, 255);
    noStroke();
    ellipse(this.position.x, this.position.y, this.size * 2, this.size * 2);
  }

  isDead() {
    return this.energy <= 0;
  }

  die() {
    let index = predators.indexOf(this);
    predators.splice(index, 1);
  }

  wrap() {
    if (this.position.x < 0) this.position.x = width;
    if (this.position.x > width) this.position.x = 0;
    if (this.position.y < 0) this.position.y = height;
    if (this.position.y > height) this.position.y = 0;
  }
}
