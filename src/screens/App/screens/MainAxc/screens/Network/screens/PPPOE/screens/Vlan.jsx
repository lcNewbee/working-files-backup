import React from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import { actions as screenActions } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';

function getInterfaceList() {
  return utils.fetch('goform/network/interface')
    .then(json => (
      {
        options: json.data.list.map(
          item => ({
            value: item.name,
            label: `${item.name}`,
          }),
        ),
      }
    ),
  );
}

const listOptions = fromJS([
  {
    id: 'vlanID',
    text: __('ID'),
    noForm: true,
    formProps: {
      type: 'text',
      required: true,
    },
  },
  {
    id: 'interface',
    text: __('Vlan Interface Binded'),
    formProps: {
      type: 'select',
      required: true,
    },
  },
]);

const propTypes = {
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      interfaceOptions: fromJS([]),
    };
  }
  componentWillMount() {
    getInterfaceList()
      .then(
        (data) => {
          this.setState({
            interfaceOptions: fromJS(data.options),
          });
        },
      );
  }
  render() {
    const newListOptions = listOptions.setIn([1, 'options'], this.state.interfaceOptions);
    return (
      <AppScreen
        {...this.props}
        listOptions={newListOptions}
        actionable
        selectable
        editable={false}
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
