import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import validator from 'shared/utils/lib/validator';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';

function getPortList() {
  return utils.fetch('goform/network/portal/rule')
    .then(json => (
      {
        options: json.data.list.map(
          item => ({
            value: item.interface_bind,
            label: item.interface_bind,
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
    id: 'mac',
    label: _('Mac White List'),
    formProps: {
      type: 'text',
      maxLength: '32',
      required: true,
      validator: validator({
        rules: 'mac',
      }),
    },
  },
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
    };
  }
  componentWillMount() {
    getPortList()
      .then((data) => {
        this.setState({
          portOptions: fromJS(data.options),
        });
      });
  }

  render() {
    const { store } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const $$curList = $$myScreenStore.getIn(['data', 'list']);
    const curListOptions = listOptions
      .setIn([0, 'options'], this.state.portOptions);
    return (
      <AppScreen
        {...this.props}
        store={store}
        listOptions={curListOptions}
        onBeforeAction={
          () => {
            alert(1);
          }
        }
        actionable
        selectable
        editable={false}
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
