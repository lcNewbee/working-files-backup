import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';

import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';

const commonFormOptions = fromJS([
  {
    id: 'enable',
    label: __('Snooping Service'),
    type: 'checkbox',
    text: __('Enable'),
    value: 1,
    saveOnChange: true,
  },
]);
const listOptions = fromJS([
  {
    id: 'mac',
    label: __('Mac Address'),
  }, {
    id: 'ip',
    label: __('IP Address'),
  }, {
    id: 'type',
    label: __('Address Type'),
    options: [
      {
        value: '0',
        label: __('Dynamic'),
      }, {
        value: '1',
        label: __('Static'),
      },
    ],
  }, {
    id: 'port',
    label: __('Port'),
  }, {
    id: 'vlanid',
    label: __('Vlan ID'),
  }, {
    id: 'leaseTime',
    label: __('Lease Time'),
  },
]);

const propTypes = {
  save: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.onSave = this.onSave.bind(this);
  }
  onSave() {
    this.props.save();
  }
  render() {
    return (
      <AppScreen
        {...this.props}
        listTitle={__('User List')}
        settingsFormOptions={commonFormOptions}
        listOptions={listOptions}
        addable={false}
        noTitle
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
)(View);
