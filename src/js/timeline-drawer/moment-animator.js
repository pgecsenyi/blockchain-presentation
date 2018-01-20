export class MomentAnimator {
    constructor(isAnimationEnabled, startRadius, targetRadius) {
        this.isAnimationEnabled = isAnimationEnabled;
        this.startRadius = startRadius;
        this.targetRadius = targetRadius;

        this.phase = 1;
        this.currentRadius = null;
        this.hasAnimationFinished = false;
    }

    calculateRadius() {
        if (!this.isAnimationEnabled || this.hasAnimationFinished)
            return this.targetRadius;

        if (this.currentRadius == null)
            this.currentRadius = this.startRadius;

        this.stepPhase();
        if (this.hasAnimationFinished)
            return this.currentRadius;

        return this.calculateNewRadius();
    }

    stepPhase() {
        var epsilon = 2;
        var tR = this.getTargetRadiusOfPhase();

        if (Math.abs(this.currentRadius - tR) < epsilon && Math.abs(this.currentRadius - tR) < epsilon)
        {
            this.currentRadius = tR;
            this.phase++;
            if (this.phase >= 3)
                this.hasAnimationFinished = true;
        }
    }

    getTargetRadiusOfPhase() {
        if (this.phase == 1)
            return this.targetRadius * 2;

        return this.targetRadius;
    }

    calculateNewRadius() {
        var r = this.currentRadius;
        var tR = this.getTargetRadiusOfPhase();

        if (this.phase == 1) {
            this.currentRadius = r + (tR - r) / 10;
        } else if (this.phase == 2) {
            this.currentRadius = r - (r - tR) / 20;
        }

        return this.currentRadius;
    }
}
