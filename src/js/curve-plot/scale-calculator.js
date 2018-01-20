import { Point, Range, Size } from '../common/primitives';

export class ScaleCalculator {
    constructor(abscissaScale, ordinateScale) {
        this.originalAbscissaScale = abscissaScale;
        this.originalOrdinateScale = ordinateScale;

        this.areCachedValuesValid = false;
        this.currentAbscissaScale = this.originalAbscissaScale;
        this.currentOffset = new Point(0, 0);
        this.currentOrdinateScale = this.originalOrdinateScale;
        this.currentSize = new Size();
    }

    get abscissaDivisionSize() {
        return this.currentAbscissaDivisionSize;
    }

    get abscissaPosition() {
        return this.currentAbscissaPosition;
    }

    get abscissaScale() {
        return this.currentAbscissaScale;
    }

    set abscissaScale(value) {
        this.currentAbscissaScale = value;
        this.invalidateCache();
    }

    get offset() {
        return this.currentOffset;
    }

    set offset(value) {
        this.currentOffset = value;
        this.invalidateCache();
    }

    get ordinateDivisionSize() {
        return this.currentOrdinateDivisionSize;
    }

    get ordinatePosition() {
        return this.currentOrdinatePosition;
    }

    get ordinateScale() {
        return this.currentOrdinateScale;
    }

    set ordinateScale(value) {
        this.originalOrdinateScale = value;
        this.invalidateCache();
    }

    get size() {
        return this.currentSize;
    }

    rescale(size) {
        if (this.areCachedValuesValid && this.currentSize.equals(size))
            return;

        this.currentSize = size;
        this.rescaleAbscissa();

        if (this.originalOrdinateScale == null)
            this.recalculateOrdinateScale();
        else
            this.rescaleOrdinate();

        this.areCachedValuesValid = true;
    }

    reset() {
        this.currentAbscissaScale = this.originalAbscissaScale;
        this.currentOffset = new Point(0, 0);
        this.currentOrdinateScale = this.originalOrdinateScale;
        this.invalidateCache();
    }

    rescaleAbscissa() {
        this.currentAbscissaDivisionSize = this.currentSize.width / this.currentAbscissaScale.length;
        var horizontalOffset = (-1) * this.currentAbscissaScale.start + (-1) * this.currentOffset.x;
        this.currentOrdinatePosition = horizontalOffset * this.abscissaDivisionSize;
    }

    recalculateOrdinateScale() {
        this.currentOrdinateDivisionSize = this.abscissaDivisionSize;
        this.currentAbscissaPosition = this.currentSize.height / 2;
        this.currentAbscissaPosition += this.currentOffset.y * this.ordinateDivisionSize;
        this.recalculateLogicalScale();
    }

    recalculateLogicalScale() {
        var start = (-1) * (this.abscissaPosition / this.currentOrdinateDivisionSize);
        var end = (this.currentSize.height - this.abscissaPosition) / this.currentOrdinateDivisionSize;

        start = (start > 0) ? 0 : start;
        end = (end < 0) ? 0 : end;

        this.currentOrdinateScale = new Range(start, end);
    }

    rescaleOrdinate() {
        this.currentOrdinateDivisionSize = this.currentSize.height / this.currentOrdinateScale.length;
        var verticalOffset = (-1) * this.currentOrdinateScale.start + this.currentOffset.y;
        this.currentAbscissaPosition = this.currentSize.height - verticalOffset * this.ordinateDivisionSize;
    }

    transformLogicalPoint(lPoint) {
        var lX = lPoint.x;
        var lY = lPoint.y;

        var pX = this.ordinatePosition + lX * this.abscissaDivisionSize;
        var pY = this.abscissaPosition - (lY * this.ordinateDivisionSize);

        return new Point(pX, pY);
    }

    transformPhysicalPoint(pPoint) {
        var pX = pPoint.x;
        var pY = pPoint.y;

        var lX = (pX - this.currentOrdinatePosition) / this.abscissaDivisionSize;
        var lY = (this.currentAbscissaPosition - pY) / this.ordinateDivisionSize;

        return new Point(lX, lY);
    }

    invalidateCache() {
        this.areCachedValuesValid = false;
    }
}
