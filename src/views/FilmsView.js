import { Routes } from '../core/constants/routes';
import { View } from './View';
import { renderFilmComponent } from '../core/components/filmComponent';

export class FilmsView extends View {
  #filmsContainer

  static #Text = {
    SeeFavoriteFilms: 'See Favorite Films',
    Title: 'All Films',
  }

  constructor(root) {
    super(root);

    this.#filmsContainer = null;
  }

  #renderSeeFavoriteButton() {
    const container = document.createElement('div');
    container.className = 'film-cards-container__links-block';

    const seeFavoritesButton = document.createElement('a');
    seeFavoritesButton.href = `#${Routes.Favorites}`;
    seeFavoritesButton.className = 'link-button film-cards-container__link-button';
    seeFavoritesButton.textContent = FilmsView.#Text.SeeFavoriteFilms;

    container.append(seeFavoritesButton);

    return container;
  }

  #renderFilms(filmModels = []) {
    this.#filmsContainer.innerHTML = '';
    filmModels.forEach((filmModel) => {
      const filmHTML = renderFilmComponent({
        filmModel,
        handleFavoriteButtonClick: this.getHandleFavoriteButtonClick(),
      });
      this.#filmsContainer.append(filmHTML);
    });
  }

  update(filmModels = []) {
    this.#renderFilms(filmModels);
  }

  render(filmModels = []) {
    const container = document.createElement('div');
    container.className = 'films-container';

    const titleHTML = document.createElement('h1');
    titleHTML.className = 'film-cards-container__title';
    titleHTML.textContent = FilmsView.#Text.Title;

    const seeFavoritesButtonContainer = this.#renderSeeFavoriteButton();

    this.#filmsContainer = document.createElement('div');
    this.#filmsContainer.className = 'film-cards-container';
    this.#renderFilms(filmModels);

    container.append(titleHTML, seeFavoritesButtonContainer, this.#filmsContainer);

    this.getRoot().append(container);
  }
}
