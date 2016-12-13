import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/utils/lib/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const listOptions = fromJS([
  {
    id: 'name',
    text: _('Name'),
    formProps: {
      required: true,
      maxLength: '24',
      notEditable: true,
    },
  }, {
    id: 'domain',
    text: _('Domain'),
    formProps: {
      required: true,
      type: 'text',
    },
  }, {
    id: 'startIp',
    text: _('Start IP'),
    formProps: {
      required: true,
      maxLength: '15',
      notEditable: true,
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'mask',
    text: _('Subnet Mask'),
    formProps: {
      required: true,
      maxLength: '15',
      notEditable: true,
      validator: validator({
        rules: 'mask',
      }),
    },
  }, {
    id: 'gateway',
    text: _('Gateway'),
    formProps: {
      required: true,
      maxLength: '15',
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'mainDns',
    text: _('Primary DNS'),
    formProps: {
      required: true,
      maxLength: '15',
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'secondDns',
    text: _('Secondary DNS'),
    formProps: {
      maxLength: '15',
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'releaseTime',
    text: _('Lease Time'),
    formProps: {
      type: 'number',
      required: true,
      help: _('Second'),
      min: '1',
      max: '99999999',
      maxLength: '15',
      validator: validator({
        rules: 'num',
      }),
    },
  }, {
    id: 'opt43',
    text: _('AC Address'),
    noTable: true,
    formProps: {
      type: 'text',
      maxLength: '31',
      validator: validator({
        rules: 'iplist:[";"]',
      }),
    },
  }, {
    id: 'opt60',
    text: _('Vendor ID'),
    noTable: true,
    formProps: {
      type: 'number',
      maxLength: '15',
      validator: validator({
        rules: 'num',
      }),
    },
  },
]);
const editFormOptions = immutableUtils.getFormOptions(listOptions);
const propTypes = {
  route: PropTypes.object,
  save: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
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
        editFormOptions={editFormOptions}

        listKey="name"
        actionable
        selectable
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
