var canvasBg = document.getElementById("canvasBg");
var contextBg = canvasBg.getContext("2d");
var canvasJet = document.getElementById("canvasJet");
var contextJet = canvasJet.getContext("2d");
var canvasEnemy = document.getElementById("canvasEnemy");
var contextEnemy = canvasEnemy.getContext("2d");
var canvasHud = document.getElementById("canvasHud");
var contextHud = canvasHud.getContext("2d");
contextHud.fillStyle = "hsla(0, 0%, 0%, 0.5)";
contextHud.font = "bold 20px Arial";
var jet1 = new Jet;
var btnPlay = new Button(265, 535, 220, 335);
var gameWidth = canvasBg.width;
var gameHeight = canvasBg.height;
var mouseX = 0;
var mouseY = 0;
var isPlaying = false;
var requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
    window.setTimeout(callback, 1e3 / 60)
};
var enemies = [];
var imgSprite = new Image;
imgSprite.src = "/static/sprite2.png";
imgSprite.addEventListener("load", init, false);
var bgDrawX1 = 0;
var bgDrawX2 = 1600;

function moveBg() {
    bgDrawX1 -= 5;
    bgDrawX2 -= 5;
    if (bgDrawX1 <= -1600) bgDrawX1 = 1600;
    if (bgDrawX2 <= -1600) bgDrawX2 = 1600;
    drawBg()
}

function init() {
    spawnEnemy(5);
    drawMenu();
    document.addEventListener("click", mouseClicked, false)
}

function playGame() {
    drawBg();
    startLoop();
    updateHud();
    document.addEventListener("keydown", checkKeyDown, false);
    document.addEventListener("keyup", checkKeyUp, false)
}

function spawnEnemy(numSpawns) {
    for (var i = 0; i < numSpawns; i++) {
        enemies[enemies.length] = new Enemy
    }
}

function drawAllEnemies() {
    clearContextEnemy();
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].draw()
    }
}

function loop() {
    if (isPlaying) {
        moveBg();
        jet1.draw();
        drawAllEnemies();
        requestAnimFrame(loop)
    }
}

function startLoop() {
    isPlaying = true;
    loop()
}

function stopLoop() {
    isPlaying = false
}

function drawBg() {
    contextBg.clearRect(0, 0, gameWidth, gameHeight);
    contextBg.drawImage(imgSprite, 0, 0, 1600, gameHeight, bgDrawX1, 0, 1600, gameHeight);
    contextBg.drawImage(imgSprite, 0, 0, 1600, gameHeight, bgDrawX2, 0, 1600, gameHeight)
}

function drawMenu() {
    var srcY = 760;
    contextBg.drawImage(imgSprite, 0, srcY, gameWidth, gameHeight, 0, 0, gameWidth, gameHeight)
}

function updateHud() {
    contextHud.clearRect(0, 0, gameWidth, gameHeight);
    contextHud.fillText("Score: " + jet1.score, 680, 30)
}

function Jet() {
    this.srcX = 0;
    this.srcY = 510;
    this.drawX = 200;
    this.drawY = 200;
    this.noseX = this.drawX + 100;
    this.noseY = this.drawY + 30;
    this.width = 144;
    this.height = 74;
    this.speed = 2;
    this.leftX = this.drawX;
    this.rightX = this.drawX + this.width;
    this.topY = this.drawY;
    this.bottomY = this.drawY + this.height;
    this.isUpKey = false;
    this.isRightKey = false;
    this.isDownKey = false;
    this.isLeftKey = false;
    this.isSpaceBar = false;
    this.isShooting = false;
    this.bullets = [];
    this.currentBullet = 0;
    for (var i = 0; i < 20; i++) this.bullets[this.bullets.length] = new Bullet(this);
    this.score = 0
}
Jet.prototype.draw = function() {
    clearContextJet();
    this.updateCoors();
    this.checkDirection();
    this.checkShooting();
    this.drawAllBullets();
    contextJet.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height)
};
Jet.prototype.updateCoors = function() {
    this.noseX = this.drawX + 100;
    this.noseY = this.drawY + 30;
    this.leftX = this.drawX;
    this.rightX = this.drawX + this.width;
    this.topY = this.drawY;
    this.bottomY = this.drawY + this.height
};
Jet.prototype.checkDirection = function() {
    if (this.isUpKey && this.topY > 0) {
        this.drawY -= this.speed
    }
    if (this.isRightKey && this.rightX < gameWidth) {
        this.drawX += this.speed
    }
    if (this.isDownKey && this.bottomY < gameHeight) {
        this.drawY += this.speed
    }
    if (this.isLeftKey && this.leftX > 0) {
        this.drawX -= this.speed
    }
};
Jet.prototype.drawAllBullets = function() {
    for (var i = 0; i < this.bullets.length; i++) {
        if (this.bullets[i].drawX >= 0) this.bullets[i].draw();
        if (this.bullets[i].explosion.hasHit) this.bullets[i].explosion.draw()
    }
};
Jet.prototype.checkShooting = function() {
    if (this.isSpaceBar && !this.isShooting) {
        this.isShooting = true;
        this.bullets[this.currentBullet].fire(this.noseX, this.noseY);
        this.currentBullet++;
        if (this.currentBullet >= this.bullets.length) this.currentBullet = 0
    } else if (!this.isSpaceBar) {
        this.isShooting = false
    }
};
Jet.prototype.updateScore = function(points) {
    this.score += points;
    debugger;
    updateHud()
};

