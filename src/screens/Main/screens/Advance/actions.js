import utils from 'shared/utils';
import * as appActions from 'shared/actions/app';
import urls from 'shared/config/urls';


export function toggleRtsSwitch(data){
  return {
    type:'TOGGLE_RTS_SWITCH',
    data
  }
}

