import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import * as appActions from 'shared/actions/app';
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
const listOptions = fromJS([
  {
    id: 'ruleType',
    label: _('NAT Rule Type'),
    options: [
      {
        value: '0',
        disabled: true,
        label: _('Static NAT'),
      }, {
        value: 'snat',
        label: _('Source Address'),
      }, {
        value: 'dnat',
        disabled: true,
        label: _('Destination NAT'),
      }, {
        value: 'masquerade',
        disabled: true,
        label: _('Internet NAT'),
      },
    ],
    defaultValue: 'snat',
    formProps: {
      type: 'select',
      label: _('NAT Rule Type'),
      placeholder: _('Please Select ') + _('NAT Rule Type'),
    },

  }, {
    id: 'sourceAddress',
    label: _('Source IP Address'),
    formProps: {
      required: true,
      validator: validator({
        rules: 'ipSegment',
      }),
      help: _('e.g. %s', '192.168.100.12/24'),
    },
  }, {
    id: 'conversionAddress',
    label: _('Translated IP Address'),
    formProps: {
      required: true,
      validator: validator({
        rules: 'ip',
      }),
    },
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
        listTitle={_('NAT Rules')}
        listKey="allKeys"
        settingsFormOptions={commonFormOptions}
        listOptions={listOptions}
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
