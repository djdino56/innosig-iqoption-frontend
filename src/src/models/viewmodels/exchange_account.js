import BaseViewModel from "./base_viewmodel";
import axios from "axios";

export default class ExchangeAccountViewModel extends BaseViewModel {
  static get ServiceUrl() {
    return 'https://api.jurrex.com'
  }

  static get _model_name() {
    return "exchange_account";
  }

  static get _model_name_plural() {
    return "exchange_accounts";
  }

  static all(page) {
    return axios.get(`${ExchangeAccountViewModel.ObjUrl({})}?page=${page}`);
  }

  static search(search) {
    return axios.get(`${ExchangeAccountViewModel.ObjUrl({})}?where={"name":{"$regex":"^(?i).*${search}.*"}}`)
  }

  constructor({
    _id = null,
    _created = "",
    _updated = "",
    _etag = "",
    name = "",
    status = "",
    exchange_type = "",
    exchange_api = "",
    exchange_secret = ""
  } = {}) {
    super();
    this._id = _id;
    this._created = _created;
    this._updated = _updated;
    this._etag = _etag;
    this.name = name;
    this.status = status;
    this.exchange_type = exchange_type;
    this.exchange_api = exchange_api;
    this.exchange_secret = exchange_secret;
  }
}
