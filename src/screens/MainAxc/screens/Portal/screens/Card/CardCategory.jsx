import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';

import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';

const queryFormOptions = fromJS([
  {
    id: 'state',
    type: 'select',
    label: __('Voucher Type'),
    options: [
      {
        value: '-100',
        label: __('ALL'),
      }, {
        value: '0',
        label: __('Hourly Voucher'),
      }, {
        value: '1',
        label: __('Daily Voucher'),
      },
      {
        value: '2',
        label: __('Monthly Voucher'),
      }, {
        value: '3',
        label: __('Yearly Voucher'),
      }, {
        value: '4',
        label: __('Traffic Voucher'),
      },
    ],
    saveOnChange: true,
  },
]);

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
    text: __('Voucher Type'),
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '0',
        label: __('Hourly Voucher'),
      }, {
        value: '1',
        label: __('Daily Voucher'),
      },
      {
        value: '2',
        label: __('Monthly Voucher'),
      }, {
        value: '3',
        label: __('Yearly Voucher'),
      }, {
        value: '4',
        label: __('Traffic Voucher'),
      },
    ],
  }, {
    id: 'maclimit',
    text: __('MAC Limit'),
    noForm: true,
    noTable: true,
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
    text: __('MAC Quantity'),
    noForm: true,
    noTable: true,
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
    noForm: true,
    noTable: true,
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
    text: __('Bandwidth limit'),
    noForm: true,
    noTable: true,
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
    text: __('Voucher Value'),
    formProps: {
      type: 'number',
      required: true,
      min: 1,
      max: 999999,
      validator: validator({
        rules: 'num:[1,999999]',
      }),
      help(val, data) {
        const curState = data.get('state');
        let ret = '';

        switch (curState) {
          case '0':
            ret = __('Hours');
            break;

          case '1':
            ret = __('Days');
            break;

          case '2':
            ret = __('Months');
            break;

          case '3':
            ret = __('Years');
            break;

          case '4':
            if (val > 1024) {
              ret = 'GB';
            } else {
              ret = 'MB';
            }
            break;

          default:
        }

        return ret;
      },
    },


    render(val, data) {
      let ret = '';

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
    text: __('Voucher Cost'),
    formProps: {
      type: 'number',
      required: true,
      min: '0.01',
      max: '999999999',
      validator: validator({
        rules: 'range:[0.01,999999]',
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
  changeScreenQuery: PropTypes.func,
};
const defaultProps = {};
export default class View extends React.Component {

  componentWillMount() {
    this.props.changeScreenQuery({ state: '-100' });
  }

  render() {
    return (
      <AppScreen
        {...this.props}
        queryFormOptions={queryFormOptions}
        listOptions={listOptions}
        noTitle
        actionable
        selectable
        searchable
        searchProps={{
          placeholder: `${__('Name')}`,
        }}
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
