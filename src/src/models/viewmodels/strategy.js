import axios from 'axios';
import BaseViewModel from './base_viewmodel';

export default class StrategyViewModel extends BaseViewModel {
    static get _model_name() {
        return 'strategy';
    }

    static get _model_name_plural() {
        return 'strategies';
    }

    static all(page) {
        return axios.get(`${StrategyViewModel.ObjUrl({})}?page=${page}&embedded={"indicators":1}`);
    }

    static search(search) {
        return axios.get(`${StrategyViewModel.ObjUrl({})}?where={"name":{"$regex":"^(?i).*${search}.*"}}`)
    }

    constructor({
                    _id = null,
                    _created = '',
                    _updated = '',
                    name = '',
                    strategy_key = '',
                    enabled = false,
                    _etag = '',
                    minimal_sell_signals = 2,
                    minimal_buy_signals = 2,
                    interval = [],
                    indicators = [],
                } = {}) {
        super();
        this._id = _id;
        this._created = _created;
        this._updated = _updated;
        this.name = name;
        this.strategy_key = strategy_key;
        this.enabled = enabled;
        this.interval = interval;
        this.minimal_sell_signals = minimal_sell_signals;
        this.minimal_buy_signals = minimal_buy_signals;
        this.indicators = indicators;
        this._etag = _etag;
    }
}
