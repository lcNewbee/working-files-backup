import { fromJS } from 'immutable';

const defaultItem = fromJS({
  id: '-1',
  activeTab: 'details',
  detailsActivePanelIndex: 0,
  configurationActivePanelIndex: 0,
  configurationRadioIndex: 0,
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
        devicename: '',
      },
    }, {
      panelKey: 'radioBase',
      text: 'Radio Base',
      module: 'radio',
      data: {
        activeIndex: 0,
        enable: '1',
        radiosOptions: [],
        countrycode: 'CN',
        phymode: '11n',
        channelwidth: 40,
        channel: 7,
        txpower: '100%',
        first5g: 1,
        switch11n: 1,
      },
    }, {
      panelKey: 'radioAdvance',
      module: 'radio',
      text: 'Radio Advance',
      data: {
        activeIndex: 0,
        phymode: 'B/G/N',
        radiosOptions: [],
        maxclientcount: 32,
        beaconinterval: 100,
        fragthreshold: 2346,
        rtsthreshold: 2346,
        shortretrythreshold: 7,
        longretrythreshold: 4,
        maxrxduration: 4,
        preamble: 0,
        dtim: 7,
        wmmenable: '0',
        cwmin: 60,
        cwmax: 60,
        aifs: 60,
        txop: 60,
        admctrmandatory: 32,
        spatialstreams: '1x1',
      },
    },
  ],
  query: {},
  data: {
    radios: [],
    info: {},
    radio: {
      radiosOptions: [],
    },
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
  if (activeIndex === -1) {
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
  const $$curList = state.getIn(['list', dataIndex]);
  const radioActiveIndex = $$curList.getIn(['configurationRadioIndex']);
  let $$ret = state;
  let $$newData = $$curList.get('data');
  let $$radiosOptions = fromJS([]);

  if (dataIndex !== -1) {
    $$newData = $$newData.merge(rcData);
    // 设置已选中的网卡radio参数
    if (rcData.radios) {
      $$radiosOptions = $$radiosOptions.merge(
        rcData.radios.map((item, index) => ({
          value: index,
          label: item.radioID,
        })),
      );
      $$newData = $$newData
        .mergeIn(['radio'], rcData.radios[radioActiveIndex])
        .setIn(['radio', 'radiosOptions'], $$radiosOptions)
        .setIn(['radio', 'activeIndex'], radioActiveIndex);
    }

    $$ret = $$ret
      .setIn(['list', dataIndex, 'data'], $$newData)
      .setIn(
        ['list', dataIndex, 'configuration'],
        $$ret.getIn(['list', dataIndex, 'configuration']).map(
          ($$item) => {
            const module = $$item.get('module');
            const $$moduleData = $$newData.get(module);

            return $$item.mergeIn(['data'], $$moduleData);
          },
        ),
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

  return ret.set('isShowPanel', ret.get('list').size > 0);
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
    data,
  );
}

function changePropertyPanelRadioIndex(state, index) {
  const $$ret = state;
  const activeIndex = $$ret.get('activeIndex');
  const radioIndex = index;
  let $$curListItem = $$ret.getIn(['list', activeIndex]);
  let $$curRadioData = $$curListItem.getIn(['data', 'radio']);

  $$curRadioData = $$curRadioData.merge(
      $$curListItem.getIn(
        ['data', 'radios', radioIndex],
      ),
    ).set('activeIndex', radioIndex);
  $$curListItem = $$curListItem
    .set('configurationRadioIndex', radioIndex)
    .updateIn(
      ['configuration'],
      item => item.map((subItem) => {
        let $$subRet = subItem;

        if (subItem.get('module') === 'radio') {
          $$subRet = $$subRet.mergeIn(
            ['data'],
            subItem.get('data')
              .mapEntries(
                ([key]) => [key, $$curRadioData.get(key)],
              ),
          );
        }

        return $$subRet;
      }),
    )
    .setIn(['data', 'radio'], $$curRadioData);

  return $$ret.setIn(['list', activeIndex], $$curListItem);
}

function changePropertysItem(state, action) {
  const changeData = action.payload;
  const cuRadioIndex = changeData.configurationRadioIndex;
  let $$ret = state;

  if (typeof cuRadioIndex !== 'undefined') {
    $$ret = changePropertyPanelRadioIndex(state, cuRadioIndex);
  }

  return $$ret.mergeIn(
    ['list', state.get('activeIndex')],
    action.payload,
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
        action.name,
      );

    // 更新合并属性列表某项的数据
    case 'CHANGE_PROPERTYS_ITEM':
      return changePropertysItem(state, action);

    case 'UPDATE_PROPERTY_PANEL_DATA':
      return updatePropertyPanelData(state, action.data);

    default:
  }
  return state;
}
