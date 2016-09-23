import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
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
      type: 'plain-text',
    },
  }, {
    id: 'exchangeModel',
    text: _('Exchange Model'),
    defaultValue: 'access',
    options: [
      {
        value: 'access',
        label: 'access',
      }, {
        value: 'trunk',
        label: 'trunk',
      }, {
        value: 'QINQ_tunnel',
        label: 'QINQ(tunnel)',
      }, {
        value: 'QINQ_uplink',
        label: 'QINQ(tunnel)',
      },
    ],
    formProps: {
      type: 'select',
    },
  }, {
    id: 'speed',
    text: _('Port Speed'),
    options: [
      {
        value: '10',
        label: '10',
      }, {
        value: '100',
        label: '100',
      }, {
        value: '1000',
        label: _('1000'),
      },
    ],
    formProps: {
      type: 'switch',
    },
  }, {
    id: 'workModel',
    text: _('Work Model'),
    options: [
      {
        value: 'half',
        label: _('Simplex'),
      }, {
        value: 'full',
        label: _('Duplex'),
      }, {
        value: 'auto',
        label: _('Auto'),
      },
    ],
    formProps: {
      type: 'switch',
    },
  }, {
    id: 'ip1',
    text: _('IP') + '_1',
    formProps: {
      type: 'text',
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'mask1',
    text: _('Mask') + '_1',
    formProps: {
      type: 'text',
      validator: validator({
        rules: 'mask',
      }),
    },
  }, {
    id: 'ip2',
    text: _('IP') + '_2',
    noTable: true,
    formProps: {
      type: 'text',
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'mask2',
    text: _('Mask') + '_2',
    noTable: true,
    formProps: {
      type: 'text',
      validator: validator({
        rules: 'mask',
      }),
    },
  }, {
    id: 'description',
    text: _('Description'),
    formProps: {
      type: 'textarea',
    },
  }, {
    id: 'status',
    text: _('Port Status'),
    formProps: {
      type: 'checkbox',
      value: '1',
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
        addable={false}
        deleteable={false}
        actionable
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
