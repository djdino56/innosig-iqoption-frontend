import BaseViewModel from './base_viewmodel'

export default class AccountViewModel extends BaseViewModel {
    static get ServiceUrl() {
        return 'https://api.jurrex.com'
    }

    static get _model_name() {
        return 'account'
    }

    static get _model_name_plural() {
        return 'accounts'
    }

    constructor({
                    _id = null,
                    _created = '',
                    _updated = '',
                    _etag = '',
                    username = "",
                    email = "",
                    password = "",
                    roles = [],
                    token = ""
                } = {}) {
        super()
        this._id = _id
        this._created = _created
        this._updated = _updated
        this._etag = _etag
        this.username = username
        this.email = email
        this.password = password
        this.roles = roles
        this.token = token
    }
}
