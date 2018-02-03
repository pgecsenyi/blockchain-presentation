export class EventHandlerManager {
  constructor() {
    this.handlers = [];
  }

  addEventHandler(eventHandler) {
    this.handlers.push(eventHandler);
  }

  registerHandlers() {
    for (let i = 0; i < this.handlers.length; i++)
      this.handlers[i].target.addEventListener(this.handlers[i].event, this.handlers[i].handler, false);
  }

  unregisterHandlers() {
    for (let i = 0; i < this.handlers.length; i++)
      this.handlers[i].target.removeEventListener(this.handlers[i].event, this.handlers[i].handler);
  }
}

export class EventHandler {
  constructor(target, event, handler) {
    this.target = target;
    this.event = event;
    this.handler = handler;
  }
}
