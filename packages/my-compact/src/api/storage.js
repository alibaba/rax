import storage from '@core/storage'
import { callWithCallback } from '../util'

export function setStorage (options) {
  callWithCallback(storage.setItem, options, {
    key: options.key,
    value: options.data
  })
}

export function getStorage (options) {
  callWithCallback(storage.getItem, options, {
    key: options.key
  }, res => {
    return {
      data: res.value
    }
  })
}

export function removeStorage (options) {
  callWithCallback(storage.removeItem, options, {
    key: options.key
  })
}

export function getStorageInfo (options) {
  callWithCallback(storage.length, options, {}, res => {
    return {
      currentSize: res.length
    }
  })
}
