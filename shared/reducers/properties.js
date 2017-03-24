import { fromJS } from 'immutable';
import ACTIONS from 'shared/constants/action';

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
        mac: '',
        isCounter: 2,
      },
    }, {
      panelKey: 'radioBase',
      text: 'Radio Base',
      module: 'radio',
      data: {
        activeIndex: 0,
        enable: '1',
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
        phymode: '1',
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
    }, {
      panelKey: 'radioQos',
      module: 'radio',
      text: 'Radio QoS',
      data: {
        wmmtemplate: 1,
        be_cwmin: 11,
        be_cwmax: 11,
        be_aifs: 11,
        be_txop: 11,
        be_noack: 1,
        bk_cwmin: 11,
        bk_cwmax: 11,
        bk_aifs: 11,
        bk_txop: 11,
        bk_noack: 1,
        vi_cwmin: 11,
        vi_cwmax: 11,
        vi_aifs: 11,
        vi_txop: 11,
        vi_noack: 1,
        vo_cwmin: 11,
        vo_cwmax: 11,
        vo_aifs: 11,
        vo_txop: 11,
        vo_noack: 1,
      },
    },
  ],
  query: {},
  curData: {
    info: {},
    radio: {
      activeIndex: 0,
      radiosOptions: [],
    },
  },
  data: {
    radios: [],
    info: {},
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

function receivePropertyPanelData(state, action) {
  const rcData = action.payload.data || {};
  const mac = action.payload.mac;
  const dataIndex = state.get('list')
    .findIndex(item => item.get('id') === mac);
  const $$curList = state.getIn(['list', dataIndex]);
  const radioActiveIndex = $$curList.getIn(['configurationRadioIndex']);
  let $$ret = state;
  let $$newData = $$curList.get('data');
  let $$radiosOptions = fromJS([]);

  // 把服务器端数据合并 到 data 中
  $$newData = $$newData.merge(rcData);
  $$ret = $$ret.setIn(['list', dataIndex, 'data'], $$newData);

  // 处理radio相关数据
  if (dataIndex !== -1) {
    // 设置已选中的网卡radio参数
    if (rcData.radios) {
      $$radiosOptions = fromJS(
        rcData.radios.map((item, index) => {
          let curRaioName = '(2.4G)';

          if (item.phymodesupport >= 8) {
            curRaioName = '(5G)';
          }
          return {
            value: index,
            label: `${item.radioID} ${curRaioName}`,
          };
        }),
      );
      $$newData = $$newData
        .mergeIn(['radio'], rcData.radios[radioActiveIndex])
        .setIn(['radio', 'radiosOptions'], $$radiosOptions)
        .setIn(['radio', 'activeIndex'], radioActiveIndex);
    }

    $$ret = $$ret
      .setIn(['list', dataIndex, 'curData'], $$newData)
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
function removePropertyPanel(state, action) {
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

// 切换 radio 网卡
function changePropertyPanelRadioIndex(state, index) {
  const $$ret = state;
  const activeIndex = $$ret.get('activeIndex');
  const radioIndex = index;
  let $$curListItem = $$ret.getIn(['list', activeIndex]);
  let $$curRadioData = $$curListItem.getIn(['curData', 'radio']);

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
    .mergeIn(['curData', 'radio'], $$curRadioData);

  return $$ret.setIn(['list', activeIndex], $$curListItem);
}

function changePropertyPanelItem(state, action) {
  const changeData = action.payload;
  const curRadioIndex = changeData.configurationRadioIndex;
  let $$ret = state;

  if (typeof curRadioIndex !== 'undefined') {
    $$ret = changePropertyPanelRadioIndex(state, curRadioIndex);
  }
  return $$ret.mergeIn(
    ['list', state.get('activeIndex')],
    action.payload,
  );
}

export default function (state = defaultState, action) {
  switch (action.type) {
    case ACTIONS.CHANGE_PROPERTY_PANEL_DATA:
      return updatePropertyPanelData(state, action.data);

    case ACTIONS.TOGGLE_PROPERTY:
      return state.update('isShowPanel', (val) => {
        let ret = !val;

        if (typeof action.payload === 'boolean') {
          ret = action.payload;
        }
        return ret;
      });

    case ACTIONS.INIT_PROPERTY_PANEL:
      return initAddPropertyPanel(state, action);

    case ACTIONS.RC_PROPERTY_PANEL_DATA:
      return receivePropertyPanelData(state, action);

    // 切换属性列表body折叠状态
    case ACTIONS.COLLAPSE_PROPERTY_PANEL:
      return state.update('activeIndex', (i) => {
        let ret = action.index;

        if (action.index === i) {
          ret = -1;
        }

        return ret;
      });

    case ACTIONS.REMOVE_PROPERTY_PANEL:
      return removePropertyPanel(state, action);

    // 修改合并属性列表某项的数据
    case ACTIONS.CHANGE_PROPERTY_PANEL_ITEM:
      return changePropertyPanelItem(state, action);

    default:
  }
  return state;
}
