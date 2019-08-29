/* global wx */
import { isWeex, isWeb } from 'universal-env';
import { shared } from 'rax';

export default function getElementById(id) {
  if (isWeex) {
    return shared.Host.driver.getElementById(id);
  } else if (isWeb) {
    return document.getElementById(id);
  } else if (typeof my == 'object') {
    return my.createSelectorQuery().select('#' + id);
  } else if (typeof wx == 'object') {
    return wx.createSelectorQuery().select('#' + id);
  }
}