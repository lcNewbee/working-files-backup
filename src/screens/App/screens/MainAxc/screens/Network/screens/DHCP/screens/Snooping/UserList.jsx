import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';

const commonFormOptions = fromJS([
  {
    id: 'enable',
    label: _('Snooping Service'),
    type: 'checkbox',
    text: _('Enable'),
    value: 1,
    saveOnChange: true,
  },
]);
const listOptions = fromJS([
  {
    id: 'mac',
    label: _('Mac Address'),
  }, {
    id: 'ip',
    label: _('IP Address'),
  }, {
    id: 'type',
    label: _('Address Type'),
    options: [
      {
        value: '0',
        label: _('Dynamic'),
      }, {
        value: '1',
        label: _('Static'),
      },
    ],
  }, {
    id: 'port',
    label: _('Port'),
  }, {
    id: 'vlanid',
    label: _('Vlan ID'),
  }, {
    id: 'leaseTime',
    label: _('Lease Time'),
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
        listTitle={_('User List')}
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
