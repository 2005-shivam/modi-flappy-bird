//board
let board;
let boardWidth = 350;
let boardHeight = 540;
let context;

//bird
let birdWidth = 40;
let birdHeight = 60;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;
let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
};

//pipes
let pipeArray = [];
let pipeWidth = 90;
let pipeHeight = 300;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.2;
let gameOver = false;
let score = 0;

// 🎵 AUDIO SECTION START
let bgMusic;
let hitSound;
// 🎵 AUDIO SECTION END

let restartBtn = document.getElementById('restartBtn');

window.onload = function () {
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //load images
    birdImg = new Image();
    birdImg.src = "modi.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    };
    topPipeImg = new Image();
    topPipeImg.src = 'top.png';
    bottomPipeImg = new Image();
    bottomPipeImg.src = 'bottom.png';

    // 🎵 AUDIO SECTION START
    bgMusic = new Audio("background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.5;

    hitSound = new Audio("hit.mp3");
    hitSound.volume = 0.7;
    // 🎵 AUDIO SECTION END

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener('keydown', moveBird);
    document.addEventListener('touchstart', moveBird);

    restartBtn.addEventListener('click', restartGame); // ⬅️ Restart logic
}

function update() {
    requestAnimationFrame(update);

    if (gameOver) return;

    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        triggerGameOver();
    }

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            triggerGameOver();
        }
    }

    //remove off-screen pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    //score display
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("GAME OVER!", 45, 300);
    }
}

function placePipes() {
    if (gameOver) return;

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 3;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(bottomPipe);
}

function moveBird(event) {
    if (event.code == "Space" || event.code == "ArrowUp" || event.type === "touchstart") {
        if (bgMusic.paused && !gameOver) {
            bgMusic.play(); // start background music
        }
        velocityY = -6;
    }
}

function triggerGameOver() {
    if (!gameOver) {
        gameOver = true;
        hitSound.play();
        bgMusic.pause();
        restartBtn.style.display = "inline-block"; // show restart button
    }
}

function restartGame() {
    // reset everything
    bird.y = birdY;
    velocityY = 0;
    pipeArray = [];
    score = 0;
    gameOver = false;

    restartBtn.style.display = "none"; // hide button again
    bgMusic.currentTime = 0;
    bgMusic.play();
}

function detectCollision(a, b) {
    const padding = 8;
    return (
        a.x + padding < b.x + b.width - padding &&
        a.x + a.width - padding > b.x + padding &&
        a.y + padding < b.y + b.height - padding &&
        a.y + a.height - padding > b.y + padding
    );
}
