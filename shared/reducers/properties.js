import { fromJS } from 'immutable';

const defaultItem = fromJS({
  activeTab: 'details',
  detailsActivePanelIndex: 0,
  configurationActivePanelIndex: 0,
  details: [
    {
      panelKey: 'overview',
      text: 'Overview',
      data: {
        mac: '44:d9:e4:33:33:22',
        model: 'AP512',
        version: '3.7.344',
      },
    },
  ],
  configuration: [
    {
      panelKey: 'general',
      text: 'General',
      data: {
        alias: 'dsd',
        apRelateNum: 122,
      },
    }, {
      panelKey: 'radios',
      text: 'Radios',
      data: {
        channel: '6',
      },
    }, {
      panelKey: 'system',
      text: 'System',
      data: {
        alias: 'dsd',
        apRelateNum: 122,
      },
    },
  ],
  data: {
    mac: '44:d9:e4:33:33:22',
    model: 'AP512',
    version: '3.7.344',
    alias: '我的别名',
    apRelateNum: 122,
  },
});

const defaultState = fromJS({
  isShowPanel: false,
  activeIndex: 0,
  list: [
  ],
});

function addToPropertyPanel(state, action) {
  const ret = state;
  const listSize = state.get('list').size;

  return ret.set('isShowPanel', true)
      .update('list', val => val.push(defaultItem))
      .set('activeIndex', listSize);
}

function removeFromPropertyPanel(state, action) {
  let ret = state;

  if (action.index < 0) {
    ret = ret.set('list', fromJS([]));
  } else {
    ret = ret.deleteIn(['list', action.index]);
  }

  return ret;
}

function updatePropertyPanelData(state, data) {
  const activeTab = state.getIn([
    'list', state.get('activeIndex'), 'activeTab',
  ]);
  const activePanelKey = `${activeTab}ActivePanelIndex`;
  const activePanelIndex = state.getIn([
    'list', state.get('activeIndex'), activePanelKey,
  ]);
  return state.mergeIn(
    [
      'list', state.get('activeIndex'),
      activeTab, activePanelIndex, 'data',
    ],
    data
  );
}

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'ADD_TO_PROPERTY_PANEL':
      return addToPropertyPanel(state, action);

    case 'REMOVE_FROM_PROPERTY_PANEL':
      return removeFromPropertyPanel(state, action);

    case 'TOGGLE_PROPERTY_PANEL':
      return state.update('isShowPanel', val => !val);

    // 切换属性列表body折叠状态
    case 'COLLAPSE_PROPERTYS':
      return state.update('activeIndex', i => {
        let ret = action.index;

        if (action.index === i) {
          ret = -1;
        }

        return ret;
      });

    // 切换属性列表某项的Tab选择
    case 'CHANGE_PROPERTYS_TAB':
      return state.setIn(
        ['list', state.get('activeIndex'), 'activeTab'],
        action.name
      );

    // 更新合并属性列表某项的数据
    case 'CHANGE_PROPERTYS_ITEM':
      return state.mergeIn(
        ['list', state.get('activeIndex')],
        action.item
      );

    case 'UPDATE_PROPERTY_PANEL_DATA':
      return updatePropertyPanelData(state, action.data);

    default:
  }
  return state;
}
