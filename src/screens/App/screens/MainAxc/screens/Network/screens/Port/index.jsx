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
    id: 'status',
    text: _('Port Status'),
    formProps: {
      type: 'checkbox',
      value: '1',
    },
  }, {
    id: 'speed',
    text: _('Port Speed'),
    options: [
      {
        value: '1G',
        label: '1G',
      }, {
        value: '10G',
        label: '10G',
      }, {
        value: 'Auto',
        label: _('Auto'),
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
        value: 'simplex',
        label: _('Simplex'),
      }, {
        value: 'duplex',
        label: _('Duplex'),
      }, {
        value: 'Auto',
        label: _('Auto'),
      },
    ],
    formProps: {
      type: 'switch',
    },
  }, {
    id: 'mtu',
    text: _('MTU'),
    defaultValue: '1500',
    formProps: {
      type: 'number',
      required: true,
      maxLength: '4',
      validator: validator({
        rules: 'range:[1,1500]',
      }),
    },
  }, {
    id: 'nativeVLAN',
    text: _('Native VLAN'),
    defaultValue: '1',
    formProps: {
      type: 'number',
      required: true,
      maxLength: '4',
      validator: validator({
        rules: 'range:[1,4095]',
      }),
    },
  }, {
    id: 'acceptVlans',
    text: _('Accept VLAN List'),
  }, {
    id: 'description',
    text: _('Description'),
    formProps: {
      type: 'textarea',
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
