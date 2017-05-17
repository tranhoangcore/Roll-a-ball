class Camera {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	view() {
		mat4.perspective(90, gl.viewportWidth / gl.viewportHeight, 1.0, 100.0, pMatrix);
        mat4.lookAt(mvMatrix, [0, 0, 0], [0, 0, 0], [0, 1, 0]);
        mat4.identity(mvMatrix);
        mat4.translate(mvMatrix, [this.x-ball.x, this.y+5, this.z-15-ball.z]);
    }
	zoomIn() {
		this.y += 0.5;
		this.z += 0.5;
	}
	zoomOut() {
		this.y -= 0.5;
		this.z -= 0.5;
	}
}