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

function getPortalServerList() {
  return utils.fetch('/goform/network/portal/server')
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

function getAAADomainName() {
  return utils.fetch('goform/network/Aaa')
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
  {
    id: 'interface_bind',
    label: _('Port'),
    formProps: {
      type: 'select',
      required: true,
      notEditable: true,
    },
  }, {
    id: 'template_name',
    label: _('Server Name'),
    formProps: {
      type: 'select',
      notEditable: true,
      required: true,
    },
  }, {
    id: 'max_usernum',
    label: _('Max Users'),
    defaultValue: '4096',
    formProps: {
      type: 'number',
      min: 5,
      max: 4096,
    },
  }, {
    id: 'auth_mode',
    label: _('Auth Type'),
    defaultValue: '1',
    options: [
      {
        value: '1',
        label: _('Direct'),
      },
      {
        value: '2',
        label: _('Layer3'),
      },
    ],
    formProps: {
      type: 'switch',
    },
  }, {
    id: 'auth_ip',
    label: _('Authentication IP'),
    formProps: {
      type: 'text',
      validator: validator({
        rules: 'ip',
      }),
      showPrecondition(data) {
        return data.get('auth_mode') === '2';
      },
    },
  }, {
    id: 'auth_mask',
    label: _('Authentication Subnet Mask'),
    formProps: {
      type: 'text',
      validator: validator({
        rules: 'mask',
      }),
      showPrecondition(data) {
        return data.get('auth_mode') === '2';
      },
    },
  }, {
    id: 'auth_domain',
    text: _('AAA Strategy'),
    defaultValue: '',
    formProps: {
      type: 'select',
      required: true,
    },
  }, {
    id: 'idle_test',
    label: _('Idle Detection'),
    defaultValue: '0',
    formProps: {
      type: 'checkbox',
      value: '1',
    },
  },
]);

const objectTableOptions = fromJS([
  {
    id: 'nickName',
    label: _('Nickname'),
  }, {
    id: 'occurrenceTime',
    label: _('Occurrence Time'),
  }, {
    id: 'recentlyAppeared',
    label: _('Recently Appeared'),
  }, {
    id: 'createtime',
    label: _('Createtime'),
  },
]);

const propTypes = {
  store: PropTypes.instanceOf(Map),
  closeListItemModal: PropTypes.func,
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
    let myPortOptions = this.state.portOptions
      .filterNot(($$item) => {
        const curPort = $$item.get('value');
        const curPortIndex = $$curList.findIndex($$listItem => $$listItem.get('interface_bind') === curPort);
        return curPortIndex !== -1;
      });
    let curListOptions = listOptions
      .setIn([1, 'options'], this.state.portalServerOption)
      .setIn([6, 'options'], this.state.AAADomainNameOption);

    if (actionType === 'edit') {
      myPortOptions = myPortOptions.push(fromJS({
        value: $$myScreenStore.getIn(['curListItem', 'interface_bind']),
        label: $$myScreenStore.getIn(['curListItem', 'interface_bind']),
      }));
    }

    curListOptions = listOptions
      .setIn([0, 'options'], myPortOptions);

    return (
      <AppScreen
        {...this.props}
        store={store}
        listKey="template_name"
        listOptions={curListOptions}
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
