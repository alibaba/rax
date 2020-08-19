var data = 'init data'

function getData() {
  return data
}

function setData(value) {
  data = value
}

module.exports = {
  getData: getData,
  setData: setData
}
