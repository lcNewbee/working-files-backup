import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import { actions as screenActions } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';

function getWebTemplate() {
  return utils.fetch('goform/portal/access/web')
    .then(json => (
      {
        options: json.data.list.map(
          item => ({
            value: item.id,
            label: item.name,
          }),
        ),
      }
    ),
  );
}

function getApMac() {
  return utils.fetch('goform/portal/access/ap')
    .then(json => (
      {
        options: json.data.list.map(
          item => ({
            value: item.mac,
            label: item.mac,
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
    formProps: {
      maxLength: '129',
      type: 'text',
      required: true,
      validator: validator({
        rules: 'utf8Len:[1, 128]',
      }),
    },
  }, {
    id: 'ip',
    text: _('IP'),
    noTable: true,
    noForm: true,
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'address',
    text: _('Address'),
    formProps: {
      type: 'text',
      maxLength: '256',
      required: true,
      validator: validator({
        rules: 'utf8Len:[1, 255]',
      }),
    },
  }, {
    id: 'basip',
    text: _('BAS'),
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
    id: 'apmac',
    text: _('AP Mac'),
    formProps: {
      type: 'select',
    },
  }, {
    id: 'des',
    text: _('Description'),
    noTable: true,
    formProps: {
      required: true,
      type: 'textarea',
      maxLength: '257',
      validator: validator({
        rules: 'utf8Len:[1, 256]',
      }),
    },
  }, {
    id: 'x',
    text: _('x'),
    noForm: true,
    noTable: true,
    formProps: {
      type: 'select',
    },
  }, {
    id: 'y',
    text: _('y'),
    noForm: true,
    noTable: true,
    formProps: {
      type: 'select',

    },
  }, {
    id: 'ssid',
    text: _('SSID'),
    formProps: {
      type: 'text',
      maxLength: '129',
      validator: validator({
        rules: 'utf8Len:[1, 128]',
      }),
    },
  }, {
    id: 'apid',
    text: _('AP ID'),
    noForm: true,
    noTable: true,
    formProps: {
      type: 'select',
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
      webTemplateOptions: fromJS([]),
      macOptions: fromJS([]),
    };
  }
  componentWillMount() {
    getWebTemplate()
      .then((data) => {
        this.setState({
          webTemplateOptions: fromJS(data.options),
        });
      });
    getApMac()
      .then((data) => {
        this.setState({
          macOptions: fromJS(data.options),
        });
      });
  }
  render() {
    const curListOptions = listOptions
      .setIn([4, 'options'], this.state.webTemplateOptions)
      .setIn([5, 'options'], this.state.macOptions);
    return (
      <AppScreen
        {...this.props}
        listOptions={curListOptions}
        noTitle
        actionable
        selectable
        searchable
        searchProps={{
          placeholder: `${__('Name')}`,
        }}
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
