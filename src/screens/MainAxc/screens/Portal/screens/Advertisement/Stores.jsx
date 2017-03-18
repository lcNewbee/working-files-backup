import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const listOptions = fromJS([
  {
    id: 'name',
    text: _('Name'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'showInfo',
    text: _('Show Info'),
    noTable: true,
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '0',
        label: _('Hide'),
      }, {
        value: '1',
        label: _('Show'),
      },
    ],
  }, {
    id: 'img',
    text: _('Logo'),
    formProps: {
      type: 'file',
      required: true,
    },
  }, {
    id: 'address',
    text: _('Address'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'phone',
    text: _('Phone'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'creatDate',
    text: _('Create Date'),
    defaultValue: '2018-2-28',
    formProps: {
      type: 'date',
      required: true,
    },
  }, {
    id: 'description',
    text: _('Description'),
    formProps: {
      type: 'textarea',
      required: true,
    },
  }, {
    id: 'userName',
    text: _('User Name'),
    noForm: true,
    defaultValue: 'Admin',
    formProps: {
      type: 'text',
      required: true,
    },
  },
]);

const propTypes = {};
const defaultProps = {};

export default class AdvStores extends React.Component {
  render() {
    return (
      <AppScreen
        {...this.props}
        listOptions={listOptions}
        editFormOption={{
          hasFile: true,
        }}
        actionable
        selectable
      />
    );
  }
}

AdvStores.propTypes = propTypes;
AdvStores.defaultProps = defaultProps;

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
)(AdvStores);
