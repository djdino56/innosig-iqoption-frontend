import BaseViewModel from "./base_viewmodel";

import axios from "axios";

export default class BotLogViewModel extends BaseViewModel {

  static get _model_name() {
    return "bot_log";
  }

  static get _model_name_plural() {
    return "bot_logs";
  }

  static all(page, bot_id) {
    return axios.get(`${BotLogViewModel.ObjUrl({})}?page=${page}&sort=-_id&where={"bot_id":"${bot_id}"}`);
  }

  constructor({
    _id = null,
    _created = "",
    _updated = "",
    level = "",
    message = "",
  } = {}) {
    super();
    this._id = _id;
    this._created = _created;
    this._updated = _updated;
    this.level = level;
    this.message = message;
  }
}
