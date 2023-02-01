import BaseViewModel from "./base_viewmodel";
import axios from "axios";

export default class IndicatorViewModel extends BaseViewModel {
  static get ServiceUrl() {
    return 'https://api.jurrex.com'
  }

  static get _model_name() {
    return "indicator";
  }

  static get _model_name_plural() {
    return "indicators";
  }

  static all(page) {
    return axios.get(`${IndicatorViewModel.ObjUrl({})}?page=${page}`);
  }

  static search(search) {
      return axios.get(`${IndicatorViewModel.ObjUrl({})}?where={"endpoint":{"$regex":"^(?i).*${search}.*"}}`)
  }

  constructor({
    _id = null,
    _created = "",
    _updated = "",
    name = "",
    _etag = "",
    settings = {},
    category = "",
    endpoint = ""
  } = {}) {
    super();
    this._id = _id;
    this._created = _created;
    this._updated = _updated;
    this.name = name;
    this.category = category;
    this.endpoint = endpoint;
    this.settings = settings;
    this._etag = _etag;
  }
}
