import { actions as appActions } from 'shared/containers/app';
import urls from 'shared/config/urls';


export function changeFirstRefresh(data) {
  return {
    type: 'CHANGE_FIRST_REFRESH',
    data,
  };
}




