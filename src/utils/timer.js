/**
 * 定时器
 */
function JsTimer() {
    this._timerInterval = 200;
    this._maxOffset = 5000;
    this._repeats = [];
    this._onces = [];
    this._offsetTime = 0;
    this._lasttime = 0;
    this._totalStartTime = 0;
    this._totalSpan = 0;
    this._popStartTime = 0;
    this._popSpan = 0;
    this._timelineRunning = false;
    window.setInterval(this._onInterval.bind(this), this._timerInterval);
}
JsTimer.prototype.appendRepeateHandler = function(name, fun, invalidTime, intervalTime) {
    this._repeats.push({
        name: name,
        handler: fun,
        expried: invalidTime,
        delay: intervalTime,
        next: this.time() + intervalTime
    });
};
JsTimer.prototype.appendHandler = function(name, handleTime, fun) {
    this._onces.push({
        name: name,
        time: handleTime,
        handler: fun
    });
};
JsTimer.prototype.removeHandler = function(name) {
    var i = 0;
    while (i < this._onces.length) {
        if (this._onces[i].name == name) {
            this._onces.splice(i, 1);
            continue;
        }
        i++;
    }
    i = 0;
    while (i < this._repeats.length) {
        if (this._repeats[i].name == name) {
            this._repeats.splice(i, 1);
            continue;
        }
        i++;
    }
};
JsTimer.prototype.startTimeline = function() {
    this._totalStartTime = this.time();
    this._totalSpan = 0;
    this._popStartTime = this._totalStartTime;
    this._popSpan = 0;
    this._timelineRunning = true;
};
JsTimer.prototype.pauseTimeline = function() {
    if (this._timelineRunning) {
        this._timelineRunning = false;
        this._totalSpan += this.time() - this._totalStartTime;
        this._popSpan += this.time() - this._popStartTime;
    }
};
JsTimer.prototype.resumeTimeline = function() {
    if (!this._timelineRunning) {
        this._timelineRunning = true;
        this._totalStartTime = this.time();
        this._popStartTime = this._totalStartTime;
    }
};
JsTimer.prototype.getTotalSpan = function() {
    if (this._timelineRunning)
        return this._totalSpan + this.time() - this._totalStartTime;
    return this._totalSpan;
};
JsTimer.prototype.popSpan = function() {
    var span = this._popSpan;
    this._popSpan = 0;
    if (this._timelineRunning) {
        var s = this._popStartTime;
        this._popStartTime = this.time();
        return span + this._popStartTime - s;
    }
    return span;
};
JsTimer.prototype.peekSpan = function() {
    if (this._timelineRunning)
        return this._popSpan + this.time() - this._popStartTime;
    return this._popSpan;
};
JsTimer.prototype.time = function() {
    return new Date().getTime() + this._offsetTime;
};
JsTimer.prototype._setServerTime = function(serverTime) {
    this._offsetTime = serverTime - new Date().getTime();
};
JsTimer.prototype._onInterval = function() {
    var i = 0,
        cur = this.time();
    this._lasttime = cur;
    while (i < this._onces.length) {
        var c = this._onces[i];
        if (cur >= c.time) {
            c.handler(c.name);
            this._onces.splice(i, 1);
            continue;
        }
        i++;
    }
    i = 0;
    while (i < this._repeats.length) {
        var c = this._repeats[i];
        if (cur >= c.expried) {
            this._repeats.splice(i, 1);
            break;
        }
        if (cur >= c.next) {
            c.handler(c.name, cur);
            c.next = cur + c.delay;
        }
        i++;
    }
};

export default JsTimer;
