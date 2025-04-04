// Scene 1 variables
let shyShapes = [];
let blueR = 150;
let blueG = 180;
let blueB = 255;
let pinkR = 255;
let pinkG = 150;
let pinkB = 180;
let bgR = 240;
let bgG = 245;
let bgB = 255;

// Scene 2 variables
let shyShape;
let approachingShape;
let actNum = 1;
let isNextToShy = false;
let pauseStartTime = 0;
let pauseDurationNear = 3000;
let pauseDurationAway = 3000;

// Scene 3 variables
let xPos;
let shyShapeSize = 50;
let moveSpeed = 5;
let spotlightSize = 200;
let isBehindCurtain = false;
let peekTimer = 0;
let peekDelay = 3500;
let isPeeking = false;

let stageFloorY;
let audience = [];
let audienceRows = 7;
let audienceCols = 25;
let stageHeight = 150;
let headSize = 20;
let bodyWidth = 25;
let bodyHeight = 35;

let peekCount = 0;
let isAudienceCheering = false;

// Scene control variables
let currScene = 3;
let sceneChangeTime = 0;
let sceneDuration = { scene1: 15000, scene2: 2000, scene3: 60000 };
let sceneRunning = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  if (!sceneRunning) {
    initializeScene();
  }

  if (currScene == 1) {
    drawScene1();
  } else if (currScene == 2) {
    drawScene2();
  } else if (currScene == 3) {
    drawScene3();
  }
}

function initializeScene() {
  // Handle initialization for the running scene
  rectMode(CENTER);

  if (currScene === 1) {
    // Create multiple shy shapes
    for (let i = 0; i < 50; i++) {
      shyShapes.push(new ShyShapeScene1(random(width), random(height)));
    }
    sceneChangeTime = millis();
  } else if (currScene === 2) {
    shyShape = new ShyShapeScene2(width / 2, height / 2);
    approachingShape = new ApproachingShape(-50, height / 2, [255, 110, 110]);
    sceneChangeTime = millis();
  } else if (currScene === 3) {
    rectMode(CORNER);
    xPos = width / 2;

    stageFloorY = height * 0.75;
    createAudience();

    sceneChangeTime = millis();
  }

  sceneRunning = true;
}

function transitionToScene(newScene) {
  currScene = newScene;
  sceneRunning = false;

  // Reset variables based on which scene we're transitioning from
  if (newScene === 2) {
    shyShapes = [];
  } else if (newScene === 3) {
    actNum = 1;
    isNextToShy = false;
  } else if (newScene === 1) {
    isBehindCurtain = false;
    isPeeking = false;
  }

  sceneChangeTime = 0;
}

function drawScene1() {
  // console.log("in scene 1");

  let blushing = false; // Check if any shy shape is blushing

  for (let shape of shyShapes) {
    if (shape.isBlushing) {
      blushing = true;
      break;
    }
  }

  // Define target background colors
  // Soft blue if cursor is far; blushing pink if cursor is near
  let targetR = blushing ? 255 : 240;
  let targetG = blushing ? 245 : 245;
  let targetB = blushing ? 255 : 255;

  // Transition background RGB values
  let transitionSpeed = 0.5;

  if (bgR < targetR) {
    bgR += transitionSpeed;
  }
  if (bgR > targetR) {
    bgR -= transitionSpeed;
  }

  if (bgG < targetG) {
    bgG += transitionSpeed;
  }
  if (bgG > targetG) {
    bgG -= transitionSpeed;
  }

  if (bgB < targetB) {
    bgB += transitionSpeed;
  }
  if (bgB > targetB) {
    bgB -= transitionSpeed;
  }

  background(bgR, bgG, bgB);

  for (let shape of shyShapes) {
    shape.update();
    shape.display();
  }

  // Switch to Scene 2
  if (millis() - sceneChangeTime > sceneDuration.scene1) {
    transitionToScene(2);
    // console.log("switching to scene 2");
  }
}

class ShyShapeScene1 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(10, 30);
    this.opacity = 255;
    this.isBlushing = false;
  }

  update() {
    // Calculate the distance between cursor and shy shape
    let d = dist(mouseX, mouseY, this.x, this.y);

    // If cursor is close, shy away (reduce size and decrease opacity)
    if (d < 40) {
      this.isBlushing = true;

      if (this.size > 5) {
        this.size -= 0.3;
      }
      if (this.opacity > 50) {
        this.opacity -= 4;
      }
    }
    // If cursor is far, slowly come out of shell (grow and increase opacity)
    else {
      this.isBlushing = false;

      if (this.size < 30) {
        this.size += 0.2;
      }
      if (this.opacity < 255) {
        this.opacity += 2;
      }
    }
  }

  display() {
    // Calculate the distance between cursor and shy shape
    let d = dist(mouseX, mouseY, this.x, this.y);

    // Determine the blend between blue (t = 0) and pink (t = 1)
    let t = (40 - d) / 40;
    // If too far, stay blue
    if (t < 0) {
      t = 0;
    }
    // If very close, full pink
    if (t > 1) {
      t = 1;
    }

    let r = blueR + t * (pinkR - blueR);
    let g = blueG + t * (pinkG - blueG);
    let b = blueB + t * (pinkB - blueB);

    fill(r, g, b, this.opacity);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }
}

