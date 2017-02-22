import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';
import validator from 'shared/validator';

function getInterfaceTypeOptions() {
  return utils.fetch('goform/network/radius/template')
    .then(json => (
      {
        options: json.data.list.map(
          item => ({
            value: item.template_name,
            label: item.template_name,
          }),
        ),
      }
    ),
  );
}
const accessTypeSeletOptions = [
  {
    value: 'lan-access',
    label: _('LAN'),
    disabled: true,
  }, {
    value: 'ppp-access',
    label: _('PPP'),
  }, {
    value: 'portal',
    label: _('Portal'),
  }, {
    value: 'mac-access',
    label: _('MAC'),
  },
];
const authTypeSeletOptions = [
  {
    value: 'local',
    label: `${_('Local')} (${_('802.1X')})`,
  },
  {
    value: 'radius-scheme',
    label: `${_('Remote')}`,
  },
];
const listOptions = fromJS([
  {
    id: 'domain_name',
    text: _('Name'),
    defaultValue: '',
    formProps: {
      type: 'text',
      required: true,
      maxLength: '31',
      validator: validator({
        rules: 'utf8Len:[1,31]',
      }),
    },
  }, {
    id: 'auth_accesstype',
    text: _('Access Type'),
    defaultValue: 'lan-access',
    options: accessTypeSeletOptions,
    formProps: {
      label: _('Access Type'),
      required: true,
      type: 'switch',
      placeholder: _('Please Select ') + _('Rules Group'),
    },
  }, {
    id: 'auth_schemetype',
    text: _('Type'),
    defaultValue: 'radius-scheme',
    options: authTypeSeletOptions,
    formProps: {
      label: _('Type'),
      required: true,
      type: 'switch',
      placeholder: _('Please Select ') + _('Rules Group'),
    },
  }, {
    id: 'radius_template',
    text: _('Radius Template'),
    formProps: {
      label: _('Radius Template'),
      required: true,
      type: 'select',
      placeholder: _('Please Select ') + _('Radius Service'),
      options: [],
    },
  },
]);
const propTypes = {
  route: PropTypes.object,
  save: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);

    this.onAction = this.onAction.bind(this);
    this.state = {
      radiusOptions: [],
    };
  }

  componentWillMount() {
    getInterfaceTypeOptions().then(
      (data) => {
        this.setState({
          radiusOptions: data.options,
        });
      },
    );
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
    const myListOptions = listOptions.setIn(
      [-1, 'formProps', 'options'],
      this.state.radiusOptions,
    );
    return (
      <AppScreen
        {...this.props}
        listKey="domain_name"
        listOptions={myListOptions}
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
