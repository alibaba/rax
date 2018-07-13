import Screen from '@core/screen'
import { callWithCallback } from '../util'

// export function getScreenBrightness (options) {
// }

export function setScreenBrightness (options) {
  callWithCallback(Screen.setBrightness, options, {
    brightness: options.brightness
  })
}

export function setKeepScreenOn (options) {
  callWithCallback(Screen.setAlwaysOn, options, {
    on: options.keepScreenOn
  })
}
