import BaseViewModel from "./base_viewmodel";

import axios from "axios";

export default class BotViewModel extends BaseViewModel {

    static get _model_name() {
        return "bot";
    }

    static get _model_name_plural() {
        return "bots";
    }

    static all(page) { // &embedded={"strategy":1}
        return axios.get(`${BotViewModel.ObjUrl({})}?page=${page}`);
    }

    constructor({
                    _id = null,
                    _created = "",
                    _updated = "",
                    _etag = '',
                    name = "",
                    practice_mode = false,
                    exchange_account_id = "",
                    enabled = true,
                    open_strong = true,
                    buy_enabled = true,
                    sell_enabled = true,
                    coins = [],
                    bond = "",
                    base_symbol = "EUR",
                    percentage_per_trade = 90,
                    stop_loss = -5,
                    profit_at = 5,
                    sell_by_strategy = false,
                    sell_by_tpst = true,
                    max_positions_per_market = 1,
                } = {}) {
        super();
        this._id = _id;
        this._created = _created;
        this._updated = _updated;
        this._etag = _etag;
        this.name = name;
        this.exchange_account_id = exchange_account_id;
        this.practice_mode = practice_mode;
        this.enabled = enabled;
        this.open_strong = open_strong;
        this.buy_enabled = buy_enabled;
        this.sell_enabled = sell_enabled;
        this.coins = coins;
        this.bond = bond
        this.base_symbol = base_symbol;
        this.percentage_per_trade = percentage_per_trade;
        this.stop_loss = stop_loss;
        this.profit_at = profit_at;
        this.sell_by_strategy = sell_by_strategy;
        this.sell_by_tpst = sell_by_tpst;
        this.max_positions_per_market = max_positions_per_market;
    }
}
