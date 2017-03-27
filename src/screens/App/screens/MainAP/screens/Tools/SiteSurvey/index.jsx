import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  Button, FormInput, Table, FormGroup,
} from 'shared/components';
import { actions as appActions } from 'shared/containers/app';
import { actions as sharedActions } from 'shared/containers/settings';
import * as selfActions from './actions';
import selfReducer from './reducer';

const propTypes = {
  store: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  save: PropTypes.func,
  initSettings: PropTypes.func,
  selfState: PropTypes.instanceOf(Map),
  product: PropTypes.instanceOf(Map),
  changeCurrRadioConfig: PropTypes.func,
  updateItemSettings: PropTypes.func,

  reqeustFetchSettings: PropTypes.func,
  changeShowTableStatus: PropTypes.func,
  leaveSettingsScreen: PropTypes.func,
  reciveFetchSettings: PropTypes.func,
  fetchSettings: PropTypes.func,
  fetch: PropTypes.func,
};

const defaultProps = {};

const siteScanResultOptions = fromJS([
  {
    id: 'mac',
    text: __('MAC'),
  },
  {
    id: 'ssid',
    text: __('SSID'),
  },
  {
    id: 'security',
    text: __('Security'),
    transform(val) {
      return val.get('mode');
    },
  },
  {
    id: 'signal',
    text: __('Signal,dBm'),
  },
  {
    id: 'noise',
    text: __('Noise,dBm'),
  },
  {
    id: 'protocol',
    text: __('Protocol'),
  },
  {
    id: 'frequency',
    text: __('Channel'),
  },
  {
    id: 'channelWidth',
    text: __('Channel Width'),
  },
]);

export default class SiteSurvey extends React.Component {

  constructor(props) {
    super(props);
    this.onScanBtnClick = this.onScanBtnClick.bind(this);
    this.onChangeRadio = this.onChangeRadio.bind(this);
  }

  componentWillMount() {
    this.props.initSettings({
      settingId: this.props.route.id,
      fetchUrl: this.props.route.fetchUrl,
      defaultData: {
      },
    });
    this.onChangeRadio({ value: '0' });
    this.props.changeShowTableStatus(false);
  }
  componentWillUnmount() {
    this.props.changeShowTableStatus(false);
    this.props.leaveSettingsScreen();
  }
  onScanBtnClick() {
    this.props.changeShowTableStatus(false);
    const query = this.props.selfState.get('currRadioConfig').toJS();
    this.props.fetch('goform/get_site_survey', query).then((json) => {
      if (json.state && json.state.code === 2000) {
        this.props.updateItemSettings(fromJS(json.data));
        this.props.changeShowTableStatus(true);
      }
    });
  }
  onChangeRadio(data) { // 注意参数实际是data的value属性，这里表示radio序号
    const radioType = this.props.product.getIn(['deviceRadioList', data.value, 'radioType']);
    const config = fromJS({
      radioId: data.value,
      radioType,
    });
    this.props.changeCurrRadioConfig(config);
  }

  render() {
    const { siteList } = this.props.store.get('curData').toJS();
    // const fetching = this.props.store.getIn([this.props.route.id, 'fetching']);
    return (
      <div>
        <FormInput
          type="plain-text"
          value={__('Notice: Site survey scan may temporary disable wireless link(s)')}
        /> <br /><br />
        <div className="clearfix">
          <div className="fl">
            {
              this.props.product.get('deviceRadioList').size > 1 ? (
                <FormInput
                  type="select"
                  label={__('Radio Select')}
                  minWidth="100px"
                  options={this.props.product.get('radioSelectOptions').toJS()}
                  value={this.props.selfState.getIn(['currRadioConfig', 'radioId'])}
                  onChange={(data) => {
                    this.onChangeRadio(data);
                  }}
                />
              ) : null
            }
          </div>
          <div className="fl">
            <Button
              theme="primary"
              loading={this.props.app.get('fetching')}
              disabled={this.props.app.get('fetching')}
              text={__('Scan')}
              onClick={this.onScanBtnClick}
              style={{
                marginLeft: '10px',
                marginTop: '2px',
              }}
            />
          </div>
        </div>
        <br /><br />
        {
          this.props.selfState.get('showTable') ? (
            <div className="stats-group">
              <div className="stats-group-cell">
                <Table
                  className="table"
                  options={siteScanResultOptions}
                  list={siteList}
                />
              </div>
            </div>
          ) : null
        }
      </div>
    );
  }
}

SiteSurvey.propTypes = propTypes;
SiteSurvey.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    product: state.product,
    store: state.settings,
    selfState: state.sitesurvey,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    utils.extend({}, appActions, sharedActions, selfActions),
    dispatch
  );
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SiteSurvey);

export const sitesurvey = selfReducer;