function drawScene2() {
  // console.log("in scene 2");

  if (actNum < 9) {
    background(240, 245, 255); // Pastel blue
  }

  // Handle animation cycles
  if (actNum === 1) {
    // console.log("act 1 now");
    moveTowardState(shyShape, approachingShape);
  } else if (actNum === 2) {
    // console.log("act 2 now");
    moveAwayState(shyShape, approachingShape);
  } else if (actNum === 3) {
    // console.log("act 3 now");
    moveTowardState(shyShape, approachingShape);
  } else if (actNum === 4) {
    // console.log("act 4 now");
    moveAwayState(shyShape, approachingShape);
  } else if (actNum === 5) {
    // console.log("act 5 now");
    moveTowardState(shyShape, approachingShape);
  } else if (actNum === 6) {
    // console.log("act 6 now");
    moveAwayState(shyShape, approachingShape);
  } else if (actNum === 7) {
    // console.log("act 7 now");
    moveTowardState(shyShape, approachingShape);
  }

  // Start scene change timer after act 7 is finished
  if (actNum === 8 && millis() - pauseStartTime > pauseDurationNear) {
    sceneChangeTime = millis();
    actNum = 9;
  }

  // Switch to Scene 1 after Scene 2 duration
  if (actNum === 9 && millis() - sceneChangeTime > sceneDuration.scene2) {
    transitionToScene(3);
    // console.log("switching to scene 3");
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

    // Jump variables
    this.jumpOffset = 0;
    this.hasJumped = false;
    this.jumpingUp = false;
  }

  update(other) {
    let d = dist(other.x, other.y, this.x, this.y);
    // console.log("comfortLevel:", other.comfortLevel);
    // console.log("this.hasJumped:", this.hasJumped);

    // If shy shape is comfortable with this approaching shape, it remains in a normal state
    if (other.comfortLevel >= 4) {
      this.normalState();
      if (!this.hasJumped) {
        this.jumpingUp = true;
        this.hasJumped = true;
      }
    }
    // If approaching shape gets close, shy shape shinks and decrease its opacity
    // The amount will depend on comfort level
    else if (d < 80) {
      if (other.comfortLevel === 3) {
        if (!this.shrinkStartTime) {
          this.shrinkStartTime = millis();
        }

        // Shrink a bit then go back to normal
        if (millis() - this.shrinkStartTime < 400) {
          if (this.size > 20) this.size -= 0.2;
          if (this.opacity > 50) this.opacity -= 5;
        } else {
          if (this.size < 50) this.size += 0.2;
          if (this.opacity < 255) this.opacity += 5;

          // Jump when returning to normal
          if (!this.hasJumped) {
            this.jumpingUp = true;
            this.hasJumped = true;
          }
        }
      } else {
        if (this.size > 20) this.size -= 0.5;
        if (this.opacity > 50) this.opacity -= 5;
      }
    }
    // If approaching shape is away, shy shape grows and increase its opacity
    else {
      if (this.size < 50) this.size += 0.2;
      if (this.opacity < 255) this.opacity += 2;
    }

    // Handle Jump Animation
    if (this.jumpingUp) {
      this.jumpOffset -= 2;
      if (this.jumpOffset <= -15) {
        this.jumpingUp = false;
      }
    } else if (this.jumpOffset < 0) {
      this.jumpOffset += 2;
    }

    if (isNextToShy === false) {
      // console.log("is next to shy");
      this.hasJumped = false;
    }
  }

  normalState() {
    this.size = 50;
    this.opacity = 255;
  }

  display() {
    fill(150, 180, 255, this.opacity); // Soft blue
    noStroke();
    ellipse(this.x, this.y + this.jumpOffset, this.size);
  }
}

class ApproachingShape {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.size = 50;
    this.speed = 3;
    this.comfortLevel = 0;
    this.hasIncremented = false;
    this.color = color;

