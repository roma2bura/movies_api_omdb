## Почему не работала логика для добавления/удаления из "избранных"?

1. Банальная невнимательность. В конструкторе класса FilmModel мы забыли прописать начальное значение для isFavorite.

Было:
```
this.#isFavorite = false;
```

Стало:
```
this.#isFavorite = filmData.isFavorite;
```

Именно поэтому у нас всегда был false у объектов внутри this.#allFilms.

2. При начальной загрузке всех фильмов нужно проверять, есть ли фильм в избранных. И если есть, то сетать ему setIsFavorite(true). Для этого в классе Service реализовал следующее:

```
  static #setFavoriteValuesForFilmModels(allFilms, favoriteFilms) {
    if (allFilms.length === 0) {
      return allFilms;
    }

    return allFilms.map((filmModel) => {
      const isFavorite = favoriteFilms.some((favoriteFilmModel) => favoriteFilmModel.getId() === filmModel.getId());
      filmModel.setIsFavorite(isFavorite);
      return filmModel;
    });
  }
```

```
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
      }
    }
  }
```

3. Также, чтобы каждый раз не fetch-ть фильмы, я переделал логику для изначального получения данных в Controller

```
  async #fetchAllFilms() {
    if (this.#allFilms.length === 0) {
      const data = await this.#service.getFilms();
      if (!data.error) {
        this.#allFilms = data;
      }
    }
  }
```

Потом вызываю в эту функцию в getViewParams:

```
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
    }

    return paramsForRender;
  }
```

4. Почему меняется значение ключа isFavorite у FavoriteModal?

allFilms - это массив, а массив - это объект (ссылочный тип данных). Получается если мы изменяем какой-то объект внутри allFilms, то он изменяется и для this.#allFilms в контролере при вызове `await this.#service.removeFilmFromFavorites(this.#allFilms, this.#favoriteFilms, filmId);`

Мутабельность - это не всегда хорошо. Но мы решили, что значения мы будем изменять через сеттер (setIsFavorite), поэтому по-другому навряд-ли получится.


```
  async addFilmToFavorites(allFilms, favorites, filmId) {
    const targetFilm = getFilmById(allFilms, filmId);
    if (targetFilm) {
      targetFilm.setIsFavorite(true);
      const finalFavoritesFilms = [...favorites, targetFilm];
      await this.saveFilms(finalFavoritesFilms);
    }
  }
```


## Ваши задачи для текущего проекта

1. Реализовать FilmView (src/views/FilmView.js) - страница просмотра конкертного фильма.

Ваш url должен выглядеть следующим образом: `#films/[filmId]` (#films/tt3438640 например).

Для получения id из url можно дополнить метод getRouteInfo:

```
  static getRouteInfo() {
    const { location } = window;
    const hash = location.hash ? location.hash.slice(1) : '';
    const splittedHash = hash.split('/');
    const routeName = splittedHash[0];
    const routeId = splittedHash[1];

    return {
      routeName,
      params: {
        routeId,
      },
    };
  }
```

2. Добавить Loader при загрузке данных. Рекомендуется реализовать его в src/core/components.

Затем логику для управления Loader можно добавить в родительский класс View (src/views/View.js) и вызывать нужные методы при необходимости (например, showLoader и hideLoader).

## Начальный код и деплой проекта

1. Начальный код для старта разработки: https://github.com/M-fil/movie-search-initial-project
2. Полностью завершенный проект: https://movie-search-spa-vladilen-minin-course.netlify.app/

## Запуск проекта
Пишем в терминале:
1. `npm install`
2. `npm run start`

Сделать build проекта:
1. `npm install`
2. `npm run build`

## Полезные ссылки
1. Ссылка на получение apiKey у апишки для фильмов: http://www.omdbapi.com/apikey.aspx
2. URL для получения данных о фильмах:
```
  static #Urls = {
    Main: (searchByName = FilmsService.#DefaultSearchValue) => `https://www.omdbapi.com/?s=${searchByName}&apikey=${EnvData.FilmsApiKey}`,
    FilmById: (filmId) => `https://www.omdbapi.com/?i=${filmId}&apikey=${EnvData.FilmsApiKey}`,
  }
```
