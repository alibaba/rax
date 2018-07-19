import location from '@core/location';
import { callWithCallback } from '../util';

export function getLocation(options) {
  callWithCallback(location.getLocation, options, {},
    res => {
      return {
        longitude: res.coords.longitude,
        latitude: res.coords.latitude,
        accuracy: res.coords.accuracy,
        province: res.address.province,
        city: res.address.city,
        cityAdcode: res.address.cityCode,
        district: res.address.area,
        streetNumber: {
          street: res.address.road,
          number: res.address.addressLine
        }
      };
    });
}
