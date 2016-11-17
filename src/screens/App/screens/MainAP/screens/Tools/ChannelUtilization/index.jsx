import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import { Button, FormGroup, Table } from 'shared/components';
import * as appActions from 'shared/actions/app';
import * as sharedActions from 'shared/actions/settings';
import * as selfActions from './actions';
import reducer from './reducer';

const propTypes = {
  app: PropTypes.instanceOf(Map),
  save: PropTypes.func,
  product: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  fetch: PropTypes.func,
  fetchSettings: PropTypes.func,
  initSettings: PropTypes.func,
  selfState: PropTypes.instanceOf(Map),
  changeChannelUtiList: PropTypes.func,
  changeChannelUtiOptions: PropTypes.func,
  changeUtiTableShowStatus: PropTypes.func,
  leaveSettingsScreen: PropTypes.func,
  changeCurrRadioConfig: PropTypes.func,
};

export default class ChannelUtilization extends React.Component {
  constructor(props) {
    super(props);
    this.onRunScanBtnClick = this.onRunScanBtnClick.bind(this);
    this.makeChannelUtiOptionsAndList = this.makeChannelUtiOptionsAndList.bind(this);
    this.getDataAndRenderTable = this.getDataAndRenderTable.bind(this);
    this.onChangeRadio = this.onChangeRadio.bind(this);
  }

  componentWillMount() {
    this.props.initSettings({
      settingId: this.props.route.id,
      fetchUrl: this.props.route.fetchUrl,
    });
    this.onChangeRadio({ value: '0' });
    this.getDataAndRenderTable();
  }

  componentWillUnmount() {
    this.props.leaveSettingsScreen();
  }

  onRunScanBtnClick() {
    this.getDataAndRenderTable();
  }
  onChangeRadio(data) { // 注意参数实际是data的value属性，这里表示radio序号
    const radioType = this.props.product.getIn(['deviceRadioList', data.value, 'radioType']);
    const config = fromJS({
      radioId: data.value,
      radioType,
    });
    this.props.changeCurrRadioConfig(config);
  }

  getDataAndRenderTable() {
    const query = this.props.selfState.get('currRadioConfig').toJS();
    this.props.save('goform/get_chanutil', query).then((json) => {
      if (json.state && json.state.code === 2000) {
        const chutilList = json.data.chutilList;
        const list = this.makeChannelUtiOptionsAndList(chutilList);
        this.props.changeChannelUtiOptions(list.get('channelUtiOptions'));
        this.props.changeChannelUtiList(list.get('channelUtiList'));
      }
    });
  }

  makeChannelUtiOptionsAndList(utilList) {
    let mapList = fromJS({});
    let channelUtiOptions = fromJS([
      {
        id: 'title',
        text: _('Channel'),
        transform() {
          return _('Utilization');
        },
      },
    ]);
    let channelUtiList = fromJS([]);
    utilList.forEach((val) => {
      const name = val.channel;
      const value = val.utilization;
      channelUtiOptions = channelUtiOptions.push(fromJS({
        id: name,
        text: name,
      }));
      mapList = mapList.set(name, value);
    });
    channelUtiList = channelUtiList.push(mapList);

    return fromJS({}).set('channelUtiOptions', channelUtiOptions)
                    .set('channelUtiList', channelUtiList);
  }

  render() {
    // const { channelUtiOptions, channelUtiList } = this.props.selfState.toJS();
    return (
      <div className="stats-group">
        <h3>{_('Channel Utilization Survey')}</h3><br />
        <div className="clearfix">
          <div className="fl">
            {
              this.props.product.get('deviceRadioList').size > 1 ? (
                <FormGroup
                  type="select"
                  label={_('Radio Select')}
                  minWidth="100px"
                  options={this.props.product.get('radioSelectOptions').toJS()}
                  value={this.props.selfState.getIn(['currRadioConfig', 'radioId'])}
                  onChange={(data) => { this.onChangeRadio(data); }}
                  style={{ marginRight: '10px' }}
                />
              ) : null
            }
          </div>
          <div className="fl">
            <Button
              theme="primary"
              text={_('Run Test')}
              loading={this.props.app.get('fetching')}
              disabled={this.props.app.get('fetching')}
              onClick={() => this.onRunScanBtnClick()}
            />
          </div>
        </div><br /><br />
        <div className="stats-group-cell">
          <Table
            className="table"
            title={_('Channel Utilization:')}
            options={this.props.selfState.get('channelUtiOptions')}
            list={this.props.selfState.get('channelUtiList')}
          />
        </div>
      </div>
    );
  }
}

ChannelUtilization.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    app: state.app,
    product: state.product,
    store: state.settings,
    selfState: state.channelutilization,
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
)(ChannelUtilization);

export const channelutilization = reducer;
