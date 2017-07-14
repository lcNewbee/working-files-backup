import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';

import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';

let ret;
let s;
let subVal;
const uptimeFilter = utils.filter('connectTime');
const queryFormOptions = fromJS([
  {
    id: 'state',
    type: 'select',
    label: __('Account Type'),
    options: [
      {
        value: '-100',
        label: __('ALL'),
      }, {
        value: '0',
        label: __('Deactivated'),
      }, {
        value: '1',
        label: __('Free'),
      },
      {
        value: '2',
        label: __('Time-based'),
      }, {
        value: '3',
        label: __('Buy Out'),
      }, {
        value: '4',
        label: __('Traffic'),
      }, {
        value: '-1',
        label: __('Outside User'),
      },
    ],
    saveOnChange: true,
  }, {
    id: 'authType',
    type: 'select',
    label: __('Login Type'),
    options: [
      {
        value: '-100',
        label: __('ALL'),
      }, {
        value: '0',
        label: __('Click-through Login'),
      }, {
        value: '1',
        label: __('User/Password Login'),
      },
      // {
      //   value: '2',
      //   label: __('Radius Login'),
      // }, {
      //   value: '3',
      //   label: __('App Login'),
      // },
      {
        value: '4',
        label: __('SMS Login'),
      }, {
        value: '5',
        label: __('Wechat Login'),
      },
      // {
      //   value: '6',
      //   label: __('Public Platform Login'),
      // }, {
      //   value: '7',
      //   label: __('Visitor Login'),
      // },
      {
        value: '9',
        label: __('Facebook Login'),
      },
    ],
    saveOnChange: true,
  },
]);
const listOptions = fromJS([
  {
    id: 'ip',
    text: __('IP'),
    type: 'text',
    formProps: {
      required: true,
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'mac',
    text: __('MAC'),
    type: 'text',
    formProps: {
      required: true,
    },
  }, {
    id: 'loginName',
    text: __('Login Name'),
    formProps: {
      required: true,
    },
  }, {
    id: 'startDate',
    text: __('Connection Date'),
    formProps: {
      required: true,
    },
  }, {
    id: 'time',
    text: __('Connection Duration'),
    formProps: {
      required: true,
    },
    render(val) {
      if (val < 1) return '0m';
      const timeStr = uptimeFilter.transform(val * 60);
      return timeStr.replace(/0s/, '');
    },
  }, {
    id: 'state',
    text: __('Account Type'),
    options: [
      {
        value: '0',
        label: __('Deactivated'),
      }, {
        value: '1',
        label: __('Free'),
      },
      {
        value: '2',
        label: __('Time-based'),
      }, {
        value: '3',
        label: __('Buy Out'),
      }, {
        value: '4',
        label: __('Traffic'),
      }, {
        value: '-1',
        label: __('Outside User'),
      },
    ],
  }, {
    id: 'ins',
    text: __('Uplink Traffic'),
    formProps: {
      required: true,
    },
    render(val) {
      s = val;
      if (s === undefined) {
        ret = '';
      } else {
        subVal = s.slice(0, s.length - 1);
        if (subVal > 1024) {
          ret = `${(subVal / 1024).toFixed(2)}Gb`;
        } else {
          ret = `${subVal}Mb`;
        }
      }
      return ret;
    },
  }, {
    id: 'outs',
    text: __('Downlink Traffic'),
    formProps: {
      required: true,
    },
    render(val) {
      s = val;
      if (s === undefined) {
        ret = '';
      } else {
        subVal = s.slice(0, s.length - 1);
        if (subVal > 1024) {
          ret = `${(subVal / 1024).toFixed(2)}Gb`;
        } else {
          ret = `${subVal}Mb`;
        }
      }
      return ret;
    },
  }, {
    id: 'octets',
    text: __('Used Traffic'),
    formProps: {
      required: true,
    },
    render(val) {
      s = val;
      if (s === undefined) {
        ret = '';
      } else {
        subVal = s.slice(0, s.length - 1);
        if (subVal > 1024) {
          ret = `${(subVal / 1024).toFixed(2)}Gb`;
        } else {
          ret = `${subVal}Mb`;
        }
      }
      return ret;
    },
  }, {
    id: 'basname',
    text: __('Bas Name'),
    noTable: true,
    formProps: {
      required: true,
    },
  }, {
    id: 'ssid',
    text: __('SSID'),
    noTable: true,
    formProps: {
      required: true,
    },
  }, {
    id: 'apmac',
    text: __('Access Point MAC Address'),
    formProps: {
      required: true,
    },
  }, {
    id: 'type',
    text: __('Login Type'),
    options: [
      {
        value: '0',
        label: __('Click-through Login'),
      }, {
        value: '1',
        label: __('User/Password Login'),
      },
      // {
      //   value: '2',
      //   label: __('Radius Login'),
      // }, {
      //   value: '3',
      //   label: __('App Login'),
      // },
      {
        value: '4',
        label: __('SMS Login'),
      }, {
        value: '5',
        label: __('Wechat Login'),
      },
      // {
      //   value: '6',
      //   label: __('Public Platform Login'),
      // }, {
      //   value: '7',
      //   label: __('Visitor Login'),
      // },
      {
        value: '9',
        label: __('Facebook Login'),
      },
    ],
    formProps: {
      required: true,
    },
  }, {
    id: 'auto',
    text: __('Auto Log'),
    formProps: {
      required: true,
    },
  }, {
    id: 'agent',
    text: __('Client'),
    formProps: {
      required: true,
    },
  }, {
    id: '__actions__',
    text: __('Actions'),
    actions: [
      {
        icon: 'arrow-down',
        actionName: 'delete',
        text: __('Offline'),
      },
    ],
  },
]);

const listActionBarButtons = [
  {
    actionName: 'delete',
    text: __('Batch Offline'),
    icon: 'arrow-down',
  },
];
const propTypes = {
  route: PropTypes.object,
  save: PropTypes.func,
  changeScreenQuery: PropTypes.func,
};
const defaultProps = {};

export default class OpenPortalBase extends React.Component {
  constructor(props) {
    super(props);

    this.onAction = this.onAction.bind(this);
  }

  componentWillMount() {
    this.props.changeScreenQuery({ state: '-100', authType: '-100' });
  }

  onAction(no, type) {
    const query = {
      no,
      type,
    };

    this.props.save(this.props.route.formUrl, query)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
        }
      });
  }

  render() {
    const myActionButtons = listActionBarButtons;
    return (
      <AppScreen
        {...this.props}
        actionBarButtons={myActionButtons}
        listOptions={listOptions}
        queryFormOptions={queryFormOptions}
        actionable
        selectable
        addable={false}
        editable={false}
        deleteable={false}
        searchable
        searchProps={{
          placeholder: `${__('IP/Login name')}`,
        }}
      />
    );
  }
}

OpenPortalBase.propTypes = propTypes;
OpenPortalBase.defaultProps = defaultProps;

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
)(OpenPortalBase);
