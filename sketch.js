let shyShapes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create multiple shy shapes
  for (let i = 0; i < 50; i++) {
    shyShapes.push(new ShyShape(random(width), random(height)));
  }
}

function draw() {
  background(240, 245, 255); // Soft pastel blue

  for (let shape of shyShapes) {
    shape.update();
    shape.display();
  }
}

class ShyShape {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(10, 30);
    this.opacity = 255;
  }

  update() {
    // Calculate the distance between cursor and shy shape
    let dx = mouseX - this.x;
    let dy = mouseY - this.y;
    let dSquared = dx * dx + dy * dy;

    // If cursor is close, shy away (reduce size and decrease opacity)
    if (dSquared < 3600) {
      if (this.size > 5) this.size -= 0.5;
      if (this.opacity > 50) this.opacity -= 5;
    }
    // If cursor is far, slowly come out of shell (grow and increase opacity)
    else {
      if (this.size < 30) this.size += 0.2;
      if (this.opacity < 255) this.opacity += 2;
    }
  }

  display() {
    fill(150, 180, 255, this.opacity); // Soft blue, transparent
    noStroke();
    ellipse(this.x, this.y, this.size);
  }
}
