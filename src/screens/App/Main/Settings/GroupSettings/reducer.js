import Immutable, {Map, List, fromJS} from 'immutable';

function setFetching(state) {
  return state.update('fetching', val => true);
}

function mergeData(state, action) {
  return state.update('data', data => data.merge(action.data))
}

function mergeDevice(state, action) {
  return state.update('devices', data => data.merge(action.data))
}

function deleteListById(state, groupname) {
  let ret = state;
  
  const index = state.getIn(['data', 'list']).findIndex(function(item) {
    return item.get('groupname') == groupname;
  });

  if(index !== -1) {
    ret = state.deleteIn(['data', 'list', index])
  }

  return ret;
}

function getDevicesByGroup(state, groupname) {
  return state.getIn(['devices', 'list']).filter(function(item){
    return item.get('groupname') == groupname;
  }).map(function(item) {
    return item.get('devicename').split('/')[0];
  });
}

function getEditGroupByName(state, groupname) {
  var devices = getDevicesByGroup(state, groupname);
  
  return state.getIn(['data', 'list']).find(function(item) {
    return item.get('groupname') == groupname;
  }).set('devices', devices)
}

function selectDevice(state, mac, unselect) {
  
  return state.updateIn(['edit', 'devices'], data => {
    let ret;
    
    if(unselect) {
      ret = data.filterNot(function(val) {
        return val === mac;
      });
    } else {
      if(data.indexOf(mac) !== -1) {
        ret = data;
      } else {
        ret = data.push(mac)
      }
    }
    
    return ret
  });
}

let defaultState = fromJS({
  fetching: false,
  data: {
    list: []
  },
  devices: {
    list: []
  },
  validator: {
    
  }
});

export default function(state = defaultState, action) {
  switch (action.type) {
    case 'RECEIVE_DEVICE_GROUPS':
      return mergeData(state, action);

    case 'REQEUST_FETCH_DEVICE_GROUPS':
      return setFetching(state);
    
    case 'RECEIVE_GROUP_DEVICES':
      return mergeDevice(state, action);

    case 'EDIT_GROUP':
      return state.set('edit', getEditGroupByName(state, action.groupname))
        .set('actionType', 'edit').setIn(['edit', 'orignName'], action.groupname);

    case 'ADD_GROUP':
      return state.set('edit', fromJS({
        devices: []
      })).set('actionType', 'add');

    case 'REMOVE_EDIT_GROUP':
      return state.delete('edit').delete('actionType');

    case 'DELETE_DEVICE_GROUP':
      return deleteListById(state, action.groupname);
      
    case 'SELECT_DEVICE':
      return selectDevice(state, action.mac, action.unselect);
      
    case 'CHANGE_EDIT_GROUP':
      return state.update('edit', data => data.merge(action.data));

  }
  return state;
};
