import View from './View';
import icons from 'url:../../img/icons.svg'; //Parcel 2

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;
      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    //Page 1, there are other pages
    if (curPage === 1 && numPages > 1) {
      return this._generateBtnNext(curPage);
      // return `wow-There are other pages`;
    }

    // Last Page
    if (curPage === numPages && numPages > 1) {
      return this._generateBtnPrev(curPage);
    }

    //Other Page
    if (curPage < numPages) {
      return [
        this._generateBtnPrev(curPage),
        this._generateBtnNext(curPage),
      ].join('');
    }

    //Page 1, there are NO other pages
    return '';
  }

  _generateBtnPrev(curPage) {
    return `
      <button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>
      `;
  }

  _generateBtnNext(curPage) {
    return `
      <button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
`;
  }
}

export default new PaginationView();
