import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import validator from 'shared/validator';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';

function getPortList() {
  return utils.fetch('goform/network/port')
    .then(json => (
      {
        options: json.data.list.filter(
          item => item,
        ).map(
          item => ({
            value: item.name,
            label: item.name,
          }),
        ),
      }
    ),
  );
}

function getPortalServerList() {
  return utils.fetch('/goform/network/portal/server')
    .then(json => (
      {
        options: json.data.list.filter(
          item => item,
        ).map(
          item => ({
            value: item.template_name,
            label: item.template_name,
          }),
        ),
      }
    ),
  );
}

function getAAADomainName() {
  return utils.fetch('goform/network/Aaa')
    .then(json => (
      {
        options: json.data.list.filter(
          item => item,
        ).map(
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
  {
    id: 'interface_bind',
    label: __('Port'),
    formProps: {
      type: 'switch',
      required: true,
    },
  }, {
    id: 'template_name',
    label: __('Server Name'),
    formProps: {
      type: 'select',
      required: true,
      notEditable: true,
    },
  }, {
    id: 'max_usernum',
    label: __('Max Users'),
    defaultValue: '4096',
    formProps: {
      type: 'number',
      min: '5',
      max: '4096',
    },
  }, {
    id: 'auth_mode',
    label: __('Auth Type'),
    defaultValue: '1',
    options: [
      {
        value: '1',
        label: __('Direct'),
      },
      {
        value: '2',
        label: __('Layer3'),
      },
    ],
    formProps: {
      type: 'switch',
    },
  }, {
    id: 'auth_ip',
    label: __('Authentication IP'),
    formProps: {
      type: 'text',
      validator: validator({
        rules: 'ip',
      }),
      required: true,
      showPrecondition(data) {
        return data.get('auth_mode') === '2';
      },
    },
  }, {
    id: 'auth_mask',
    label: __('Authentication Subnet Mask'),
    formProps: {
      type: 'text',
      validator: validator({
        rules: 'mask',
      }),
      required: true,
      showPrecondition(data) {
        return data.get('auth_mode') === '2';
      },
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
  // 闲置检查
  // {
  //   id: 'idle_test',
  //   label: __('Idle Detection'),
  //   defaultValue: '0',
  //   formProps: {
  //     type: 'checkbox',
  //     value: '1',
  //   },
  // },
]);

const propTypes = {
  store: PropTypes.instanceOf(Map),
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      portOptions: fromJS([]),
      portalServerOption: fromJS([]),
      AAADomainNameOption: fromJS([]),
    };
  }
  componentWillMount() {
    getPortList()
      .then((data) => {
        this.setState({
          portOptions: fromJS(data.options),
        });
      });

    getPortalServerList()
      .then((data) => {
        this.setState({
          portalServerOption: fromJS(data.options),
        });
      });
    getAAADomainName()
      .then((data) => {
        this.setState({
          AAADomainNameOption: fromJS(data.options),
        });
      });
  }

  render() {
    const { store } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const actionType = $$myScreenStore.getIn(['actionQuery', 'action']);
    const $$curList = $$myScreenStore.getIn(['data', 'list']);
    const myPortOptions = this.state.portOptions
      .filterNot(($$item) => {
        const curPort = $$item.get('value');
        const curPortIndex = $$curList.findIndex($$listItem => $$listItem.get('interface_bind') === curPort);
        let ret = curPortIndex !== -1;

        if (actionType === 'edit' && $$myScreenStore.getIn(['curListItem', 'id']) === $$curList.getIn([curPortIndex, 'id'])) {
          ret = false;
        }

        return ret;
      });
    const myPortalServerOption = this.state.portalServerOption
      .filterNot(($$item) => {
        const curServerName = $$item.get('value');
        const curIndex = $$curList.findIndex($$listItem => $$listItem.get('template_name') === curServerName);
        let ret = curIndex !== -1;

        if (actionType === 'edit' && $$myScreenStore.getIn(['curListItem', 'id']) === $$curList.getIn([curIndex, 'id'])) {
          ret = false;
        }

        return ret;
      });
    const curListOptions = listOptions.map(
      ($$item) => {
        const curId = $$item.get('id');

        switch (curId) {
          case 'interface_bind':
            return $$item.set('options', myPortOptions);

          case 'template_name':
            return $$item.set('options', myPortalServerOption);

          case 'auth_domain':
            return $$item.set('options', this.state.AAADomainNameOption);

          default:
            return $$item;
        }
      },
    );

    return (
      <AppScreen
        {...this.props}
        store={store}
        listKey="template_name"
        listOptions={curListOptions}
        maxListSize="6"
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
