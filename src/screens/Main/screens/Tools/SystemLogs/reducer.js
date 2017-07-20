import { fromJS } from 'immutable';

const defaultState = fromJS({
  perPageNum: 30,
  logPage: {
    totalPage: 0,
    currPage: 1,
    nextPage: -1,
  },
  tableList: [],
  searchList: [],
  startNoForEveryPage: 5,
  searchItem: ' ',
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'CHANGE_PER_PAGE_NUM':
      return state.set('perPageNum', action.data);
    case 'CHANGE_PAGE_OBJECT':
      return state.set('logPage', action.data);
    case 'CHANGE_TABLE_LIST':
      return state.set('tableList', action.data);
    case 'CHANGE_START_NO':
      return state.set('startNoForEveryPage', action.data);
    case 'CHANGE_SEARCH_ITEM':
      return state.set('searchItem', action.data);
    case 'CHANG_SEARCH_LIST':
      return state.set('searchList', action.data);
    default:
  }
  return state;
}
