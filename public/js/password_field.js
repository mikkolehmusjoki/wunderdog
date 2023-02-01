class PasswordField extends HTMLElement
{
  constructor() {
    super();
    this.nativeInput = this.querySelector('input');
    if (!this.nativeInput) {
      throw 'PasswordField requires native password input.';
    }

    const shadow = this.attachShadow({ mode: 'open' });
    shadow.append(this.createStyleTag());
    this.after(this.createHiddenInput());
    shadow.append(this.nativeInput);
    shadow.append(this.createButton());

    if (this.parentElement.tagName === 'LABEL')
      this.parentElement.addEventListener('click', () => { this.nativeInput.focus() });
  }

  createStyleTag() {
    const style = document.createElement('style');
    style.textContent = `
      input {
        box-sizing: border-box;
        width: 100%;
      }
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
        content: '👁'; 
      }
    `;
    return style;
  }

  createHiddenInput() {
    const input = document.createElement('input');
    [...this.nativeInput.attributes].forEach(a => input.setAttribute(a.nodeName, a.nodeValue));
    input.setAttribute('type', 'hidden');
    return input;
  }

  createButton() {
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => this.toggleInputType());
    return button;
  }

  toggleInputType() {
    this.nativeInput.setAttribute('type', this.nativeInput.getAttribute('type') === 'password' ? 'text' : 'password');
  }
}

customElements.define('password-field', PasswordField);