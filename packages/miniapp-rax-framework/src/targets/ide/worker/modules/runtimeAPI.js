export default {
  $getCurrentActivePageId() {
    return self.__current_client_id__;
  },
  $on(eventName, callback) {
    addEventListener(eventName, callback);
  },
  $emit(eventName, payload, clientId) {
    postMessage({
      type: eventName,
      data: payload,
      clientId
    });
  }
};
