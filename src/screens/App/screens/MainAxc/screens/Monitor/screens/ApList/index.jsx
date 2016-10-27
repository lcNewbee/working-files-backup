import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import utils from 'shared/utils';
import Button from 'shared/components/Button/Button';
import ListInfo from 'shared/components/Template/ListInfo';

// custom
import * as screenActions from 'shared/actions/screens';
import * as propertiesActions from 'shared/actions/properties';

const flowRateFilter = utils.filter('flowRate:["KB"]');
const apTableOptions = fromJS([
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
    text: _('Up/Down Speed'),
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
    }
    if (type === 'edit') {
      actionQuery.mac = item.get('mac');
      this.props.addToPropertyPanel(actionQuery, item.toJS());
    } else {
      actionQuery.mac = item;
      actionQuery.operate = type;
    }
  }
  render() {
    const myTableOptions = apTableOptions.push(fromJS({
      id: 'mac',
      text: _('Actions'),
      width: '290',
      transform: mac => (
        <div className="action-btns">
          <Button
            onClick={() => this.onAction('reboot', mac)}
            text={_('Reboot')}
            size="sm"
            icon="recycle"
          />
          <Button
            onClick={() => this.onAction('locate', mac)}
            text={_('Locate')}
            size="sm"
            icon="location-arrow"
          />
          <Button
            onClick={() => this.onAction('reset', mac)}
            text={_('Reset')}
            size="sm"
            icon="reply-all"
          />
        </div>
      ),
    }))
    .setIn([0, 'transform'], (val, item) => {
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
    const actionBarChildren = (
      <Button
        key="upgradeAp"
        onClick={() => this.onAction('upgrade')}
        text={_('Upgrade')}
        icon="arrow-circle-o-up"
      />
    );

    return (
      <ListInfo
        {...this.props}
        tableOptions={myTableOptions}
        actionBarChildren={actionBarChildren}
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
    groupid: state.product.getIn(['group', 'selected', 'id']),
    apList: state.product.get('devices'),
    store: state.screens,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    screenActions,
    propertiesActions
  ), dispatch);
}


// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(View);
