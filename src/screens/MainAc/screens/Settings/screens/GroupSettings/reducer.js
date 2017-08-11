import Immutable, {Map, List, fromJS} from 'immutable';
import immutableUtils from 'shared/utils/lib/immutable';

function setFetching(state) {
  return state.update('fetching', val => true);
}

function mergeData(state, action) {
  return state.update('data', data => data.merge(action.data))
}

function getSeeDevices(state, groupname) {
  return state.getIn(['devices', 'list']).filter(function(item) {
    return item.get('groupname') === groupname;
  });
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

function getDevicesByGroupname(state, groupname) {
  return state.getIn(['devices', 'list']).filter(function(item){
    return item.get('groupname') === groupname;
  }).map(function(item) {
    return item.get('mac');
  });
}

function getEditGroupByName(state, groupname) {
  const devices = getDevicesByGroupname(state, groupname);
  return state.getIn(['data', 'list']).find(function(item) {
    return item.get('groupname') === groupname;
  }).set('devices', devices);
}
function geteditIndex(state, groupname) {
  const devices = getDevicesByGroupname(state, groupname).toJS();
  console.log('devices', devices);
  const editIndex = [];
  devices.forEach((mac) => {
    editIndex.push(state.getIn(['devices', 'list']).findIndex((item) => {
      return item.get('mac') === mac;
    }));
  });
  console.log('editIndex', editIndex);
  return editIndex;
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

function selectRow(state, action) {
  const selectObject = immutableUtils.selectList(
    state.getIn(['devices', 'list']),
    action.payload,
    state.getIn(['actionQuery', 'selectedList']),
  );
  const devices = [];
  const $$selectedListIndex = selectObject.selectedList;
  if ($$selectedListIndex.size !== 0) {
    $$selectedListIndex.forEach((index) => {
      devices.push(state.getIn(['devices', 'list', index, 'mac']));
    });
  }
  return state.setIn(['devices', 'list'], selectObject.$$list)
    .setIn(['edit', 'devices'], devices)
    .setIn(['actionQuery', 'selectedList'], $$selectedListIndex);
}
function editGroup(state, action) {
  const devices = getDevicesByGroupname(state, action.groupname).toJS();
  const editIndex = [];
  let newState = state;
  devices.forEach((mac) => {
    editIndex.push(state.getIn(['devices', 'list']).findIndex((item) => {
      return item.get('mac') === mac;
    }));
  });
  let selectedList = newState.getIn(['actionQuery', 'selectedList']);
  if (editIndex.length !== 0) {
    editIndex.forEach((index) => {
      console.log('index', index);
      selectedList = selectedList.push(index);
      newState = newState.setIn(['actionQuery', 'selectedList'], selectedList)
                          .mergeDeepIn(['devices', 'list', index], { __selected__: true });
    });
  }
  return newState.set('edit', getEditGroupByName(state, action.groupname))
          .set('actionType', 'edit').setIn(['edit', 'orignName'], action.groupname);
}
function removeEditModal(state) {
  const selectedList = state.getIn(['actionQuery', 'selectedList']).toJS();
  let newState = state;
  selectedList.forEach((index) => {
    newState = newState.mergeDeepIn(['devices', 'list', index], { __selected__: false });
  });
  return newState.delete('edit').delete('actionType')
         .setIn(['actionQuery', 'selectedList'], fromJS([]));
}

let defaultState = fromJS({
  fetching: false,
  data: {
    list: []
  },
  devices: {
    list: []
  },
  actionQuery: {
    selectedList: [],
  },
  seeDevices: [],
  validator: {
  },
});

export default function(state = defaultState, action) {
  switch (action.type) {
    case 'RECEIVE_DEVICE_GROUPS':
      return mergeData(state, action).set('fetching', false);

    case 'REQEUST_FETCH_DEVICE_GROUPS':
      return setFetching(state);

    case 'RECEIVE_GROUP_DEVICES':
      return state.update('devices', data => data.merge(action.data))
        .set('fetching', false);

    case 'EDIT_GROUP':
      return editGroup(state, action);
      // return state.set('edit', getEditGroupByName(state, action.groupname))
      //   .set('actionType', 'edit').setIn(['edit', 'orignName'], action.groupname)
      //   .setIn(['actionQuery', 'selectedList'], [geteditIndex(state, action.groupname)])
      //   .mergeDeepIn(['devices', 'list', geteditIndex(state, action.groupname)], { __selected__: true });

    case 'ADD_GROUP':
      return state.set('edit', fromJS({
        devices: []
      })).set('actionType', 'add');

    case 'REMOVE_EDIT_GROUP':
      return removeEditModal(state);
      // return state.delete('edit').delete('actionType')
      //       .setIn(['actionQuery', 'selectedList'], fromJS([]));

    case 'DELETE_DEVICE_GROUP':
      return deleteListById(state, action.groupname);
    case 'SELECT_DEVICE':
      return selectDevice(state, action.mac, action.unselect);
    case 'SELECT_ROW':
      return selectRow(state, action);
    case 'CHANGE_EDIT_GROUP':
      return state.update('edit', data => data.merge(action.data));

    case 'LOOK_GROUP_DEVICES':
      return state.set('edit', Map({
          groupname: action.groupname
        }))
        .set('actionType', 'look')
        .set('seeDevices', getSeeDevices(state, action.groupname))

  }
  return state;
};
