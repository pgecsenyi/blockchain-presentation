export class TimelineProperties {
  constructor(startPosition, scale, color, labelColor, descriptionColor, isAnimationEnabled, momentRadius) {
    this.startPosition = startPosition;
    this.scale = scale;
    this.color = color;
    this.labelColor = labelColor;
    this.descriptionColor = descriptionColor;
    this.isAnimationEnabled = isAnimationEnabled;
    this.momentRadius = (momentRadius == null) ? 10 : momentRadius;
  }
}
