import icons from 'url:../../img/icons.svg';

export default class View {
  _parentElement;
  _errorMessage = `Sorry, couldn't find your recipe. Please try another one.`;
  _successMessage = ``;

  _data;

  /**
   * Render the recieved object to the DOM
   * @param {object | Object[]} data the data to be rendered. (accepts an object or array of objects) (e.g. a recipe
   * @param {boolean} [render=true] if false, create markup string instead of rendering to DOM
   * @returns {void|string} A markup string is returned if render = false
   * @this {Object} View instance
   * @author Nana Poku
   * @todo finish the implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  //May not be the most robust or most performant. But for most small projects/apps, this is fine.
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      //Update Changed Text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== '' //checks to make sure the nodeValue(which we want to be text, is not empty
      ) {
        curEl.textContent = newEl.textContent;
      }

      //Update Changed Attributes
      if (!newEl.isEqualNode(curEl)) {
        //We turn the attributes from newEl into an array AND
        //For Each, set a particular current attribute of the CurEl to match
        //The newEl's attribute Name and Value  (so pretty much transfer them over to replace the old/curEl)
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
<div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderSuccess(message = this._successMessage) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _generateMarkup() {
    //only a placeholder, it will later get overridden in child classes
    return undefined;
  }
}
