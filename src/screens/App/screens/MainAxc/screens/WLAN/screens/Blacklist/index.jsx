import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/utils/lib/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const listOptions = fromJS([
  {
    id: 'mac',
    text: _('MAC Address'),
    formProps: {
      required: true,
      validator: validator({
        rules: 'mac',
      }),
    },
  }, {
    id: 'vendor',
    text: _('Manufacturer'),
    noForm: true,
  }, {
    id: 'clientType',
    text: _('Client Type'),
    noForm: true,
  }, {
    id: 'reason',
    text: _('Reason'),
    formProps: {
      type: 'textarea',
      maxLenght: 128,
    },
  },
]);

const propTypes = {
  route: PropTypes.object,
  save: PropTypes.func,
};
const defaultProps = {};

export default class Blacklist extends React.Component {
  constructor(props) {
    super(props);

    this.onAction = this.onAction.bind(this);
  }
  onAction(mac, action) {
    const query = {
      mac,
      action,
    };

    this.props.save('goform/blacklist', query)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          // alert('ds');
        }
      });
  }

  render() {
    const { route } = this.props;

    return (
      <AppScreen
        // Screen 全局属性
        {...this.props}
        title={_('Blacklist Settings')}
        // List Props
        listTitle={route.text}
        listOptions={listOptions}
        listKey="allKeys"
        editable={false}
        actionable
        selectable
        noTitle
      />
    );
  }
}

Blacklist.propTypes = propTypes;
Blacklist.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.screens,
    groupid: state.product.getIn(['group', 'selected', 'id']),
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
)(Blacklist);
