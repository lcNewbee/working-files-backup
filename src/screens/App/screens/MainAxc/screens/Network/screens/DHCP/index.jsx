import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/utils/lib/validator';
import {
  ListInfo,
} from 'shared/components';
import * as listActions from 'shared/actions/list';
import * as appActions from 'shared/actions/app';

const screenOptions = fromJS([
  {
    id: 'name',
    text: _('Name'),
    formProps: {
      maxLength: '24',
    },
  }, {
    id: 'type',
    text: _('Type'),
    defaultValue: 'ipv4',
    formProps: {
      type: 'switch',
      options: [
        {
          value: 'ipv4',
          label: 'IPV4',
        }, {
          value: 'ipv6',
          label: 'IPV6',
        },
      ],
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
      maxLength: '13',
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'endIp',
    text: _('End IP'),
    formProps: {
      maxLength: '13',
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'mask',
    text: _('Mask'),
    formProps: {
      maxLength: '13',
      validator: validator({
        rules: 'mask',
      }),
    },
  }, {
    id: 'gateway',
    text: _('Gateway'),
    formProps: {
      maxLength: '13',
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'mainDns',
    text: _('Main DNS'),
    formProps: {
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
      maxLength: '13',
      validator: validator({
        rules: 'time',
      }),
    },
  },
]);
const tableOptions = immutableUtils.getTableOptions(screenOptions);
const editFormOptions = immutableUtils.getFormOptions(screenOptions);
const defaultEditData = immutableUtils.getDefaultData(screenOptions);
const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),

  route: PropTypes.object,
  initList: PropTypes.func,
  closeListItemModal: PropTypes.func,
  updateEditListItem: PropTypes.func,
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
    store: state.list,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    listActions
  ), dispatch);
}


// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(View);
