export class NinjaElement {
    constructor(element) {
        if (element == null)
            throw 'element cannot be null.';

        this.element = element;

        this.configureInitialVisibility();
    }

    get innerElement() {
        return this.element;
    }

    get isVisible() {
        return this.isCurrentlyVisible;
    }

    hide() {
        if (!this.isCurrentlyVisible)
            return;

        this.savedDisplayState = this.element.style.display;
        this.element.style.display = 'none';
        this.isCurrentlyVisible = false;
    }

    show() {
        if (this.isCurrentlyVisible)
            return;

        this.element.style.display = this.savedDisplayState;
        this.isCurrentlyVisible = true;
    }

    toggle() {
        if (this.isCurrentlyVisible)
            this.hide();
        else
            this.show();
    }

    configureInitialVisibility() {
        this.isCurrentlyVisible = true;
        var display = window.getComputedStyle(this.element).getPropertyValue('display');

        if (display === 'none')
        {
            this.isCurrentlyVisible = false;
            this.savedDisplayState = 'block';
        }
    }
}

export class NullableNinjaElement {
    constructor(element) {
        if (element == null)
            this.ninjaElement = null;
        else
            this.ninjaElement = new NinjaElement(element);
    }

    get innerElement() {
        if (this.ninjaElement == null)
            return null;

        return this.ninjaElement.innerElement;
    }

    get isVisible() {
        if (this.ninjaElement == null)
            return false;

        return this.ninjaElement.isVisible;
    }

    hide() {
        if (this.ninjaElement != null)
            this.ninjaElement.hide();
    }

    show() {
        if (this.ninjaElement != null)
            this.ninjaElement.show();
    }

    toggle() {
        if (this.ninjaElement != null)
            this.ninjaElement.toggle();
    }
}
