import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';

import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';

function getPortList() {
  return utils.fetch('goform/network/port')
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

const commonFormOptions = fromJS([
  {
    id: 'enable',
    label: __('NAT Service'),
    type: 'checkbox',
    text: __('Enable'),
    value: 1,
    saveOnChange: true,
  },
]);
const listOptions = fromJS([
  {
    id: 'type',
    label: __('NAT Rule Type'),
    options: [
      {
        value: '0',
        disabled: true,
        label: __('Static NAT'),
      }, {
        value: 'snat',
        label: __('Source Address'),
      }, {
        value: 'dnat',
        disabled: true,
        label: __('Destination NAT'),
      }, {
        value: 'masquerade',
        disabled: true,
        label: __('Internet NAT'),
      },
    ],
    defaultValue: 'snat',
    formProps: {
      type: 'select',
      label: __('NAT Rule Type'),
      placeholder: __('Please Select ') + __('NAT Rule Type'),
    },

  }, {
    id: 'addr',
    label: __('Source IP Address'),
    formProps: {
      required: true,
      validator: validator({
        rules: 'ipSegment',
      }),
      help: __('e.g. %s', '192.168.1.0/24'),
    },
  }, {
    id: 'nataddr',
    label: __('Translated IP Address'),
    formProps: {
      required: true,
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'pubifname',
    label: __('Uplink Port'),
    formProps: {
      type: 'select',
      required: true,
    },
  },
]);


const propTypes = {
  route: PropTypes.object,
};

const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
    utils.binds(this, [
      'onSave',
    ]);

    this.state = {
      listOptions,
    };
  }

  componentWillMount() {
    getPortList()
      .then(
        (data) => {
          this.setState({
            listOptions: this.state.listOptions.setIn(
              [-1, 'options'],
              data.options,
            ),
          });

          return data;
        },
      );
  }

  render() {
    return (
      <AppScreen
        {...this.props}
        listTitle={__('NAT Rules')}
        listKey="allKeys"
        settingsFormOptions={commonFormOptions}
        listOptions={this.state.listOptions}
        noTitle
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
