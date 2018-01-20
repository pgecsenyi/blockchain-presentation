export class ColorPair {
    constructor(backgroundColor, foregroundColor) {
        this.backgroundColor = backgroundColor;
        this.foregroundColor = foregroundColor;
    }
}

export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get isValid() {
        return !isNaN(this.x) && !isNaN(this.y);
    }

    clone() {
        return new Point(this.x, this.y);
    }

    equals(point) {
        if (point == null)
            return false;

        return point.x == this.x && point.y == this.y;
    }
}

export class Range {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    get length() {
        return this.end - this.start;
    }
}

export class Size {
    constructor(width, height) {
        this.width = (width == null) ? 0 : width;
        this.height = (height == null) ? 0 : height;
    }

    equals(size) {
        if (size == null)
            return false;

        return size.width == this.width && size.height == this.height;
    }
}
