import utils from 'shared/utils';
import * as appActions from 'shared/actions/app';
import urls from 'shared/config/urls';

export function requestFetchStatus(){
  return {
    type:'REQUEST_FETCH_STATUS'
  }
}
