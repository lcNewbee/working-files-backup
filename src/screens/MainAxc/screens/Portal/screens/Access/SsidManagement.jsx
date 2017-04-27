import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';

import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';

function getWebTemplate() {
  return utils.fetch('goform/portal/access/web', {
    size: 9999,
    page: 1,
  })
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
function getBasIP() {
  return utils.fetch('goform/portal/access/config')
    .then(json => (
      {
        basip: json.data.settings.bas_ip,
      }
    ),
  );
}
function getAllGroupSSID() {
  return utils.fetch('goform/group/ssidSetting', {
    groupid: -100,
    size: 9999,
    page: 1,
  })
    .then(json => (
      {
        options: json.data.list.map(
          item => ({
            value: item.ssid,
            label: item.ssid,
          }),
        ),
      }
    ),
  );
}
function getApMac() {
  return utils.fetch('goform/portal/access/ap', {
    size: 9999,
    page: 1,
  })
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
    noTable: true,
    noForm: true,
    formProps: {
      type: 'text',
      maxLength: '256',
      validator: validator({
        rules: 'utf8Len:[1, 255]',
      }),
    },
  }, {
    id: 'basip',
    text: _('BAS'),
    noTable: true,
    noForm: true,
    formProps: {
      type: 'text',
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
    text: _('AP MAC'),
    formProps: {
      type: 'select',
    },
  },
  {
    id: 'ssid',
    text: _('SSID'),
    formProps: {
      type: 'select',
      maxLength: '129',
      validator: validator({
        rules: 'utf8Len:[1, 128]',
      }),
    },
  },
  {
    id: 'des',
    text: _('Description'),
    noTable: true,
    formProps: {
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
      ssidOptions: fromJS([]),
      basip: '',
    };
  }
  componentDidMount() {
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
    getAllGroupSSID()     
      .then((data) => {
        this.setState({
          ssidOptions: fromJS(data.options),
        });
      });
    getBasIP()
      .then((data) => {
        this.setState({
          basip: fromJS(data.basip),
        });
      });
  }

  render() {
    const curListOptions = listOptions
      .setIn([3, 'formProps', 'defaultValue'], this.state.basip)
      .setIn([4, 'options'], this.state.webTemplateOptions)
      .setIn([5, 'options'], this.state.macOptions)
      .setIn([6, 'options'], this.state.ssidOptions);

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
