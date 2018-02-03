import { Point } from '../common/primitives';

export class LineProperties {
  constructor(color) {
    this.color = color;
  }
}

export class LineVisual {
  constructor(properties, scaleCalculator, p0, p1) {
    this.properties = properties;
    this.scaleCalculator = scaleCalculator;
    this.p0 = p0;
    this.p1 = p1;
  }

  draw(context) {
    var edgeIntersections = this.calculateEdgeIntersections();
    if (edgeIntersections.length < 2)
      return;

    this.setLineStyle(context);

    var start = edgeIntersections[0];
    var end = edgeIntersections[1];

    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
  }

  setLineStyle(context) {
    context.lineWidth = 4;
    context.strokeStyle = this.properties.color;
  }

  calculateV() {
    var v = new Point(this.p1.x - this.p0.x, this.p1.y - this.p0.y);

    return this.normalizeVector(v);
  }

  normalizeVector(vector) {
    var length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);

    return new Point(vector.x / length, vector.y / length);
  }

  calculateEdgeIntersections() {
    var w = this.scaleCalculator.size.width;
    var h = this.scaleCalculator.size.height;
    var p0 = this.scaleCalculator.transformLogicalPoint(this.p0);
    var p1 = this.scaleCalculator.transformLogicalPoint(this.p1);

    var i1 = this.calculateIntersection(p0, p1, new Point(0, 0), new Point(w, 0));
    var i2 = this.calculateIntersection(p0, p1, new Point(w, 0), new Point(w, h));
    var i3 = this.calculateIntersection(p0, p1, new Point(0, h), new Point(w, h));
    var i4 = this.calculateIntersection(p0, p1, new Point(0, 0), new Point(0, h));

    return this.getValidPoints(i1, i2, i3, i4);
  }

  calculateIntersection(l1p1, l1p2, l2p1, l2p2) {
    var denominator = (l1p1.x - l1p2.x) * (l2p1.y - l2p2.y) - (l1p1.y - l1p2.y) * (l2p1.x - l2p2.x);
    if (denominator == 0)
      return new Point(NaN, NaN);

    var m1 = (l1p1.x * l1p2.y - l1p1.y * l1p2.x);
    var m2 = (l2p1.x * l2p2.y - l2p1.y * l2p2.x);
    var x = (m1 * (l2p1.x - l2p2.x) - (l1p1.x - l1p2.x) * m2) / denominator;
    var y = (m1 * (l2p1.y - l2p2.y) - (l1p1.y - l1p2.y) * m2) / denominator;

    return new Point(x, y);
  }

  getValidPoints(points) {
    points = arguments;
    var epsilon = 0.1;
    var limitX = this.scaleCalculator.size.width + epsilon;
    var limitY = this.scaleCalculator.size.height + epsilon;
    var validPoints = [];

    for (let i = 0; i < points.length; i++) {
      var isXValid = points[i].x >= (-1) * epsilon && points[i].x <= limitX;
      var isYValid = points[i].y >= (-1) * epsilon && points[i].y <= limitY;

      if (points[i].isValid && isXValid && isYValid)
        validPoints.push(points[i]);
    }

    return validPoints;
  }
}
