import contact from '@core/contact';
import { callWithCallback } from '../util';

export function choosePhoneContact(options) {
  callWithCallback(contact.choosePhoneContact, options, {}, res => {
    return {
      name: res.name,
      mobile: res.phone
    };
  });
}
