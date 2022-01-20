const initDefaults = {
  credentials: 'same-origin',
  headers: { Accept: 'application/json' },
}

export const fetchJSON = (url, body = false, init = {}) => {
  // apply defaults to init
  init = { ...initDefaults, ...init }
  const rejectOnErrorStatus = (response) => {
    if (response.ok) {
      return response
    } else {
      if (response.status === 401) {
        // log the user out!
        // require('app/store').store.dispatch({
        //   type: 'scout/auth/LOGOUT_REQUESTED',
        // })
      }
      // TODO - ensure that the json() response is a well-formed
      // api error.
      // If yes, then throw an APIError with the code and error from the response
      // If no, then throw a generic APIError
      return response.json().then((json) => Promise.reject(json))
    }
  }

  if (body) {
    init.body = JSON.stringify(body)
    init.headers = init.headers ? Object.assign({}, init.headers) : {}
    init.headers['Content-Type'] = 'application/json'
    init.method = init.method || 'POST'
  }

  return fetch(url, init)
    .then(rejectOnErrorStatus)
    .then((response) => response.json())
}
