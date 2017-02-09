import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import validator from 'shared/validator';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { SaveButton, Button } from 'shared/components/Button';
import Table from 'shared/components/Table';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';
import * as productActions from '../../../../reducer';

const msg = {
  upSpeed: _('Up Speed'),
  downSpeed: _('Down Speed'),
  selectGroup: _('Select Group'),
};
const encryptionOptions = [
  {
    value: 'none',
    label: _('NONE'),
  }, {
    value: 'psk-mixed',
    label: _('SECURITY'),
  },
];
const loadBalanceTypeArr = [
  {
    value: '0',
    label: _('Disable'),
  }, {
    value: '1',
    label: _('Users'),
  }, {
    value: '2',
    label: _('SSID'),
  },
];

const validOptions = Map({
  password: validator({
    rules: 'remarkTxt:["\'\\\\"]|len:[8, 256]',
  }),
  vlanid: validator({
    rules: 'num:[2, 4095]',
  }),
  ssid: validator({
    rules: 'remarkTxt:["\'\\\\"]|len:[1, 32]',
  }),
  upstream: validator({
    rules: 'num:[0, 102400, 0]',
  }),
  downstream: validator({
    rules: 'num:[0, 102400, 0]',
  }),
  maxUser: validator({
    rules: 'num:[0, 64]',
  }),
});
const storeForwardOption = [
  {
    value: 'local',
    label: _('Local Forward'),
  },
  //  {
  //   value: 'centralized-802.3',
  //   label: _('Centralized Forward-%s', '802.3'),
  // }, {
  //   value: 'centralized-802.11',
  //   label: _('Centralized Forward-%s', '802.11'),
  // },
];
const checkboxOptions = [
  {
    value: '1',
    label: _('On'),
    render() {
      return (
        <span
          style={{
            color: 'green',
          }}
        >
          {_('On')}
        </span>
      );
    },
  }, {
    value: '0',
    label: _('Off'),
    render() {
      return (
        <span
          style={{
            color: 'red',
          }}
        >
          {_('Off')}
        </span>
      );
    },
  },
];

