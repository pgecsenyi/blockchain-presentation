import { Point } from '../common/primitives';

export class AxisProperties {
  constructor(axisColor, gridColor) {
    this.axisColor = axisColor;
    this.gridColor = gridColor;
  }
}

export class AxisVisual {
  constructor(properties, scaleCalculator) {
    this.properties = properties;
    this.scaleCalculator = scaleCalculator;
  }

  draw(context) {
    if (this.properties.gridColor != null) {
      this.setGridStyle(context);
      this.drawGrid(context);
    }
    this.setLineStyle(context);
    this.drawLines(context);
    this.setScaleStyle(context);
    this.drawScales(context);
  }

  setGridStyle(context) {
    context.lineWidth = 1;
    context.strokeStyle = this.properties.gridColor;
  }

  drawGrid(context) {
    context.beginPath();
    this.drawHorizontalLines(context);
    this.drawVerticalLines(context);
    context.stroke();
  }

  drawHorizontalLines(context) {
    var size = this.scaleCalculator.size;
    var start = this.calculateFirstPositionOnOrdinate();
    for (let y = start; y > 0; y -= this.scaleCalculator.ordinateDivisionSize)
      this.drawLine(context, 0, y, size.width, y);
  }

  drawVerticalLines(context) {
    var size = this.scaleCalculator.size;
    var start = this.calculateFirstPositionOnAbscissa();
    for (let x = start; x < size.width; x += this.scaleCalculator.abscissaDivisionSize)
      this.drawLine(context, x, 0, x, size.height);
  }

  drawLine(context, x0, y0, x1, y1) {
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
  }

  calculateFirstPositionOnAbscissa() {
    return 0;
  }

  calculateFirstPositionOnOrdinate() {
    var size = this.scaleCalculator.size;
    var d = size.height - this.scaleCalculator.abscissaPosition;

    return size.height - d % this.scaleCalculator.ordinateDivisionSize;
  }

  setLineStyle(context) {
    context.lineWidth = 2;
    context.strokeStyle = this.properties.axisColor;
  }

  drawLines(context) {
    var size = this.scaleCalculator.size;

    context.beginPath();

    context.moveTo(0, this.scaleCalculator.abscissaPosition);
    context.lineTo(size.width, this.scaleCalculator.abscissaPosition);

    context.moveTo(this.scaleCalculator.ordinatePosition, 0);
    context.lineTo(this.scaleCalculator.ordinatePosition, size.height);

    context.stroke();
  }

  setScaleStyle(context) {
    context.lineWidth = 1;
    context.fillStyle = this.properties.axisColor;
    context.font = '14px Arial';
    context.textAlign = 'center';
  }

  drawScales(context) {
    this.drawAbscissa(context);
    this.drawOrdinate(context);
  }

  drawAbscissa(context) {
    var label = this.calculateFirstLabelOnAbscissa();
    var size = this.scaleCalculator.size;
    var start = this.calculateFirstPositionOnAbscissa();

    for (let x = start; x < size.width; x += this.scaleCalculator.abscissaDivisionSize) {
      let linePosition = new Point(x, this.scaleCalculator.abscissaPosition);
      let lineOffset = new Point(0, 8);
      let labelPosition = new Point(linePosition.x, linePosition.y + 30);
      this.drawDivisionLine(context, linePosition, lineOffset, label);
      this.drawDivisionLabel(context, labelPosition, label);
      label++;
    }
  }

  calculateFirstLabelOnAbscissa() {
    return (-1) * Math.floor(this.scaleCalculator.ordinatePosition / this.scaleCalculator.abscissaDivisionSize);
  }

  drawDivisionLine(context, position, offset) {
    context.beginPath();
    context.moveTo(position.x - offset.x, position.y - offset.y);
    context.lineTo(position.x + offset.x, position.y + offset.y);
    context.stroke();
  }

  drawDivisionLabel(context, position, label) {
    context.fillText(label, position.x, position.y);
  }

  drawOrdinate(context) {
    var start = this.calculateFirstPositionOnOrdinate();
    var label = this.calculateFirstLabelOnOrdinate();

    for (let y = start; y > 0; y -= this.scaleCalculator.ordinateDivisionSize) {
      let linePosition = new Point(this.scaleCalculator.ordinatePosition, y);
      let lineOffset = new Point(8, 0);
      let labelPosition = new Point(linePosition.x - 30, linePosition.y);
      this.drawDivisionLine(context, linePosition, lineOffset, label);
      this.drawDivisionLabel(context, labelPosition, label);
      label++;
    }
  }

  calculateFirstLabelOnOrdinate() {
    var d = this.scaleCalculator.size.height - this.scaleCalculator.abscissaPosition;

    return (-1) * Math.floor(d / this.scaleCalculator.ordinateDivisionSize);
  }
}
