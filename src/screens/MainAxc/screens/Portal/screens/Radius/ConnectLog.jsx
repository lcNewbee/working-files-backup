import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';

import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';

const onlinetimeFilter = utils.filter('connectTime');
const flowFilter = utils.filter('flowRate');
const listOptions = fromJS([
  {
    id: 'nasip',
    text: __('Nas IP'),
    type: 'text',
    formProps: {
      required: true,
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'sourceip',
    text: __('Source IP'),
    type: 'text',
    formProps: {
      required: true,
    },
  }, {
    id: 'userip',
    text: __('User IP'),
    formProps: {
      required: true,
    },
  }, {
    id: 'callingstationid',
    text: __('Mac'),
    formProps: {
      required: true,
    },
  }, {
    id: 'name',
    text: __('Login Name'),
    formProps: {
      required: true,
    },
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
  }, {
    id: 'startDate',
    text: __('Online Date'),
    type: 'text',
  }, {
    id: 'endDate',
    text: __('Offline Date'),
    type: 'text',
    required: true,
  }, {
    id: 'time',
    text: __('Online Time'),
    formProps: {
      required: true,
    },
    render(val) {
      return onlinetimeFilter.transform(val / 1000);
    },
  }, {
    id: 'ins',
    text: __('Up Traffic'),
    formProps: {
      required: true,
    },
    render(val) {
      return `${flowFilter.transform(val)}`;
    },
  }, {
    id: 'outs',
    text: __('Down Traffic'),
    formProps: {
      required: true,
    },
    render(val) {
      return `${flowFilter.transform(val)}`;
    },
  }, {
    id: 'octets',
    text: __('Used Traffic'),
    formProps: {
      required: true,
    },
    render(val) {
      return `${flowFilter.transform(val)}`;
    },
  }, {
    id: 'acctsessionid',
    text: __('Acc ID'),
    noTable: true,
    formProps: {
      required: true,
    },
  }, {
    id: 'ex1',
    text: __('NAS Type'),
    noTable: true,
    formProps: {
      required: true,
    },
  }, {
    id: 'ex2',
    text: __('Reason'),
    formProps: {
      required: true,
    },
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
        queryFormOptions={queryFormOptions}
        searchable
        searchProps={{
          placeholder: `${__('Login Name')}/NAS IP`,
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
