export class CanvasResizer {
  constructor(canvasName, drawer) {
    this.canvasName = canvasName;
    this.drawer = drawer;
  }

  register() {
    this.canvas = document.getElementById(this.canvasName);
    if (this.canvas == null || !this.canvas.getContext)
      return;
    this.context = this.canvas.getContext('2d');

    window.addEventListener('resize', () => this.resize(), false);

    this.resize();
  }

  resize() {
    this.calculateSize();
    this.drawer();
  }

  calculateSize() {
    if (this.canvas.offsetWidth <= 0 || this.canvas.offsetHeight <= 0)
      return;

    var aspectRatio = window.innerHeight / window.innerWidth;

    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetWidth * aspectRatio;
  }

  unregister() {
    window.removeEventListener('resize', () => this.resize());
  }
}
