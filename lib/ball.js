var ballVertexPositionBuffer = null;
var ballVertexTextureCoordBuffer = null;
var ballVertexIndexBuffer = null;
var ballVertexNormalBuffer = null;
var ballTexture = null;

class Ball {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.xAxisRotation = 1;
		this.yAxisRotation = 1;
		this.zAxisRotation = 1;
		this.angleRotation = 0;
		this.speed = 0;
	}
	static initBuffer() {
		var latitudeBands = 30;
	    var longitudeBands = 30;
	    var radius = 0.8;

	    var vertexPositionData = [];
	    var normalData = [];
	    var textureCoordData = [];

	    for(var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
	    	var theta = latNumber * Math.PI / latitudeBands;
	      	var sinTheta = Math.sin(theta);
			var cosTheta = Math.cos(theta);

			for(var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
				var phi = longNumber * 2 * Math.PI / longitudeBands;
				var sinPhi = Math.sin(phi);
				var cosPhi = Math.cos(phi);

				var x = cosPhi * sinTheta;
				var y = cosTheta;
				var z = sinPhi * sinTheta;
				var u = 1 - (longNumber / longitudeBands);
				var v = 1 - (latNumber / latitudeBands);

				normalData.push(x);
				normalData.push(y);
				normalData.push(z);
				textureCoordData.push(u);
				textureCoordData.push(v);
				vertexPositionData.push(radius * x);
				vertexPositionData.push(radius * y);
				vertexPositionData.push(radius * z);
			}
	    }

	    var indexData = [];

	    for(var latNumber = 0; latNumber < latitudeBands; latNumber++) {
			for(var longNumber = 0; longNumber < longitudeBands; longNumber++) {
				var first = (latNumber * (longitudeBands + 1)) + longNumber;
				var second = first + longitudeBands + 1;
				indexData.push(first);
				indexData.push(second);
				indexData.push(first + 1);

				indexData.push(second);
				indexData.push(second + 1);
				indexData.push(first + 1);
			}
    	}    

	    ballVertexNormalBuffer = gl.createBuffer();
	    gl.bindBuffer(gl.ARRAY_BUFFER, ballVertexNormalBuffer);
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
	    ballVertexNormalBuffer.itemSize = 3;
	    ballVertexNormalBuffer.numItems = normalData.length / 3;

	    ballVertexPositionBuffer = gl.createBuffer();
	    gl.bindBuffer(gl.ARRAY_BUFFER, ballVertexPositionBuffer);
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
	    ballVertexPositionBuffer.itemSize = 3;
	    ballVertexPositionBuffer.numItems = vertexPositionData.length / 3;

	    ballVertexTextureCoordBuffer = gl.createBuffer();
	    gl.bindBuffer(gl.ARRAY_BUFFER, ballVertexTextureCoordBuffer);
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordData), gl.STATIC_DRAW);
	    ballVertexTextureCoordBuffer.itemSize = 2;
	    ballVertexTextureCoordBuffer.numItems = textureCoordData.length / 2;

	    ballVertexIndexBuffer = gl.createBuffer();
	    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ballVertexIndexBuffer);
	    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STREAM_DRAW);
	    ballVertexIndexBuffer.itemSize = 1;
	    ballVertexIndexBuffer.numItems = indexData.length;
	}
	static initTexture() {
		ballTexture = gl.createTexture();
		ballTexture.image = new Image();
		ballTexture.image.onload = function() {
			handleLoadedTexture(ballTexture);
		}
		ballTexture.image.src = "src/ball.gif";
	}
	draw() {
		mMatrix.setTranslate(this.x, this.y, this.z);
		mMatrix.rotate(this.angleRotation, this.xAxisRotation, this.yAxisRotation, this.zAxisRotation);

		gl.bindBuffer(gl.ARRAY_BUFFER, ballVertexPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.aPosition, ballVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, ballVertexNormalBuffer);
		gl.vertexAttribPointer(shaderProgram.aNormal, ballVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, ballVertexTextureCoordBuffer);
		gl.vertexAttribPointer(shaderProgram.aTextureCoord, ballVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
		setMatrixUniforms();

		nMatrix.setInverseOf(mMatrix);
		nMatrix.transpose();

	    gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, ballTexture);
		gl.uniform1i(shaderProgram.uSampler, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ballVertexIndexBuffer);	

		gl.drawElements(gl.TRIANGLES, ballVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	}
	setAngleRotation() {
		this.angleRotation += this.speed;
	}
	setSpeed(speed) {
		this.speed = speed;
	}
	setXAxisTranslate(x) {
		this.x += x;
	}
	setZAxisTranslate(z) {
		this.z += z;
	}
	disableRotateXAxis() {
		this.xAxisRotation = 0;
	}
	enableRotateXAxis() {
		this.xAxisRotation = 1;
	}
	disableRotateZAxis() {
		this.zAxisRotation = 0;
	}
	enableRotateZAxis() {
		this.zAxisRotation = 1;
	}
}
