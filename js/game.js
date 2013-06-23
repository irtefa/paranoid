/**
 * Created with JetBrains WebStorm.
 * User: mirtefa
 * Date: 6/22/13
 * Time: 1:52 AM
 * To change this template use File | Settings | File Templates.
 */

//get canvas
var canvas = document.getElementById('canvas');
//get context
var context = canvas.getContext('2d');

/**
 * AUDIOS
 *
 */
var bouncingSound = new Audio("audio/bounce.ogg");
var breakingSound = new Audio("audio/break.ogg");
var dieSound = new Audio("audio/die.ogg");
/*
 * VIEWS
 */
//paddle
var paddleX = 200;
var paddleY = 460;
var paddleWidth = 100;
var paddleHeight = 12;
var paddleMove;
var paddleDeltaX;
var paddleSpeedX = 10;

function drawPaddle() {
    context.fillStyle = 'silver';
    context.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
}

//ball
var ballX = 300;
var ballY = 300;
var ballRadius = 7;
var ballDeltaX;
var ballDeltaY;

function drawBall() {
    //beginpath when you draw primitive shapes
    context.beginPath();
    //draw the arc
    context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2, true);
    //fill the path I drew
    context.fill();
}

//bricks
var bricksPerRow = 14;
var brickHeight = 20;
var brickWidth = canvas.width/bricksPerRow;

//color of the bricks
var bricks = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    [4,4,4,4,4,4,5,5,4,4,4,4,4,4]
]

function createBricks() {
    for(var i=0; i < bricks.length; i++) {
        for(var j=0; j < bricks[i].length; j++) {
            drawBrick(j, i, bricks[i][j]);
        }
    }
}

function drawBrick(x, y, color) {
    switch(color) {
        case 1:
            context.fillStyle = 'red';
            break;
        case 2:
            context.fillStyle = 'blue';
            break;
        case 3:
            context.fillStyle = 'green';
            break;
        case 4:
            context.fillStyle = 'teal';
            break;
        case 5:
            context.fillStyle = 'purple';
            break;
        case 0:
            context.fillStyle = 'black';
            break;
    }
    //draw the brick with the previously instructed color
    context.fillRect(x * brickWidth, y * brickHeight, brickWidth, brickHeight);
    //draw black border lines around it
    context.strokeRect(x * brickWidth + 1, y * brickHeight + 1, brickWidth, brickHeight);
}

//score
var score = 0;

function drawScore() {
    context.fillStyle = 'white';
    context.font = "20px Helvetica"
    context.clearRect(0, canvas.height - 30, canvas.width, 30);
    context.fillText("Score: " + score, 10, canvas.height - 5);
}

/**
 * CONTROLLERS
 */

//ball
function moveBall() {
    //handle collisions
    //if ball hits the top reverse its direction
    //check if ball hits a brick from the top or below
    if((ballY + ballDeltaY - ballRadius < 0) || collisionYWithBricks()) {
        ballDeltaY = - ballDeltaY;
    }
    //if ball hits the right or the left
    //check if ball hits a brick from left or right

    if((ballX + ballDeltaX - ballRadius <= 0) || (ballX + ballDeltaX + ballRadius >= canvas.width) || collisionXWithBricks()) {
        ballDeltaX = -ballDeltaX;
    }
    //if ball hits the floor you die
    if(ballY + ballDeltaY - ballRadius >= canvas.height) {
        endGame();
    }
    //check if ball hits the paddle
    if(ballY + ballDeltaY + ballRadius > paddleY) {
        //check if its between the two ends of the paddle
        if((ballX + ballDeltaX >= paddleX) && (ballX + ballDeltaX <= paddleX + paddleWidth)) {
            bouncingSound.play();
            if(paddleMove === 'NONE') {
                ballDeltaY = -ballDeltaY;
            }
            else {
                ballDeltaY = -ballDeltaY;
            }
        }
    }

    // Move the ball with updated deltas
    ballX += ballDeltaX;
    ballY += ballDeltaY;
}

//paddle
function movePaddle() {
    //check which way we should move
    if(paddleMove === 'RIGHT') {
        paddleDeltaX = paddleSpeedX;
    }
    else if(paddleMove === 'LEFT') {
        paddleDeltaX = -paddleSpeedX;
    }
    else {
        paddleDeltaX = 0;
    }
    //if paddle reaches side of the screen dont make it move
    if((paddleX + paddleDeltaX < 0) || (paddleX + paddleDeltaX + paddleWidth >= canvas.width)) {
        paddleDeltaX = 0;
    }
    paddleX += paddleDeltaX;
}

//collision with bricks
//checks for x
function collisionXWithBricks() {
    var collidedX = false;
    for(var i=0; i < bricks.length; i++) {
        for(var j=0; j < bricks[i].length; j++) {
            if(bricks[i][j] != 0) {
                var brickX = j * brickWidth;
                var brickY = i * brickHeight;
                // if hits
                if(
                    //from the left
                    ((ballX + ballDeltaX + ballRadius >= brickX) && (ballX + ballRadius <= brickX))
                    ||
                    //from the right
                    ((ballX + ballDeltaX - ballRadius <= brickX + brickWidth) && (ballX - ballRadius >= brickX + brickWidth))
                    ) {
                    if((ballY + ballDeltaY - ballRadius <= brickY + brickHeight) && (ballY + ballDeltaY + ballRadius >= brickY)) {
                        //break the brick
                        breakBrick(i, j);
                        collidedX = true;
                    }
                }
            }
        }
    }
    return collidedX;
}

//checks for y
function collisionYWithBricks() {
    var collidedY = false;
    for(var i=0; i < bricks.length; i++) {
        for(var j=0; j < bricks[i].length; j++) {
            if(bricks[i][j] != 0) {
                var brickX = j * brickWidth;
                var brickY = i * brickHeight;
                if(
                    //from below
                    ((ballY + ballDeltaY - ballRadius <= brickY + brickHeight) && (ballY - ballRadius >= brickY + brickHeight))
                    ||
                    //from above
                    ((ballY + ballRadius <= brickY) && (ballY + ballDeltaY - ballRadius >= brickY))
                    ) {
                    if (ballX + ballDeltaX + ballRadius >= brickX &&
                        ballX + ballDeltaX - ballRadius <= brickX + brickWidth){
                        // weaken brick and increase score
                        breakBrick(i,j);
                        collidedY = true;
                    }
                }
            }
        }
    }
    return collidedY;
}
//brick breaker
function breakBrick(i, j) {
    bricks[i][j] = 0;
    score += 2;
    breakingSound.play();
}
//animate
function animate() {
    //clear everything before drawing
    context.clearRect(0, 0, canvas.width, canvas.height);
    createBricks();
    drawScore();
    moveBall();
    movePaddle();
    drawPaddle();
    drawBall();
}

function startGame() {
    ballDeltaX = -4;
    ballDeltaY = -3;
    paddleMove = 'NONE';
    paddleDeltaX = 0;

    //call animate function every 200ms
    gameLoop = setInterval(animate, 20);

    //check if left or right arrow is pressed
    $(document).keydown(function(event) {
        if(event.keyCode === 39) {
            paddleMove = 'RIGHT';
        }
        else if(event.keyCode === 37) {
            paddleMove = 'LEFT';
        }
    });

    // check if user lifted finger from keys
    $(document).keyup(function(event) {
        if(event.keyCode === 39 || event.keyCode === 37) {
            paddleMove = 'NONE';
        }
    });
}

function endGame() {
    clearInterval(gameLoop);
    dieSound.play();
    context.fillText("Game Over", 6 * brickWidth, canvas.height/2);
}

startGame();