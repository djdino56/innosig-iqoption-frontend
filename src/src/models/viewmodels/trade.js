import BaseViewModel from "./base_viewmodel";

import axios from "axios";

export default class TradeViewModel extends BaseViewModel {

  static get _model_name() {
    return "trade";
  }

  static get _model_name_plural() {
    return "trades";
  }

  static all(page) {
    return axios.get(`${TradeViewModel.ObjUrl({})}?page=${page}&sort=-_id`);
  }

  static find_by_status_bot(page, status, setPercentageNotEqualsNull, bot_id) {
    let pageUrl = `${TradeViewModel.ObjUrl({})}?page=${page}&sort=-_id&where={"bot_id":"${bot_id}","percentage":{"$ne":null},"status":{"$in":${status}}}`;
    if(setPercentageNotEqualsNull === false) {
      pageUrl = `${TradeViewModel.ObjUrl({})}?page=${page}&sort=-_id&where={"bot_id":"${bot_id}","status":{"$in":${status}}}`;
    }
    return axios.get(pageUrl);
  }

  constructor({
    _id = null,
    _created = "",
    _updated = "",
    close_price = "",
    open_price = "",
    interval = "",
    market = "",
    percentage = "",
    status = "",
    bot_id = ""
  } = {}) {
    super();
    this._id = _id;
    this._created = _created;
    this._updated = _updated;
    this.close_price = close_price == null ? "-" : close_price;
    this.open_price = open_price;
    this.bot_id = bot_id;
    this.interval = interval;
    this.market = market;
    this.percentage = percentage == null ? "-" : parseFloat(percentage).toFixed(2);
    this.status = status;
  }
}