const flowRateFilter = utils.filter('flowRate:["KB"]');
const listOptions = fromJS([
  {
    id: 'ssid',
    notEditable: true,
    text: _('SSID'),
    maxLength: '31',
    formProps: {
      type: 'text',
      required: true,
      notEditable: true,
      validator: validator({
        rules: 'utf8Len:[1, 31]',
      }),
    },
  }, {
    id: 'remark',
    text: _('Description'),
    formProps: {
      type: 'text',
      maxLength: 255,
      validator: validator({
        rules: 'utf8Len:[1, 255]',
      }),
    },
    noTable: true,
  }, {
    id: 'enabled',
    text: _('Status'),
    options: checkboxOptions,
    defaultValue: '1',
    formProps: {
      type: 'checkbox',
      value: '1',
    },
  }, {
    id: 'hiddenSsid',
    text: _('Hide SSID'),
    options: [
      {
        value: '1',
        label: _('YES'),
        render() {
          return (
            <span
              style={{
                color: 'red',
              }}
            >
              {_('YES')}
            </span>
          );
        },
      }, {
        value: '0',
        label: _('NO'),
        render() {
          return (
            <span
              style={{
                color: 'green',
              }}
            >
              {_('NO')}
            </span>
          );
        },
      },
    ],
    defaultValue: '0',
    formProps: {
      type: 'checkbox',
      value: '1',
    },
  }, {
    id: 'ssidisolate',
    text: _('SSID Isolation'),
    defaultValue: '0',
    options: checkboxOptions,
    formProps: {
      type: 'checkbox',
      value: '1',
    },
  }, {
    id: 'maxBssUsers',
    text: _('Max Clients'),
    defaultValue: 32,
    formProps: {
      type: 'number',
      min: 1,
      max: 64,
    },
  }, {
    id: 'mandatorydomain',
    text: _('AAA Policy'),
    defaultValue: '',
    noTable: true,
    formProps: {
      type: 'select',
      options: [],
    },
  }, {
    id: 'storeForwardPattern',
    options: storeForwardOption,
    text: _('Forwarding Mode'),
    defaultValue: 'local',
    formProps: {
      type: 'select',
    },
  }, {
    id: 'upstream/downstream',
    text: _('UP/Down Traffic'),
    transform(val, item) {
      const upRate = flowRateFilter.transform(item.get('upstream'));
      const downRate = flowRateFilter.transform(item.get('downstream'));

      return `${upRate} / ${downRate}`;
    },
    noForm: true,
  }, {
    id: 'loadBalanceType',
    text: _('Traffic Control'),
    defaultValue: '0',
    options: loadBalanceTypeArr,
    formProps: {
      type: 'switch',
    },
  }, {
    id: 'upstream',
    defaultValue: '64',
    text: msg.upSpeed,
    noTable: true,
    formProps: {
      type: 'number',
      min: 1,
      max: 102400,
      required: true,
      showPrecondition($$data) {
        const curRepaet = $$data.get('loadBalanceType');

        return curRepaet !== '0';
      },
      help: 'KB/S',
    },
  }, {
    id: 'downstream',
    defaultValue: '256',
    text: msg.downSpeed,
    noTable: true,
    formProps: {
      type: 'number',
      min: 1,
      max: 102400,
      required: true,
      showPrecondition($$data) {
        const curRepaet = $$data.get('loadBalanceType');

        return curRepaet !== '0';
      },
      help: 'KB/S',
    },
  }, {
    id: 'encryption',
    text: _('Encryption'),
    defaultValue: 'psk-mixed',
    formProps: {
      type: 'switch',
      options: encryptionOptions,
    },
  }, {
    id: 'password',
    text: _('Password'),
    defaultValue: '',
    noTable: true,
    formProps: {
      type: 'password',
      required: true,
      maxLength: '64',
      validator: validator({
        rules: 'remarkTxt:["\'\\\\"]|len:[8, 256]',
      }),
      showPrecondition($$data) {
        const curRepaet = $$data.get('encryption');

        return curRepaet === 'psk-mixed';
      },
    },
  },
]);

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  group: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  groupid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  changeScreenActionQuery: PropTypes.func,
  updateCurEditListItem: PropTypes.func,
  fetch: PropTypes.func,
  reciveScreenData: PropTypes.func,
  createModal: PropTypes.func,
  onListAction: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);

    this.getCurrData = this.getCurrData.bind(this);
    this.onUpdateSettings = this.onUpdateSettings.bind(this);

    utils.binds(this, [
      'onSave',
      'fetchCopyGroupSsids',
      'renderActionBar',
      'onOpenCopySsidModal',
      'onSelectCopyFromGroup',
      'renderUpdateSsid',
      'renderCopySsid',
      'onSelectCopySsid',
      'fetchMandatoryDomainList',
    ]);
    this.state = {
      updateListOptions: false,
    };
    this.listOptions = listOptions;
  }
  componentDidMount() {
    this.props.changeScreenActionQuery({
      groupid: this.props.groupid,
    });
    this.fetchMandatoryDomainList();
  }
  onSave(type) {
    const { store } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const $$copyGroupSsids = $$myScreenStore.getIn(['data', 'copyGroupSsids']);

    if (type === 'copy') {
      let $$copySelectedList = $$myScreenStore.getIn(['actionQuery', 'copySelectedList']);

      $$copySelectedList = $$copySelectedList.map(
        index => $$copyGroupSsids.getIn(['list', index, 'ssid']),
      );

      // 没有选择要拷贝的 Ssids
      if ($$copySelectedList.size < 1) {
        this.props.createModal({
          type: 'alert',
          text: _('Please select ssid'),
        });
      } else {
        this.props.changeScreenActionQuery({
          copySelectedList: $$copySelectedList.toJS(),
        });
        this.props.onListAction();
      }
    }
  }
  onUpdateSettings(name) {
    return (item) => {
      const data = {};

      data[name] = item.value;
      this.props.updateCurEditListItem(data);
    };
  }
  onOpenCopySsidModal() {
    const { store } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const copyFromGroupId = $$myScreenStore.getIn(['actionQuery', 'copyFromGroupId']);

    this.props.changeScreenActionQuery({
      action: 'copy',
      myTitle: _('Copy Form Other Group'),
      copySelectedList: fromJS([]),
    });
    this.fetchCopyGroupSsids(copyFromGroupId);
  }

  onSelectCopyFromGroup(groupId, e) {
    e.preventDefault();
    this.props.changeScreenActionQuery({
      copyFromGroupId: groupId,
      copySelectedList: fromJS([]),
    });
    this.fetchCopyGroupSsids(groupId);
  }
  onSelectCopySsid(data) {
    const { store } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    let $$copySelectedList = $$myScreenStore.getIn(['actionQuery', 'copySelectedList']);
    let $$copyGroupSsid = $$myScreenStore.getIn(['data', 'copyGroupSsids']);

    $$copyGroupSsid = $$copyGroupSsid.update('list',
      ($$list) => {
        const ret = immutableUtils.selectList(
          $$list,
          data,
          $$copySelectedList,
        );
        $$copySelectedList = ret.selectedList;

        return ret.$$list;
      },
    );

    this.props.reciveScreenData({
      copyGroupSsids: $$copyGroupSsid,
    }, this.props.route.id);
    this.props.changeScreenActionQuery({
      copySelectedList: $$copySelectedList,
    });
  }

  getCurrData(name) {
    return this.props.store.getIn([this.props.route.id, 'curListItem', name]);
  }

  fetchCopyGroupSsids(groupid) {
    const fetchUrl = this.props.route.fetchUrl || this.props.route.formUrl;
    const queryData = {
      groupid,
    };

    if (groupid === -100) {
      queryData.filterGroupid = this.props.groupid;
    }

    this.props.fetch(fetchUrl, queryData)
      .then(
        (json) => {
          if (json && json.state && json.state.code === 2000) {
            this.props.reciveScreenData({
              copyGroupSsids: json.data,
            }, this.props.route.id);
          }
        },
      );
  }
  fetchMandatoryDomainList() {
    this.props.fetch('goform/network/Aaa', {
      page: 1,
      size: 500,
    })
      .then((json) => {
        let options = [];

        if (json && json.data && json.data.list) {
          options = json.data.list.map(
            item => ({
              value: item.domain_name,
              label: item.domain_name,
            }),
          );
        }

        this.setState({
          updateListOptions: !this.state.updateListOptions,
        });
        this.listOptions = listOptions.mergeIn(
          [6, 'formProps'], {
            options,
          },
        );
      },
    );
  }

  renderActionBar() {
    return (
      <Button
        text={_('Link From Other Group')}
        key="cpoyActionButton"
        icon="link"
        theme="primary"
        onClick={() => this.onOpenCopySsidModal()}
      />
    );
  }

  renderCopySsid() {
    const { store, app, route } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const $$group = this.props.group;
    const selectGroupId = $$group.getIn(['selected', 'id']);
    const copyFromGroupId = $$myScreenStore.getIn(['actionQuery', 'copyFromGroupId']);
    const actionQuery = store.getIn([route.id, 'actionQuery']) || Map({});
    const isCopySsid = actionQuery.get('action') === 'copy';

    if (!isCopySsid) {
      return null;
    }

    return (
      <div className="row">
        <div className="o-list cols col-4">
          <h3 className="o-list__header">{_('Group List')}</h3>
          <ul className="m-menu m-menu--open">
            {
              $$group.getIn(['list']).map((item) => {
                const curId = item.get('id');
                let classNames = 'm-menu__link';

                // 不能选择自己组
                if (curId === selectGroupId) {
                  return null;
                }

                if (curId === copyFromGroupId) {
                  classNames = `${classNames} active`;
                }

                return (
                  <li key={curId}>
                    <a
                      className={classNames}
                      onClick={
                        e => this.onSelectCopyFromGroup(curId, e)
                      }
                    >
                      {item.get('groupname')}
                    </a>
                  </li>
                );
              })
            }
          </ul>

        </div>
        <div className="o-list cols col-8">
          <h3 className="o-list__header">{_('Group SSID List')}</h3>
          <Table
            options={[
              {
                id: 'ssid',
                text: _('SSID'),
              }, {
                id: 'hiddenSsid',
                text: _('Hide SSID'),
                options: [
                  {
                    value: '1',
                    label: _('YES'),
                    render() {
                      return (
                        <span
                          style={{
                            color: 'red',
                          }}
                        >
                          {_('YES')}
                        </span>
                      );
                    },
                  }, {
                    value: '0',
                    label: _('NO'),
                    render() {
                      return (
                        <span
                          style={{
                            color: 'green',
                          }}
                        >
                          {_('NO')}
                        </span>
                      );
                    },
                  },
                ],
                defaultValue: '0',
              }, {
                id: 'storeForwardPattern',
                options: storeForwardOption,
                text: _('Forward Pattern'),
                defaultValue: 'local',
              }, {
                id: 'encryption',
                text: _('Encryption'),
                defaultValue: 'psk-mixed',
              },
            ]}
            list={$$myScreenStore.getIn(['data', 'copyGroupSsids', 'list'])}
            psge={$$myScreenStore.getIn(['data', 'copyGroupSsids', 'page'])}
            onRowSelect={this.onSelectCopySsid}
            selectable
          />
          <div className="o-list__footer">
            <SaveButton
              type="button"
              className="fr"
              loading={app.get('saving')}
              onClick={() => this.onSave('copy')}
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { store, route } = this.props;
    const actionQuery = store.getIn([route.id, 'actionQuery']) || Map({});
    const isCopySsid = actionQuery.get('action') === 'copy';
    return (
      <AppScreen
        {...this.props}
        listOptions={this.listOptions}
        listKey="allKeys"
        actionBarChildren={this.renderActionBar()}
        initOption={{
          actionQuery: {
            copyFromGroupId: -100,
          },
        }}
        modalSize={isCopySsid ? 'lg' : 'md'}
        modalChildren={this.renderCopySsid()}
        actionable
        selectable
      />
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    group: state.product.get('group'),
    groupid: state.product.getIn(['group', 'selected', 'id']),
    store: state.screens,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    screenActions,
    productActions,
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions),
)(View);
