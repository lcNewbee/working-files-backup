import { fromJS } from 'immutable';

const defaultItem = fromJS({
  id: '-1',
  activeTab: 'details',
  detailsActivePanelIndex: 0,
  configurationActivePanelIndex: 0,
  details: [
    {
      panelKey: 'overview',
      text: 'Overview',
      data: {},
    },
  ],
  configuration: [
    {
      panelKey: 'general',
      text: 'General',
      module: 'info',
      data: {
        devicename: ''
      },
    }, {
      panelKey: 'radioBase',
      text: 'Radio Base',
      module: 'radio',
      data: {
        countrycode: "CN",
        phymode: '11n',
        channelwidth: 40,
        channel: 7,
        txpower: 13,
      },
    }, {
      panelKey: 'radioAdvance',
      module: 'radio',
      text: 'Radio Advance',
      data: {
        maxclientcount: 64,
        beaconinterval: 1,
        dtim: 40,
        rtsthreshold: 7,
        preamble: 0,
      },
    },
  ],
  query: {},
  data: {
    info: {},
    radio: {},
  },
});

const defaultState = fromJS({
  isShowPanel: false,
  activeIndex: 0,

  // 属性面板列表
  list: [],
});

function initAddPropertyPanel(state, action) {
  const ret = state;
  const listSize = state.get('list').size;
  const myItem = defaultItem
    .mergeIn(['query'], action.payload.query)
    .mergeIn(['data', 'info'], action.payload.info)
    .mergeIn(['details', 0, 'data'], action.payload.info)
    .set('id', action.payload.query.mac);
  let activeIndex = state.get('list')
    .findIndex(item => item.get('id') === action.payload.query.mac);
  let $$retList = state.get('list');

  // 列表中无此项
  if(activeIndex === -1) {
    activeIndex = listSize;
    $$retList = $$retList.push(myItem);
  }

  return ret.set('isShowPanel', true)
      .set('list', $$retList)
      .set('activeIndex', activeIndex);
}
function rcPropertyPanelData(state, action) {
  const rcData = action.payload.data || {};
  const mac = action.payload.mac;
  const dataIndex = state.get('list')
    .findIndex(item => item.get('id') === mac);
  let $$ret = state;
  let $$newData = state.getIn(['list', dataIndex, 'data']);

  console.log(dataIndex)
  if (dataIndex !== -1) {
    $$newData = $$newData.merge(rcData);
    $$ret = $$ret
      .setIn(['list', dataIndex, 'data'], $$newData)
      .updateIn(
        ['list', dataIndex, 'configuration'],
        (item) => {
          return item.map((subItem) => {
            const module = subItem.get('module');
            const $$moduleData = $$newData.get(module);
            const customData = subItem.get('data')
              .mapEntries(([key, val]) => [key, $$moduleData.get(key)]);

            return subItem.mergeIn(['data'], customData);
          });
        }
      );
  }

  return $$ret;
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
    case 'INIT_ADD_PROPERTY_PANEL':
      return initAddPropertyPanel(state, action);

    case 'RC_PROPERTY_PANEL_DATA':
      return rcPropertyPanelData(state, action);

    case 'REMOVE_FROM_PROPERTY_PANEL':
      return removeFromPropertyPanel(state, action);

    case 'TOGGLE_PROPERTY_PANEL':
      return state.update('isShowPanel', val => !val);

    // 切换属性列表body折叠状态
    case 'COLLAPSE_PROPERTYS':
      return state.update('activeIndex', (i) => {
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
