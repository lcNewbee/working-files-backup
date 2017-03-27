import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import { actions as screenActions } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';

let ret;

const listOptions = fromJS([
  {
    id: 'name',
    text: __('Name'),
    width: '120px',
    formProps: {
      type: 'text',
      required: true,
      maxLength: 129,
      validator: validator({
        rules: 'utf8Len:[1,128]',
      }),
    },
  }, {
    id: 'state',
    text: __('Type'),
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '0',
        label: __('Hour Card'),
      }, {
        value: '1',
        label: __('Day Card'),
      },
      {
        value: '2',
        label: __('Month Card'),
      }, {
        value: '3',
        label: __('Year Card'),
      }, {
        value: '4',
        label: __('Traffic Card'),
      },
    ],
  }, {
    id: 'maclimit',
    text: __('Mac Limit'),
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '0',
        label: __('Closed'),
      }, {
        value: '1',
        label: __('Open'),
      },
    ],
  }, {
    id: 'maclimitcount',
    text: __('Mac Quantity'),
    formProps: {
      type: 'number',
      required: true,
      min: '0',
      max: '999999',
      validator: validator({
        rules: 'num:[0,999999]',
      }),
    },
  }, {
    id: 'autologin',
    text: __('Auto Login'),
    options: [
      {
        value: '0',
        label: __('Closed'),
      }, {
        value: '1',
        label: __('Open'),
      },
    ],
    formProps: {
      type: 'select',
      required: true,

    },
  }, {
    id: 'speed',
    text: __('Speed Limit'),
    formProps: {
      type: 'select',
      required: true,
    },
    defaultValue: '1',
    options: [
      {
        value: '1',
        label: __('1M'),
      },
    ],
  }, {
    id: 'time',
    text: __('Count'),
    formProps: {
      type: 'number',
      required: true,
      min: 1,
      max: 999999,
      validator: validator({
        rules: 'num:[1,999999]',
      }),
    },
    transform(val, data) {
      if (data.get('state') === '0') {
        ret = `${val}h`;
      } else if (data.get('state') === '1') {
        ret = `${val}d`;
      } else if (data.get('state') === '2') {
        ret = `${val}m`;
      } else if (data.get('state') === '3') {
        ret = `${val}y`;
      } else if (data.get('state') === '4') {
        if (val > 1024) {
          ret = `${(val / 1024).toFixed(2)}Gb`;
        } else {
          ret = `${val}Mb`;
        }
      }
      return ret;
    },
  }, {
    id: 'money',
    text: __('Price'),
    formProps: {
      type: 'number',
      required: true,
      min: '0',
      max: '999999999',
      validator: validator({
        rules: 'num:[1,999999]',
      }),
      help: __('$'),
    },
  }, {
    id: 'description',
    text: __('Description'),
    width: '120px',
    options: [],
    formProps: {
      type: 'textarea',
      required: true,
      maxLength: 256,
      validator: validator({
        rules: 'utf8Len:[1,255]',
      }),
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
