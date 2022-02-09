export class FilmModel {
  #poster

  #title

  #year

  #imdbID

  #isFavorite

  constructor(filmData) {
    this.#poster = filmData.Poster;
    this.#title = filmData.Title;
    this.#year = filmData.Year;
    this.#imdbID = filmData.imdbID;
    this.#isFavorite = filmData.isFavorite;
  }

  getPoster() {
    return this.#poster;
  }

  getTitle() {
    return this.#title;
  }

  getYear() {
    return this.#year;
  }

  getId() {
    return this.#imdbID;
  }

  getIsFavorite() {
    return this.#isFavorite;
  }

  setIsFavorite(isFavorite) {
    this.#isFavorite = isFavorite;
  }
}
