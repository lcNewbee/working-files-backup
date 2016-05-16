function reqeustLogin() {
  return {
    type: 'REQEUST_LOGIN'
  };
}

export function updateData(name, val) {
  return {
    type: 'UPDATE_DATA',
    name: name,
    value: val
  };
}

export function login() {
  return dispatch => {
    dispatch(reqeustLogin());

    fetch('bundle.js')
      .then(function(response) {
        console.log(response)
      })
  };
}

