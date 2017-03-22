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
            value: item.id,
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
    text: __('Name'),
    width: '120px',
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'ip',
    text: __('IP'),
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
    text: __('Mac'),
    formProps: {
      type: 'number',
      required: true,
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'address',
    text: __('Address'),
    formProps: {
      type: 'text',
      required: true,
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
    id: 'web',
    text: __('Web Template'),
    formProps: {
      type: 'select',
      required: true,
    },
  }, {
    id: 'count',
    text: __('Authetication Count'),
    noTable: true,
    formProps: {
      type: 'number',
      required: true,
    },
  }, {
    id: 'des',
    text: __('Description'),
    noTable: true,
    formProps: {
      type: 'textarea',
      required: true,
    },
  }, {
    id: 'x',
    text: __('X'),
    noForm: true,
    noTable: true,
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'y',
    text: __('Y'),
    noForm: true,
    noTable: true,
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'ssid',
    text: __('SSID Location'),
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
      webTemplateOptions: fromJS([]),
    };
  }
  componentWillMount() {
    getWebTemplate()
      .then((data) => {
        this.setState({
          webTemplateOptions: fromJS(data.options),
        });
      });
  }
  render() {
    const curListOptions = listOptions
      .setIn([5, 'options'], this.state.webTemplateOptions);
    return (
      <AppScreen
        {...this.props}
        listOptions={curListOptions}
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
