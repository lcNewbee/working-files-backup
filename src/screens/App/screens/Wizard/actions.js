import utils from 'utils';

export function reqeustLogin() {
  return {
    type: 'REQEUST_LOGIN',
  };
}

export function loginResult(result) {
  return {
    type: 'RESPONSE_LOGIN',
    loginedAt: Date.now(),
    result,
  }
}

export function checkResult(result) {
  return {
    type: "checkResult",
    result
  }
}

export function updateData(data) {
  return {
    type: 'UPDATE_DATA',
    data,
  };
}

export function setWizard() {
  
  return (dispatch, getState) => {
    const data = getState().login.get('data');
    
    dispatch(reqeustLogin());

    utils.save('/goform/login', data)
      .then(function(json) {
        let result = '未知错误';

        if(json.state) {
          if(json.state.code === 2000) {
            result = 'ok';
          } else {
            result = json.state.msg;
          }
        }
        dispatch(loginResult(result));
      });

  };
}

