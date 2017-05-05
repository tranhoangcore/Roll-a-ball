var gl = null;

var shaderProgram = null;

var scoreBoard = null;
var currentScore = 0;

var pMatrix = new Matrix4();
var vMatrix = new Matrix4();
var mMatrix = new Matrix4();
var nMatrix = new Matrix4();

var animationFrame = null;

var camera = null;

var ground = null;

var light = null;

var ball = null;

var numberOftargets = 0;
var targets = [];

var degtarget = 0;

var lastTime = 0;

var currentlyPressedKeys = {};

function initGL() {
	glCanvas = document.getElementById('rollABall');
	scoreBoardCanvas = document.getElementById('scoreBoard');

	gl = glCanvas.getContext("experimental-webgl");
	scoreBoard = scoreBoardCanvas.getContext('2d');

	gl.viewportWidth = glCanvas.width;
	gl.viewportHeight = glCanvas.height;
	scoreBoard.viewportWidth = scoreBoardCanvas.width;
	scoreBoard.viewportHeight = scoreBoardCanvas.height;
}

function getShader(id) {
	var shaderScript = document.getElementById(id);
	if(!shaderScript)
		return null;

	var str = "";
	var k = shaderScript.firstChild;
	while(k) {
		if(k.nodeType == 3)
			str += k.textContent;
		k = k.nextSibling;
	}

	var shader;
	if(shaderScript.type == "x-shader/x-fragment")
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	else if(shaderScript.type = "x-shader/x-vertex")
		shader = gl.createShader(gl.VERTEX_SHADER);
	else
		return null;

	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	return shader;
}

function initShaders() {

	var fragmentShader = getShader("fshader");
	var vertexShader = getShader("vshader");
	shaderProgram = gl.createProgram();

	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	
	gl.linkProgram(shaderProgram);

	gl.useProgram(shaderProgram);

	// Attribute
	shaderProgram.aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
	shaderProgram.aTextureCoord = gl.getAttribLocation(shaderProgram, "aTextureCoord");
	shaderProgram.aNormal = gl.getAttribLocation(shaderProgram, "aNormal");
	gl.enableVertexAttribArray(shaderProgram.aPosition);
	gl.enableVertexAttribArray(shaderProgram.aTextureCoord);
	gl.enableVertexAttribArray(shaderProgram.aNormal);

	// Uniform
	shaderProgram.uPMatrix = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.uVMatrix = gl.getUniformLocation(shaderProgram, "uVMatrix");
	shaderProgram.uMMatrix = gl.getUniformLocation(shaderProgram, "uMMatrix");
	shaderProgram.uSampler = gl.getUniformLocation(shaderProgram, "uSampler");
	shaderProgram.uNMatrix = gl.getUniformLocation(shaderProgram, "uNMatrix");
	shaderProgram.uLightDirection = gl.getUniformLocation(shaderProgram, "uLightDirection");
}

function initBuffers() {
	Ground.initBuffer();
	target.initBuffer();
	Ball.initBuffer();
}

