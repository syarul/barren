const axios = require('axios')

const baseURL = 'https://api.github.com/'

const conf = {
  baseURL,
  timeout: 5000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  }
}

exports.setConfig = function (config) {
  Object.assign(conf, config)
}

exports.request = function (endpoint, type, data, timeout, inflightRequestCancelation) {
  if (timeout) {
    conf['timeout'] = timeout
  }

  const api = axios.create(conf)

  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  if (inflightRequestCancelation && typeof inflightRequestCancelation === 'function') {
    inflightRequestCancelation(source)
  }

  let reqData = {
    cancelToken: source.token
  }
  if (data) {
    reqData = {
      ...reqData,
      ...data
    }
  }
  reqData = JSON.stringify(reqData)

  if (!type || type === 'get') {
    return api
      .get(endpoint, reqData)
      .then(res => res.data)
      .catch(err => {
        console.log(new Error(err))
        return {
          success: false,
          message: err.message
        }
      })
  } else if (type === 'post') {
    return api
      .post(endpoint, reqData)
      .then(res => res.data)
      .catch(err => {
        console.log(new Error(err))
        return {
          success: false,
          message: err.message
        }
      })
  }
}
