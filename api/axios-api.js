const axios = require('axios')

const devel = process.env.NODE_ENV === 'development'

const baseURL = 'http://localhost:3000'

const conf = {
  baseURL,
  timeout: 5000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  }
}

function request(endpoint, data, timeout, inflightRequestCancelation) {
  if (timeout) {
    conf['timeout'] = timeout
  }

  const api = axios.create(conf)

  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  if (inflightRequestCancelation && typeof inflightRequestCancelation === 'function') {
    inflightRequestCancelation(source)
  }

  let reqData = {}
  if (data) {
    reqData = {
      ...reqData,
      ...data,
      cancelToken: source.token
    }
  }
  reqData = JSON.stringify(reqData)
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

module.exports = config => {
  Object.assign(conf, config)

  return request

}
