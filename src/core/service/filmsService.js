import { EnvData } from '../constants/envData';
import { FilmModel } from '../../models/filmModel';
import { StorageKeys } from '../constants/storageKeys';
import { checkIfInFavorites, getFilmById, removeFilmById } from '../helpers/films';

export class FilmsService {
  static #DefaultSearchValue = 'Marvel';

  static #Urls = {
    Main: (searchByName = FilmsService.#DefaultSearchValue) => `https://www.omdbapi.com/?s=${searchByName}&apikey=${EnvData.FilmsApiKey}`,
    FilmById: (filmId) => `https://www.omdbapi.com/?i=${filmId}&apikey=${EnvData.FilmsApiKey}`,
  }

  static #convertFilmModelToFilm(filmModels = []) {
    return filmModels.map((filmModel) => ({
      Poster: filmModel.getPoster(),
      Title: filmModel.getTitle(),
      Year: filmModel.getYear(),
      imdbID: filmModel.getId(),
      isFavorite: filmModel.getIsFavorite(),
    }));
  }

  static #convertFilmsToFilmModel(films) {
    return films.map((filmData) => new FilmModel({
      Poster: filmData.Poster,
      Title: filmData.Title,
      Year: filmData.Year,
      imdbID: filmData.imdbID,
      isFavorite: !!filmData.isFavorite,
    }));
  }

  static #setFavoriteValuesForFilmModels(allFilms, favoriteFilms) {
    if (allFilms.length === 0) {
      return allFilms;
    }

    return allFilms.map((filmModel) => {
      const isFavorite = checkIfInFavorites(favoriteFilms, filmModel.getId());
      filmModel.setIsFavorite(isFavorite);
      return filmModel;
    });
  }

  #storage

  constructor() {
    this.#storage = window.localStorage;
  }

  async getFilms() {
    try {
      const response = await fetch(FilmsService.#Urls.Main());
      const data = await response.json();
      const favoritesFilms = await this.getFavoriteFilms();
      const filmModels = FilmsService.#convertFilmsToFilmModel(data.Search);
      return FilmsService.#setFavoriteValuesForFilmModels(filmModels, favoritesFilms);
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }

  getFavoriteFilms() {
    return new Promise((resolve) => {
      const localStorageData = this.#storage.getItem(StorageKeys.Favorites);
      const favoriteFilms = JSON.parse(localStorageData) || [];
      const convertedFilmModels = FilmsService.#convertFilmsToFilmModel(favoriteFilms);
      resolve(convertedFilmModels);
    });
  }

  saveFilms(favorites = []) {
    return new Promise((resolve) => {
      const convertedFavorites = FilmsService.#convertFilmModelToFilm(favorites);
      const stringifyFavoriteFilms = JSON.stringify(convertedFavorites);
      this.#storage.setItem(StorageKeys.Favorites, stringifyFavoriteFilms);
      resolve();
    });
  }

  async addFilmToFavorites(allFilms, favorites, filmId) {
    const targetFilm = getFilmById(allFilms, filmId);
    if (targetFilm) {
      targetFilm.setIsFavorite(true);
      const finalFavoritesFilms = [...favorites, targetFilm];
      await this.saveFilms(finalFavoritesFilms);
    }
  }

  async removeFilmFromFavorites(allFilms, favorites, filmId) {
    const targetFilm = getFilmById(allFilms, filmId);
    if (targetFilm) {
      targetFilm.setIsFavorite(false);
      const finalFavoritesFilms = removeFilmById(favorites, targetFilm.getId());
      await this.saveFilms(finalFavoritesFilms);
    }
  }
}
