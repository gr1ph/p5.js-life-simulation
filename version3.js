let creatures = [];
let food = [];
let predators = [];
let reproductionRate = 0.01;
let mutationRate = 0.01;
let populationLimit = 400;
let limitReached = false;
let creatureCountInput;
let foodSlider;
let predatorCheckbox;
let boundaryWrapCheckbox;

function setup() {
  createCanvas(800, 800);
  for (let i = 0; i < 10; i++) {
    creatures.push(new Creature(random(width), random(height)));
  }

  // Create number input field
  creatureCountInput = createInput('10', 'number');
  creatureCountInput.position(10, 10);

  // Create food slider
  foodSlider = createSlider(0, 100, 50);
  foodSlider.position(10, 30);
  foodSlider.style('width', '80px');

  // Create predator checkbox
  predatorCheckbox = createCheckbox('Predators', false);
  predatorCheckbox.position(10, 50);

  // Create boundary wrap checkbox
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
  if (predatorCheckbox.checked()) {
    for (let i = predators.length - 1; i >= 0; i--) {
      predators[i].update();
      predators[i].display();
      if (predators[i].isDead()) {
        predators.splice(i, 1);
      }
    }
  }

  // Update creatures
  for (let creature of creatures) {
    creature.update();
    creature.display();

    // Chance of reproduction
    if (creatures.length < populationLimit && random(1) < reproductionRate) {
      let child = creature.reproduce();
      if (random(1) < mutationRate) {
        child.mutate();
      }
      creatures.push(child);
    }

    // Check for predator
    if (predatorCheckbox.checked()) {
      for (let predator of predators) {
        if (dist(creature.position.x, creature.position.y, predator.position.x, predator.position.y) < creature.size) {
          creature.die();
        }
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

function mouseClicked() {
  if (creatureCountInput.value() > 0) {
    let count = int(creatureCountInput.value());
    for (let i = 0; i < count; i++) {
      creatures.push(new Creature(width / 2, height / 2));
    }
  }

  if (predatorCheckbox.checked()) {
    predators.push(new Predator(mouseX, mouseY));
  }
}

class Creature {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.energy = 100;
    this.size = 5;
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

  mutate() {
    this.velocity.rotate(random(-PI / 4, PI / 4));
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
    this.velocity.setMag(random(2, 4));
    this.size = 10;
    this.lifespan = 1000;
  }

  update() {
    this.position.add(this.velocity);
    this.lifespan--;
  }

  display() {
    fill(0, 0, 255);
    noStroke();
    ellipse(this.position.x, this.position.y, this.size * 2, this.size * 2);
  }

  isDead() {
    return this.lifespan <= 0;
  }

  wrap() {
    if (this.position.x < 0) this.position.x = width;
    if (this.position.x > width) this.position.x = 0;
    if (this.position.y < 0) this.position.y = height;
    if (this.position.y > height) this.position.y = 0;
  }
}
