var alpha = 0;
var beta = 0;
var gamma = 0;

function CalculateQuaternion(order) {}

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
