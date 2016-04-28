export function reqeustFetch() {
  return {
    type: 'REQEUST_FETCH'
  };
}

export function receiveFetch(data) {
  return {
    type: 'RECEIVE_FETCH'
    data: data,
    updateAt: Date.now()
  };
}

export function fetch(url) {
  return dispatch => {
    dispatch(reqeustFetch());

    fetch('api/deviceGroup')
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        if(json.state && json.state.code === 2000) {
          dispatch(receiveFetch(json.data))
        }
      })
      .catch(function() {

      })
  };
}
