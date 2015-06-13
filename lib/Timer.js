var Log = require('./Log');
var Time = require('./Time');

var Timer = function() {
  this.paused = false;
  this.reset();
  Time.registerTimer(this);
}

Timer.prototype.update = function(delta) {
  if (this.paused) {
    return;
  }

  if (this.prev === 0) {
    this.prev = Date.now();
  }

  this.now = Date.now();
  this.delta = (delta !== undefined) ? delta : (this.now - this.prev) / 1000;

  //More than 1s = probably switched back from another window so we have big jump now
  if (this.delta > 1) {
    this.delta = 0;
  }

  this.prev = this.now;
  this.seconds += this.delta;
  
  return this.seconds;

};


Timer.prototype.start = function() {
  this.startOfMeasuredTime = Date.now();
};

Timer.prototype.stop = function(msg) {
  var now = Date.now();
  var seconds = (now - this.startOfMeasuredTime) / 1000;
  if (msg) {
    console.log(msg + seconds);
  }
  return seconds;
};

Timer.prototype.pause = function() {
  this.paused = true;
};

Timer.prototype.togglePause = function() {
  this.paused = !this.paused;
};

Timer.prototype.reset = function() {
  this.now = 0;
  this.prev = 0;
  this.delta = 0;
  this.seconds = 0;
  this.startOfMeasuredTime = 0;
}

module.exports = Timer;