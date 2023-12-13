var alpha = 0
var beta = 0
var gamma = 0
var device2earth = Quaternion.identity

function CalculateQuaternion(order) {
	let qs = []

	for (let cnt = 2; cnt >= 0; cnt++) {
		let q
		switch (order[cnt]) {
			// https://developer.mozilla.org/ja/docs/Web/API/Device_orientation_events/Orientation_and_motion_data_explained
			case "z":
				q = Quaternion.AngleAxis(-alpha, [0, 0, 1])
				break
			case "x":
				q = Quaternion.AngleAxis(-beta, [1, 0, 0])
				break
			case "y":
				q = Quaternion.AngleAxis(-gamma, [0, 1, 0])
				break
		}

		qs.push(q)
	}

	let earth2device = Quaternion.Multiply(
		qs[0],
		Quaternion.Multiply(qs[1], qs[2]),
	)
	device2earth = Quaternion.Inverse(earth2device)
}

function OnOrderChanged(order) {
	CalculateQuaternion(order)
}

function ReceiveOrientation(event) {
	alpha = event.alpha
	beta = event.beta
	gamma = event.gamma
}

function GetDirection() {
	return device2earth.RotateVector([0, 1, 0])
}

function UpdateDirection() {
	let direction = GetDirection()

	document.getElementById("x").innerHTML = direction[0]
	document.getElementById("y").innerHTML = direction[1]
	document.getElementById("z").innerHTML = direction[2]
}

function Start() {
	if (typeof DeviceMotionEvent.requestPermission === "function") {
		DeviceMotionEvent.requestPermission()
			.then((permissionState) => {
				if (permissionState === "granted") {
					this.$emit("permissionGranted")
				}
			})
			.catch(console.error)
	}
	window.addEventListener("deviceorientation", ReceiveOrientation, true)

	setInterval(UpdateDirection, 1000)
}