    // Jump variables
    this.jumpOffset = 0;
    this.hasJumped = false;
    this.jumpingUp = false;
  }

  moveToward(target) {
    // console.log("moving towards shy shape");

    if (this.x < target.x - 70) {
      this.x += this.speed;
      this.hasIncremented = false;
    } else {
      isNextToShy = true;

      if (!this.hasJumped) {
        this.jumpingUp = true;
        this.hasJumped = true;
      }

      if (!this.hasIncremented) {
        this.comfortLevel += 1;
        this.hasIncremented = true;
      }
    }

    // Handle jump animation
    if (this.jumpingUp) {
      this.jumpOffset -= 2;
      if (this.jumpOffset <= -15) {
        this.jumpingUp = false;
      }
    } else if (this.jumpOffset < 0) {
      this.jumpOffset += 2;
    }
  }

  moveAway() {
    // console.log("moving away shy shape");

    if (this.x > -50) {
      this.x -= this.speed;
      this.hasJumped = false; // Reset jump trigger when moving away
      this.jumpOffset = 0; // Reset jump position
    } else {
      isNextToShy = false;
    }
  }

  display() {
    fill(this.color);
    noStroke();
    rect(this.x, this.y + this.jumpOffset, this.size, this.size);
  }
}

function createAudience() {
  audience = [];
  const seatPadding = 30;
  const rowPadding = 3;
  const personWidth = bodyWidth;
  const personHeight = headSize + bodyHeight;

  // Calculate total audience width and starting position
  const totalAudienceWidth =
    audienceCols * personWidth + (audienceCols - 1) * seatPadding;
  const startX = (width - totalAudienceWidth) / 2;
  const startY = stageFloorY - 50;

  for (let row = 0; row < audienceRows; row++) {
    for (let col = 0; col < audienceCols; col++) {
      const x = startX + col * (personWidth + seatPadding);
      const y = startY + row * (personHeight + rowPadding);
      audience.push(new AudienceMember(x, y));
    }
  }
}

function drawScene3() {
  // console.log("in scene 3");

  background(50); // Gray

  drawStage();
  updateShyShapePosition();
  drawShyShape();
  drawCurtains();
  drawAudience();
  drawDimLights();
  drawSpotlight();

  // Switch to Scene 1
  if (millis() - sceneChangeTime > sceneDuration.scene3) {
    // transitionToScene(1);
    // console.log("switching to scene 1");
  }
}

function drawStage() {
  // Stage Floor
  fill(92, 60, 0); // Brown
  rect(0, stageFloorY - stageHeight, width, stageHeight);

  // Wooden Planks
  stroke(80, 50, 0); // Darker brown
  for (let i = 0; i < width; i += 50) {
    line(i, stageFloorY - stageHeight, i, stageFloorY);
  }
}

function updateShyShapePosition() {
  // Shy shape returns back to the center of stage
  if (peekCount >= 6) {
    // Check if we're to the left or right of center
    if (xPos < width / 2) {
      xPos += moveSpeed; // Move right
    } else if (xPos > width / 2) {
      xPos -= moveSpeed; // Move left
    }

    return;
  }

  let shyShapeX = xPos;
  let shyShapeY = stageFloorY - stageHeight - 25;
  let distance = dist(mouseX, mouseY, shyShapeX, shyShapeY);

  checkCurtainPosition(shyShapeX);

  if (isPeeking) {
    handlePeekingBehavior(shyShapeX, distance);
  }

  // Handle movement when not behind curtain and not peeking
  if (!isBehindCurtain && !isPeeking) {
    handleSpotlightMovement(shyShapeX, distance);
  }
}

function checkCurtainPosition(shyShapeX) {
  if (peekCount >= 6) {
    return;
  }

  // Shy Shape is behind left curtain
  if (shyShapeX < 75) {
    isBehindCurtain = true;
    if (millis() - peekTimer > peekDelay) {
      if (!isPeeking) {
        peekCount++;
        console.log("Peek count:", peekCount);
      }
      isPeeking = true;
    }
  }
  // Shy Shape is behind right curtain
  else if (shyShapeX > width - 75) {
    isBehindCurtain = true;
    if (millis() - peekTimer > peekDelay) {
      if (!isPeeking) {
        peekCount++;
        console.log("Peek count:", peekCount);
      }
      isPeeking = true;
    }
  }
  // Shy Shape is not behind curtains anymore
  else {
    isBehindCurtain = false;
    isPeeking = false;
  }

  // Audience cheers when about to peek 3 times
  if (peekCount === 6 - 1) {
    isAudienceCheering = true;
  }
}

function handlePeekingBehavior(shyShapeX, distance) {
  if (shyShapeX < width / 2) {
    // console.log("peeking out of left curtain");
    xPos += 10;
  } else {
    // console.log("peeking out of right curtain");
    xPos -= 10;
  }

  // If the shy shape is in the spotlight, hide behind the curtain
  if (distance < spotlightSize / 2 + shyShapeSize / 2) {
    if (shyShapeX < width / 2) {
      // console.log("going back in left curtain");
      xPos -= 10;
    } else {
      // console.log("going back in right curtain");
      xPos += 10;
    }

    isBehindCurtain = true;
    isPeeking = false;
    peekTimer = millis();
  }
}

