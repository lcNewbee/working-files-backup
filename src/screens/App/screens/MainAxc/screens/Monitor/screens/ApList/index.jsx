import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import utils from 'shared/utils';
import AppScreen from 'shared/components/Template/AppScreen';

// custom
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';
import * as propertiesActions from 'shared/actions/properties';

const flowRateFilter = utils.filter('flowRate:["KB"]');
const listOptions = fromJS([
  {
    id: 'devicename',
    width: '180',
    text: `${_('MAC Address')}/${_('Name')}`,
    transform(val, item) {
      return item.get('devicename') || item.get('mac');
    },
  }, {
    id: 'ip',
    width: '160',
    text: _('IP Address'),
  }, {
    id: 'mac',
    width: '160',
    text: _('MAC Address'),
  }, {
    id: 'connectedNumbers',
    width: '80',
    text: _('Connected Numbers'),
  }, {
    id: 'bandwidth',
    width: '80',
    text: _('Data'),
    transform(val, item) {
      const upRate = flowRateFilter.transform(item.get('upstream'));
      const downRate = flowRateFilter.transform(item.get('downstream'));

      return `${upRate}/${downRate}`;
    },
  }, {
    id: 'operationhours',
    text: _('Uptime'),
    width: '80',
    filter: 'connectTime',
  },
]);

const propTypes = {
  addToPropertyPanel: PropTypes.func,
  changeScreenActionQuery: PropTypes.func,
  onListAction: PropTypes.func,
  groupid: PropTypes.any,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);

    this.onAction = this.onAction.bind(this);
  }
  onAction(type, item) {
    const actionQuery = {
      groupid: this.props.groupid,
    };
    if (type === 'edit') {
      actionQuery.mac = item.get('mac');
      this.props.addToPropertyPanel(actionQuery, item.toJS());
    } else {
      actionQuery.mac = item;
      actionQuery.action = type;
      actionQuery.operate = type;
      this.props.changeScreenActionQuery(actionQuery);
      this.props.onListAction();
    }
  }
  render() {
    const myListOptions = listOptions.setIn([0, 'transform'], (val, item) => {
      const mac = item.get('mac');
      return (
        <span
          onClick={() => this.onAction('edit', item)}
          className="link-text"
        >
          { item.get('devicename') || mac }
        </span>
      );
    });

    return (
      <AppScreen
        {...this.props}
        listOptions={myListOptions}
        actionBarButtons={[
          {
            name: 'upgrade',
            text: _('Upgrade'),
            icon: 'arrow-circle-o-up',
          }, {
            name: 'reboot',
            text: _('Reboot'),
            icon: 'recycle',
          }, {
            name: 'reset',
            text: _('Reset'),
            icon: 'reply-all',
          },
        ]}
        listKey="mac"
        addable={false}
        editable={false}
        deleteable={false}
        selectable
        actionable
        searchable
      />
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    groupid: state.product.getIn(['group', 'selected', 'id']),
    apList: state.product.get('devices'),
    store: state.screens,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    screenActions,
    propertiesActions
  ), dispatch);
}


// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(View);
