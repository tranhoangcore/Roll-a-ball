class Camera {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	setPerspective(degrees, scale, near, far) {
		pMatrix.setPerspective(degrees, scale, near, far);
	}
	setLookAt(xAxisObject, yAxisObject, zAxisObject, xAxis, yAxis, zAxis) {
		vMatrix.setLookAt(this.x, this.y, this.z, xAxisObject, yAxisObject, zAxisObject, xAxis, yAxis, zAxis);
	}
	zoom(angle) {
		this.y += angle;
	}
}