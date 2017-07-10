import React from 'react';
import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';
import './smsgateway.scss';

let ret;
const listOptions = fromJS([
  {
    id: 'name',
    text: __('Name'),
    formProps: {
      type: 'text',
      required: true,
      maxLength: '129',
      validator: validator({
        rules: 'utf8Len:[1, 128]',
      }),
    },
  }, {
    id: 'url',
    text: __('URL'),
    noTable: true,
    formProps: {
      type: 'text',
      required: true,
      maxLength: '256',
      validator: validator({
        rules: 'utf8Len:[1, 255]',
      }),
    },
  }, {
    id: 'appkey',
    text: __('App Key'),
    formProps: {
      help: __('gwid,accountid,username'),
      maxLength: '129',
      type: 'text',
      required: true,
      validator: validator({
        rules: 'utf8Len:[1, 128]',
      }),
    },
  }, {
    id: 'appsecret',
    text: __('Password'),
    noTable: true,
    formProps: {
      maxLength: '128',
      type: 'password',
      required: true,
      validator: validator({
        rules: 'pwd',
      }),
    },
  },
  {
    id: 'smstemplate',
    text: __('Template ID'),
    formProps: {
      maxLength: '256',
      help: __('ServiceID, Spcode'),
      type: 'text',
      validator: validator({
        rules: 'utf8Len:[1, 255]',
      }),
    },
  }, {
    id: 'smssign',
    text: __('Signature ID'),
    formProps: {
      help: __('srcTermID'),
      type: 'text',
      maxLength: '33',
      validator: validator({
        rules: 'utf8Len:[1, 32]',
      }),
    },
  }, {
    id: 'company',
    text: __('Company Name'),
    formProps: {
      type: 'text',
      maxLength: '33',
      required: true,
      validator: validator({
        rules: 'utf8Len:[1, 32]',
      }),
    },
  }, {
    id: 'count',
    text: __('Used Times'),
    noForm: true,
    formProps: {
      type: 'number',
      required: true,
      min: '0',
      max: '99999',
      defaultValue: '5',
      help: __('Times'),
      validator: validator({
        rules: 'num:[0,99999]',
      }),
    },
  }, {
    id: 'type',
    text: __('Type'),
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '1',
        label: __('iKuai'),
      }, {
        value: '2',
        label: __('Alidayu'),
      }, {
        value: '3',
        label: __('Sucker Ducker'),
      }, {
        value: '4',
        label: __('China Mobile ESMS'),
      }, {
        value: '5',
        label: __('China Unicome OSMS'),
      }, {
        value: '6',
        label: __('China Mobile OpenMas'),
      }, {
        value: '7',
        label: __('Submail'),
      }, {
        value: '8',
        label: __('Carrier Message'),
      }, {
        value: '9',
        label: __('China Telicome SMGP'),
      }, {
        value: '10',
        label: __('Huaxin Message System'),
      }, {
        value: '11',
        label: __('China Telicome ESMS'),
      },
    ],
  }, {
    id: 'state',
    text: __('State'),
    formProps: {
      type: 'select',
      defaultValue: '1',
      required: true,
    },
    options: [
      {
        value: '1',
        label: __('Enable'),
      }, {
        value: '0',
        label: __('Disable'),
      },
    ],
  }, {
    id: 'more',
    text: __('Multi-Terminal Log'),
    formProps: {
      type: 'select',
      defaultValue: '1',
      required: true,
    },
    options: [
      {
        value: '0',
        label: __('Enable'),
      }, {
        value: '1',
        label: __('Disable'),
      },
    ],
  }, {
    id: 'time',
    text: __('Release Time'),
    formProps: {
      type: 'number',
      min: '0',
      max: '10',
      defaultValue: '5',
      help: __('Minutes'),
      validator: validator({
        rules: 'num:[0,10]',
      }),
    },
    render(val) {
      ret = `${val}m`;
      return ret;
    },
  }, {
    id: 'text',
    text: __('Message Content'),
    noTable: true,
    formProps: {
      type: 'textarea',
      required: true,
      maxLength: '257',
      validator: validator({
        rules: 'utf8Len:[1, 256]',
      }),
    },
  },
]);

const queryFormOptions = fromJS([
  {
    id: 'gateway_type',
    type: 'select',
    label: __('Type'),
    options: [
      {
        value: '-100',
        label: __('ALL'),
      },
      {
        value: '1',
        label: __('iKuai'),
      }, {
        value: '2',
        label: __('Alidayu'),
      }, {
        value: '3',
        label: __('Sucker Ducker'),
      }, {
        value: '4',
        label: __('China Mobile ESMS'),
      }, {
        value: '5',
        label: __('China Unicome OSMS'),
      }, {
        value: '6',
        label: __('China Mobile OpenMas'),
      }, {
        value: '7',
        label: __('Submail'),
      }, {
        value: '8',
        label: __('Carrier Message'),
      }, {
        value: '9',
        label: __('China Telicome SMGP'),
      }, {
        value: '10',
        label: __('Huaxin Message System'),
      }, {
        value: '11',
        label: __('China Telicome ESMS'),
      },
    ],
    saveOnChange: true,
  },
]);

const propTypes = {
  changeScreenQuery: PropTypes.func,
};
const defaultProps = {};
export default class View extends React.Component {
  constructor(props) {
    super(props);
    utils.binds(this,
      [
        'onSearch',
        'clearTimeout',
      ],
    );
  }

  componentWillMount() {
    this.props.changeScreenQuery({ gateway_type: '-100' });
  }

  render() {
    return (
      <AppScreen
        {...this.props}
        listOptions={listOptions}
        queryFormOptions={queryFormOptions}
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
