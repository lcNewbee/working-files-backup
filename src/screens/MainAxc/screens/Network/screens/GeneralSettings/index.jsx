import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import validator from 'shared/validator';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormContainer } from 'shared/components';
import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreenSettings, AppScreenList } from 'shared/containers/appScreen';

// 还有ipv6的IP和网关之间的组合验证没有做，暂时不清楚规则

const settingsFormOptions = fromJS([
  {
    id: 'deviceName',
    type: 'text',
    fieldset: 'generalsettings',
    label: __('Device Name'),
  },
  {
    id: 'ipv6Enable',
    type: 'checkbox',
    fieldset: 'generalsettings',
    label: __('IPv6 Enable'),
  },
  /** *****IPv4 settings********** */
  {
    id: 'ipv4Ip',
    type: 'text',
    fieldset: 'ipv4settings',
    required: true,
    fieldsetOption: {
      className: 'fl',
    },
    label: __('IP'),
    legend: __('IPv4 Management Interface'),
    validator: validator({
      rules: 'ip',
    }),
  },
  {
    id: 'ipv4Mask',
    type: 'text',
    required: true,
    fieldset: 'ipv4settings',
    label: __('Subnet Mask'),
    disabled: item => item.get('ipv4Type') === 'dhcp',
    validator: validator({
      rules: 'mask',
    }),
  },
  {
    id: 'ipv4Vlan',
    type: 'number',
    required: true,
    fieldset: 'ipv4settings',
    label: __('Access VLAN'),
    validator: validator({
      rules: 'num:[1,4094]',
    }),
  },
  /** ***IPv6 settings********* */
  {
    id: 'ipv6Ip',
    type: 'text',
    fieldset: 'ipv6settings',
    fieldsetOption: {
      className: 'fl',
    },
    label: __('IP'),
    disabled: item => item.get('ipv6Type') === 'auto',
    legend: __('IPv6 Management Interface'),
    visible(item) {
      return item.get('ipv6Enable') === '1';
    },
    validator: validator({
      rules: 'ipv6Ip',
    }),
  },
  {
    id: 'ipv6Prefix',
    type: 'text',
    fieldset: 'ipv6settings',
    label: __('Prefix'),
    disabled: item => item.get('ipv6Type') === 'auto',
    visible(item) {
      return item.get('ipv6Enable') === '1';
    },
    validator: validator({
      rules: 'num:[1,128]',
    }),
  },
]).groupBy(item => item.get('fieldset'))
  .toList();

const ipv4ListOptions = fromJS([
  {
    id: 'name',
    type: 'text',
    text: __('Name'),
    formProps: {
      type: 'text',
      required: true,
      validator: validator({
        rules: 'len:[1, 20]',
      }),
    },
  },
  {
    id: 'subnet',
    type: 'text',
    text: __('Subnet'),
    formProps: {
      required: true,
      type: 'text',
      help: `${__('Example')}: 192.168.0.0/24`,
      validator: validator({
        rules: 'ipSegment',
      }),
    },
  },
  {
    id: 'gateway',
    type: 'text',
    text: __('Gateway'),
    formProps: {
      required: true,
      type: 'text',
      validator: validator({
        rules: 'ip',
      }),
    },
  },
]);

const ipv6ListOptions = fromJS([
  {
    id: 'name',
    type: 'text',
    text: __('Name'),
    formProps: {
      required: true,
      type: 'text',
      validator: validator({
        rules: 'len:[1,20]',
      }),
    },
  },
  {
    id: 'prefix',
    type: 'text',
    text: __('Prefix'),
    formProps: {
      required: true,
      type: 'text',
      validator: validator({
        rules: 'num:[1,128]',
      }),
    },
  },
  {
    id: 'gateway',
    type: 'text',
    text: __('Gateway'),
    formProps: {
      required: true,
      type: 'text',
      validator: validator({
        rules: 'ipv6Ip',
      }),
    },
  },
]);

function onIpv4BeforeSync(actionQuery, curListItem) {
  const action = actionQuery.get('action');
  const { gateway, subnet } = curListItem.toJS();
  let msg = '';
  if (action === 'edit' || action === 'add') {
    msg = validator.combine.isWithinSubnet(gateway, subnet);
  }
  return msg;
}

const tableOptions = immutableUtils.getTableOptions(ipv4ListOptions);
const editFormOptions = immutableUtils.getFormOptions(ipv4ListOptions);
const ipv6TableOptions = immutableUtils.getTableOptions(ipv6ListOptions);
const ipv6EditFormOptions = immutableUtils.getFormOptions(ipv6ListOptions);

const propTypes = {
  store: PropTypes.object,
  fetchScreenData: PropTypes.func,
};
const defaultProps = {};


export default class GeneralSettings extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.fetchScreenData();
  }

  render() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const curStore = store.get(curScreenId);

    const ipv6Enable = store.getIn([curScreenId, 'curSettings', 'ipv6Enable']);
    this.tableOptions = immutableUtils.getTableOptions(ipv4ListOptions);
    this.editFormOptions = immutableUtils.getFormOptions(ipv4ListOptions);
    this.ipv6TableOptions = immutableUtils.getTableOptions(ipv6ListOptions);
    this.ipv6EditFormOptions = immutableUtils.getTableOptions(ipv6ListOptions);
    return (
      <div className="t-app t-overview">
        <div
          className="t-overview__section"
          style={{
            paddingTop: '12px',
          }}
        >
          <AppScreenSettings
            {...this.props}

            store={curStore}
            settingsFormOptions={settingsFormOptions}
            hasSettingsSaveButton
          />
        </div>
        <h3 className="element t-overview__header">{__('IPv4 Static Route')}</h3>
        <div style={{ padding: '0 1em' }} className="t-overview__section">
          <AppScreenList
            {...this.props}
            store={curStore}
            tableOptions={tableOptions}
            editFormOptions={editFormOptions}
            onBeforeSync={onIpv4BeforeSync}
            // listTitle={__('IPv4 Static Route')}
            actionable
            addable
            editable
            selectable
            deletable
          />
        </div>
        {
          ipv6Enable === '1' && (
            <div style={{ padding: '10px 0' }}>
              <h3 className="element t-overview__header">{__('IPv6 Static Route')}</h3>
              <div style={{ padding: '0 1em' }} className="t-overview__section">
                <AppScreenList
                  {...this.props}
                  store={curStore}
                  tableOptions={ipv6TableOptions}
                  id="ipv6"
                  // onBeforeSync={this.onBeforeSync}
                  editFormOptions={ipv6EditFormOptions}
                  // listTitle={__('IPv6 Static Route')}
                  actionable
                  selectable
                  deletable
                />
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

GeneralSettings.propTypes = propTypes;
GeneralSettings.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.screens,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    screenActions,
  ), dispatch);
}


// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(GeneralSettings);

