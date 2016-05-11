import utils from 'utils';

const urls = {
  fetch: "/goform/getQos",
  save: "/goform/setQos"
}

// Fetch
export function reqeustFetchQos() {
  return {
    type: "REQEUST_FETCH_QOS"
  }
}
export function receiveQos(data) {
  return {
    type: "RECEIVE_QOS",
    updateAt: Date.now(),
    data
  }
}
export function fetchBandwidth() {
  return dispatch => {
    dispatch(reqeustFetchQos());

    utils.fetch(urls.fetch)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(receiveQos(json.data));
        }
      });
  };
}

// handle user custom action
export function changeQosGroup(name) {
  return {
    type: "CHANGE_QOS_GROUP",
    name
  }
}

export function changeQosSettings(data) {
  return {
    type: "CHANGE_QOS_SETTINGS",
    data
  }
}

// Set 
export function reqeustSetQos() {
  return {
    type: "REQEUST_SET_QOS"
  }
}
export function receiveSetQos() {
  return {
    type: "RECEIVE_SET_QOS"
  }
}
export function setBandwidth() {
  return (dispatch, getState) => {
    const data = getState().bandwidth.getIn(['data', 'curr']);
    
    dispatch(reqeustSetQos());

    utils.save(urls.save, data)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(receiveQos());
          dispatch(fetchBandwidth());
        }
      });
  };
}