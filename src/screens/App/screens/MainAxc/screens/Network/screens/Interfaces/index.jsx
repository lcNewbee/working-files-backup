import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/utils/lib/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

function getPortList() {
  return utils.fetch('goform/network/port')
    .then(json => (
      {
        options: json.data.list.map(
          item => ({
            value: item.name,
            label: item.name,
          }),
        ),
      }
    ),
  );
}
const listOptions = fromJS([
  {
    id: 'name',
    text: _('Port Name'),
    formProps: {
      form: 'port',
      type: 'select',
      required: true,
      loadOptions: getPortList,
      isAsync: true,
    },
  }, {
    id: 'ip',
    text: _('IP Address'),
    formProps: {
      form: 'port',
      type: 'text',
      required: true,
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'mask',
    text: _('Subnet Mask'),
    formProps: {
      form: 'port',
      type: 'text',
      required: true,
      validator: validator({
        rules: 'mask',
      }),
    },
  },
]);
const propTypes = {
  route: PropTypes.object,
  save: PropTypes.func,
};
const defaultProps = {};

export default function NetworkInterface(props) {
  return (
    <AppScreen
      {...props}
      listOptions={listOptions}
      editFormId="port"
      listKey="allKeys"
      actionable
      selectable
    />
  );
}

NetworkInterface.propTypes = propTypes;
NetworkInterface.defaultProps = defaultProps;

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
)(NetworkInterface);
