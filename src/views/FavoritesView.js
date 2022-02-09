import { renderFilmComponent } from '../core/components/filmComponent';
import { Routes } from '../core/constants/routes';
import { View } from './View';

export class FavoritesView extends View {
  #filmsContainer

  static #Text = {
    Title: 'Your Favorite Films',
    SeeAllFilmsButtonText: 'See All Films',
  }

  constructor(root) {
    super(root);

    this.#filmsContainer = null;
  }

  #renderFilms(favoriteFilmModels) {
    this.#filmsContainer.innerHTML = '';
    favoriteFilmModels.forEach((filmModel) => {
      const filmHTML = renderFilmComponent({
        filmModel,
        handleFavoriteButtonClick: this.getHandleFavoriteButtonClick(),
      });
      this.#filmsContainer.append(filmHTML);
    });
  }

  update(favoriteFilmModels) {
    this.#renderFilms(favoriteFilmModels);
  }

  render(favoriteFilmModels = []) {
    const container = document.createElement('div');
    container.className = 'favorite-container';

    const titleHTML = document.createElement('h1');
    titleHTML.className = 'film-cards-container__title';
    titleHTML.textContent = FavoritesView.#Text.Title;

    const linksBlock = document.createElement('div');
    linksBlock.className = 'film-cards-container__links-block';
    const allFilmsLink = document.createElement('a');
    allFilmsLink.href = `#${Routes.Main}`;
    allFilmsLink.className = 'link-button film-cards-container__link-button';
    allFilmsLink.textContent = FavoritesView.#Text.SeeAllFilmsButtonText;
    linksBlock.append(allFilmsLink);

    this.#filmsContainer = document.createElement('div');
    this.#filmsContainer.className = 'film-cards-container';
    this.#renderFilms(favoriteFilmModels);

    container.append(titleHTML, linksBlock, this.#filmsContainer);

    this.getRoot().append(container);
  }
}
