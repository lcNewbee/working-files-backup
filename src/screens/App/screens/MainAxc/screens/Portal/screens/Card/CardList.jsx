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
    text: _('Recharge Name'),
    width: '120px',
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'payType',
    text: _('Recharge Type'),
    width: '120px',
    noForm: true,
    formProps: {
      type: 'select',
      required: true,
      options: [
        {
          value: '0',
          label: _('Unavailability'),
        }, {
          value: '1',
          label: _('Free'),
        },
        {
          value: '2',
          label: _('Timekeeping'),
        }, {
          value: '3',
          label: _('Buy Out'),
        }, {
          value: '4',
          label: _('Traffic'),
        }, {
          value: '-1',
          label: _('Outside User'),
        },
      ],
    },
  }, {
    id: 'categoryType',
    text: _('Category Type'),
    formProps: {
      type: 'select',
      required: true,
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
        }, {
          value: 'null',
          label: _('Error'),
        },
      ],
    },
  }, {
    id: 'maclimit',
    text: _('Mac Limit'),
    noForm: true,
    formProps: {
      type: 'select',
      required: true,
      options: [
        {
          value: '0',
          label: _('Closed'),
        }, {
          value: '1',
          label: _('Open'),
        },
      ],
    },
  }, {
    id: 'maclimitcount',
    text: _('Mac Quantity'),
    formProps: {
      type: 'number',
      required: true,
    },
  }, {
    id: 'autologin',
    text: _('Auto Login'),
    noForm: true,
    noTable: true,
    formProps: {
      type: 'select',
      required: true,
      options: [
        {
          value: '0',
          label: _('Closed'),
        }, {
          value: '1',
          label: _('Open'),
        },
      ],
    },
  }, {
    id: 'speed',
    text: _('Speed Limit'),
    noForm: true,
    formProps: {
      type: 'select',
      required: true,
      options: [
        {
          value: '0',
          label: _('1M'),
        },
      ],
    },
  }, {
    id: 'cdKey',
    text: _('CD Key'),
    noForm: true,
    formProps: {
      type: 'number',
      required: true,
    },
  },
  {
    id: 'paytime',
    text: _('Count'),
    noForm: true,
    formProps: {
      type: 'number',
      required: true,
    },
  }, {
    id: 'state',
    text: _('State'),
    noForm: true,
    formProps: {
      type: 'select',
      required: true,
      options: [
        {
          value: '-1',
          label: _('Unpayed'),
        }, {
          value: '0',
          label: _('New Card'),
        }, {
          value: '1',
          label: _('Sold'),
        }, {
          value: '0',
          label: _('Active'),
        },
      ],
    },
  }, {
    id: 'accountName',
    text: _('Recharge User'),
    noForm: true,
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'buyDate',
    text: _('Order Date'),
    noForm: true,
    width: '120px',
    options: [],
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'payDate',
    text: _('Recharge Date'),
    noForm: true,
    width: '120px',
    options: [],
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'money',
    text: _('Price'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'decsription',
    noTable: true,
    text: _('Description'),
    formProps: {
      type: 'textarea',
      required: true,
    },
  }, {
    id: '__actions__',
    noForm: true,
    text: _('Actions'),
    transform(val, $$item) {
      return (
        <span>
          <a href={`index.html#/main/portal/message/sendmessage/${$$item.get('name')}`} className="tablelink">{_('Send to Users')}</a>
        </span>
      );
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
        editable={false}
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
