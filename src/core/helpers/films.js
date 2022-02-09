export const getFilmById = (films, filmId) => films
  .find((filmModel) => filmModel.getId() === filmId);

export const removeFilmById = (films, filmId) => films
  .filter((filmModel) => filmModel.getId() !== filmId);

export const checkIfInFavorites = (films, filmId) => films
  .some((film) => film.getId() === filmId);
