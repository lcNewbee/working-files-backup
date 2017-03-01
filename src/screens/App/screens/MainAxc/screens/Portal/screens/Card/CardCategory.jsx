import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const listOptions = fromJS([
  {
    id: 'name',
    text: _('Name'),
    width: '120px',
    formProps: {
      type: 'text',
      required: true,
      maxLength: 32,
      validator: validator({
        rules: 'utf8Len:[1,31]',
      }),
    },
  }, {
    id: 'state',
    text: _('Type'),
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '0',
        label: _('Hour Card'),
      }, {
        value: '1',
        label: _('Day Card'),
      },
      {
        value: '2',
        label: _('Month Card'),
      }, {
        value: '3',
        label: _('Year Card'),
      }, {
        value: '4',
        label: _('Traffic Card'),
      },
    ],
  }, {
    id: 'maclimit',
    text: _('Mac Limit'),
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '0',
        label: _('Closed'),
      }, {
        value: '1',
        label: _('Open'),
      },
    ],
  }, {
    id: 'maclimitcount',
    text: _('Mac Quantity'),
    formProps: {
      type: 'number',
      required: true,
      min: 0,
      validator: validator({
        rules: 'num[0,9999]',
      }),
    },
  }, {
    id: 'autologin',
    text: _('Auto Login'),
    noTable: true,
    options: [
      {
        value: '0',
        label: _('Closed'),
      }, {
        value: '1',
        label: _('Open'),
      },
    ],
    formProps: {
      type: 'select',
      required: true,

    },
  }, {
    id: 'speed',
    text: _('Speed Limit'),
    noTable: true,
    noForm: true,
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '1',
        label: _('1M'),
      },
    ],
  }, {
    id: 'time',
    text: _('Count'),
    formProps: {
      type: 'number',
      required: true,
      min: 0,
      validator: validator({
        rules: 'num[0,9999]',
      }),
    },
  }, {
    id: 'money',
    text: _('Price'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'description',
    text: _('Description'),
    width: '120px',
    options: [],
    formProps: {
      type: 'textarea',
      required: true,
    },
  },
]);

const propTypes = {
  store: PropTypes.instanceOf(Map),
};
const defaultProps = {};
export default class View extends React.Component {
  render() {
    return (
      <AppScreen
        {...this.props}
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
