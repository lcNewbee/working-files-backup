import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import validator from 'shared/utils/lib/validator';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import Modal from 'shared/components/Modal';
import Table from 'shared/components/Table';
import WizardContainer from 'shared/components/Organism/WizardContainer';
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
            value: item.name,
            label: item.name,
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
    },
  }, {
    id: 'max_usernum',
    label: _('Max Users'),
    formProps: {
      type: 'number',
      min: '1',
      max: '99999',
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
    },
  }, {
    id: 'auth_domain',
    label: _('Force Auth Domain'),
    formProps: {
      type: 'text',
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
    };
  }
  componentWillMount() {
    getPortList()
      .then((options) => {
        this.setState({
          portOptions: fromJS(options),
        });
      });

    getPortalServerList()
      .then((options) => {
        this.setState({
          portalServerOption: fromJS(options),
        });
      });
  }

  render() {
    const { store } = this.props;
    const curListOptions = listOptions
      .setIn([0, 'options'], this.state.portOptions)
      .setIn([1, 'options'], this.state.portalServerOption);

    return (
      <AppScreen
        {...this.props}
        store={store}
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
    screenActions
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(View);
