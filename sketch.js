// // Scene 1 variables
// let shyShapes = [];

// // Scene 2 variables
// let shyShape;
// let approachingShape;
// let actNum = 1;
// let isNextToShy = false;
// let pauseStartTime = 0;
// let pauseDurationNear = 3000;
// let pauseDurationAway = 3000;

// // Scene control variables
// let curr_scene = 1;
// let sceneChangeTime = 0;
// let sceneDuration = { scene1: 15000, scene2: 2000 };
// let scene_running = false;

// function setup() {
//   createCanvas(windowWidth, windowHeight);
//   rectMode(CENTER);
// }

// function draw() {
//   // Initializing variables for the scene
//   if (!scene_running) {
//     if (curr_scene === 1) {
//       // Create multiple shy shapes
//       for (let i = 0; i < 50; i++) {
//         shyShapes.push(new ShyShapeScene1(random(width), random(height)));
//       }
//       sceneChangeTime = millis();
//     } else {
//       shyShape = new ShyShapeScene2(width / 2, height / 2);
//       approachingShape = new ApproachingShape(-50, height / 2, [255, 110, 110]);
//       sceneChangeTime = millis();
//     }

//     scene_running = true;
//   }

//   if (curr_scene === 1) {
//     console.log("in scene 1");

//     background(240, 245, 255); // Pastel blue

//     for (let shape of shyShapes) {
//       shape.update();
//       shape.display();
//     }

//     // Switch to Scene 2
//     if (millis() - sceneChangeTime > sceneDuration.scene1) {
//       curr_scene = 2;
//       scene_running = false;

//       // Reset variables
//       shyShapes = [];
//       sceneChangeTime = 0;

//       console.log("switching to scene 2");
//     }
//   } else {
//     console.log("in scene 2");

//     if (actNum < 9) {
//       background(240, 245, 255); // Pastel blue
//     }

//     // Handle animation cycles
//     if (actNum === 1) {
//       console.log("act 1 now");
//       moveTowardState(shyShape, approachingShape);
//     } else if (actNum === 2) {
//       console.log("act 2 now");
//       moveAwayState(shyShape, approachingShape);
//     } else if (actNum === 3) {
//       console.log("act 3 now");
//       moveTowardState(shyShape, approachingShape);
//     } else if (actNum === 4) {
//       console.log("act 4 now");
//       moveAwayState(shyShape, approachingShape);
//     } else if (actNum === 5) {
//       console.log("act 5 now");
//       moveTowardState(shyShape, approachingShape);
//     } else if (actNum === 6) {
//       console.log("act 6 now");
//       moveAwayState(shyShape, approachingShape);
//     } else if (actNum === 7) {
//       console.log("act 7 now");
//       moveTowardState(shyShape, approachingShape);
//     }

//     // Start scene change timer after act 7 is finished
//     if (actNum === 8 && millis() - pauseStartTime > pauseDurationNear) {
//       sceneChangeTime = millis();
//       actNum = 9;
//     }

//     // Switch to Scene 1 after Scene 2 duration
//     if (actNum === 9 && millis() - sceneChangeTime > sceneDuration.scene2) {
//       curr_scene = 1;
//       scene_running = false;

//       // Reset variables
//       actNum = 1;
//       isNextToShy = false;
//       sceneChangeTime = 0;

//       console.log("switching to scene 1");
//     }
//   }
// }

// class ShyShapeScene1 {
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
//     if (d < 40) {
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
//     fill(150, 180, 255, this.opacity); // Soft blue
//     noStroke();
//     ellipse(this.x, this.y, this.size);
//   }
// }

// function moveAwayState(shyShape, approachingShape) {
//   approachingShape.moveAway(shyShape);
//   shyShape.update(approachingShape);

//   shyShape.display();
//   approachingShape.display();

//   if (isNextToShy && pauseStartTime === 0) {
//     pauseStartTime = millis(); // Start the pause timer
//   }

//   if (!isNextToShy && millis() - pauseStartTime > pauseDurationAway) {
//     pauseStartTime = 0; // Reset timer
//     if (actNum === 2) {
//       actNum = 3;
//     } else if (actNum === 4) {
//       actNum = 5;
//     } else if (actNum === 6) {
//       actNum = 7;
//     }
//   }
// }

