import { EventHandler, EventHandlerManager } from './event-handler-manager';
import { FadeTransition } from './transitions';
import { NinjaElement } from './ninja-element';

export function initialize(assistantGroup, transition) {
  if (transition == null)
    transition = new FadeTransition();

  var slideshow = new Slideshow(assistantGroup, transition);
  slideshow.loadSlides();
}

class Slideshow {
  constructor(assistantGroup, transition) {
    this.assistantGroup = assistantGroup;
    this.transition = transition;

    this.currentSlide = 0;
    this.slides = [];
    this.registerEventHandlers();
  }

  registerEventHandlers() {
    this.eventHandlerManager = new EventHandlerManager();
    this.eventHandlerManager.addEventHandler(new EventHandler(window, 'load', () => this.onDocumentLoad()));
    this.eventHandlerManager.addEventHandler(new EventHandler(window, 'hashchange', () => this.onHashChange()));
    this.eventHandlerManager.addEventHandler(new EventHandler(window, 'keydown', e => this.onKeyDown(e)));
    this.eventHandlerManager.registerHandlers();
  }

  loadSlides() {
    var htmlSlides = document.getElementsByClassName('slide');

    for (let i = 0; i < htmlSlides.length; i++) {
      var slideElement = new NinjaElement(htmlSlides[i]);
      this.slides.push(slideElement);

      if (i > 0)
        slideElement.hide();
    }
  }

  onDocumentLoad() {
    this.handleUrlChange();
  }

  handleUrlChange() {
    var nextSlide = this.getSlideIdFromUrl();
    this.changePage(this.currentSlide, nextSlide);
  }

  getSlideIdFromUrl() {
    var urlAnchor = window.location.hash;
    if (urlAnchor == null)
      return 0;

    var re = new RegExp('#slide-([0-9]+)');
    var match = urlAnchor.match(re);
    if (match == null || match.length < 2)
      return 0;

    return parseInt(match[1]);
  }

  changePage(slideFrom, slideTo) {
    if (slideFrom == slideTo)
      return;

    this.transition.apply(this.slides[slideFrom], this.slides[slideTo]);
    this.currentSlide = slideTo;
    this.updatePageUrl(this.currentSlide);
    this.assistantGroup.go(this.currentSlide);
    this.triggerSlidedChangeEvent(slideFrom, slideTo);
  }

  updatePageUrl(slideId) {
    var url = window.location.href;

    var anchorPos = url.indexOf('#');
    if (anchorPos != -1)
      url = url.substring(0, anchorPos);

    url += '#slide-' + slideId;
    window.location.href = url;
  }

  triggerSlidedChangeEvent(from, to) {
    var event = this.createSlideChangedEvent(from, to);
    document.dispatchEvent(event);
  }

  createSlideChangedEvent(from, to) {
    return new CustomEvent(
      'changed',
      {
        detail: {
          from: from,
          to: to,
        },
        bubbles: true,
        cancelable: true
      }
    );
  }

  onHashChange() {
    this.handleUrlChange();
  }

  onKeyDown(event) {
    // End.
    if (event.keyCode == 35) {
      this.changePage(this.currentSlide, this.slides.length - 1);
      // Home.
    } else if (event.keyCode == 36) {
      this.changePage(this.currentSlide, 0);
      // Left arrow or backspace.
    } else if (event.keyCode == 37 || event.keyCode == 8) {
      if (this.currentSlide > 0)
        this.changePage(this.currentSlide, this.currentSlide - 1);
      // Right arrow or space.
    } else if (event.keyCode == 39 || event.keyCode == 32) {
      if (this.currentSlide < this.slides.length - 1)
        this.changePage(this.currentSlide, this.currentSlide + 1);
    }
  }
}
