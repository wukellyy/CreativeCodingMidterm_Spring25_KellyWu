// let shyShapes = [];

// function setup() {
//   createCanvas(windowWidth, windowHeight);

//   // Create multiple shy shapes
//   for (let i = 0; i < 50; i++) {
//     shyShapes.push(new ShyShape(random(width), random(height)));
//   }
// }

// function draw() {
//   background(240, 245, 255); // Soft pastel blue

//   for (let shape of shyShapes) {
//     shape.update();
//     shape.display();
//   }
// }

// class ShyShape {
//   constructor(x, y) {
//     this.x = x;
//     this.y = y;
//     this.size = random(10, 30);
//     this.opacity = 255;
//   }

//   update() {
//     // Calculate the distance between cursor and shy shape
//     let d = dist(mouseX, mouseY, this.x, this.y);

//     // If cursor is close, shy away (reduce size and decrease opacity)
//     if (d < 60) {
//       if (this.size > 5) {
//         this.size -= 0.5;
//       }
//       if (this.opacity > 50) {
//         this.opacity -= 5;
//       }
//     }
//     // If cursor is far, slowly come out of shell (grow and increase opacity)
//     else {
//       if (this.size < 30) {
//         this.size += 0.2;
//       }
//       if (this.opacity < 255) {
//         this.opacity += 2;
//       }
//     }
//   }

//   display() {
//     fill(150, 180, 255, this.opacity); // Soft blue, transparent
//     noStroke();
//     ellipse(this.x, this.y, this.size);
//   }
// }

let shyShape;
let approachingShape;
let actNum = 1;
let isNextToShy = false;
let pauseStartTime = 0;
let pauseDuration = 3000;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);

  shyShape = new ShyShape(width / 2, height / 2);
  approachingShape = new ApproachingShape(-50, height / 2);
}

function draw() {
  background(240, 245, 255); // Pastel blue

  // Handle animation cycles
  if (actNum === 1) {
    moveTowardState(shyShape, approachingShape);
  } else if (actNum === 2) {
    moveAwayState(shyShape, approachingShape);
  } else if (actNum === 3) {
    moveTowardState(shyShape, approachingShape);
  }
}

function moveAwayState(shyShape, approachingShape) {
  approachingShape.moveAway(shyShape);
  shyShape.update(approachingShape);

  shyShape.display();
  approachingShape.display();

  if (isNextToShy) {
    pauseStartTime = millis(); // Start the pause timer
  }

  if (!isNextToShy && millis() - pauseStartTime > pauseDuration) {
    console.log("act 3 now");
    actNum = 3;
  }
}

function moveTowardState(shyShape, approachingShape) {
  approachingShape.moveToward(shyShape);
  shyShape.update(approachingShape);

  shyShape.display();
  approachingShape.display();

  if (isNextToShy && pauseStartTime === 0) {
    pauseStartTime = millis(); // Start the pause timer
  }

  if (isNextToShy && millis() - pauseStartTime > pauseDuration) {
    if (actNum === 1) {
      console.log("act 2 now");
      actNum = 2;
    } else if (actNum === 3) {
      // console.log("act 4 now");
      actNum = 3;
    }
  }
}

class ShyShape {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 50;
    this.opacity = 255;
    this.comfortLevel = 0;
  }

  update(other) {
    let d = dist(other.x, other.y, this.x, this.y);

    // If shy shape is comfortable with this approaching shape, it remains in a normal state
    if (this.comfortLevel >= 3) {
      this.normalState();
    }
    // If approaching shape gets close, shy shape shinks and decrease its opacity
    else if (d < 80) {
      if (this.comfortLevel === 2 && this.size > 30) {
        this.size -= 0.5;
      } else if (this.size > 20) {
        this.size -= 0.5;
      }

      if (this.opacity > 50) {
        this.opacity -= 5;
      }
    }
    // If approaching shape is away, shy shape grows and increase its opacity
    else {
      if (this.size < 50) {
        this.size += 0.2;
      }

      if (this.opacity < 255) {
        this.opacity += 2;
      }
    }
  }

  normalState() {
    this.size = 50;
    this.opacity = 255;
  }

  display() {
    fill(150, 180, 255, this.opacity); // Light blue
    noStroke();
    ellipse(this.x, this.y, this.size);
  }
}

class ApproachingShape {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 50;
    this.speed = 2;
  }

  moveToward(target) {
    console.log("moving towards shy shape");
    if (this.x < target.x - 70) {
      this.x += this.speed;
    } else {
      isNextToShy = true;
      this.comfortLevel += 1;
    }
  }

  moveAway() {
    console.log("moving away shy shape");
    if (this.x > -50) {
      this.x -= this.speed;
    } else {
      isNextToShy = false;
    }
  }

  display() {
    fill(255, 110, 110); // Red

    noStroke();
    rect(this.x, this.y, this.size, this.size);
  }
}
