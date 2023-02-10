import axios from 'axios'
import BaseRepository from '../repositories/base_repository'

export default class BaseViewModel {
  static get Repository() {
    return null
  }

  static get _model_name() {
    return null
  }

  static get _model_name_plural() {
    return null
  }

  static get ServiceUrl() {
    return 'https://api.jurrex.com'
  }

  static ObjUrl({ parentModel = null, parentId = null, objId = null }) {
    if (parentModel === null || parentId === null) {
      if (objId === null) {
        return `${this.ServiceUrl}/${this._model_name_plural}`
      }
      return `${this.ServiceUrl}/${this._model_name_plural}/${objId}`
    }
    return `${this.ServiceUrl}/${parentModel}/${parentId}/${this._model_name_plural}`
  }

  static Filter(parentModel = null, parentId = null) {
    return axios.get(
      this.ObjUrl({ parentModel, parentId }),
      {
        headers: { ...this.headers },
        params: {
          ...this.FilterParams,
          ...this.PaginationParams,
          ...this.PopulateParams,
          ...this.SortParams,
        },
      },
    )
  }

  static Get(_id) {
    return axios.get(this.ObjUrl({ objId: _id }), {
      params: {
        ...this.FilterParams,
        ...this.PaginationParams,
        ...this.PopulateParams,
        ...this.SortParams,
      },
    })
  }

  refresh() {
    const _this = this
    return this.constructor
      .Get(this._id, { params: { ...this.constructor.PopulateParams } })
      .then(res => {
        _this._construct(res.data)
        if (_this.repository !== undefined) {
          _this.repository.updateRawObjs(_this.id, res.data)
        }
        _this.populate_([])
        return this
      })
      .catch(err => {
        _this.populate_([])
        return err
      })
  }

  create(fields = []) {
    for (const obj in this) {
      if (this[obj] instanceof BaseRepository) {
        this[obj] = this[obj].to.json()
      }
    }
    return axios.post(
        this.constructor.ObjUrl({}),
        this.to.json(fields, true)
    )
  }

  beforeUpdate() {
    for (const key in this) {
      const value = this[key]
      if (value instanceof BaseViewModel) {
        value.beforeUpdate()
      }
    }
  }

  update(fields = [], filters = {}, headers = {}) {
    this.beforeUpdate()
    const _if_match_header = { 'If-Match': this._etag }
    return axios.patch(
      this.constructor.ObjUrl({ objId: this._id }),
      this.to.json(fields, true),
      { params: filters, headers: { ...headers, ..._if_match_header } },
    )
  }

  static updateMany(data = {}, filters = {}) {
    for (const key in data) {
      const fieldValue = data[key]
      if (
        fieldValue instanceof BaseRepository
        || fieldValue instanceof BaseViewModel
      ) {
        data[key] = fieldValue.to.json()
      }
    }
    return axios.put(this.ObjUrl({}), data, { params: filters })
  }

  delete() {
    return this.constructor.deleteById(this._id, this._etag)
  }

  static deleteById(_id = '', _etag = '') {
    const _if_match_header = { 'If-Match': _etag }
    return axios.delete(this.ObjUrl({ objId: _id }), { headers: _if_match_header })
  }

  static Populate(populatedFields = []) {
    this.PopulateParams = {
      _populate: populatedFields.join(','),
    }
    return this
  }

  populate_(populatedFields = []) {
    this.constructor.Populate(populatedFields)
    return this
  }

  static Paginate(paginator) {
    this.PaginationParams = paginator.jump()
    return this
  }

  static Sort(sorters) {
    this.SortParams = sorters.params
    return this
  }

  static Filters(filters) {
    this.FilterParams = filters
    return this
  }

  static Headers(headers) {
    this.headers = headers
    return this
  }

  get to() {
    const _this = this
    return {
      json(fields = [], respectIdOnlyFields = false) {
        const data = {}
        fields = fields.length === 0 ? Object.keys(_this) : fields
        if (_this.id != null) {
          data._id = _this._id
        }
        for (const key of fields) {
          const value = _this[key]
          if (key.includes('WATCHED___PROPERTY___')) {
            continue
          }
          if (
            (value instanceof BaseRepository
              || value instanceof BaseViewModel)
            && key !== 'repository'
          ) {
            if (value instanceof BaseRepository) {
              data[key] = value.to.json(respectIdOnlyFields)
            } else if (value instanceof BaseViewModel) {
              data[key] = value.to.json([], respectIdOnlyFields)
            }
          } else if (
            typeof value === 'string'
            || typeof value === 'number'
            || typeof value === 'boolean'
            || typeof value === 'object'
            || Array.isArray(value)
          ) {
            data[key] = value
          }
          if (key === 'actions') {
            data[key] = null
          }
        }
        return data
      },
    }
  }

  _construct({ val = '' } = {}) {
    throw `_construct ${val} method not defined for ${this.constructor._model_name}`
  }

  get json() {
    return JSON.stringify(this)
  }

  /**
   * this function will allow to add multiple watchers on one or more properties, this can be write/read or update watchers
   * @param prop: the property name that needs to be watched
   * @param handler: the Function that needs to be executed when property has been set/get
   * @param handlerId the identifier of the handler to prevent duplicate handlers
   * @param type: the type of watcher "get" or "set"
   */
  watch(prop, handler, handlerId = null, type = 'set') {
    if (this.watchers === undefined) {
      this.watchers = {
        set: {},
        get: {},
      }
    }
    if (this.watchers[type][prop] === undefined) {
      this.watchers[type][prop] = {}
    }
    if (handlerId === null) {
      handlerId = `RESERVED_IDENTIFIER_${
        Object.keys(this.watchers[type][prop]).length
      }`
    }
    this.watchers[type][prop][handlerId] = handler
    this[`WATCHED___PROPERTY___${prop}`] = this[prop]
    Object.defineProperty(this, prop, {
      set(newValue) {
        const oldValue = this[`WATCHED___PROPERTY___${prop}`]
        this[`WATCHED___PROPERTY___${prop}`] = newValue
        const handlers = this.watchers.set[prop]
        for (const identifier in handlers) {
          handlers[identifier](this, oldValue, newValue)
        }
      },
      get() {
        const handlers = this.watchers.get[prop]
        for (const identifier in handlers) {
          handlers[identifier](this)
        }
        return this[`WATCHED___PROPERTY___${prop}`]
      },
    })
  }

  removeWatcher(prop, type, identifier) {
    if (this.watchers === undefined) {
      this.watchers = {
        set: {},
        get: {},
      }
    }
    if (this.watchers[type][prop] === undefined) {
      this.watchers[type][prop] = {}
    }
    delete this.watchers[type][prop][identifier]
  }
}
