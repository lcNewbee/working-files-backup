import utils from 'shared/utils';
import { actions as appActions } from 'shared/containers/app';
import urls from 'shared/config/urls';


export function toggleRtsSwitch(data){
  return {
    type:'TOGGLE_RTS_SWITCH',
    data
  }
}

