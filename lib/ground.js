var groundVertexPositionBuffer;
var groundVertexNormalBuffer;
var groundVertexTextureCoordBuffer;
var groundTexture;

class Ground {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
        this.size = 20;
	}
	static initBuffer() {
		var vertices = new Float32Array([
            -20.0, -1.0, -20.0,
            -20.0, -1.0, 20.0,
            20.0, -1.0, -20.0,
            20.0, -1.0, 20.0
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
    static deleteBuffer() {
        gl.deleteBuffer(groundVertexPositionBuffer);
        gl.deleteBuffer(groundVertexNormalBuffer);
        gl.deleteBuffer(groundVertexTextureCoordBuffer);
    }
	static initTexture() {
		groundTexture = gl.createTexture();
        groundTexture.image = new Image();
        groundTexture.image.onload = function () {
            handleLoadedTexture(groundTexture)
        }

        groundTexture.image.src = "src/ground.png";
	}
	draw() {
		mvPushMatrix();
        mat4.translate(mvMatrix, [this.x, this.y, this.z]);

        gl.bindBuffer(gl.ARRAY_BUFFER, groundVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, groundVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, groundVertexNormalBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, groundVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, groundVertexTextureCoordBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, groundVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, groundTexture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);
        
        
        var lightingDirection = [-0.25, -0.25, -1.0];
        var adjustedLD = vec3.create();
        vec3.normalize(lightingDirection, adjustedLD);
        vec3.scale(adjustedLD, -1);
        gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);
        

        setMatrixUniforms();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, groundVertexPositionBuffer.numItems);
        mvPopMatrix();
	}
}