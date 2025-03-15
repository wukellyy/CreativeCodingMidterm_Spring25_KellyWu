// Scene 1 variables
let shyShapes = [];

// Scene 2 variables
let shyShape;
let approachingShape;
let actNum = 1;
let isNextToShy = false;
let pauseStartTime = 0;
let pauseDurationNear = 3000;
let pauseDurationAway = 2000;

// Scene control variables
let curr_scene = 1;
let sceneChangeTime = 0;
let sceneDuration = { scene1: 20000, scene2: 2000 };
let scene_running = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
}

function draw() {
  // Initializing variables for the scene
  if (!scene_running) {
    if (curr_scene === 1) {
      // Create multiple shy shapes
      for (let i = 0; i < 50; i++) {
        shyShapes.push(new ShyShapeScene1(random(width), random(height)));
      }
      sceneChangeTime = millis();
    } else {
      shyShape = new ShyShapeScene2(width / 2, height / 2);
      approachingShape = new ApproachingShape(-50, height / 2);
      sceneChangeTime = millis();
    }

    scene_running = true;
  }

  if (curr_scene === 1) {
    console.log("in scene 1");

    background(240, 245, 255); // Pastel blue

    for (let shape of shyShapes) {
      shape.update();
      shape.display();
    }

    // Switch to Scene 2
    if (millis() - sceneChangeTime > sceneDuration.scene1) {
      curr_scene = 2;
      scene_running = false;

      // Reset variables
      shyShapes = [];
      sceneChangeTime = 0;

      console.log("switching to scene 2");
    }
  } else {
    console.log("in scene 2");

    if (actNum < 9) {
      background(240, 245, 255); // Pastel blue
    }

    // Handle animation cycles
    if (actNum === 1) {
      console.log("act 1 now");
      moveTowardState(shyShape, approachingShape);
    } else if (actNum === 2) {
      console.log("act 2 now");
      moveAwayState(shyShape, approachingShape);
    } else if (actNum === 3) {
      console.log("act 3 now");
      moveTowardState(shyShape, approachingShape);
    } else if (actNum === 4) {
      console.log("act 4 now");
      moveAwayState(shyShape, approachingShape);
    } else if (actNum === 5) {
      console.log("act 5 now");
      moveTowardState(shyShape, approachingShape);
    } else if (actNum === 6) {
      console.log("act 6 now");
      moveAwayState(shyShape, approachingShape);
    } else if (actNum === 7) {
      console.log("act 7 now");
      moveTowardState(shyShape, approachingShape);
    }

    // Start scene change timer after act 7 is finished
    if (actNum === 8 && millis() - pauseStartTime > pauseDurationNear) {
      sceneChangeTime = millis();
      actNum = 9;
    }

    // Switch to Scene 1 after Scene 2 duration
    if (actNum === 9 && millis() - sceneChangeTime > sceneDuration.scene2) {
      curr_scene = 1;
      scene_running = false;

      // Reset variables
      actNum = 1;
      isNextToShy = false;
      sceneChangeTime = 0;

      console.log("switching to scene 1");
    }
  }
}

class ShyShapeScene1 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(10, 30);
    this.opacity = 255;
  }

  update() {
    // Calculate the distance between cursor and shy shape
    let d = dist(mouseX, mouseY, this.x, this.y);

    // If cursor is close, shy away (reduce size and decrease opacity)
    if (d < 40) {
      if (this.size > 5) {
        this.size -= 0.5;
      }
      if (this.opacity > 50) {
        this.opacity -= 5;
      }
    }
    // If cursor is far, slowly come out of shell (grow and increase opacity)
    else {
      if (this.size < 30) {
        this.size += 0.2;
      }
      if (this.opacity < 255) {
        this.opacity += 2;
      }
    }
  }

  display() {
    fill(150, 180, 255, this.opacity); // Soft blue
    noStroke();
    ellipse(this.x, this.y, this.size);
  }
}

function moveAwayState(shyShape, approachingShape) {
  approachingShape.moveAway(shyShape);
  shyShape.update(approachingShape);

  shyShape.display();
  approachingShape.display();

  if (isNextToShy && pauseStartTime === 0) {
    pauseStartTime = millis(); // Start the pause timer
  }

  if (!isNextToShy && millis() - pauseStartTime > pauseDurationAway) {
    pauseStartTime = 0; // Reset timer
    if (actNum === 2) {
      actNum = 3;
    } else if (actNum === 4) {
      actNum = 5;
    } else if (actNum === 6) {
      actNum = 7;
    }
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

  if (isNextToShy && millis() - pauseStartTime > pauseDurationNear) {
    pauseStartTime = 0; // Reset timer
    if (actNum === 1) {
      actNum = 2;
    } else if (actNum === 3) {
      actNum = 4;
    } else if (actNum === 5) {
      actNum = 6;
    } else if (actNum === 7) {
      actNum = 8;
    }
  }
}

class ShyShapeScene2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 50;
    this.opacity = 255;
    this.shrinkStartTime = null;
  }

  update(other) {
    let d = dist(other.x, other.y, this.x, this.y);

    // If shy shape is comfortable with this approaching shape, it remains in a normal state
    if (other.comfortLevel >= 4) {
      this.normalState();
    }
    // If approaching shape gets close, shy shape shinks and decrease its opacity
    else if (d < 80) {
      if (other.comfortLevel === 3) {
        if (!this.shrinkStartTime) {
          this.shrinkStartTime = millis();
        }
        // Shrink a bit then go back to normal
        if (millis() - this.shrinkStartTime < 400) {
          if (this.size > 20) {
            this.size -= 0.2;
          }

          if (this.opacity < 255) {
            this.opacity -= 5;
          }
        } else {
          if (this.size < 50) {
            this.size += 0.2;
          }

          if (this.opacity < 255) {
            this.opacity += 5;
          }
        }
      } else {
        if (this.size > 20) {
          this.size -= 0.5;
        }

        if (this.opacity > 50) {
          this.opacity -= 5;
        }
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
    fill(150, 180, 255, this.opacity); // Soft blue
    noStroke();
    ellipse(this.x, this.y, this.size);
  }
}

class ApproachingShape {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 50;
    this.speed = 3;
    this.comfortLevel = 0;
    this.hasIncremented = false;
  }

  moveToward(target) {
    console.log("moving towards shy shape");
    if (this.x < target.x - 70) {
      this.x += this.speed;
      this.hasIncremented = false;
    } else {
      isNextToShy = true;

      if (!this.hasIncremented) {
        this.comfortLevel += 1;
        this.hasIncremented = true;
      }
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
