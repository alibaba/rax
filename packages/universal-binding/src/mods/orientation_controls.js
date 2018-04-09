import Quaternion from './quaternion';
import Vector3 from './vector3';
import Euler from './euler';
import _Math from './math';
import assign from 'object-assign';


function isNaNOrUndefined(n) {
  return n === undefined || isNaN(n) || n === null;
}

function DeviceOrientationControls(object) {
  var scope = this;
  this.object = assign({
    alphaOffsetAngle: 0,
    betaOffsetAngle: 0,
    gammaOffsetAngle: 0
  }, object);

  this.alphaOffsetAngle = this.object.alphaOffsetAngle;
  this.betaOffsetAngle = this.object.betaOffsetAngle;
  this.gammaOffsetAngle = this.object.gammaOffsetAngle;


  this.quaternion = new Quaternion(0, 0, 0, 1);
  this.enabled = true;
  this.deviceOrientation = {};
  this.screenOrientation = 0;
  this.start = null;

  this.recordsAlpha = [];


  function formatRecords(records, threshold) {
    var l = records.length;
    var times = 0;
    if (l > 1) {
      for (var i = 0; i < l; i++) {
        if (records[i - 1] != undefined && records[i] != undefined) {
          if (records[i] - records[i - 1] < -threshold / 2) {
            times = Math.floor(records[i - 1] / threshold) + 1;
            records[i] = records[i] + times * threshold;
          }
          if (records[i] - records[i - 1] > threshold / 2) {
            records[i] = records[i] - threshold;
          }
        }
      }
    }
    return records;
  }

  var onDeviceOrientationChangeEvent = function(e) {
    var alpha = e.alpha;
    var beta = e.beta;
    var gamma = e.gamma;
    var recordsAlpha = scope.recordsAlpha;

    if (!scope.start) {
      scope.start = {
        alpha: alpha,
        beta: beta,
        gamma: gamma
      };
    }
    recordsAlpha.push(alpha);
    if (recordsAlpha.length > 5) {
      recordsAlpha = formatRecords(recordsAlpha, 360);
      recordsAlpha.shift();
    }

    var formatAlpha = (recordsAlpha[recordsAlpha.length - 1] - scope.start.alpha) % 360;
    if (!isNaNOrUndefined(alpha) && !isNaNOrUndefined(beta) && !isNaNOrUndefined(gamma)) {
      scope.enabled = true;
    }


    scope.deviceOrientation = {
      alpha: alpha,
      beta: beta,
      gamma: gamma,
      formatAlpha: formatAlpha,
      dalpha: alpha - scope.start.alpha,
      dbeta: beta - scope.start.beta,
      dgamma: gamma - scope.start.gamma
    };
  };

  var onScreenOrientationChangeEvent = function() {
    scope.screenOrientation = window.orientation || 0;
  };

  // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

  var setObjectQuaternion = function() {
    var zee = new Vector3(0, 0, 1);

    var euler = new Euler();

    var q0 = new Quaternion();

    var q1 = new Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

    return function(quaternion, alpha, beta, gamma, orient) {
      euler.set(beta, alpha, -gamma, 'YXZ'); // 'ZXY' for the device, but 'YXZ' for us

      quaternion.setFromEuler(euler); // orient the device

      quaternion.multiply(q1); // camera looks out the back of the device, not the top

      quaternion.multiply(q0.setFromAxisAngle(zee, -orient)); // adjust for screen orientation
    };
  }();

  this.connect = function() {
    onScreenOrientationChangeEvent(); // run once on load
    window.addEventListener('orientationchange', onScreenOrientationChangeEvent, false);
    window.addEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);
  };

  this.disconnect = function() {
    window.removeEventListener('orientationchange', onScreenOrientationChangeEvent, false);
    window.removeEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);
    scope.enabled = false;
  };

  this.update = function() {
    if (scope.enabled === false) return;
    var alpha = !isNaNOrUndefined(scope.deviceOrientation.formatAlpha) ? _Math.degToRad(!isNaNOrUndefined(scope.object.alpha) ? scope.object.alpha : scope.deviceOrientation.formatAlpha + scope.alphaOffsetAngle) : 0; // Z
    var beta = !isNaNOrUndefined(scope.deviceOrientation.beta) ? _Math.degToRad(!isNaNOrUndefined(scope.object.beta) ? scope.object.beta : scope.deviceOrientation.beta + scope.betaOffsetAngle) : 0; // X'
    var gamma = !isNaNOrUndefined(scope.deviceOrientation.gamma) ? _Math.degToRad(!isNaNOrUndefined(scope.object.gamma) ? scope.object.gamma : scope.deviceOrientation.gamma + scope.gammaOffsetAngle) : 0; // Y''
    var orient = scope.screenOrientation ? _Math.degToRad(scope.screenOrientation) : 0; // O
    setObjectQuaternion(scope.quaternion, alpha, beta, gamma, orient);
  };

  this.updateAlphaOffsetAngle = function(angle) {
    this.alphaOffsetAngle = angle;
    this.update();
  };
  this.updateBetaOffsetAngle = function(angle) {
    this.betaOffsetAngle = angle;
    this.update();
  };
  this.updateGammaOffsetAngle = function(angle) {
    this.gammaOffsetAngle = angle;
    this.update();
  };

  this.dispose = function() {
    this.disconnect();
  };

  this.connect();
};

export default DeviceOrientationControls;