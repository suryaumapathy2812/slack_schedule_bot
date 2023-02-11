"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressBar = void 0;
var ProgressBar = /** @class */ (function () {
    function ProgressBar() {
    }
    ProgressBar.generateProgressBar = function (percentage) {
        var completed = Math.round(percentage * this.n);
        var inCompleted = ((this.max * this.n) - completed);
        var max = (this.max * this.n);
        var progressBar = "";
        for (var i = 0; i < max; i++) {
            progressBar += (i < completed) ? "█" : "░";
        }
        console.log(progressBar);
        return progressBar;
    };
    ProgressBar.n = 3;
    ProgressBar.max = 10;
    return ProgressBar;
}());
exports.ProgressBar = ProgressBar;
