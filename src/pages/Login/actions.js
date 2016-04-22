export function reqeustLogin() {
  return {
    type: 'REQEUST_LOGIN'
  };
}

export function loginResult(result) {
  return {
    type: 'RESPONSE_LOGIN',
    result: result,
    loginedAt: Date.now()
  }
}

export function updateData(data) {
  return {
    type: 'UPDATE_DATA',
    data
  };
}

export function login() {
  return dispatch => {
    dispatch(reqeustLogin());

    fetch('/api/login')
      .then(function(response) {
         return response.json();
      })
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
      })
      .catch(function() {
        dispatch(loginResult('网络异常'));
      })

  };
}

