import {Map, List, fromJS} from 'immutable';

const defaultState = fromJS({
  fetching: false,
  data: {
    list: []
  },
  query: {
    type: '0',
    size: 20,
    page: 1
  },
  actionQuery: {}
});

function receiveDevicesData(state, updateAt, data) {
  if (data && data.list) {
    const dataList = data.list;
    const dataPage = data.page;
    let i = 0;
    const size = data.list.length;
    const startIndex = (dataPage.currPage - 1) * dataPage.size;
    for (i; i < size; i += 1) {
      dataList[i].index = startIndex + i + 1;
    }
    const newData = {};
    newData.list = dataList;
    newData.page = dataPage;
    return state.set('fetching', false)
          .set('updateAt', updateAt)
          .mergeIn(['data'], newData);
  }

  return state;
}

export default function(state = defaultState, action) {
  switch (action.type) {
    case 'REQEUST_FETCH_CLIENT':
      return state.set('fetching', true);

    case 'RECIVE_FETCH_CLIENTS':
      return receiveDevicesData(state, action.updateAt, action.data);
      // return state.set('fetching', false)
      //   .set('updateAt', action.updateAt)
      //   .mergeIn(['data'], action.data);

    case 'CHANGE_CLIENTS_QUERY':
      return state.mergeIn(['query'], action.query);

    case "CHANGE_CLIENT_ACTION_QUERY":
      return state.mergeIn(['actionQuery'], action.actionQuery);

    case 'LEAVE_CLIENTS_SCREEN':
      return state.mergeIn(['query'], {
        search: ''
      });

  }
  return state;
};
