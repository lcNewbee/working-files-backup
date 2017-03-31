import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import { actions as screenActions } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';

const onlinetimeFilter = utils.filter('connectTime');
let ret;
let s;
let subVal;
const listOptions = fromJS([
  {
    id: 'nasIP',
    text: __('NAS IP'),
  }, {
    id: 'ip',
    text: __('Source IP'),
  }, {
    id: 'userIP',
    text: __('User IP'),
  }, {
    id: 'callingStationId',
    text: __('Mac'),
  }, {
    id: 'name',
    text: _('Name'),
  },
  // {
  //   id: 'sessionTime',
  //   text: _('Session Time'),
  //   transform(val) {
  //     return onlinetimeFilter.transform(val / 1000);
  //   },
  // },
  {
    id: 'octets',
    text: __('Available Traffic'),
  }, {
    id: 'clientType',
    text: __('Time out'),
  }, {
    id: 'startDate',
    text: __('Online Date'),
  }, {
    id: 'costTime',
    text: __('Online Time'),
    transform(val) {
      return onlinetimeFilter.transform(val / 1000);
    },
  }, {
    id: 'inS',
    text: __('Up Traffic'),
    transform(val) {
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
    id: 'outS',
    text: __('Down Traffic'),
    transform(val) {
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
    id: 'costOctets',
    text: __('Used Traffic'),
    transform(val) {
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
    id: 'updateDate',
    text: __('Update Date'),
  }, {
    id: 'acctSessionId',
    text: __('Acc ID'),
  }, {
    id: 'state',
    text: __('Acc Type'),
    formProps: {
      type: 'select',
      required: true,
    },
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
  },
]);
const queryFormOptions = fromJS([
  {
    id: 'state',
    type: 'select',
    label: __('Acc Type'),
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
    saveOnChange: true,
  },
]);
const propTypes = {
  route: PropTypes.object,
  save: PropTypes.func,
  substring: PropTypes.func,
};
const defaultProps = {};

export default class OpenPortalBase extends React.Component {
  constructor(props) {
    super(props);

    this.onAction = this.onAction.bind(this);
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
    return (
      <AppScreen
        {...this.props}
        listOptions={listOptions}
        actionable
        selectable
        addable={false}
        editable={false}
        searchable
        queryFormOptions={queryFormOptions}
        searchProps={{
          placeholder: `${__('Name')}/NAS IP`,
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
