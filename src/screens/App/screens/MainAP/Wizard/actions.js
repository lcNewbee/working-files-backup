import utils from 'shared/utils';
import urls from 'shared/config/urls';

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
  };
}

export function checkResult(result) {
  return {
    type: 'checkResult',
    result,
  };
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

    utils.save(urls.login, data)
      .then((json) => {
        let result = '未知错误';

        if (json.state) {
          if (json.state.code === 2000) {
            result = 'ok';
          } else {
            result = json.state.msg;
          }
        }
        dispatch(loginResult(result));
      });
  };
}


// Mine
export function changeCurrentMode(data) {
  return {
    type: 'CHANGE_CURRENT_MODE',
    data,
  };
}

export function changeShowProgressBar(data) {
  return {
    type: 'CHANGE_SHOW_PROGRESS_BAR',
    data,
  };
}

export function changeNextMode(data) {
  return {
    type: 'CHANGE_NEXT_MODE',
    data,
  };
}
