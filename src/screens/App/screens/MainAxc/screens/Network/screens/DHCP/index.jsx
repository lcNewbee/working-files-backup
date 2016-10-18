import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/utils/lib/validator';
import {
  ListInfo,
} from 'shared/components';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const screenOptions = fromJS([
  {
    id: 'name',
    text: _('Name'),
    formProps: {
      required: true,
      maxLength: '24',
    },
  }, {
    id: 'domain',
    text: _('Domain'),
    formProps: {
      type: 'text',
    },
  }, {
    id: 'startIp',
    text: _('Start IP'),
    formProps: {
      required: true,
      maxLength: '13',
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'mask',
    text: _('Mask'),
    formProps: {
      required: true,
      maxLength: '13',
      validator: validator({
        rules: 'mask',
      }),
    },
  }, {
    id: 'gateway',
    text: _('Gateway'),
    formProps: {
      required: true,
      maxLength: '13',
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'mainDns',
    text: _('Main DNS'),
    formProps: {
      required: true,
      maxLength: '13',
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'secondDns',
    text: _('Second DNS'),
    formProps: {
      maxLength: '13',
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'releaseTime',
    text: _('Release Time'),
    formProps: {
      required: true,
      help: _('Second'),
      maxLength: '13',
      validator: validator({
        rules: 'number',
      }),
    },
  }, {
    id: 'opt43',
    text: _('AC Address'),
    noTable: true,
    formProps: {
      maxLength: '13',
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'opt60',
    text: _('Vendor ID'),
    noTable: true,
    formProps: {
      type: 'number',
      maxLength: '13',
      validator: validator({
        rules: 'num',
      }),
    },
  },
]);
const tableOptions = immutableUtils.getTableOptions(screenOptions);
const editFormOptions = immutableUtils.getFormOptions(screenOptions);
const defaultEditData = immutableUtils.getDefaultData(screenOptions);
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
          console.log(json);
        }
      });
  }

  render() {
    return (
      <ListInfo
        {...this.props}
        tableOptions={tableOptions}
        editFormOptions={editFormOptions}
        defaultEditData={defaultEditData}
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
    screenActions
  ), dispatch);
}


// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(View);
