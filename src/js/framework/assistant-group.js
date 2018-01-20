export class AssistantGroup {
    constructor() {
        this.currentSlide = -1;
        this.assistants = [];
    }

    add(assistant, index) {
        this.assistants[index] = assistant;
    }

    go(index) {
        this.cleanCurrentSlide();
        if (this.assistants[index]) {
            this.currentSlide = index;
            this.assistants[index].activate();
        }
    }

    cleanCurrentSlide() {
        if (this.currentSlide > - 1 && this.assistants[this.currentSlide]) {
            this.assistants[this.currentSlide].deactivate();
            this.currentSlide = -1;
        }
    }
}
