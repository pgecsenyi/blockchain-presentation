import { Size } from '../common/primitives';

export class TextSizeCalculator {
  constructor() {
    this.testTextfield = document.createElement('span');
    this.commonStyle = 'margin: 0; padding: 0; position: absolute; visibility: hidden;';
    this.setStyle();
  }

  measureSize(text, fontStyle) {
    this.setStyle(fontStyle);
    this.testTextfield.innerHTML = text;
    document.body.appendChild(this.testTextfield);
    var size = new Size(this.testTextfield.offsetWidth, this.testTextfield.offsetHeight - 10);
    document.body.removeChild(this.testTextfield);

    return size;
  }

  setStyle(newCompactStyle) {
    var newStyle = this.parseCompactStyle(newCompactStyle);
    this.testTextfield.setAttribute('style', newStyle + this.commonStyle);
  }

  parseCompactStyle(compactStyle) {
    if (compactStyle == null || compactStyle == '')
      return '';

    var regex = new RegExp('([a-z]*) {0,1}([0-9]+)px {0,1} ([a-zA-Z]+)');
    var match = regex.exec(compactStyle);
    var newStyle = 'font-family: ' + match[3] + ', Lucida, Verdana, sans-serif; font-size: ' + match[2] + 'px;';

    if (match[1] == 'bold')
      newStyle += ' font-weight: bold;';
    else if (match[1] == 'italic')
      newStyle += ' text-decoration: italic;';
    else if (match[1] == 'underline')
      newStyle += ' text-decoration: underline;';

    return newStyle;
  }
}
