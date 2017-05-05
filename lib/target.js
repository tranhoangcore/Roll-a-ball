var targetVertexPositionBuffer = null;
var targetVertexTextureCoordBuffer = null;
var targetVertexIndexBuffer = null;
var targetVertexNormalBuffer = null;
var targetTexture = null;

class target {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	static initBuffer() {
		var vertices = new Float32Array([
	        // Front face
	        -1.0, -1.0,  1.0,
	         1.0, -1.0,  1.0,
	         1.0,  1.0,  1.0,
	        -1.0,  1.0,  1.0,

	        // Back face
	        -1.0, -1.0, -1.0,
	        -1.0,  1.0, -1.0,
	         1.0,  1.0, -1.0,
	         1.0, -1.0, -1.0,

	        // Top face
	        -1.0,  1.0, -1.0,
	        -1.0,  1.0,  1.0,
	         1.0,  1.0,  1.0,
	         1.0,  1.0, -1.0,

	        // Bottom face
	        -1.0, -1.0, -1.0,
	         1.0, -1.0, -1.0,
	         1.0, -1.0,  1.0,
	        -1.0, -1.0,  1.0,

	        // Right face
	         1.0, -1.0, -1.0,
	         1.0,  1.0, -1.0,
	         1.0,  1.0,  1.0,
	         1.0, -1.0,  1.0,

	        // Left face
	        -1.0, -1.0, -1.0,
	        -1.0, -1.0,  1.0,
	        -1.0,  1.0,  1.0,
	        -1.0,  1.0, -1.0
	    ]);

	    vertices = vertices.map(function(val) {
	    	return val / 4.0;
	    });

	    targetVertexPositionBuffer = gl.createBuffer();
	    gl.bindBuffer(gl.ARRAY_BUFFER, targetVertexPositionBuffer);
	    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
	    targetVertexPositionBuffer.itemSize = 3;
	    targetVertexPositionBuffer.numItems = 24;

	    var normals = new Float32Array([
	        // Front face
	        0.0, 0.0,  1.0,
	        0.0, 0.0,  1.0,
	        0.0, 0.0,  1.0,
	        0.0, 0.0,  1.0,

	        // Back face
	        0.0, 0.0, -1.0,
	        0.0, 0.0, -1.0,
	        0.0, 0.0, -1.0,
	        0.0, 0.0, -1.0,

	        // Top face
	        0.0,  1.0, 0.0,
	        0.0,  1.0, 0.0,
	        0.0,  1.0, 0.0,
	        0.0,  1.0, 0.0,

	        // Bottom face
	        0.0, -1.0, 0.0,
	        0.0, -1.0, 0.0,
	        0.0, -1.0, 0.0,
	        0.0, -1.0, 0.0,

	        // Right face
	        1.0, 0.0, 0.0,
	        1.0, 0.0, 0.0,
	        1.0, 0.0, 0.0,
	        1.0, 0.0, 0.0,

	        // Left face
	        -1.0, 0.0, 0.0,
	        -1.0, 0.0, 0.0,
	        -1.0, 0.0, 0.0,
	        -1.0, 0.0, 0.0,
	    ]);

	    targetVertexNormalBuffer = gl.createBuffer();
	    gl.bindBuffer(gl.ARRAY_BUFFER, targetVertexNormalBuffer);
	    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
	    targetVertexNormalBuffer.itemSize = 3;
	    targetVertexNormalBuffer.numItems = 24;

	    var textureCoords = new Float32Array([
	        // Front face
	        0.0, 0.0,
	        1.0, 0.0,
	        1.0, 1.0,
	        0.0, 1.0,

	        // Back face
	        1.0, 0.0,
	        1.0, 1.0,
	        0.0, 1.0,
	        0.0, 0.0,

	        // Top face
	        0.0, 1.0,
	        0.0, 0.0,
	        1.0, 0.0,
	        1.0, 1.0,

	        // Bottom face
	        1.0, 1.0,
	        0.0, 1.0,
	        0.0, 0.0,
	        1.0, 0.0,

	        // Right face
	        1.0, 0.0,
	        1.0, 1.0,
	        0.0, 1.0,
	        0.0, 0.0,

	        // Left face
	        0.0, 0.0,
	        1.0, 0.0,
	        1.0, 1.0,
	        0.0, 1.0
	    ]);

	    targetVertexTextureCoordBuffer = gl.createBuffer();
	    gl.bindBuffer(gl.ARRAY_BUFFER, targetVertexTextureCoordBuffer);
	    gl.bufferData(gl.ARRAY_BUFFER, textureCoords, gl.STATIC_DRAW);
	    targetVertexTextureCoordBuffer.itemSize = 2;
	    targetVertexTextureCoordBuffer.numItems = 24;

	    var indices = new Uint16Array([
	    	0, 1, 2,      0, 2, 3,    // Front face
	        4, 5, 6,      4, 6, 7,    // Back face
	        8, 9, 10,     8, 10, 11,  // Top face
	        12, 13, 14,   12, 14, 15, // Bottom face
	        16, 17, 18,   16, 18, 19, // Right face
	        20, 21, 22,   20, 22, 23  // Left face
	    ]);
	    targetVertexIndexBuffer = gl.createBuffer();
	    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, targetVertexIndexBuffer);
	    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
	    targetVertexIndexBuffer.itemSize = 1;
	    targetVertexIndexBuffer.numItems = 36;
	}
	static deleteBuffer() {
		gl.deleteBuffer(targetVertexPositionBuffer);
		gl.deleteBuffer(targetVertexTextureCoordBuffer);
		gl.deleteBuffer(targetVertexIndexBuffer);
		gl.deleteBuffer(targetVertexNormalBuffer);
	}
	static initTexture() {
		targetTexture = gl.createTexture();
		targetTexture.image = new Image();
		targetTexture.image.onload = function() {
			handleLoadedTexture(targetTexture);
		}
		targetTexture.image.src = "src/target.gif";
	}
	draw(degrees) {
		mMatrix.setTranslate(this.x, this.y, this.z);
		mMatrix.rotate(degrees, 0, 1, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, targetVertexPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.aPosition, targetVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, targetVertexNormalBuffer);
		gl.vertexAttribPointer(shaderProgram.aNormal, targetVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, targetVertexTextureCoordBuffer);
		gl.vertexAttribPointer(shaderProgram.aTextureCoord, targetVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
		setMatrixUniforms();

		nMatrix.setInverseOf(mMatrix);
		nMatrix.transpose();

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, targetTexture);
		gl.uniform1i(shaderProgram.uSampler, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, targetVertexIndexBuffer);

		gl.drawElements(gl.TRIANGLES, targetVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	}
}