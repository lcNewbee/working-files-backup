import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Table from 'shared/components/Table';
import Button from 'shared/components/Button/Button';
import FormGroup from 'shared/components/Form/FormGroup';
import FormInput from 'shared/components/Form/FormInput';
import { fromJS, Map, List } from 'immutable';
import utils from 'shared/utils';
import { actions as sharedActions } from 'shared/containers/settings';
import { actions as appActions } from 'shared/containers/app';
import * as selfActions from './actions';
import reducer from './reducer';

let intervalAction;
const flowRateFilter = utils.filter('flowRate');

const propTypes = {
  selfState: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  app: PropTypes.instanceOf(Map),
  initSettings: PropTypes.func,
  fetchSettings: PropTypes.func,
  route: PropTypes.object,
  product: PropTypes.instanceOf(Map),
  changeCurrRadioConfig: PropTypes.func,
};

const defaultProps = {
};

const vapInterfaceOptions = fromJS([
  {
    id: 'name',
    text: __('Name'),
    transform(val, item) {
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
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '152px',
  }, {
    id: 'txBytes',
    text: __('Tx Data'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return flowRateFilter.transform(val);
    },
    width: '144px',
  }, {
    id: 'rxBytes',
    text: __('Rx Data'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return flowRateFilter.transform(val);
    },
    width: '144px',
  }, {
    id: 'txPackets',
    text: __('Tx Packets'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'rxPackets',
    text: __('Rx Packets'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'txErrorPackets',
    text: __('Tx Errors'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'rxErrorPackets',
    text: __('Rx Errors'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'ccq',
    text: __('CCQ'),
    transform(val) {
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
    this.refreshData = this.refreshData.bind(this);
  }

  componentWillMount() {
    clearInterval(intervalAction);
    this.props.initSettings({
      settingId: this.props.route.id,
      fetchUrl: this.props.route.fetchUrl,
      defaultData: {},
    });
    this.refreshData();
    this.onChangeRadio({ value: '0' });
    intervalAction = setInterval(() => {
      this.refreshData();
    }, 10000);
  }

  componentDidUpdate(prevProps) {
    if (this.props.app.get('refreshAt') !== prevProps.app.get('refreshAt')) {
      clearInterval(intervalAction);
      this.refreshData();
      intervalAction = setInterval(this.refreshData, 10000);
    }
  }

  componentWillUnmount() {
    clearInterval(intervalAction);
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
    this.props.fetchSettings();
  }

  render() {
    const { radioId, radioType } = this.props.selfState.get('currRadioConfig').toJS();
    if (!this.props.store.getIn(['curData', 'radioList'])) return null;
    const { wirelessMode, vapList } = this.props.store.getIn(['curData', 'radioList', radioId]).toJS();
    const vapInterfacesList = (wirelessMode === 'sta') ? [vapList[0]] : vapList;
    console.log('vapInterfacesList', vapInterfacesList);
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

        <div className="o-box__cell clearfix">
          <h3
            className="fl"
            style={{
              paddingTop: '3px',
              marginRight: '15px',
            }}
          >
            {__('Wireless Interfaces')}
          </h3>
          {
            this.props.product.get('deviceRadioList').size > 1 ? (
              <FormInput
                type="switch"
                label={__('Radio Select')}
                minWidth="100px"
                options={this.props.product.get('radioSelectOptions')}
                value={this.props.selfState.getIn(['currRadioConfig', 'radioId'])}
                onChange={(data) => {
                  this.onChangeRadio(data);
                }}
                style={{
                  marginBottom: '15px',
                }}
              />
            ) : null
          }
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