function handleSpotlightMovement(shyShapeX, distance) {
  if (!(mouseX < 100 || mouseX > width - 100)) {
    if (distance < spotlightSize / 2 + shyShapeSize / 2) {
      let overlapRatio =
        (spotlightSize / 2 + shyShapeSize / 2 - distance) / (spotlightSize / 2);
      if (overlapRatio > 0.5) {
        if (mouseX < shyShapeX) {
          xPos += moveSpeed; // Move right
        } else {
          xPos -= moveSpeed; // Move left
        }
      }
    }
  } else {
    // console.log("spotlight on curtain");
  }
}

function drawShyShape() {
  noStroke();
  fill(150, 180, 255); // Soft blue
  ellipse(xPos, stageFloorY - stageHeight - 25, shyShapeSize, shyShapeSize);
}

function drawCurtains() {
  drawCurtain(0, 0, 100, stageFloorY - stageHeight); // Left curtain
  drawCurtain(width - 100, 0, 100, stageFloorY - stageHeight); // Right curtain
}

function drawCurtain(x, y, w, h) {
  noStroke();

  push();
  translate(x, y);

  // Draw curtain with red gradient
  for (let i = 0; i < w; i++) {
    // Calculate shade from left (darker) to right (lighter)
    let darkness = map(i, 0, w, 40, 0);
    fill(200 - darkness, 0, 0);
    rect(i, 0, 1, h);
  }

  // Add ripples for details
  fill(160, 0, 0); // Darker red
  rect(w * 0.3, 0, 8, h); // Left fold
  rect(w * 0.6, 0, 8, h); // Right fold

  pop();
}

function drawAudience() {
  for (let member of audience) {
    member.update();
    member.display();
  }
}

function drawDimLights() {
  noStroke();
  fill(0, 100);
  rect(0, 0, width, height);
}

function drawSpotlight() {
  fill(200, 200, 150, 70);
  ellipse(mouseX, mouseY, spotlightSize, spotlightSize);
}

class AudienceMember {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.headSize = headSize;
    this.bodyWidth = bodyWidth;
    this.bodyHeight = bodyHeight;
    this.cheering = false;
    this.cheerTimer = 0;
    this.cheerOffset = 0;
    this.cheerRotation = 0;
    this.cheerDirection = random([-1, 1]);
    this.rotationSpeed = random([0.0005, 0.0007, 0.002]);
    this.maxRotation = 0.07;
    this.cheerDuration = 5000;
  }

  display() {
    push();

    if (this.cheering) {
      translate(this.x + this.bodyWidth / 2, this.baseY + this.bodyHeight / 2);
      rotate(this.cheerRotation);
      translate(
        -(this.x + this.bodyWidth / 2),
        -(this.baseY + this.bodyHeight / 2)
      );
    }

    // Body
    fill(this.cheering ? 255 : 200);
    rect(
      this.x,
      this.baseY + this.cheerOffset,
      this.bodyWidth,
      this.bodyHeight
    );

    // Head
    fill(this.cheering ? 255 : 230);
    ellipse(
      this.x + this.bodyWidth / 2,
      this.baseY - this.headSize / 2 + this.cheerOffset,
      this.headSize
    );

    pop();

    this.drawSeat();
  }

  drawSeat() {
    // Backrest
    fill(200, 0, 0); // Red
    rect(this.x - 5, this.y + 3, this.bodyWidth + 10, this.bodyHeight + 15, 10);

    // Armrests
    fill(120, 0, 0); // Darker red
    let armrestWidth = 9.7;
    let armrestHeight = 30;

    rect(this.x - armrestWidth - 5, this.y + 20, armrestWidth, armrestHeight); // Left armrest
    rect(this.x + this.bodyWidth + 5, this.y + 20, armrestWidth, armrestHeight); // Right armrest
  }

  cheer() {
    this.cheering = true;
    this.cheerTimer = millis();
  }

  update() {
    if (isAudienceCheering && !this.cheering) {
      this.cheer();
    }

    if (this.cheering) {
      // Jumping animation
      this.cheerOffset = sin(frameCount * 0.2) * 5;

      // Rotation animation with individual speeds
      this.cheerRotation += this.cheerDirection * this.rotationSpeed;
      if (abs(this.cheerRotation) > this.maxRotation) {
        this.cheerDirection *= -1;
      }

      // Stop cheering after duration
      if (millis() - this.cheerTimer > this.cheerDuration) {
        this.cheering = false;
        this.cheerOffset = 0;
        this.cheerRotation = 0;
      }
    }
  }
}