function clearContextJet() {
    contextJet.clearRect(0, 0, gameWidth, gameHeight)
}

function Bullet(j) {
    this.srcX = 176;
    this.srcY = 501;
    this.drawX = -20;
    this.drawY = 0;
    this.width = 48;
    this.height = 20;
    this.speed = 3;
    this.explosion = new Explosion;
    this.jet = j
}
Bullet.prototype.draw = function() {
    this.drawX += this.speed;
    contextJet.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
    this.checkHitEnemy();
    if (this.drawX > gameWidth) this.recycle()
};
Bullet.prototype.recycle = function() {
    this.drawX = -20
};
Bullet.prototype.fire = function(noseX, noseY) {
    this.drawX = noseX;
    this.drawY = noseY
};
Bullet.prototype.checkHitEnemy = function() {
    for (var i = 0; i < enemies.length; i++) {
        if (this.drawX >= enemies[i].drawX && this.drawX <= enemies[i].drawX + enemies[i].width && this.drawY >= enemies[i].drawY && this.drawY <= enemies[i].drawY + enemies[i].height) {
            this.explosion.drawX = enemies[i].drawX - this.explosion.width / 2;
            this.explosion.drawY = enemies[i].drawY;
            this.explosion.hasHit = true;
            this.recycle();
            enemies[i].recycleEnemy();
            this.jet.updateScore(enemies[i].rewardPoints)
        }
    }
};

function Explosion() {
    this.srcX = 720;
    this.srcY = 510;
    this.drawX = 0;
    this.drawY = 0;
    this.width = 129;
    this.height = 61;
    this.currentFrame = 0;
    this.totalFrames = 10;
    this.hasHit = false
}
Explosion.prototype.draw = function() {
    if (this.currentFrame <= this.totalFrames) {
        contextJet.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
        this.currentFrame++
    } else {
        this.hasHit = false;
        this.currentFrame = 0
    }
};

function Enemy() {
    this.srcX = 0;
    this.srcY = 644;
    this.width = 97;
    this.height = 51;
    this.speed = 2;
    this.drawX = Math.floor(Math.random() * 1e3) + gameWidth;
    this.drawY = Math.floor(Math.random() * gameHeight) - this.height;
    this.rewardPoints = 5
}
Enemy.prototype.draw = function() {
    this.drawX -= this.speed;
    contextEnemy.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
    this.checkEscaped()
};
Enemy.prototype.checkEscaped = function() {
    if (this.drawX + this.width <= 0) {
        this.recycleEnemy()
    }
};
Enemy.prototype.recycleEnemy = function() {
    this.drawX = Math.floor(Math.random() * 1e3) + gameWidth;
    this.drawY = Math.floor(Math.random() * gameHeight)
};

function clearContextEnemy() {
    contextEnemy.clearRect(0, 0, gameWidth, gameHeight)
}

function Button(xL, xR, yT, yB) {
    this.xLeft = xL;
    this.xRight = xR;
    this.yTop = yT;
    this.yBottom = yB
}
Button.prototype.checkClicked = function() {
    return this.xLeft <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY && mouseY <= this.yBottom
};

function mouseClicked(e) {
    mouseX = e.pageX - canvasBg.offsetLeft;
    mouseY = e.pageY - canvasBg.offsetTop;
    if (!isPlaying)
        if (btnPlay.checkClicked()) playGame()
}

function checkKeyDown(e) {
    var keyId = e.keyCode || e.which;
    if (keyId == 38 || keyId == 87) {
        jet1.isUpKey = true;
        e.preventDefault()
    }
    if (keyId == 39 || keyId == 68) {
        jet1.isRightKey = true;
        e.preventDefault()
    }
    if (keyId == 40 || keyId == 83) {
        jet1.isDownKey = true;
        e.preventDefault()
    }
    if (keyId == 37 || keyId == 65) {
        jet1.isLeftKey = true;
        e.preventDefault()
    }
    if (keyId == 32) {
        jet1.isSpaceBar = true;
        e.preventDefault()
    }
}

function checkKeyUp(e) {
    var keyId = e.keyCode || e.which;
    if (keyId == 38 || keyId == 87) {
        jet1.isUpKey = false;
        e.preventDefault()
    }
    if (keyId == 39 || keyId == 68) {
        jet1.isRightKey = false;
        e.preventDefault()
    }
    if (keyId == 40 || keyId == 83) {
        jet1.isDownKey = false;
        e.preventDefault()
    }
    if (keyId == 37 || keyId == 65) {
        jet1.isLeftKey = false;
        e.preventDefault()
    }
    if (keyId == 32) {
        jet1.isSpaceBar = false;
        e.preventDefault()
    }
}
