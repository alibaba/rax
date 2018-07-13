import device from '@core/device'
import { callWithCallback } from '../util'

export function watchShake (options) {
  callWithCallback(device.onShake, options, {
    on: true
  })
}

export function vibrate (options) {
  callWithCallback(device.vibrate, options)
}