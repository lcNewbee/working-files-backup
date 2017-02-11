import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

function getWebTemplate() {
  return utils.fetch('goform/portal/access/web')
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
    id: 'name',
    text: _('Name'),
    width: '120px',
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'ip',
    text: _('IP'),
    width: '120px',
    options: [],
    formProps: {
      type: 'text',
      required: true,
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'mac',
    text: _('Mac'),
    formProps: {
      type: 'number',
      required: true,
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'address',
    text: _('Address'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'basip',
    text: _('Bas IP'),
    formProps: {
      type: 'text',
      required: true,
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'web',
    text: _('Web Template'),
    formProps: {
      type: 'select',
      required: true,
    },
  }, {
    id: 'count',
    text: _('Authetication Count'),
    noTable: true,
    formProps: {
      type: 'number',
      required: true,
    },
  }, {
    id: 'des',
    text: _('Description'),
    noTable: true,
    formProps: {
      type: 'textarea',
      required: true,
    },
  }, {
    id: 'x',
    text: _('X'),
    noForm: true,
    noTable: true,
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'y',
    text: _('Y'),
    noForm: true,
    noTable: true,
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'ssid',
    text: _('SSID Location'),
    formProps: {
      required: true,
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
      p: fromJS([]),
    };
  }
  render() {
    return (
      <AppScreen
        {...this.props}
        listOptions={listOptions}
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
