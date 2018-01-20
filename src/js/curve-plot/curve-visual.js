import { Point } from '../common/primitives';

export class CurveProperties {
    constructor(color, increment, drawLines) {
        this.color = color;
        this.increment = increment;
        this.drawLines = drawLines;

        if (this.increment == null)
            this.increment = 0.01;
        if (this.drawLines == null)
            this.drawLines = true;
    }
}

export class CurveVisual {
    constructor(properties, scaleCalculator, func) {
        this.properties = properties;
        this.func = func;
        this.scaleCalculator = scaleCalculator;
    }

    draw(context) {
        this.setLineStyle(context);
        this.drawCurve(context);
    }

    setLineStyle(context) {
        context.lineWidth = 4;
        context.strokeStyle = this.properties.color;
    }

    drawCurve(context) {
        var increment = this.properties.increment;
        var prevValue = [];
        var abscissaScale = this.scaleCalculator.abscissaScale;

        context.beginPath();

        for (let x = abscissaScale.start; x < abscissaScale.end; x += increment) {
            let value = this.calculateFunctionValue(x);
            this.drawCurveValues(context, increment, x, prevValue, value);
            prevValue = value;
        }

        context.stroke();
    }

    calculateFunctionValue(x) {
        var value = this.func(x);
        if (typeof value === 'number')
            value = [value];

        return value;
    }

    drawCurveValues(context, increment, x, prevValue, value) {
        if (isNaN(value[0])) {
            if (!isNaN(prevValue[0]) && !isNaN(prevValue[1]))
                this.drawCurveAtPos(context, x - increment, x - increment, prevValue[1], prevValue[0]);
        } else {
            if (isNaN(prevValue[0])) {
                if (!isNaN(value[1]))
                    this.drawCurveAtPos(context, x, x, value[1], value[0]);
            } else {
                this.drawCurveAtPos(context, x - increment, x, prevValue[0], value[0]);
            }
            if (!isNaN(prevValue[1]))
                this.drawCurveAtPos(context, x - increment, x, prevValue[1], value[1]);
        }
    }

    drawCurveAtPos(context, x0, x1, y0, y1) {
        if (this.properties.drawLines)
            this.drawCurveSection(context, x0, x1, y0, y1);
        else
            this.drawCurvePoint(context, x1, y1);
    }

    drawCurvePoint(context, x1, y1) {
        var t = this.scaleCalculator.transformLogicalPoint(new Point(x1, y1));

        context.beginPath();
        context.arc(t.x, t.y, 2, 0, 2 * Math.PI, false);
        context.fillStyle = this.properties.color;
        context.fill();
    }

    drawCurveSection(context, x0, x1, y0, y1) {
        var p0 = this.scaleCalculator.transformLogicalPoint(new Point(x0, y0));
        var p1 = this.scaleCalculator.transformLogicalPoint(new Point(x1, y1));
        context.moveTo(p0.x, p0.y);
        context.lineTo(p1.x, p1.y);
    }
}
