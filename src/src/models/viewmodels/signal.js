import axios from 'axios';
import BaseViewModel from './base_viewmodel';

import SignalValueRepository from '../repositories/sginal_value';

export default class SignalViewModel extends BaseViewModel {
    static get ServiceUrl() {
        return 'https://api.jurrex.com';
    }

    static get _model_name() {
        return 'signal';
    }

    static get _model_name_plural() {
        return 'signals';
    }

    static all(page) {
        return axios.get(`${SignalViewModel.ObjUrl({})}?page=${page}&sort=market,interval`);
    }

    constructor({
        _id = null,
        _created = '',
        _updated = '',
        interval = '',
        market = '',
        exchange_type = '',
        signals = [],
    } = {}) {
        super();
        this._id = _id;
        this._created = _created;
        this._updated = _updated;
        this.interval = interval;
        this.market = market;
        this.exchange_type = exchange_type;
        this.signals = new SignalValueRepository(signals);
    }
}
