import React from 'react'; import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Table from 'shared/components/Table';
import Button from 'shared/components/Button/Button';
import { fromJS, Map } from 'immutable';
import utils from 'shared/utils';
import { actions as sharedActions } from 'shared/containers/settings';
import { actions as appActions } from 'shared/containers/app';
import * as selfActions from './actions';
import reducer from './reducer';

const flowRateFilter = utils.filter('flowRate');

const propTypes = {
  selfState: PropTypes.instanceOf(Map),
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  initSettings: PropTypes.func,
  fetchSettings: PropTypes.func,
  route: PropTypes.object,
  product: PropTypes.instanceOf(Map),
  changeCurrRadioConfig: PropTypes.func,
  updateItemSettings: PropTypes.func,
  radioIdFromUpper: PropTypes.string,
};

const defaultProps = {
};

const vapInterfaceOptions = fromJS([
  {
    id: 'num',
    text: __('No.'),
  }, {
    id: 'name',
    text: __('Name'),
    render(val, item) {
      const ssid = item.get('ssid');
      if (val === '') {
        return `--(${ssid})`;
      }
      return `${val}(${ssid})`;
    },
    width: '152px',
  }, {
    id: 'mac',
    text: __('MAC'),
    sortable: true,
    render(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '152px',
  }, {
    id: 'txBytes',
    text: __('Tx Data'),
    sortable: true,
    sortFun: (a, b) => {
      const aVal = parseInt(a, 10);
      const bVal = parseInt(b, 10);
      if (aVal - bVal < 0) return 1;
      return -1;
    },
    render(val) {
      if (val === '') {
        return '--';
      }
      return flowRateFilter.transform(val);
    },
    width: '144px',
  }, {
    id: 'rxBytes',
    text: __('Rx Data'),
    sortable: true,
    sortFun: (a, b) => {
      const aVal = parseInt(a, 10);
      const bVal = parseInt(b, 10);
      if (aVal - bVal < 0) return 1;
      return -1;
    },
    render(val) {
      if (val === '') {
        return '--';
      }
      return flowRateFilter.transform(val);
    },
    width: '144px',
  }, {
    id: 'txPackets',
    text: __('Tx Packets'),
    render(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'rxPackets',
    text: __('Rx Packets'),
    render(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'txErrorPackets',
    text: __('Tx Errors'),
    render(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'rxErrorPackets',
    text: __('Rx Errors'),
    render(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'ccq',
    text: __('CCQ'),
    render(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
  },
]);

export default class SsidDetails extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeRadio = this.onChangeRadio.bind(this);
    this.updateBlockStatus = this.updateBlockStatus.bind(this);
    this.refreshData = this.refreshData.bind(this);
  }

  componentWillMount() {
    clearInterval(this.intervalAction);
    clearTimeout(this.timeoutAction);
    this.props.initSettings({
      settingId: this.props.route.id,
      fetchUrl: this.props.route.fetchUrl,
      defaultData: {},
    });
    Promise.resolve().then(() => {
      const id = this.props.radioIdFromUpper;
      this.onChangeRadio({ value: id });
    }).then(() => {
      this.refreshData();
    });
    this.intervalAction = setInterval(() => { this.refreshData(); }, 10000);
  }

  componentDidUpdate(prevProps) {
    if (this.props.app.get('refreshAt') !== prevProps.app.get('refreshAt')) {
      clearInterval(this.intervalAction);
      clearTimeout(this.timeoutAction);
      this.refreshData();
      this.intervalAction = setInterval(this.refreshData, 10000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalAction);
    clearTimeout(this.timeoutAction);
  }

  onChangeRadio(data) { // 注意参数实际是data的value属性，这里表示radio序号
    const radioType = this.props.product.getIn(['deviceRadioList', data.value, 'radioType']);
    const config = fromJS({
      radioId: data.value,
      radioType,
    });
    this.props.changeCurrRadioConfig(config);
  }

  refreshData() {
    this.props.fetchSettings().then(() => {
      const radioNum = this.props.product.get('deviceRadioList').size;
      for (let i = 0; i < radioNum; i++) {
        const staList = this.props.store.getIn(['curData', 'radioList', i, 'staList'])
                          .map((item, j) => item.set('block', false).set('num', j + 1));
        const radioList = this.props.store.getIn(['curData', 'radioList']).setIn([i, 'staList'], staList);
        this.props.updateItemSettings({ radioList });
      }
    });
  }

  updateBlockStatus(item) {
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    const staList = this.props.store.getIn(['curData', 'radioList', radioId, 'staList']);
    const index = staList.indexOf(item);
    const radioList = this.props.store.getIn(['curData', 'radioList'])
                          .setIn([radioId, 'staList', index, 'block'], true);
    this.props.updateItemSettings({ radioList });
  }

  render() {
    const { radioId /* , radioType */ } = this.props.selfState.get('currRadioConfig').toJS();
    if (!this.props.store.getIn(['curData', 'radioList', radioId, 'staList'])) return null;
    const { wirelessMode, vapList } = this.props.store.getIn(['curData', 'radioList', radioId]).toJS();
    const tableList = vapList.map((item, i) => {
      const arr = item;
      arr.num = i + 1;
      return arr;
    });
    const vapInterfacesList = (wirelessMode === 'sta') ? [tableList[0]] : tableList;
    return (
      <div className="o-box">
        <Button
          text={__('Back')}
          theme="primary"
          style={{
            marginBottom: '15px',
          }}
          onClick={() => {
            window.location.href = '#/main/status/overview';
          }}
        />

        <div className="o-box__cell">
          <h3>
            {`${__('Wireless Interfaces')} (${this.props.product.getIn(['radioSelectOptions', radioId, 'label'])})`}
          </h3>
        </div>
        <div className="o-box__cell">
          <Table
            className="table"
            options={vapInterfaceOptions}
            list={vapInterfacesList}
          />
        </div>
      </div>
    );
  }
}

SsidDetails.propTypes = propTypes;
SsidDetails.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    selfState: state.ssiddetails,
    app: state.app,
    store: state.settings,
    product: state.product,
    radioIdFromUpper: state.systemstatus.getIn(['currRadioConfig', 'radioId']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    utils.extend({}, appActions, sharedActions, selfActions),
    dispatch,
  );
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SsidDetails);

export const ssiddetails = reducer;
