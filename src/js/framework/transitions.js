export class FadeTransition {
  apply(slideFrom, slideTo) {
    this.fadeIn(slideTo);
    slideFrom.hide();
  }

  fadeIn(slideElement) {
    var currentOpacity = 0;
    slideElement.innerElement.style.opacity = currentOpacity;
    slideElement.show();

    var animation = setInterval(() => {
      if (currentOpacity < 1) {
        currentOpacity += 0.05;
        slideElement.innerElement.style.opacity = currentOpacity;
      } else {
        slideElement.innerElement.style.opacity = 1;
        clearInterval(animation);
      }
    }, 10);
  }
}
