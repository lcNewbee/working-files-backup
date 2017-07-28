import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import validator from 'shared/validator';
import { bindActionCreators } from 'redux';

import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';

function getPortList() {
  return utils.fetch('goform/network/portal/rule')
    .then(json => (
      {
        options: json.data.list.map(
          item => ({
            value: item.interface_bind,
            label: item.interface_bind,
            serverName: item.template_name,
          }),
        ),
      }
    ),
  );
}
const listOptions = fromJS([
  {
    id: 'index',
    text: __('NO.'),
    noForm: true,
    formProps: {
      required: true,
    },
  },
  // {
  //   id: 'interface_bind',
  //   label: __('Port'),
  //   defaultValue: 'eth_all',
  //   formProps: {
  //     type: 'select',
  //     required: true,
  //     notEditable: true,
  //   },
  // },
  {
    id: 'src_mac',
    label: __('Mac Address'),
    formProps: {
      type: 'text',
      maxLength: '31',
      required: true,
      validator: validator({
        rules: 'mac',
      }),
    },
  },
]);

const propTypes = {
  store: PropTypes.instanceOf(Map),
  updateCurEditListItem: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      portOptions: fromJS([]),
    };
    utils.binds(this, [
      'onBeforeSave',
    ]);
  }
  componentWillMount() {
    // getPortList()
    //   .then((data) => {
    //     this.setState({
    //       portOptions: fromJS(data.options).filter($$item => $$item.get('value') !== 'lo'),
    //     });
    //   });
  }

  // onBeforeSave($$actionQuery, $$curListItem) {
  //   const actionType = $$actionQuery.getIn(['action']);
  //   const interfaceBind = $$curListItem.get('interface_bind');
  //   let serverName = '';

  //   if (actionType === 'add' || actionType === 'delete') {
  //     serverName = this.state.portOptions.find(
  //       $$item => $$item.get('value') === interfaceBind,
  //     ).get('serverName');

  //     this.props.updateCurEditListItem({
  //       template_name: serverName,
  //     });
  //   }
  // }

  render() {
    const { store } = this.props;
    const curListOptions = listOptions;

    return (
      <AppScreen
        {...this.props}
        store={store}
        listOptions={curListOptions}

        onBeforeSave={this.onBeforeSave}
        // actionBarChildren={__('This function is available only when the "Rule Type" is "Port",whice configured in "User Access Policies".')}
        editable={false}
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
