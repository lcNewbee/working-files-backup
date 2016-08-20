import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  ListInfo,
} from 'shared/components';
import * as listActions from 'shared/actions/list';
import * as appActions from 'shared/actions/app';

function getInterfaceTypeOptions() {
  return utils.fetch('/goform/interfaceType')
    .then((json) => (
      {
        options: json.data.list.map(
          (item) => ({
            value: item.no,
            label: `${item.no}(${item.noInfo})`,
          })
        ),
      }
    )
  );
}
const screenOptions = fromJS([
  {
    id: 'no',
    text: _('No'),
    formProps: {
      disabled: true,
    },
  }, {
    id: 'ruleType',
    text: _('Rule Type'),
    formProps: {
      type: 'select',
      label: _('NAT Rule Type'),
      placeholder: _('Please Select ') + _('NAT Rule Type'),
      options: [
        {
          value: '0',
          label: _('Static Address Transform'),
        }, {
          value: '1',
          label: _('Static Address Transform'),
        }, {
          value: '2',
          label: _('Target Address Transform'),
        }, {
          value: '3',
          label: _('Public IP Transparent Transmission'),
        },
      ],
    },
  }, {
    id: 'sourceAddress',
    text: _('Source Address'),
    formProps: {
      type: 'select',
      placeholder: _('Please Select ') + _('Source Address'),
      loadOptions: getInterfaceTypeOptions,
      isAsync: true,
    },
  }, {
    id: 'targetAddress',
    text: _('Target Address'),
    formProps: {
      type: 'select',
      placeholder: _('Please Select ') + _('Target Address'),
      loadOptions: getInterfaceTypeOptions,
      isAsync: true,
    },
  }, {
    id: 'serviceObject',
    text: _('Service Object'),
    formProps: {
      type: 'select',
      placeholder: _('Please Select ') + _('Service Object'),
      loadOptions: getInterfaceTypeOptions,
      isAsync: true,
    },
  }, {
    id: 'outgoingInterface',
    text: _('Outgoing Interface'),
    formProps: {
      type: 'select',
      placeholder: _('Please Select ') + _('Outgoing Interface'),
      loadOptions: getInterfaceTypeOptions,
      isAsync: true,
    },
  }, {
    id: 'convertedSourceAddress',
    text: _('Converted Source Address'),
    formProps: {
      type: 'select',
      placeholder: _('Please Select ') + _('Converted Source Address'),
      loadOptions: getInterfaceTypeOptions,
      isAsync: true,
    },
  }, {
    id: 'enableLogging',
    text: _('Enable Logging'),
    formProps: {
      type: 'checkbox',
      text: _('Enable'),
    },
  }, {
    id: 'description',
    text: _('Description'),

    formProps: {
      type: 'textarea',
    },
  },
]);
const tableOptions = screenOptions.map(
  (item) => item.delete('formProps')
);
const editFormOptions = immutableUtils.getFormOptions(screenOptions);

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),

  route: PropTypes.object,
  initList: PropTypes.func,
  closeListItemModal: PropTypes.func,
  save: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);

    this.onAction = this.onAction.bind(this);
  }

  componentWillMount() {
  }

  onAction(mac, action) {
    const query = {
      mac,
      action,
    };

    this.props.save('/goform/blacklist', query)
      .then(() => {});
  }

  render() {
    return (
      <ListInfo
        {...this.props}
        tableOptions={tableOptions}
        editFormOptions={editFormOptions}
        controlAbled
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
    store: state.list,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    listActions
  ), dispatch);
}


// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(View);
