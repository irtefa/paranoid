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

//paddle
var paddleX = 200;
var paddleY = 400;
var paddleWidth = 100;
var paddleHeight = 15;

function drawPaddle() {
    context.fillStyle = 'silver';
    context.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
}

//ball
var ballX = 300;
var ballY = 300;
var ballRadius = 10;

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
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3] ,
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
    }
    //draw the brick with the previously instructed color
    context.fillRect(x * brickWidth, y * brickHeight, brickWidth, brickHeight);
    //draw black border lines around it
    context.strokeRect(x * brickWidth + 1, y * brickHeight + 1, brickWidth, brickHeight);
}

drawPaddle();
drawBall();
createBricks();