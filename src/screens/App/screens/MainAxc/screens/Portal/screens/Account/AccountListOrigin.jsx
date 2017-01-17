import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/utils/lib/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const listOptions = fromJS([
  {
    id: 'loginName',
    text: _('Login Name'),
    formProps: {
      type: 'text',
      required: true,
      maxLength: '32',
    },
  }, {
    id: 'date',
    text: _('Expired Date'),
    noForm: true,
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'time',
    text: _('Left Time'),
    noForm: true,
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'octets',
    text: _('Left Traffic'),
    noForm: true,
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'password',
    text: _('Password'),
    type: 'pwd',
    noTable: true,
    formProps: {
      required: true,
    },
  }, {
    id: 'ex1',
    text: _('Question'),
    noTable: true,
    formProps: {
      type: 'text',
    },
  }, {
    id: 'ex2',
    text: _('Answer'),
    noTable: true,
    type: 'text',
  }, {
    id: 'type',
    type: 'text',
    text: _('Type'),
    options: [
      {
        value: '0',
        label: _('Unavailability'),
      }, {
        value: '1',
        label: _('Timekeeping'),
      }, {
        value: '2',
        label: _('Buy Out'),
      }, {
        value: '3',
        label: _('Traffic'),
      },
    ],
    defaultValue: '0',
    formProps: {
      type: 'select',
      required: true,
      label: _('Type'),
      placeholder: _('Please Select ') + _('Type'),
    },
  }, {
    id: 'maclimit',
    text: _('Mac Limit'),
    options: [
      {
        value: '0',
        label: _('Closed'),
      }, {
        value: '1',
        label: _('Open'),
      },
    ],
    defaultValue: '0',
    formProps: {
      type: 'select',
      required: true,
      label: _('Mac Limit'),
      placeholder: _('Please Select ') + _('Mac Limit'),
    },
  }, {
    id: 'maclimitcount',
    text: _('Mac Quantity'),
    formProps: {
      type: 'num',
      min: '0',
      required: true,
    },
  }, {
    id: 'autologin',
    text: _('Auto Login'),
    options: [
      {
        value: '0',
        label: _('Closed'),
      }, {
        value: '1',
        label: _('Open'),
      },
    ],
    defaultValue: '0',
    formProps: {
      type: 'select',
      required: true,
      label: _('Auto Login'),
      placeholder: _('Auto Login') + _('Auto Login'),
    },
  }, {
    id: 'speed',
    text: _('Speed Limit'),
    options: [
      {
        value: '0',
        label: _('1M'),
      },
    ],
    defaultValue: '0',
    formProps: {
      type: 'select',
      required: true,
      label: _('Speed Limit'),
      placeholder: _('Please Select ') + _('Speed Limit'),
    },
  }, {
    id: 'ex4',
    text: _('Last Unbind Month'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'ex3',
    text: _('Unbind Times'),
    formProps: {
      type: 'num',
      min: '0',
      required: true,
    },
  }, {
    id: 'name',
    text: _('Name'),
    noTable: true,
    formProps: {
      type: 'text',
      maxLength: '32',
    },
  }, {
    id: 'gender',
    text: _('Gender'),
    noTable: true,
    options: [
      {
        value: '0',
        label: _('Male'),
      }, {
        value: '1',
        label: _('Female'),
      },
    ],
    defaultValue: '0',
    formProps: {
      type: 'select',
      label: _('Gender'),
      placeholder: _('Please Select ') + _('Gender'),
    },
  }, {
    id: 'idnumber',
    text: _('ID No.'),
    noTable: true,
    formProps: {
      type: 'num',
    },
  }, {
    id: 'phoneNumber',
    text: _('Phone'),
    noTable: true,
    formProps: {
      type: 'num',
    },
  }, {
    id: 'address',
    text: _('Address'),
    noTable: true,
    formProps: {
      type: 'text',
    },
  }, {
    id: 'email',
    text: _('Email'),
    noTable: true,
    formProps: {
      type: 'text',
      validator: validator({
        rules: 'email',
      }),
    },
  }, {
    id: 'description',
    text: _('Detail Information'),
    noTable: true,
    formProps: {
      type: 'text',
    },
  }, {
    id: 'ex5',
    text: _('ex5'),
    noTable: true,
    noForm: true,
  }, {
    id: 'ex6',
    text: _('ex6'),
    noTable: true,
    noForm: true,
  }, {
    id: 'ex7',
    text: _('ex7'),
    noTable: true,
    noForm: true,
  }, {
    id: 'ex8',
    text: _('ex8'),
    noTable: true,
    noForm: true,
  }, {
    id: 'ex9',
    text: _('ex9'),
    noTable: true,
    noForm: true,
  }, {
    id: 'ex10',
    text: _('ex10'),
    noTable: true,
    noForm: true,
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
