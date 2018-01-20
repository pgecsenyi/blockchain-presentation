import { Point } from '../common/primitives';
import { MomentVisual } from './moment-visual';
import { AxisVisual } from './axis-visual';

export class TimelineDrawer {
    constructor(canvasName, properties) {
        this.properties = properties;

        this.findCanvasContext(canvasName);
        this.moments = [];
        this.axis = new AxisVisual(properties);
    }

    addMoment(moment) {
        var visual = new MomentVisual(this.properties, moment);
        this.moments.push(visual);
    }

    draw() {
        this.clearCanvas();
        this.setDrawingAreaParameters();
        this.drawAxis();
        this.drawMoments();
        this.animate();
    }

    findCanvasContext(canvasName) {
        this.canvas = document.getElementById(canvasName);
        if (this.canvas == null || !this.canvas.getContext)
            throw 'No canvas available with this name.';

        this.context = this.canvas.getContext('2d');
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = this.properties.color.backgroundColor;
        this.context.rect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fill();
    }

    setDrawingAreaParameters() {
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        var y = (this.properties.startPosition.y == null) ? this.height / 2 : this.properties.startPosition.y;

        this.start = new Point(this.properties.startPosition.x, y);
        this.end = new Point(this.width - this.properties.startPosition.x, y);
    }

    drawAxis() {
        this.axis.draw(this.context, this.start, this.end);
    }

    drawMoments() {
        var props = this.properties;
        var timelineWidth = this.width - this.start.x - (this.width - this.end.x);

        for (let i = 0; i < this.moments.length; i++) {
            let visual = this.moments[i];
            let logicalX = visual.model.scalePosition;
            let physicalPosition = new Point(
                this.start.x + ((logicalX - props.scale.start) / props.scale.length) * timelineWidth,
                this.start.y);

            visual.draw(this.context, physicalPosition, i % 2 == 1);
        }
    }

    animate() {
        var hasAnimationFinished = this.axis.animator.hasAnimationFinished;

        if (hasAnimationFinished) {
            for (let i = 0; i < this.moments.length; i++) {
                hasAnimationFinished = hasAnimationFinished && this.moments[i].isDrawn;
                if (!hasAnimationFinished)
                    break;
            }
        }

        if (!hasAnimationFinished)
            window.requestAnimationFrame(() => this.draw());
    }
}
