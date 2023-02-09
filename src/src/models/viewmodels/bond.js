import axios from 'axios';
import BaseViewModel from './base_viewmodel';

export default class BondViewModel extends BaseViewModel {
    static get _model_name() {
        return 'bond';
    }

    static get _model_name_plural() {
        return 'bonds';
    }

    static all(page) {
        return axios.get(`${BondViewModel.ObjUrl({})}?page=${page}&embedded={"strategies":1}`);
    }

    static search(search) {
        return axios.get(`${BondViewModel.ObjUrl({})}?where={"name":{"$regex":"^(?i).*${search}.*"}}`)
    }

    constructor({
                    _id = null,
                    _created = '',
                    _updated = '',
                    name = '',
                    signal = 'none',
                    enabled = false,
                    _etag = '',
                    interval = [],
                    strategies = [],
                } = {}) {
        super();
        this._id = _id;
        this._created = _created;
        this._updated = _updated;
        this.name = name;
        this.signal = signal;
        this.interval = interval;
        this.enabled = enabled;
        this.strategies = strategies;
        this._etag = _etag;
    }
}