function initTextures() {
	Ground.initTexture();
	target.initTexture();
	Ball.initTexture();
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

function setMatrixUniforms() {
	gl.uniformMatrix4fv(shaderProgram.uPMatrix, false, pMatrix.elements);
	gl.uniformMatrix4fv(shaderProgram.uVMatrix, false, vMatrix.elements);
	gl.uniformMatrix4fv(shaderProgram.uMMatrix, false, mMatrix.elements);
	gl.uniformMatrix4fv(shaderProgram.uNMatrix, false, nMatrix.elements);
}

function initGround() {
	ground = new Ground(0.0, 0.0, 0.0);
}

function initCamera() {
	camera = new Camera(0.0, 5.0, 7.0);
}

function initLight() {
	light = new Vector3([0.0, 1.0, 0.0]);
}

function initBall() {
	ball = new Ball(0.0, 0.0, 0.0);
}

function inittargets() {
	numberOftargets = 12;
	targets.push(new target(2, 0, 5));
    targets.push(new target(2, 0, -5));
	targets.push(new target(-2, 0, 5));
    targets.push(new target(-2, 0, -5));
    targets.push(new target(-5, 0, 4));
    targets.push(new target(5, 0, 4));
    targets.push(new target(-5, 0, -3));
    targets.push(new target(5, 0, -3));
    targets.push(new target(-6, 0, 2));
    targets.push(new target(6, 0, 2));
    targets.push(new target(-6, 0, 0));
    targets.push(new target(6, 0, 0));
}

function drawtargets() {
	for(var i = 0; i < numberOftargets; i++)
		targets[i].draw(degtarget);
}	

function drawBall() {
	ball.draw();
}

function drawGround() {
	ground.draw();
}


function drawScene() {
	camera.setPerspective(90, gl.viewportWidth / gl.viewportHeight, 1, 100);
	camera.setLookAt(ball.x, ball.y, ball.z, 0, 1, 0);

	light.normalize();
	gl.uniform3fv(shaderProgram.uLightDirection, light.elements);

	drawGround();
	drawtargets();
	drawBall();
}

function drawScoreBoard() {
	scoreBoard.clearRect(0, 0, 500, 500);
	scoreBoard.font = '20px Arial';
	scoreBoard.fillStyle = 'rgba(255, 255, 255, 1)';
	scoreBoard.fillText('Your score: ' + currentScore, (scoreBoard.viewportWidth / 2.0) - 50, 50);
		
	if(checkGameOver()) {
		scoreBoard.clearRect(0, 0, 500, 500);
		scoreBoard.font = '40px Arial';
		scoreBoard.fillStyle = 'rgba(255, 0, 0, 1)';
		scoreBoard.fillText('Game Over!', (scoreBoard.viewportWidth / 2.0) - 80, scoreBoard.viewportHeight / 2.0 - 50);
		scoreBoard.font = '20px Arial';
		scoreBoard.fillText('You got: ' + currentScore, (scoreBoard.viewportWidth / 2.0) - 30, scoreBoard.viewportHeight / 2.0 - 20);
		cancelAnimationFrame(animationFrame);
		location.href="rollaball.html";
	}
	

	if(checkWinGame()) {
		scoreBoard.clearRect(0, 0, 500, 500);
		scoreBoard.font = '40px Arial';
		scoreBoard.fillStyle = 'rgba(0, 255, 0, 1)';
		scoreBoard.fillText('Congratulations!', (scoreBoard.viewportWidth / 2.0) - 110, scoreBoard.viewportHeight / 2.0 - 50);
		scoreBoard.font = '20px Arial';
		scoreBoard.fillText('You got: ' + currentScore, (scoreBoard.viewportWidth / 2.0) - 30, scoreBoard.viewportHeight / 2.0 - 20);
	}
	checkScore();
}

function checkGameOver() {
	return (ball.x <= -ground.side || ball.x >= ground.side || ball.z <= -ground.side || ball.z >= ground.side);
}

function checkWinGame() {
	return numberOftargets === 0;
}

function checkScore() {
	for(var i = 0; i < numberOftargets; i++)
		if((ball.x >= targets[i].x-1 && ball.x <= targets[i].x+1) && (ball.z >= targets[i].z-1 && ball.z <= targets[i].z+1)) {
			currentScore += 10;
			numberOftargets -= 1;
			targets.splice(i, 1);
		}
}

function tick() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	animationFrame = requestAnimationFrame(tick);

	drawScene();
	drawScoreBoard();
	handleKeys();
	animate();
}

function animate() {
	var timeNow = new Date().getTime();
	if(lastTime != 0) {
		var elapsed = timeNow - lastTime;
		degtarget += (75 * elapsed) / 1000.0;
	}
	lastTime = timeNow;
	ball.setAngleRotation();
}

function handleKeyDown(event) {
	currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
	currentlyPressedKeys[event.keyCode] = false;
}

function handleKeys() {
	// A ball stops when not pressing any button.
	ball.setSpeed(0);

	// Left arrow to turn left
	if(currentlyPressedKeys[37]) {
        ball.enableRotateZAxis();
       	ball.disableRotateXAxis();
  		ball.setSpeed(2);
  		ball.setXAxisTranslate(-0.04);
    }

    // Up arrow to turn up
    if(currentlyPressedKeys[38]) {
        ball.enableRotateXAxis();
        ball.disableRotateZAxis();
       	ball.setSpeed(-2);
       	ball.setZAxisTranslate(-0.04);
    }

    // Right arrow to turn right
    if(currentlyPressedKeys[39]) {
        ball.enableRotateZAxis();
        ball.disableRotateXAxis();
        ball.setSpeed(-2);
       	ball.setXAxisTranslate(0.04);      
    }

    // Down arrow to turn down
    if(currentlyPressedKeys[40]) {    
        ball.enableRotateXAxis();
        ball.disableRotateZAxis();
        ball.setSpeed(2);
        ball.setZAxisTranslate(0.04);
    }

    // Q to zoom out
    if(currentlyPressedKeys[81])
        camera.zoom(0.1);

    // W to zoom in
	if(currentlyPressedKeys[87])
		camera.zoom(-0.1);
}

function webGL() {
	initGL();
	initShaders();
	initBuffers();
	initTextures();

	initGround();
	initCamera();
	initLight();
	inittargets();
	initBall();

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);

	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;

	tick();
}