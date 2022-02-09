export class View {
  #handleFavoriteButtonClick;

  #root

  constructor(root) {
    this.#root = root;
    this.#handleFavoriteButtonClick = null;
  }

  getRoot() {
    return this.#root;
  }

  getHandleFavoriteButtonClick() {
    return this.#handleFavoriteButtonClick;
  }

  setHandleFavoriteButtonClick(handleFavoriteButtonClick) {
    this.#handleFavoriteButtonClick = handleFavoriteButtonClick;
  }

  update() {}

  render() {}
}
