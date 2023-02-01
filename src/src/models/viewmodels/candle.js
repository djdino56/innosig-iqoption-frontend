import BaseViewModel from "./base_viewmodel";

export default class CandleViewModel extends BaseViewModel {

  constructor({
    _id = null,
    x = 0,
    y = [],
  } = {}) {
    super();
    this._id = _id;
    this.x = new Date(x);
    this.y = y;
  }
}
