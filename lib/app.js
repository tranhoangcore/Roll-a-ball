var gl;
var scoreBoard;

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

function initScoreBoard(canvas) {
    try {
        scoreBoard = canvas.getContext("2d");
        scoreBoard.viewportWidth = canvas.width;
        scoreBoard.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise Scoreboard, sorry :-(");
    }
}


function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}


var shaderProgram;

function initShaders() {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
    shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");
}



function handleLoadedTexture(texture) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.bindTexture(gl.TEXTURE_2D, null);
}


function initTexture() {
    Ground.initTexture();
    Cube.initTexture();
    Ball.initTexture();
}


var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

function mvPushMatrix() {
    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}


function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

    var normalMatrix = mat3.create();
    mat4.toInverseMat3(mvMatrix, normalMatrix);
    mat3.transpose(normalMatrix);
    gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
}


function degToRad(degrees) {
    return degrees * Math.PI / 180;
}



var degCube = 0;

var currentlyPressedKeys = {};

function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}


function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

function handleKeys() {
    // A ball stops when not pressing any button.
    ball.setSpeed(0); 

    if (currentlyPressedKeys[33]) {
        // Page Up
        camera.zoomOut();
    }
    if (currentlyPressedKeys[34]) {
        // Page Down
        camera.zoomIn();
    }
    if (currentlyPressedKeys[37]) {
        // Left cursor key
        console.log(ball.x, ball.y, ball.z);

        ball.enableRotateZAxis();
        ball.disableRotateXAxis();
        ball.setSpeed(2);
        ball.setXAxisTranslate(-0.08);
    }
    if (currentlyPressedKeys[39]) {
        // Right cursor key
        console.log(ball.x, ball.y, ball.z);

        ball.enableRotateZAxis();
        ball.disableRotateXAxis();
        ball.setSpeed(-2);
        ball.setXAxisTranslate(0.08);   
    }
    if (currentlyPressedKeys[38]) {
        // Up cursor key
        console.log(ball.x, ball.y, ball.z);

        ball.enableRotateXAxis();
        ball.disableRotateZAxis();
        ball.setSpeed(-2);
        ball.setZAxisTranslate(-0.08);
    }
    if (currentlyPressedKeys[40]) {
        // Down cursor key
        console.log(ball.x, ball.y, ball.z);

        ball.enableRotateXAxis();
        ball.disableRotateZAxis();
        ball.setSpeed(2);
        ball.setZAxisTranslate(0.08);
    }
}



function initBuffers() {
    Ground.initBuffer();
    Cube.initBuffer();
    Ball.initBuffer();
}


function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    drawScoreBoard();
    camera.view();
    ground.draw();  
    for(var i = 0; i < numberOfCubes; i++) {
        cubes[i].draw();
    }
    ball.draw();
}


var lastTime = 0;

function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;

        degCube += (90 * elapsed) / 1000.0;
    }
    lastTime = timeNow;
    ball.setAngleRotation();
}


function tick() {
    requestAnimFrame(tick);
    handleKeys();
    drawScene();
    animate();
    checkScore();
    checkGameOver();
    checkWinGame();
}

var ground;
var cubes = [];
var numberOfCubes = 12;

function createGround() {
    ground = new Ground(0, -1, 0);
}

function createCube() {
    var R = 12;
    var x, z;
    var y = 0;
    for(var angle = 0; angle < 360; angle += 360/numberOfCubes) {
        x = R * Math.cos(degToRad(angle));
        z = R * Math.sin(degToRad(angle))
        cubes.push(new Cube(x, y, z));
    }
}

var camera;
function createCamera() {
    camera = new Camera(0, -20, -20);
}

var ball;
function createBall() {
    ball = new Ball(0, 0, 0);
}

var currentScore = 0;
function drawScoreBoard() {
    scoreBoard.clearRect(0, 0, scoreBoard.viewportWidth, scoreBoard.viewportHeight);
    scoreBoard.font = '40px Times New Roman';
    scoreBoard.fillStyle = 'rgba(255, 255, 255, 1)';
    scoreBoard.fillText('Your score: ' + currentScore, (scoreBoard.viewportWidth / 2.0) - 100, 60);

    if(gameOver) {
        scoreBoard.clearRect(0, 0, scoreBoard.viewportWidth, scoreBoard.viewportHeight);
        scoreBoard.font = '40px Arial';
        scoreBoard.fillStyle = 'rgba(255, 0, 0, 1)';
        scoreBoard.fillText('Game Over!', (scoreBoard.viewportWidth / 2.0) - 100, scoreBoard.viewportHeight / 2.0 - 50);
        scoreBoard.font = '20px Arial';
        scoreBoard.fillText('You got: ' + currentScore, (scoreBoard.viewportWidth / 2.0) - 50, scoreBoard.viewportHeight / 2.0 - 20);
        setTimeout(function(){location.reload();}, 1000);
    }

    if(winGame) {
        scoreBoard.clearRect(0, 0, scoreBoard.viewportWidth, scoreBoard.viewportHeight);
        scoreBoard.font = '40px Arial';
        scoreBoard.fillStyle = 'rgba(0, 255, 0, 1)';
        scoreBoard.fillText('Congratulations!', (scoreBoard.viewportWidth / 2.0) - 110, scoreBoard.viewportHeight / 2.0 - 50);
        scoreBoard.font = '20px Arial';
        scoreBoard.fillText('You got: ' + currentScore, (scoreBoard.viewportWidth / 2.0) - 30, scoreBoard.viewportHeight / 2.0 - 20);
        setTimeout(function(){location.reload();}, 1000);
    }
}

function checkScore() {
    for(var i = 0; i < numberOfCubes; i++)
        if(ball.x >= cubes[i].x-2.5 && ball.x <= cubes[i].x+2.5 && ball.z >= cubes[i].z-2.5 && ball.z <= cubes[i].z+2.5) {
            cubes.splice(i, 1);
            numberOfCubes -= 1;
            currentScore += 100;
        }
}


gameOver = false;

function checkGameOver() {
    if(ball.x < -ground.size || ball.x > ground.size || ball.z < -ground.size || ball.z > ground.size)
        gameOver = true;
}

winGame = false;

function checkWinGame() {
    if(numberOfCubes === 0)
        winGame = true;
}

function webGLStart() {
    var canvas = document.getElementById("rollaball");
    initGL(canvas);
    canvas = document.getElementById("scoreboard");
    initScoreBoard(canvas);
    initShaders();
    initBuffers();
    initTexture();

    createGround();
    createCube();
    createCamera();
    createBall();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    tick();
}