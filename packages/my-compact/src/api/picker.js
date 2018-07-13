import picker from '@core/picker'
import { callWithCallback } from '../util'

export function chooseCity (options) {
  if (options.cities && Array.isArray(options.cities)) {
    options.cities = options.cities.map(city => {
      return {
        cityName: city.city,
        cityCode: city.adCode,
        spell: city.spell
      }
    })
  }
  if (options.hotCities && Array.isArray(options.hotCities)) {
    options.hotCities = options.hotCities.map(city => {
      return {
        cityName: city.city,
        cityCode: city.adCode,
        spell: city.spell
      }
    })
  }
  callWithCallback(picker.chooseCity, options, options,
    res => {
      return {
        city: res.cityName,
        adCode: res.cityCode
      }
    }
  )
}
