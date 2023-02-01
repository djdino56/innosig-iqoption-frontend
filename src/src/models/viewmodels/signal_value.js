import BaseViewModel from './base_viewmodel';

export default class SignalValueViewModel extends BaseViewModel {
    constructor({
                    strategy = '',
                    value = '',
                    results = {}
                } = {}) {
        super();
        this.strategy = strategy;
        this.value = value;
        this.results = results;
    }
}
