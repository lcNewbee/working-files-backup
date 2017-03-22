import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const uptimeFilter = utils.filter('connectTime');
const flowFilter = utils.filter('flowRate');

const listOptions = fromJS([
  {
    id: 'ip',
    text: __('IP'),
    formProps: {
      type: 'text',
      required: true,
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'basip',
    text: __('Bas IP'),
    formProps: {
      type: 'text',
      required: true,
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'mac',
    text: __('Mac'),
    type: 'text',
    formProps: {
      required: true,
      validator: validator({
        rules: 'mac',
      }),
    },
  }, {
    id: 'startDate',
    text: __('Online Date'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'endDate',
    text: __('Offline Date'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'time',
    text: __('Online Time'),
    type: 'num',
    formProps: {
      required: true,
    },
    transform(val) {
      return uptimeFilter.transform(val / 1000);
    },
  },   // {
  //   id: 'accType',
  //   text: __('Acc Type'),
  //   formProps: {
  //     required: true,
  //   },
  // },
  {
    id: 'outs',
    text: __('Down Traffic'),
    formProps: {
      required: true,
    },
    transform(val) {
      return `${flowFilter.transform(val)}`;
    },
  }, {
    id: 'ins',
    text: __('Up Traffic'),
    formProps: {
      required: true,
    },
    transform(val) {
      return `${flowFilter.transform(val)}`;
    },
  }, //  {
  //   id: 'accLogic',
  //   text: __('Acc Logic'),
  //   formProps: {
  //     required: true,
  //   },
  // },
  {
    id: 'ex2',
    text: __('Reason'),
    formProps: {
      required: true,
      maxLength: 257,
      validator: validator({
        rules: 'utf8Len:[1,256]',
      }),
    },
  },
]);
const propTypes = {
  route: PropTypes.object,
  save: PropTypes.func,
};
const defaultProps = {};

export default class OpenPortalBase extends React.Component {
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
        }
      });
  }

  render() {
    return (
      <AppScreen
        {...this.props}
        listOptions={listOptions}
        actionable
        selectable
        addable={false}
        editable={false}
      />
    );
  }
}

OpenPortalBase.propTypes = propTypes;
OpenPortalBase.defaultProps = defaultProps;

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
)(OpenPortalBase);
