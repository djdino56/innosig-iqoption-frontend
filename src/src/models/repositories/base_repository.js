import BaseViewModel from '../viewmodels/base_viewmodel'

export default class BaseRepository {
  constructor(objs, objType, objParsedCallback = () => {}, objsParsedCallback = () => {}, parent = null, isIdOnlyArray = false) {
    Object.defineProperty(this, 'parent', {
      enumerable: false,
      writable: true,
      readable: true,
      value: parent,
    })
    this.objType = objType
    this.objParsedCallback = objParsedCallback
    this.objsParsedCallback = objsParsedCallback
    this.isIdOnlyArray = isIdOnlyArray
    if (objs instanceof this.constructor) {
      objs = objs.to.json()
    }
    this.processRawObjs(objs)
  }

  /**
     * @param rawObjs, the raw data that needs to be parsed to viewmodels
     * @param removePrevious, if true it will remove previous results, if default(false) it will merge rawObjs with current (already parsed results
     */
  processRawObjs(rawObjs, removePrevious = false) {
    try {
      if (this.rawObjs === undefined || removePrevious) {
        this.rawObjs = rawObjs
      } else if (Array.isArray(this.rawObjs)) {
        this.rawObjs = [...this.rawObjs, ...rawObjs]
      } else {
        this.rawObjs = { ...this.rawObjs, ...rawObjs }
      }
    } catch (err) {
      console.error(err)
    }
    const cleanedObjs = this.preObjParsing(rawObjs)
    this.parseObjects(cleanedObjs, removePrevious)
  }

  /**
     * this function will update a rawObjs to keep it in sync with the viewmodel e.g. when viewmodel is refreshed (refresh func baseviewmodel)
     * it is purely meant for reference functionality whenever the rawObjs gets referenced it will have the same data as it viewmodel
     * @param id
     * @param data
     */
  updateRawObjs(id, data) {
    if (this.rawObjs instanceof Array) {
      for (const i in this.rawObjs) {
        let objData = this.rawObjs[i]
        if (typeof (objData) === 'string') {
          objData = { _id: objData }
        }
        if (objData._id === id) {
          this.rawObjs[i] = data
          this.rawObjs[i]._id = id
        }
      }
    } else if (this.rawObjs instanceof Object) {
      for (const key in this.rawObjs) {
        const objData = this.rawObjs[key]
        if (objData === null) {
          continue
        }
        if (objData._id === id) {
          this.rawObjs[key] = data
          this.rawObjs[key]._id = id
        }
      }
    }
  }

  /**
     * this function will be executed before parsing the data, we can execute things here to
     * cleanup the data
     * @param rawObjs
     */
  preObjParsing(rawObjs) {
    return rawObjs
  }

  parseObjects(objs, removePrevious = false) {
    if (objs instanceof Array) {
      if (this.objsParsed === undefined || removePrevious) {
        this.objsParsed = []
      }
      for (const i in objs) {
        let objData = objs[i]
        if (objData === null) {
          continue
        }
        if (typeof (objData) === 'string') {
          objData = { _id: objData }
          objs[i] = objData
        }
        const newObj = this.objDataToViewModel(objData)
        const curIndex = this.objsParsed.length
        newObj._delete_from_repo = () => {
          delete this.rawObjs[i]
          this.rawObjs.splice(i, 1)
          delete this.objsParsed[curIndex]
          this.objsParsed.splice(curIndex, 1)
        }
        Object.defineProperty(newObj, 'repository', {
          enumerable: false,
          writable: true,
          readable: true,
          value: this,
        })
        this.objsParsed.push(newObj)
        this.objHasBeenParsed(newObj)
      }
    } else if (objs instanceof Object) {
      if (this.objsParsed === undefined || removePrevious) {
        this.objsParsed = {}
      }
      for (const key in objs) {
        const objData = objs[key]
        if (objData === null) {
          continue
        }
        const newObj = this.objDataToViewModel(objData)
        if (newObj.name === undefined) {
          newObj.name = key
        }
        this.objsParsed[key] = newObj
        newObj._delete_from_repo = () => {
          delete this.rawObjs[key]
          delete this.objsParsed[key]
        }
        Object.defineProperty(newObj, 'repository', {
          enumerable: false,
          writable: true,
          readable: true,
          value: this,
        })
        this[key] = newObj
        this.objHasBeenParsed(newObj)
      }
    }
    this.objsHaveBeenParsed()
  }

