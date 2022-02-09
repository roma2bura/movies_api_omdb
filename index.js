import './index.css';

import { Router } from './src/core/router/router';
import { FilmsService } from './src/core/service/filmsService';
import { FilmsController } from './src/controller/filmsController';
import { FilmsView } from './src/views/FilmsView';
import { FavoritesView } from './src/views/FavoritesView';
import { FilmView } from './src/views/FilmView';
import { Routes } from './src/core/constants/routes';

const routes = {
  [Routes.Main]: FilmsView,
  [Routes.Favorites]: FavoritesView,
  [Routes.Film]: FilmView,
};
const root = document.getElementById('root');
const router = new Router(routes, root);
const filmsService = new FilmsService();
const controller = new FilmsController(router, filmsService);
router.setController(controller);
controller.init();
