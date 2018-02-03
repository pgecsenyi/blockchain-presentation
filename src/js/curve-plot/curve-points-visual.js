import { Point } from '../common/primitives';
import { PointVisual } from './point-visual';

export class CurvePointsProperties {
  constructor(color) {
    this.color = color;
  }
}

export class CurvePointsVisual {
  constructor(properties, scaleCalculator, func) {
    this.properties = properties;
    this.scaleCalculator = scaleCalculator;
    this.func = func;

    this.pointVisuals = [];
  }

  get count() {
    return this.pointVisuals.length;
  }

  get points() {
    var result = [];
    for (let i = 0; i < this.pointVisuals.length; i++) {
      var pv = this.pointVisuals[i];
      var tp = this.recalculatePointCoordinates(pv.model);
      result.push(tp);
    }

    return result;
  }

  addPointLogical(logicalPoint, color) {
    if (color == null)
      color = this.properties.color;

    var visual = new PointVisual(logicalPoint, color, this.scaleCalculator);
    this.pointVisuals.push(visual);
  }

  addPointPhysical(physicalPoint, color) {
    var logicalPoint = this.scaleCalculator.transformPhysicalPoint(physicalPoint);

    var fYs = this.func(logicalPoint.x);
    var fY = this.getClosestY(fYs, logicalPoint.y);

    this.addPointLogical(new Point(logicalPoint.x, fY), color);
  }

  clear() {
    this.pointVisuals = [];
  }

  draw(context) {
    for (let i = 0; i < this.pointVisuals.length; i++) {
      var visual = this.pointVisuals[i];
      visual.model = this.recalculatePointCoordinates(visual.model);
      visual.draw(context);
    }
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
