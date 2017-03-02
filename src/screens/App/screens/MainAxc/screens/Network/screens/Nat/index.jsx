import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
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
    label: _('NAT Service'),
    type: 'checkbox',
    text: _('Enable'),
    value: 1,
    saveOnChange: true,
  },
]);
const listOptions = fromJS([
  {
    id: 'ruleType',
    label: _('NAT Rule Type'),
    options: [
      {
        value: '0',
        disabled: true,
        label: _('Static NAT'),
      }, {
        value: 'snat',
        label: _('Source Address'),
      }, {
        value: 'dnat',
        disabled: true,
        label: _('Destination NAT'),
      }, {
        value: 'masquerade',
        disabled: true,
        label: _('Internet NAT'),
      },
    ],
    defaultValue: 'snat',
    formProps: {
      type: 'select',
      label: _('NAT Rule Type'),
      placeholder: _('Please Select ') + _('NAT Rule Type'),
    },

  }, {
    id: 'sourceAddress',
    label: _('Source IP Address'),
    formProps: {
      required: true,
      validator: validator({
        rules: 'ipSegment',
      }),
      help: _('e.g. %s', '192.168.1.0/24'),
    },
  }, {
    id: 'conversionAddress',
    label: _('Translated IP Address'),
    formProps: {
      required: true,
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'ifname',
    label: _('Uplink Port'),
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
        listTitle={_('NAT Rules')}
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