// function moveTowardState(shyShape, approachingShape) {
//   approachingShape.moveToward(shyShape);
//   shyShape.update(approachingShape);

//   shyShape.display();
//   approachingShape.display();

//   if (isNextToShy && pauseStartTime === 0) {
//     pauseStartTime = millis(); // Start the pause timer
//   }

//   if (isNextToShy && millis() - pauseStartTime > pauseDurationNear) {
//     pauseStartTime = 0; // Reset timer
//     if (actNum === 1) {
//       actNum = 2;
//     } else if (actNum === 3) {
//       actNum = 4;
//     } else if (actNum === 5) {
//       actNum = 6;
//     } else if (actNum === 7) {
//       actNum = 8;
//     }
//   }
// }

// class ShyShapeScene2 {
//   constructor(x, y) {
//     this.x = x;
//     this.y = y;
//     this.size = 50;
//     this.opacity = 255;
//     this.shrinkStartTime = null;

//     // Jump variables
//     this.jumpOffset = 0;
//     this.hasJumped = false;
//     this.jumpingUp = false;
//   }

//   update(other) {
//     let d = dist(other.x, other.y, this.x, this.y);
//     console.log("comfortLevel:", other.comfortLevel);
//     console.log("this.hasJumped:", this.hasJumped);

//     // If shy shape is comfortable with this approaching shape, it remains in a normal state
//     if (other.comfortLevel >= 4) {
//       this.normalState();
//       if (!this.hasJumped) {
//         this.jumpingUp = true;
//         this.hasJumped = true;
//       }
//     }
//     // If approaching shape gets close, shy shape shinks and decrease its opacity
//     // The amount will depend on comfort level
//     else if (d < 80) {
//       if (other.comfortLevel === 3) {
//         if (!this.shrinkStartTime) {
//           this.shrinkStartTime = millis();
//         }

//         // Shrink a bit then go back to normal
//         if (millis() - this.shrinkStartTime < 400) {
//           if (this.size > 20) this.size -= 0.2;
//           if (this.opacity > 50) this.opacity -= 5;
//         } else {
//           if (this.size < 50) this.size += 0.2;
//           if (this.opacity < 255) this.opacity += 5;

//           // Jump when returning to normal
//           if (!this.hasJumped) {
//             this.jumpingUp = true;
//             this.hasJumped = true;
//           }
//         }
//       } else {
//         if (this.size > 20) this.size -= 0.5;
//         if (this.opacity > 50) this.opacity -= 5;
//       }
//     }
//     // If approaching shape is away, shy shape grows and increase its opacity
//     else {
//       if (this.size < 50) this.size += 0.2;
//       if (this.opacity < 255) this.opacity += 2;
//     }

//     // Handle Jump Animation
//     if (this.jumpingUp) {
//       this.jumpOffset -= 2;
//       if (this.jumpOffset <= -15) {
//         this.jumpingUp = false;
//       }
//     } else if (this.jumpOffset < 0) {
//       this.jumpOffset += 2;
//     }

//     if (isNextToShy === false) {
//       console.log("is next to shy");
//       this.hasJumped = false;
//     }
//   }

//   normalState() {
//     this.size = 50;
//     this.opacity = 255;
//   }

//   display() {
//     fill(150, 180, 255, this.opacity); // Soft blue
//     noStroke();
//     ellipse(this.x, this.y + this.jumpOffset, this.size);
//   }
// }

// class ApproachingShape {
//   constructor(x, y, color) {
//     this.x = x;
//     this.y = y;
//     this.size = 50;
//     this.speed = 3;
//     this.comfortLevel = 0;
//     this.hasIncremented = false;
//     this.color = color;

//     // Jump variables
//     this.jumpOffset = 0;
//     this.hasJumped = false;
//     this.jumpingUp = false;
//   }

//   moveToward(target) {
//     console.log("moving towards shy shape");

//     if (this.x < target.x - 70) {
//       this.x += this.speed;
//       this.hasIncremented = false;
//     } else {
//       isNextToShy = true;

//       if (!this.hasJumped) {
//         this.jumpingUp = true;
//         this.hasJumped = true;
//       }

//       if (!this.hasIncremented) {
//         this.comfortLevel += 1;
//         this.hasIncremented = true;
//       }
//     }

