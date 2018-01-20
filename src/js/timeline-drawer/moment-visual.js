import { Point, Size } from '../common/primitives';
import { MomentAnimator } from './moment-animator';
import { TextSizeCalculator } from './text-size-calculator';

export class MomentVisual {
    constructor(properties, model) {
        this.properties = properties;
        this.model = model;

        this.animator = new MomentAnimator(
            this.properties.isAnimationEnabled,
            this.properties.momentRadius,
            this.properties.momentRadius);
        this.isImageLoaded = false;
        this.textSizeCalculator = new TextSizeCalculator();
        this.loadImage();
    }

    get isDrawn() {
        return this.isImageLoaded && this.animator.hasAnimationFinished;
    }

    draw(context, position, invert) {
        this.drawCircle(context, position);
        this.drawTexts(context, position, invert);
        this.drawImage(context, position, invert);
    }

    loadImage() {
        if (this.model.imagePath == null)
            return;

        this.image = null;
        var image = new Image();
        image.onload = () => {
            this.image = image;
            this.isImageLoaded = true;
        };
        image.src = this.model.imagePath;
    }

    drawCircle(context, position) {
        context.beginPath();

        context.arc(position.x, position.y, this.animator.calculateRadius(), 0, 2 * Math.PI, false);
        context.fillStyle = this.properties.color.backgroundColor;
        context.fill();

        context.lineWidth = 10;
        context.strokeStyle = this.properties.color.foregroundColor;
        context.stroke();
    }

    drawTexts(context, position, invert) {
        var m = invert ? -1 : 1;
        var labelHeight = 0;

        if (this.model.label != null && this.model.label != '') {
            let font = 'bold 30px ubuntu';
            let size = this.textSizeCalculator.measureSize(this.model.label, font);
            labelHeight = size.height;
            let y = position.y + m * (this.animator.targetRadius + 20 + ((m < 0) ? 0 : labelHeight));
            this.drawText(this.model.label, context, new Point(position.x, y), font, this.properties.labelColor);
        }

        this.drawDescription(context, position, labelHeight, m);
    }

    drawText(text, context, location, font, color) {
        context.fillStyle = color;
        context.font = font;
        context.textAlign = 'center';
        context.fillText(text, location.x, location.y);
    }

    drawDescription(context, position, labelHeight, m) {
        if (this.model.description == null && this.model.description == '')
            return;

        var lines = this.model.description.split('\n');
        var font = '24px ubuntu';
        var baseHeight = this.animator.targetRadius + 25 + labelHeight;
        var size = this.textSizeCalculator.measureSize(lines[0], font);

        for (let i = 0; i < lines.length; i++) {
            var lineCount = (m < 0) ? ((lines.length - 1) - i) : i + 1;
            var y = position.y + m * (baseHeight + lineCount * (size.height + 5));
            this.drawText(
                lines[i],
                context,
                new Point(position.x, y),
                font,
                this.properties.descriptionColor);
        }

        this.lowestY = y + m * ((m < 0) ? (lineCount + 1) * (size.height + 5) : 0);
    }

    drawImage(context, position, invert) {
        if (this.image == null)
            return;

        var size = this.calculateImageSize();
        var m = invert ? -1 : 1;
        var f = (m < 0) ? size.height : 0;
        var x = position.x - (size.width / 2);
        var y = this.lowestY + m * (f + 25);

        context.drawImage(this.image, x, y, size.width, size.height);
    }

    calculateImageSize() {
        var maxSize = 100;
        var width = this.image.width;
        var height = this.image.height;

        if (width > height) {
            width = maxSize;
            height = width * (this.image.height / this.image.width);
        } else {
            height = maxSize;
            width = height * (this.image.width / this.image.height);
        }

        return new Size(width, height);
    }
}
