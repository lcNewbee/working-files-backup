import React from 'react'; import PropTypes from 'prop-types';
import { fromJS, Map, List } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';

import Select from 'shared/components/Select';
import Table from 'shared/components/Table';
import Modal from 'shared/components/Modal';
import { FormGroup, FormInput } from 'shared/components/Form';
import { actions as appActions } from 'shared/containers/app';
import { actions, AppScreen } from 'shared/containers/appScreen';

const flowRateFilter = utils.filter('flowRate');
const propTypes = {
  route: PropTypes.object,
  initScreen: PropTypes.func,
  store: PropTypes.object,
  changeScreenQuery: PropTypes.func,
  fetchScreenData: PropTypes.func,
};
const msg = {
  days: __('Days'),
};
const timeTypeSwitchs = fromJS([
  {
    value: '-1',
    label: __('Current'),
  },
  {
    value: '0',
    label: __('Today'),
  },
  {
    value: '1',
    label: __('Yesterday'),
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
    text: __('MAC'),
  }, {
    id: 'ip',
    text: __('IP'),
  },
  // {
  //   id: 'osType',
  //   text: __('OS Type'),
  //   render(val) {
  //     if (val === '' || val === undefined) {
  //       return '--';
  //     }
  //     return val;
  //   },
  // },
  {
    id: 'curRate',
    text: __('Current Rate'),
    render(val) {
      return `${flowRateFilter.transform(val)}/s`;
    },
  }, {
    id: 'trafficPercent',
    text: __('Proportion'),
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
      // userModalOptions,
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
        text: __('Application'),
      }, {
        id: 'userNum',
        text: __('User Number'),
        render: (val, item) => (
          <span
            className="link-text"
            title={__('Click for details')}
            onClick={() => {
              // 找到traffic在options中的位置，然后改变traffic的text属性
              // const optionsIndex = this.state.userModalOptions.findIndex(name => name.get('id') === 'traffic');
              // const options = this.state.userModalOptions.setIn([optionsIndex, 'text'], `${item.get('attr_name')} ${__('Traffic')}`);
              this.setState({
                showModal: true,
                  // userModalOptions: options,
              });
              Promise.resolve().then(() => {
                this.props.changeScreenQuery({
                  modalPage: 1,
                  modalSize: 20,
                  proto: item.get('attr_name'),
                });
              }).then(() => {
                this.props.fetchScreenData();
              });
            }}
          >
            {val || '0'}
          </span>
          ),
      }, {
        id: 'curRate',
        text: __('Current Rate'),
        render(val) {
          return `${flowRateFilter.transform(val)}/s`;
        },
      }, {
        id: 'trafficPercent',
        text: __('Proportion'),
      },
    ]);


    return (
      <div>
        <AppScreen
          {...this.props}
          // listOptions={listOptions}
          initOption={{
            isFetchInfinite: true,
            fetchIntervalTime: 10000,
            query: {
              timeType: '0',
              size: 50,
              page: 1,
            },
          }}
          // listTitle={__('Statistics Within 30 Seconds')}
        >
          <div className="t-overview">
            <div className="element t-overview__section-header">
              <h3>
                <span
                  style={{
                    marginRight: '10px',
                  }}
                >
                  {__('Time')}
                </span>
                <Select
                  options={timeTypeSwitchs.toJS()}
                  value={store.getIn([curScreenId, 'query', 'timeType'])}
                  onChange={this.onChangeTimeType}
                  clearable={false}
                  style={{
                    width: '180px',
                  }}
                />
              </h3>
            </div>
            <div className="t-overview__section">
              <Table
                className="table"
                options={listOptions}
                list={store.getIn([curScreenId, 'data', 'list'])}
                page={store.getIn([curScreenId, 'data', 'page'])}
                pageQuery={{
                  size: store.getIn([curScreenId, 'query', 'size']),
                }}
                onPageChange={this.onChangePage}
                onPageSizeChange={this.onChangeView}
              />
            </div>
          </div>
          <Modal
            isShow={this.state.showModal}
            title={`${__('Clients List')}`}
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
            <Table
              options={userModalOptions}
              list={store.getIn([curScreenId, 'data', 'protoClientList'])}
              className="table"
              page={store.getIn([curScreenId, 'data', 'clientPage'])}
              pageQuery={{
                size: store.getIn([curScreenId, 'query', 'modalSize']),
              }}
              onPageChange={this.onChangeModalPage}
              onPageSizeChange={this.onChangeModalView}
            />
          </Modal>
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
