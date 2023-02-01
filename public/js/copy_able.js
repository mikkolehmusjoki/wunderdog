class CopyAble extends HTMLElement
{
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    this.storedText = this.textContent;
    [...this.children].forEach(c => shadow.append(c));
    shadow.append(this.createStyleTag());
    shadow.append(this.createButton());
  }

  createStyleTag() {
    const style = document.createElement('style');
    style.textContent = `
      button {
        appearance: none;
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        background: none;
        border: 0;
        font-size: 1em;
        cursor: pointer;
      }
      button::after {
        content: '📋'; 
      }
    `;
    return style;
  }

  createButton() {
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => navigator.clipboard.writeText(this.storedText));
    return button;
  }
}
customElements.define('copy-able', CopyAble);