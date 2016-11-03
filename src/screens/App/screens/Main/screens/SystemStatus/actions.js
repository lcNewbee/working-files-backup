import * as appActions from 'shared/actions/app';
import urls from 'shared/config/urls';


export function changeFirstRefresh(data) {
  return {
    type: 'CHANGE_FIRST_REFRESH',
    data,
  };
}




