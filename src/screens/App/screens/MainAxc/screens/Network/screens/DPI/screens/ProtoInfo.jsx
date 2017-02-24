import React, { PropTypes } from 'react';
import { fromJS, Map, List } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import AppScreen from 'shared/components/Template/AppScreen';
import Select from 'shared/components/Select';
import Table from 'shared/components/Table';
import Modal from 'shared/components/Modal';
import { FormGroup, FormInput } from 'shared/components/Form';
import * as appActions from 'shared/actions/app';
import * as actions from 'shared/actions/screens';

const flowRateFilter = utils.filter('flowRate');
const propTypes = fromJS({
  route: PropTypes.object,
  initScreen: PropTypes.func,
});
const msg = {
  days: _('Days'),
};
const timeTypeSwitchs = fromJS([
  {
    value: '-1',
    label: _('Current'),
  },
  {
    value: '0',
    label: _('Today'),
  },
  {
    value: '1',
    label: _('Yesterday'),
  },
  {
    value: '7',
    label: `7 ${msg.days}`,
  },
  {
    value: '15',
    label: `15 ${msg.days}`,
  },
  {
    value: '30',
    label: `30 ${msg.days}`,
  },
]);

const viewOptions = fromJS([
  { label: '20', value: '20' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
  { label: '150', value: '150' },
]);

const userModalOptions = fromJS([
  {
    id: 'mac',
    text: 'MAC',
  },
  {
    id: 'ip',
    text: 'IP',
  },
  {
    id: 'ethx_name',
    text: _('Ethernet'),
  },
  {
    id: 'osType',
    text: _('OS Type'),
  },
  {
    id: 'traffic',
    text: 'Traffic',
    transform(val) {
      return flowRateFilter.transform(val);
    },
  }, {
    id: 'trafficPercent',
    text: 'Traffic Proportion',
  },
]);

export default class ProtoInfo extends React.Component {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'initOptions',
      'onChangeTimeType',
      'onChangePage',
      'onChangeView',
      'onChangeModalPage',
      'onChangeModalView',
    ]);
    this.state = {
      showModal: false,
      userModalOptions,
    };
  }

  componentWillMount() {
    this.initOptions(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const curScreenId = nextProps.store.get('curScreenId');

    if (this.props.store.getIn([curScreenId, 'data']) !== nextProps.store.getIn([curScreenId, 'data'])) {
      this.initOptions(nextProps);
    }
  }

  onChangeTimeType(data) {
    this.props.changeScreenQuery({ timeType: data.value });
    this.props.fetchScreenData();
  }

  onChangeView(data) {
    this.props.changeScreenQuery({ size: data.value });
    this.props.fetchScreenData();
  }

  onChangeModalView(data) {
    this.props.changeScreenQuery({ modalSize: data.value });
    this.props.fetchScreenData();
  }

  onChangePage(data) {
    this.props.changeScreenQuery({ page: data });
    this.props.fetchScreenData();
  }
  onChangeModalPage(data) {
    this.props.changeScreenQuery({ modalPage: data });
    this.props.fetchScreenData();
  }

  initOptions(props) {
    const { store } = props;
    const curScreenId = store.get('curScreenId');
    const serverData = store.getIn([curScreenId, 'data']);

    this.serverData = serverData;
    // this.flowOption = getFlowOption(serverData, store.getIn([curScreenId, 'query', 'timeType']));
  }

  render() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const listOptions = fromJS([
      {
        id: 'attr_name',
        text: _('Application'),
      }, {
        id: 'userNum',
        text: _('User Number'),
        transform: function (val, item) {
          return (
            <span
              style={{
                width: '100%',
                color: 'blue',
                cursor: 'pointer',
                display: 'inline-block',
              }}
              onClick={() => {
                // 找到traffic在options中的位置，然后改变traffic的text属性
                const optionsIndex = this.state.userModalOptions.findIndex(name => name.get('id') === 'traffic');
                const options = this.state.userModalOptions.setIn([optionsIndex, 'text'], `${item.get('attr_name')} ${_('Traffic')}`);
                this.setState({
                  showModal: true,
                  userModalOptions: options,
                });
                Promise.resolve().then(() => {
                  this.props.changeScreenQuery({
                    modalPage: '1',
                    modalSize: '20',
                    proto: item.get('attr_name'),
                  });
                }).then(() => {
                  this.props.fetchScreenData();
                });
              }}
            >
              {val || '0'}
            </span>
          );
        }.bind(this),
      }, {
        id: 'curRate',
        text: _('Current Rate'),
        transform(val) {
          return `${flowRateFilter.transform(val)}/s`;
        },
      }, {
        id: 'trafficPercent',
        text: _('Proportion'),
      },
    ]);


    return (
      <div>
        <AppScreen
          {...this.props}
          // listOptions={listOptions}
          initOption={{
            isFetchInfinite: true,
            fetchIntervalTime: 5000,
            query: {
              timeType: '0',
              size: '50',
              page: '1',
            },
          }}
          // listTitle={_('Statistics Within 30 Seconds')}
        >
          <div className="t-overview">
            <Modal
              isShow={this.state.showModal}
              title={`${_('Clients List')}`}
              cancelButton={false}
              draggable
              size="lg"
              onOk={() => {
                this.setState({
                  showModal: false,
                });
              }}
              onClose={() => {
                this.setState({
                  showModal: false,
                });
              }}
            >
              <div className="t-overview">
                <div className="element t-overview__section-header">
                  <span
                    style={{
                      marginRight: '5px',
                      fontWeight: 'bold',
                    }}
                  >
                    {_('View')}
                  </span>
                  <FormInput
                    label={_('View')}
                    options={viewOptions.toJS()}
                    type="select"
                    value={store.getIn([curScreenId, 'query', 'modalSize'])}
                    onChange={this.onChangeModalView}
                  />
                </div>
                <div className="t-overview__section">
                  <Table
                    options={this.state.userModalOptions}
                    list={store.getIn([curScreenId, 'data', 'protoClientList'])}
                    className="table"
                    page={store.getIn([curScreenId, 'data', 'clientPage'])}
                    onPageChange={this.onChangeModalPage}
                  />
                </div>
              </div>
            </Modal>
            <div className="element t-overview__section-header">
              <h3>
                <span
                  style={{
                    marginRight: '10px',
                  }}
                >
                  {_('Time')}
                </span>
                <Select
                  options={timeTypeSwitchs.toJS()}
                  value={store.getIn([curScreenId, 'query', 'timeType'])}
                  onChange={this.onChangeTimeType}
                  clearable={false}
                />
                <FormGroup
                  type="select"
                  className="fr"
                  label={_('View')}
                  options={viewOptions.toJS()}
                  value={store.getIn([curScreenId, 'query', 'size'])}
                  onChange={this.onChangeView}
                />
              </h3>
            </div>
            <div className="t-overview__section">
              <Table
                className="table"
                options={listOptions}
                list={store.getIn([curScreenId, 'data', 'list'])}
                page={store.getIn([curScreenId, 'data', 'page'])}
                onPageChange={this.onChangePage}
              />
            </div>
          </div>
        </AppScreen>
      </div>
    );
  }
}

ProtoInfo.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.screens,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    actions,
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProtoInfo);
