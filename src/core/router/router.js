import { FilmsView } from '../../views/FilmsView';

export class Router {
  #controller

  #routes

  #root

  #targetView

  constructor(routes, root) {
    this.#routes = routes;
    this.#controller = null;
    this.#root = root;
    this.#targetView = null;
  }

  setController(controller) {
    this.#controller = controller;
  }

  #getRouteInfo() {
    const { location } = window;
    const { hash } = location;

    return {
      routeName: hash.slice(1),
    };
  }

  async #hashChange() {
    const routeInfo = this.#getRouteInfo();
    const TargetView = this.#routes[routeInfo.routeName] || FilmsView;
    if (TargetView) {
      this.#root.innerHTML = '';
      const paramsForRender = await this.#controller.getViewParams(routeInfo.routeName);
      this.#targetView = new TargetView(this.#root);
      this.#targetView.setHandleFavoriteButtonClick(
        this.#controller.handleFavoriteButtonClick.bind(this.#controller),
      );
      this.#targetView.render(...paramsForRender);
    }
  }

  async updateView() {
    const routeInfo = this.#getRouteInfo();
    const paramsForRender = await this.#controller.getViewParams(routeInfo.routeName);
    if (this.#targetView) {
      this.#targetView.update(...paramsForRender);
    }
  }

  init() {
    window.addEventListener('hashchange', this.#hashChange.bind(this));
    this.#hashChange();
  }
}
