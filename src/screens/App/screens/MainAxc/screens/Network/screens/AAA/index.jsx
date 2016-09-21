import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  ListInfo,
} from 'shared/components';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

function getInterfaceTypeOptions() {
  return utils.fetch('goform/interfaceType')
    .then((json) => (
      {
        options: json.data.list.map(
          (item) => ({
            value: item.no,
            label: `${item.no}(${item.noInfo})`,
          })
        ),
      }
    )
  );
}
const accessTypeSeletOptions = [
  {
    value: '0',
    label: _('LAN'),
  }, {
    value: '1',
    label: _('PPP'),
  }, {
    value: '2',
    label: _('Portal'),
  }, {
    value: '3',
    label: _('MAC'),
  },
];
const authTypeSeletOptions = [
  {
    value: '0',
    label: `${_('Local')} (${_('802.1X')})`,
  },
  {
    value: '1',
    label: `${_('Remotely')}(${_('Radius Service')})`,
  },
];

const screenOptions = fromJS([
  {
    id: 'ispDomain',
    text: _('ISP Domain Name'),
    formProps: {
      type: 'url',
    },
  }, {
    id: 'authAccessType',
    text: _('Access Type') + _('(Auth)'),
    defaultValue: '0',
    fieldset: 'auth',
    legend: _('Auth Service'),
    formProps: {
      type: 'select',
      placeholder: _('Please Select ') + _('Rules Group'),
      options: accessTypeSeletOptions,
    },
  }, {
    id: 'authType',
    text: _('Auth Type') + _('(Auth)'),
    defaultValue: '0',
    fieldset: 'auth',
    formProps: {
      type: 'switch',
      placeholder: _('Please Select ') + _('Rules Group'),
      options: authTypeSeletOptions,
    },
  }, {
    id: 'authRadiusTemplate',
    text: _('Radius Template') + _('(Auth)'),
    fieldset: 'auth',
    formProps: {
      type: 'select',
      placeholder: _('Please Select ') + _('Radius Template'),
      loadOptions: getInterfaceTypeOptions,
      isAsync: true,
    },
  }, {
    id: 'billingAccessType',
    text: _('Access Type') + _('(Accounting)'),
    defaultValue: '0',
    fieldset: 'billing',
    legend: _('Accounting Service'),
    formProps: {
      type: 'select',
      placeholder: _('Please Select ') + _('Rules Group'),
      options: accessTypeSeletOptions,
    },
  }, {
    id: 'billingType',
    text: _('Accounting Type') + _('(Accounting)'),
    fieldset: 'billing',
    defaultValue: '0',
    formProps: {
      type: 'switch',
      placeholder: _('Please Select ') + _('Rules Group'),
      options: authTypeSeletOptions,
    },
  }, {
    id: 'billingRadiusTemplate',
    text: _('Radius Template') + _('(Accounting)'),
    fieldset: 'billing',
    formProps: {
      type: 'select',
      placeholder: _('Please Select ') + _('Radius Template'),
      loadOptions: getInterfaceTypeOptions,
      isAsync: true,
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
