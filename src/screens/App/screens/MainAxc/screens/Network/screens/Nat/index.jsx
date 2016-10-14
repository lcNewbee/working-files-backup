import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  ListInfo,
} from 'shared/components';
import * as appActions from 'shared/actions/app';
import * as actions from 'shared/actions/settings';
import * as screenActions from 'shared/actions/screens';

const commonFormOptions = fromJS([
  {
    id: 'enable',
    label: _('NAT Service'),
    type: 'checkbox',
    text: _('Enable'),
    value: 1,
    saveOnChange: true,
  },
]);
const screenOptions = fromJS([
  {
    id: 'ruleType',
    label: _('NAT Rule Type'),
    options: [
      {
        value: '0',
        label: _('Static Address Transform'),
      }, {
        value: 'snat',
        label: _('Source Address Transform'),
      }, {
        value: 'dnat',
        label: _('Target Address Transform'),
      }, {
        value: 'masquerade',
        label: _('Public IP Transparent Transmission'),
      },
    ],
    formProps: {
      type: 'select',
      label: _('NAT Rule Type'),
      placeholder: _('Please Select ') + _('NAT Rule Type'),
    },

  }, {
    id: 'sourceAddress',
    label: _('Source Address'),
  }, {
    id: 'conversionAddress',
    label: _('Conversion Address'),
  },
]);

const formOptions = immutableUtils.getFormOptions(screenOptions);
const tableOptions = immutableUtils.getTableOptions(screenOptions);
const defaultEditData = immutableUtils.getDefaultData(screenOptions);
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
      <ListInfo
        {...this.props}
        listTitle={_('NAT Rules List')}
        listKey="allKeys"
        settingsFormOption={commonFormOptions}
        tableOptions={tableOptions}
        editFormOptions={formOptions}
        defaultEditData={defaultEditData}
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
    actions,
    screenActions
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(View);