  objDataToViewModel(objData) {
    let viewModel
    if (objData instanceof this.objType) {
      viewModel = objData
    } else {
      viewModel = new this.objType(objData)
    }
    return viewModel
  }

  /**
     * this function will be executed whenever an object has been parsed,
     * we can give e.g. custom properties to this object in the derived repository
     * @param objParsed
     */
  objHasBeenParsed(objParsed) {
    objParsed._parsed = true
    this.objParsedCallback(objParsed)
  }

  /**
     * this function will be executed whenever an object has been parsed,
     * we can give e.g. custom properties to this object in the derived repository
     */
  objsHaveBeenParsed() {
    this.objsParsedCallback(this)
  }

  [Symbol.iterator]() {
    if (Array.isArray(this.objsParsed)) {
      return this.objsParsed.values()
    }
    return Object.values(this.objsParsed).values()
  }

  /**
     * return the last obj in the repository
     * @return {*}
     */
  get last() {
    if (this.objsParsed.length > 0) {
      return this.objsParsed[this.objsParsed.length - 1]
    }
    return undefined
  }

  get length() {
    return this.objsParsed.length
  }

  /**
     * @param objs: can be json object (as params of a viewmodel or as dictionary of repository), array of json objects,
     * array of BaseViewModel
     * if objs is no array and objsParsed is not a dict (but array), we shall convert objs to array, so it can accept
     * arrays of objects as wel as just objects
     * if objs is object and this.objsParsed is a dictionary we should loop to check if they are view models and then
     * transform them back to json
     * if this.objsParsed is no dictionary (but an array) we shall loop through all objs and convert the to json if the
     * obj is a viewmodel
     *
     */
  add(objs) {
    if (Array.isArray(objs) === false && typeof (this.objsParsed) !== 'object') {
      objs = [objs]
    }
    if (Array.isArray(objs)) {
      objs = objs.map(obj => {
        if (obj instanceof BaseViewModel) {
          return obj.to.json()
        }
        return obj
      })
    } else if (typeof (this.objsParsed) === 'object') {
      for (const key in objs) {
        if (objs[key] instanceof BaseViewModel) {
          objs[key] = objs[key].to.json()
        }
      }
    }
    this.processRawObjs(objs)
  }

  get_by_index(index) {
    return this.objsParsed[index]
  }

  remove(obj) {
    obj._delete_from_repo()
  }

  /**
     * remove all objects inside the repository
     * if array we will keep references to the array
     * if object the reference will be removed an new object will be created
     */
  reset() {
    if (Array.isArray(this.objsParsed)) {
      this.objsParsed.length = 0
      this.rawObjs.length = 0
    } else {
      this.objsParsed = {}
    }
  }

  get to() {
    const _this = this
    return {
      json(respectIdOnlyFields = false, fields = []) {
        let data
        if (Array.isArray(_this.objsParsed)) {
          data = []
          for (const obj of _this.objsParsed) {
            if (_this.isIdOnlyArray && respectIdOnlyFields) {
              data.push(obj.id)
            } else {
              data.push(obj.to.json(fields))
            }
          }
        } else {
          data = {}
          for (const key in _this.objsParsed) {
            data[key] = _this.objsParsed[key].to.json(fields)
          }
        }
        return data
      },
    }
  }

  /**
     * results will be refreshed, e.g. when local filter switches are changed we just have to apply the filters locally
     * on the already retrieved data, instead of doing a request to the server for data tha we already have!
     */
  refresh() {
    this.processRawObjs(this.rawObjs, true)
  }

  sortByField(field) {
    this.rawObjs = this.rawObjs.sort((a, b) => a[field] - b[field])
    this.refresh()
  }

  indexOf(objToCheck) {
    for (const i in this.objsParsed) {
      const obj = this.objsParsed[i]
      if (typeof (objToCheck) === 'string') {
        if (obj.id === objToCheck) {
          return i
        }
      } else if (obj.id === objToCheck.id) {
        return i
      }
    }
    return -1
  }

  includes(objToCheck) {
    return this.indexOf(objToCheck) !== -1
  }
}
