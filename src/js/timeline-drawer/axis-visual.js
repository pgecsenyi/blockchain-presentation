import { AxisAnimator } from './axis-animator';

export class AxisVisual {
    constructor(properties) {
        this.properties = properties;

        this.animator = new AxisAnimator(this.properties.isAnimationEnabled);
    }

    draw(context, start, end) {
        this.setStyle(context);
        var animatedPosition = this.animator.calculatePosition(start, end);
        this.drawLine(context, start, animatedPosition);
        this.drawArrow(context, animatedPosition);
    }

    setStyle(context) {
        context.lineWidth = 10;
        context.strokeStyle = this.properties.color.foregroundColor;
    }

    drawLine(context, start, end) {
        context.beginPath();

        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);

        context.stroke();
    }

    drawArrow(context, position) {
        context.beginPath();

        context.moveTo(position.x - 20, position.y - 20);
        context.lineTo(position.x + 2, position.y + 2);

        context.moveTo(position.x + 2, position.y - 2);
        context.lineTo(position.x - 20, position.y + 20);

        context.stroke();
    }
}
