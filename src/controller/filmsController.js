import { Routes } from '../core/constants/routes';

export class FilmsController {
  #router

  #service

  #allFilms

  #favoriteFilms

  constructor(router, service) {
    this.#router = router;
    this.#service = service;

    this.#allFilms = [];
    this.#favoriteFilms = [];
  }

  async #fetchAllFilms() {
    if (this.#allFilms.length === 0) {
      const data = await this.#service.getFilms();
      if (!data.error) {
        this.#allFilms = data;
      }
    }
  }

  async getViewParams(routeName) {
    let paramsForRender = [];

    await this.#fetchAllFilms();
    this.#favoriteFilms = await this.#service.getFavoriteFilms();

    if (routeName === Routes.Main) {
      paramsForRender = [this.#allFilms];
    } else if (routeName === Routes.Favorites) {
      paramsForRender = [this.#favoriteFilms];
    } else if (routeName === Routes.Film) {
      paramsForRender = [];
    } else {
      paramsForRender = [this.#allFilms];
    }

    return paramsForRender;
  }

  async handleFavoriteButtonClick(isFavorite, filmId) {
    if (isFavorite) {
      await this.#service.removeFilmFromFavorites(this.#allFilms, this.#favoriteFilms, filmId);
    } else {
      await this.#service.addFilmToFavorites(this.#allFilms, this.#favoriteFilms, filmId);
    }

    await this.#router.updateView();
  }

  async init() {
    this.#router.init();
  }
}
