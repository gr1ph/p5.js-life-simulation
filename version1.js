let creatures = [];
let food = [];
let reproductionRate = 0.01;
let populationLimit = 400;
let limitReached = false;
let creatureCountInput;
let foodSlider;

function setup() {
  createCanvas(800, 800);
  for (let i = 0; i < 10; i++) {
    creatures.push(new Creature(random(width), random(height)));
  }

  // Create number input field
  creatureCountInput = createInput('10', 'number');
  creatureCountInput.position(10, 10);

  // Create food slider
  foodSlider = createSlider(0, 100, 100);
  foodSlider.position(10, 30);
  foodSlider.style('width', '80px');
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
  
  for (let creature of creatures) {
    creature.update();
    creature.display();
    
    // Chance of reproduction
    if (creatures.length < populationLimit && random(1) < reproductionRate) {
      creatures.push(creature.reproduce());
    }
  }

  for (let f of food) {
    fill(0, 255, 0);
    noStroke();
    ellipse(f.x, f.y, 5, 5);
  }

  // Check if population limit is reached
  if (creatures.length >= populationLimit && !limitReached) {
    limitReached = true;
    alert("Limit Reached");
  }
}

function mouseClicked() {
  if (creatureCountInput.value() > 0) {
    let count = int(creatureCountInput.value());
    for (let i = 0; i < count; i++) {
      creatures.push(new Creature(width / 2, height / 2));
    }
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

  die() {
    let index = creatures.indexOf(this);
    creatures.splice(index, 1);
  }
}
