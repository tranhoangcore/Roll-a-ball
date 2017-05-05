var groundVertexPositionBuffer = null;
var groundVertexTextureCoordBuffer = null;
var groundVertexNormalBuffer = null;
var groundTexture = null;

class Ground {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.side = 10;
	}
	static initBuffer() {
		var vertices = new Float32Array([
			-10.0, -1.0, -10.0,
			-10.0, -1.0, 10.0,
			10.0, -1.0, -10.0,
			10.0, -1.0, 10.0
		]);

		groundVertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, groundVertexPositionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
		groundVertexPositionBuffer.itemSize = 3;
		groundVertexPositionBuffer.numItems = 4;

		var normals = new Float32Array([
			0.0, -1.0, 0.0,
			0.0, -1.0, 0.0,
			0.0, -1.0, 0.0,
			0.0, -1.0, 0.0
		]);

		groundVertexNormalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, groundVertexNormalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
		groundVertexNormalBuffer.itemSize = 3;
		groundVertexNormalBuffer.numItems = 4;

		var textureCoords = new Float32Array([
			0.0, 1.0,
			0.0, 0.0,
			1.0, 1.0,
			1.0, 0.0
		]);

		groundVertexTextureCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, groundVertexTextureCoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, textureCoords, gl.STATIC_DRAW);
		groundVertexTextureCoordBuffer.itemSize = 2;
		groundVertexTextureCoordBuffer.numItems = 4;
	}
	static initTexture() {
		groundTexture = gl.createTexture();
		groundTexture.image = new Image();
		groundTexture.image.onload = function() {
			handleLoadedTexture(groundTexture);
		}
		groundTexture.image.src = "src/ground.png";
	}
	draw() {
		mMatrix.setTranslate(this.x, this.y, this.z);

		gl.bindBuffer(gl.ARRAY_BUFFER, groundVertexPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.aPosition, groundVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, groundVertexNormalBuffer);
		gl.vertexAttribPointer(shaderProgram.aNormal, groundVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, groundVertexTextureCoordBuffer);
		gl.vertexAttribPointer(shaderProgram.aTextureCoord, groundVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
		setMatrixUniforms();

		nMatrix.setInverseOf(mMatrix);
		nMatrix.transpose();

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, groundTexture);
		gl.uniform1i(shaderProgram.uSampler, 0);

		gl.drawArrays(gl.TRIANGLE_STRIP, 0, groundVertexPositionBuffer.numItems);
	}
}