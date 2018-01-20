export class PointVisual {
    constructor(model, color, scaleCalculator) {
        this.model = model;
        this.color = color;
        this.scaleCalculator = scaleCalculator;
    }

    draw(context) {
        var t = this.scaleCalculator.transformLogicalPoint(this.model);

        context.beginPath();
        context.arc(t.x, t.y, 8, 0, 2 * Math.PI, false);
        context.fillStyle = this.color;
        context.fill();
    }
}
