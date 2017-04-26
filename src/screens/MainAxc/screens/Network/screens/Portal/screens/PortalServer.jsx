import React from 'react';
import utils from 'shared/utils';
import validator from 'shared/validator';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';

import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';


function getAAADomainName() {
  return utils.fetch('goform/portal/Aaa', {
    size: 9999,
    page: 1,
  })
    .then(json => (
      {
        options: json.data.list.map(
          item => ({
            value: item.domain_name,
            label: item.domain_name,
          }),
        ),
      }
    ),
  );
}
const listOptions = fromJS([
  // {
  //   id: 'template_type',
  //   label: __('Server Type'),
  //   options: [
  //     {
  //       value: 'remote',
  //       label: __('Remote Server'),
  //     }, {
  //       value: 'local',
  //       label: __('Local Server'),
  //     },
  //   ],
  //   formProps: {
  //     type: 'switch',
  //     required: true,
  //   },
  // },
  {
    id: 'template_name',
    label: __('Server Name'),
    formProps: {
      type: 'text',
      maxLength: '31',
      notEditable: true,
      required: true,
      validator: validator({
        rules: 'utf8Len:[1,31]',
      }),
    },
  },
  // {
  //   id: 'address_type',
  //   label: __('Address Type'),
  //   defaultValue: '1',
  //   options: [
  //     {
  //       value: '1',
  //       label: __('IP Address'),
  //     }, {
  //       value: '2',
  //       label: __('Domain'),
  //       disabled: true,
  //     },
  //   ],
  //   formProps: {
  //     type: 'switch',
  //   },
  // },
  {
    id: 'server_ipaddr',
    label: __('Server IP'),
    formProps: {
      type: 'text',
      required: true,
      validator: validator({
        rules: 'ip',
      }),
      // visible(data) {
      //   return data.get('address_type') === '1';
      // },
    },
  },
  // {
  //   id: 'server_domain',
  //   label: __('Server Domain'),
  //   formProps: {
  //     type: 'text',
  //     required: true,
  //     validator: validator({
  //       rules: 'utf8Len:[1,31]',
  //     }),
  //     visible(data) {
  //       return data.get('address_type') === '2';
  //     },
  //   },
  // },
  {
    id: 'server_port',
    label: __('Server Port'),
    formProps: {
      type: 'number',
      min: '1',
      max: '65535',
      required: true,
    },
  }, {
    id: 'server_key',
    label: __('Shared Key'),
    noTable: true,
    formProps: {
      type: 'password',
      maxLength: '31',
      required: true,
      validator: validator({
        rules: 'pwd',
      }),
    },
  }, {
    id: 'server_url',
    label: __('Redirect URL'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'ac_ip',
    label: __('AC IP'),
    formProps: {
      type: 'text',
      required: true,
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'auth_domain',
    text: __('AAA Strategy'),
    defaultValue: '',
    formProps: {
      type: 'select',
      required: true,
    },
  },
]);

const propTypes = {};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      AAADomainNameOption: fromJS([]),
    };
  }
  componentWillMount() {
    getAAADomainName()
      .then((data) => {
        this.setState({
          AAADomainNameOption: fromJS(data.options),
        });
      });
  }
  render() {
    const curListOptions = listOptions.setIn([6, 'options'], this.state.AAADomainNameOption);
    return (
      <AppScreen
        {...this.props}
        listKey="template_name"
        listOptions={curListOptions}
        maxListSize="16"
        deleteable={
          ($$item, index) => (index !== 0)
        }
        actionable
        selectable
        noTitle
      />
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    settings: state.settings,
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
