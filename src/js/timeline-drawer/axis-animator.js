export class AxisAnimator {
    constructor(isAnimationEnabled) {
        this.isAnimationEnabled = isAnimationEnabled;

        this.currentPosition = null;
        this.hasAnimationFinished = false;
    }

    calculatePosition(startPoint, targetPoint) {
        if (!this.isAnimationEnabled || this.hasAnimationFinished)
            return targetPoint;

        if (this.currentPosition == null)
            this.currentPosition = startPoint;

        var epsilon = 2;
        var tX = targetPoint.x;
        var tY = targetPoint.y;

        if (Math.abs(this.currentPosition.x - tX) < epsilon && Math.abs(this.currentPosition.y - tY) < epsilon)
        {
            this.currentPosition = targetPoint;
            this.hasAnimationFinished = true;
            return targetPoint;
        }

        return this.calculateNewPosition(targetPoint);

    }

    calculateNewPosition(targetPoint) {
        var x = this.currentPosition.x;
        var y = this.currentPosition.y;
        this.currentPosition.x = x + (targetPoint.x - x) / 10;
        this.currentPosition.y = y + (targetPoint.y - y) / 10;

        return this.currentPosition;
    }
}
