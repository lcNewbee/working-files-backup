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
const flowFilter = utils.filter('flowRate');
const queryFormOptions = fromJS([
  {
    id: 'state',
    type: 'select',
    label: __('Acc Type'),
    options: [
      {
        value: '-1',
        label: __('ALL'),
      }, {
        value: '0',
        label: __('Unavailability'),
      }, {
        value: '1',
        label: __('Free of Charge'),
      },
      {
        value: '2',
        label: __('Timekeeping'),
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
    label: __('Authentication Types'),
    options: [
      {
        value: '-1',
        label: __('ALL'),
      }, {
        value: '0',
        label: __('One Key Authentication'),
      }, {
        value: '1',
        label: __('Access User Authentication'),
      }, {
        value: '2',
        label: __('Radius Authentication'),
      }, {
        value: '3',
        label: __('App Authentication'),
      }, {
        value: '4',
        label: __('Messages Authentication'),
      }, {
        value: '5',
        label: __('Wechat Authentication'),
      }, {
        value: '6',
        label: __('Public Platform Authentication'),
      }, {
        value: '7',
        label: __('Visitor Authentication'),
      }, {
        value: '9',
        label: __('Facebook Authentication'),
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
      return uptimeFilter.transform(val * 60);
    },
  }, {
    id: 'state',
    text: __('Acc Type'),
    options: [
      {
        value: '0',
        label: __('Unavailability'),
      }, {
        value: '1',
        label: __('Free of Charge'),
      },
      {
        value: '2',
        label: __('Timekeeping'),
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
    text: __('Authetication Type'),
    options: [
      {
        value: '0',
        label: __('One Key Authentication'),
      }, {
        value: '1',
        label: __('Access User Authentication'),
      }, {
        value: '2',
        label: __('Radius Authentication'),
      }, {
        value: '3',
        label: __('App Authentication'),
      }, {
        value: '4',
        label: __('Messages Authentication'),
      }, {
        value: '5',
        label: __('Wechat Authentication'),
      }, {
        value: '6',
        label: __('Public Platform Authentication'),
      }, {
        value: '7',
        label: __('Visitor Authentication'),
      }, {
        value: '9',
        label: __('Facebook Authentication'),
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
    this.props.changeScreenQuery({ state: '-1', authType: '-1' });
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
          placeholder: `${__('IP')}`,
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
