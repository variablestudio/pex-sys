var Log = require('./Log');

var Time = {
    now: 0,
    prev: 0,
    delta: 0,
    seconds: 0,
    frameNumber: 0,
    fpsFrames: 0,
    fpsTime: 0,
    fps: 0,
    fpsFrequency: 3,
    paused: false,
    verbose: false,
    timers: []
};

Time.registerTimer = function(timer) {
  // check if timer exists in the array
  for (var i = 0; i < Time.timers.length; i++) {
      if (Time.timers[i] === timer) {
          return;
      }
  }
  Time.timers.push(timer);
};

Time.unregisterTimer = function(timer) {
  // look for timer
  var i = 0;
  for (; i < Time.timers.length;) {
      if (Time.timers[i] === timer) {
          Time.timers.splice(i, 1);
      } else {
        i++;
      }
  }
};

Time.update = function(delta) {
  for (var i = 0; i < Time.timers.length; i++) {
    Time.timers[i].update();
  }

  if (Time.paused) {
    return;
  }

  if (Time.prev === 0) {
    Time.prev = Date.now();
  }

  Time.now = Date.now();
  Time.delta = (delta !== undefined) ? delta : (Time.now - Time.prev) / 1000;

  //More than 1s = probably switched back from another window so we have big jump now
  if (Time.delta > 1) {
    Time.delta = 0;
  }

  Time.prev = Time.now;
  Time.seconds += Time.delta;
  Time.fpsTime += Time.delta;
  Time.frameNumber++;
  Time.fpsFrames++;

  if (Time.fpsTime > Time.fpsFrequency) {
    Time.fps = Time.fpsFrames / Time.fpsTime;
    Time.fpsTime = 0;
    Time.fpsFrames = 0;
    if (this.verbose)
      Log.message('FPS: ' + Time.fps);
  }
  return Time.seconds;

};

var startOfMeasuredTime = 0;

Time.startMeasuringTime = function() {
  startOfMeasuredTime = Date.now();
};

Time.stopMeasuringTime = function(msg) {
  var now = Date.now();
  var seconds = (now - startOfMeasuredTime) / 1000;
  if (msg) {
    console.log(msg + seconds);
  }
  return seconds;
};

Time.pause = function() {
  Time.paused = true;
};

Time.togglePause = function() {
  Time.paused = !Time.paused;
};

Time.reset = function() {
  Time.now = 0;
  Time.prev = 0;
  Time.delta = 0;
  Time.seconds = 0;
  Time.frameNumber = 0;
  Time.fpsFrames = 0;
}

module.exports = Time;