//     // Handle jump animation
//     if (this.jumpingUp) {
//       this.jumpOffset -= 2;
//       if (this.jumpOffset <= -15) {
//         this.jumpingUp = false;
//       }
//     } else if (this.jumpOffset < 0) {
//       this.jumpOffset += 2;
//     }
//   }

//   moveAway() {
//     console.log("moving away shy shape");

//     if (this.x > -50) {
//       this.x -= this.speed;
//       this.hasJumped = false; // Reset jump trigger when moving away
//       this.jumpOffset = 0; // Reset jump position
//     } else {
//       isNextToShy = false;
//     }
//   }

//   display() {
//     fill(this.color);
//     noStroke();
//     rect(this.x, this.y + this.jumpOffset, this.size, this.size);
//   }
// }

let xPos;
let shyShapeSize = 50;
let moveSpeed = 5;
let spotlightSize = 200;
let isBehindCurtain = false;
let peekTimer = 0;
let peekDelay = 3500;
let isPeeking = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  xPos = windowWidth / 2;
}

function draw() {
  background(50); // Gray

  console.log("mouseX:", mouseX);

  // Stage Floor
  fill(92, 60, 0); // Brown
  rect(0, windowHeight - 200, windowWidth, 200);

  // Wooden Planks
  stroke(80, 50, 0); // Darker brown
  for (let i = 0; i < windowWidth; i += 50) {
    line(i, windowHeight - 200, i, windowHeight);
  }

  let shyShapeX = xPos;
  let shyShapeY = windowHeight - 225;
  let distance = dist(mouseX, mouseY, shyShapeX, shyShapeY);

  // Shy Shape is behind left curtain
  if (shyShapeX < 75) {
    console.log("behind left curtain");
    isBehindCurtain = true;
    if (millis() - peekTimer > peekDelay) {
      isPeeking = true;
    }
  }
  // Shy Shape is behind right curtain
  else if (shyShapeX > windowWidth - 75) {
    console.log("behind right curtain");
    isBehindCurtain = true;
    if (millis() - peekTimer > peekDelay) {
      isPeeking = true;
    }
  }
  // Shy Shape is not behind curtains anymore
  else {
    isBehindCurtain = false;
    isPeeking = false;
  }

  // If the shy shape is peeking out
  if (isPeeking) {
    if (shyShapeX < windowWidth / 2) {
      console.log("peeking out of left curtain");
      xPos += 10;
    } else {
      console.log("peeking out of right curtain");
      xPos -= 10;
    }

    // If the shy shape is in the spotlight, hide behind the curtain
    if (distance < spotlightSize / 2 + shyShapeSize / 2) {
      if (shyShapeX < windowWidth / 2) {
        console.log("going back in left curtain");
        xPos -= 10;
      } else {
        console.log("going back in right curtain");
        xPos += 10;
      }

      isBehindCurtain = true;
      isPeeking = false;
      peekTimer = millis();
    }
  }

  // Move if majority of the spotlight is on the shy shape and it's not peeking
  if (!isBehindCurtain && !isPeeking) {
    if (!(mouseX < 100 || mouseX > windowWidth - 100)) {
      if (distance < spotlightSize / 2 + shyShapeSize / 2) {
        let overlapRatio =
          (spotlightSize / 2 + shyShapeSize / 2 - distance) /
          (spotlightSize / 2);
        if (overlapRatio > 0.5) {
          if (mouseX < shyShapeX) {
            xPos += moveSpeed; // Move right
          } else {
            xPos -= moveSpeed; // Move left
          }
        }
      }
    } else {
      console.log("spotlight on curtain");
    }
  }

  // Shy Shape
  noStroke();
  fill(150, 180, 255); // Soft blue
  ellipse(xPos, windowHeight - 225, shyShapeSize, shyShapeSize);

  // Curtains
  noStroke();
  fill(200, 0, 0); // Red
  rect(0, 0, 100, windowHeight - 200); // Left curtain
  rect(windowWidth - 100, 0, 100, windowHeight - 200); // Right curtain

  // Dim Lights
  noStroke();
  fill(0, 100);
  rect(0, 0, windowWidth, windowHeight);

  // Spotlight
  fill(200, 200, 150, 70);
  ellipse(mouseX, mouseY, spotlightSize, spotlightSize);
}
