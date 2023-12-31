var alpha = 0
var beta = 0
var gamma = 0
var device2earth = Quaternion.identity
var order = "zxy"

function CalculateQuaternion() {
	let qs = []

	for (let cnt = 0; cnt < 3; cnt++) {
		let q
		switch (order[cnt]) {
			// https://developer.mozilla.org/ja/docs/Web/API/Device_orientation_events/Orientation_and_motion_data_explained
			case "z":
				q = Quaternion.AngleAxis(alpha, [0, 0, 1])
				break
			case "x":
				q = Quaternion.AngleAxis(beta, [1, 0, 0])
				break
			case "y":
				q = Quaternion.AngleAxis(gamma, [0, 1, 0])
				break
			default:
				alert("Error")
		}

		qs.push(q)
	}

	device2earth = Quaternion.Multiply(qs[0], Quaternion.Multiply(qs[1], qs[2]))
	let earth2device = Quaternion.Inverse(device2earth)

	document.getElementById("qw").innerHTML = earth2device.w
	document.getElementById("qx").innerHTML = earth2device.x
	document.getElementById("qy").innerHTML = earth2device.y
	document.getElementById("qz").innerHTML = earth2device.z
}

function OnOrderChanged(_order) {
	order = _order
}

function ReceiveOrientation(event) {
	alpha = event.alpha
	beta = event.beta
	gamma = event.gamma

	document.getElementById("alpha").innerHTML = alpha
	document.getElementById("beta").innerHTML = beta
	document.getElementById("gamma").innerHTML = gamma
}

function GetDirection() {
	return device2earth.RotateVector([0, 0, -1])
}

function UpdateDirection() {
	CalculateQuaternion()
	let direction = GetDirection()

	document.getElementById("x").innerHTML = direction[0]
	document.getElementById("y").innerHTML = direction[1]
	document.getElementById("z").innerHTML = direction[2]
}

function Start() {
	try {
		DeviceMotionEvent.requestPermission()
			.then((permissionState) => {
				if (permissionState === "granted") {
					alert("permissionGranted")
				}
			})
			.catch((error) => {
				alert("permissionDenied")
			})
	} catch {
		alert("permissionDenied")
	}
}

window.addEventListener("deviceorientation", ReceiveOrientation, false)

setInterval(UpdateDirection, 1000)
