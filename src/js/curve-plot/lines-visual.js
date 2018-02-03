import { Point } from '../common/primitives';
import { LineProperties, LineVisual } from './line-visual';

export class LinesProperties {
  constructor(color) {
    this.color = color;
  }
}

export class LinesVisual {
  constructor(properties, scaleCalculator, func) {
    this.properties = properties;
    this.scaleCalculator = scaleCalculator;
    this.func = func;

    this.lineVisuals = [];
  }

  get count() {
    return this.lineVisuals.length;
  }

  add(p0, p1, color) {
    color = (color == null) ? this.properties.color : color;
    var lineProperties = new LineProperties(color);
    var visual = new LineVisual(lineProperties, this.scaleCalculator, p0, p1);

    this.lineVisuals.push(visual);
  }

  clear() {
    this.lineVisuals = [];
  }

  draw(context) {
    for (let i = 0; i < this.lineVisuals.length; i++) {
      var visual = this.lineVisuals[i];
      this.recalculateLineCoordinates(visual);
      visual.draw(context);
    }
  }

  recalculateLineCoordinates(line) {
    line.p0 = this.recalculatePointCoordinates(line.p0);
    line.p1 = this.recalculatePointCoordinates(line.p1);
  }

  recalculatePointCoordinates(point) {
    var fYs = this.func(point.x);
    var fY = this.getClosestY(fYs, point.y);

    return new Point(point.x, fY);
  }

  getClosestY(fYs, lY) {
    if (fYs.constructor === Array) {
      var d1 = Math.abs(fYs[0] - lY);
      var d2 = Math.abs(fYs[1] - lY);

      return d1 < d2 ? fYs[0] : fYs[1];
    }

    return fYs;
  }
}
