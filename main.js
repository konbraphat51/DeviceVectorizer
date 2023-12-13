const Quaternion = require("./Quaternion");

var alpha = 0;
var beta = 0;
var gamma = 0;
var device2earth = Quaternion.identity;

function CalculateQuaternion(order) {
  let qs = [];

  for (let cnt = 0; cnt < 3; cnt++) {
    let q;
    switch (order[cnt]) {
      // https://developer.mozilla.org/ja/docs/Web/API/Device_orientation_events/Orientation_and_motion_data_explained
      case "z":
        q = Quaternion.AngleAxis(-alpha, [0, 0, 1]);
        break;
      case "x":
        q = Quaternion.AngleAxis(-beta, [1, 0, 0]);
        break;
      case "y":
        q = Quaternion.AngleAxis(-gamma, [0, 1, 0]);
        break;
    }

    qs.push(q);
  }

  let earth2device = Quaternion.Multiply(
    qs[0],
    Quaternion.Multiply(qs[1], qs[2])
  );
  device2earth = Quaternion.Inverse(earth2device);
}

function OnOrderChanged(order) {
  CalculateQuaternion(order);
}

function ReceiveOrientation(event) {
  alpha = event.alpha;
  beta = event.beta;
  gamma = event.gamma;
}

function Start() {
  if (typeof DeviceMotionEvent.requestPermission === "function") {
    DeviceMotionEvent.requestPermission()
      .then((permissionState) => {
        if (permissionState === "granted") {
          this.$emit("permissionGranted");
        }
      })
      .catch(console.error);
  }
  window.addEventListener("deviceorientation", ReceiveOrientation, true);
}
