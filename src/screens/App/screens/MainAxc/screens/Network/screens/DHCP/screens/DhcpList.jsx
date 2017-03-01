import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const listOptions = fromJS([
  {
    id: 'name',
    text: _('Name'),
    formProps: {
      required: true,
      maxLength: '31',
      notEditable: true,
      validator: validator({
        rules: 'utf8Len:[1, 31]',
      }),
    },
  }, {
    id: 'domain',
    text: _('Domain'),
    formProps: {
      maxLength: '31',
      type: 'text',
    },
  }, {
    id: 'startIp',
    text: _('IP Address'),
    formProps: {
      required: true,
      notEditable: true,
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'mask',
    text: _('Subnet Mask'),
    formProps: {
      required: true,
      notEditable: true,
      validator: validator({
        rules: 'mask',
      }),
    },
  }, {
    id: 'gateway',
    text: _('Gateway'),
    formProps: {
      required: true,
      maxLength: '31',
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'mainDns',
    text: _('Primary DNS'),
    formProps: {
      maxLength: '31',
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'secondDns',
    text: _('Secondary DNS'),
    formProps: {
      maxLength: '31',
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'releaseTime',
    text: _('Lease Time'),
    formProps: {
      type: 'number',
      required: true,
      help: _('Range: 300-604800 Seconds'),
      min: '300',
      max: '604800',
      defaultValue: '7200',
      validator: validator({
        rules: 'num[300,604800]',
      }),
    },
  }, {
    id: 'opt43',
    text: _('AC Address'),
    noTable: true,
    formProps: {
      type: 'text',
      validator: validator({
        rules: 'iplist:[";"]',
      }),
    },
  }, {
    id: 'opt60',
    text: _('Vendor ID'),
    noTable: true,
    formProps: {
      type: 'number',
      min: '0',
      maxLength: '31',
      defaultValue: '',
      validator: validator({
        rules: 'len[1,31]',
      }),
    },
  },
]);
const editFormOptions = immutableUtils.getFormOptions(listOptions);
const propTypes = {
  route: PropTypes.object,
  store: PropTypes.object,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
    utils.binds(this, [
      'onBeforeSync',
    ]);
  }

  onBeforeSync($$actionQuery, $$curListItem) {
    const { store, route } = this.props;
    const $$curList = store.getIn([route.id, 'data', 'list']);
    const actionType = $$actionQuery.get('action');
    const startIp = $$curListItem.get('startIp');
    const mask = $$curListItem.get('mask');
    const gateway = $$curListItem.get('gateway');
    let ret = '';

    if (actionType === 'add' || actionType === 'edit') {
      ret = validator.combine.needSameNet(startIp, mask, gateway, {
        ipLabel: _('Start IP'),
        ip2Label: _('Gateway'),
      });

      if ($$curList.find(
        $$item => validator.combine.noSameSegment(
          startIp,
          mask,
          $$item.get('startIp'),
          $$item.get('mask'),
          {
            ipLabel: '',
            ip1Label: '',
          },
        ),
      )) {
        ret = _('Same %s item already exists', _('segment'));
      }
    }

    return ret;
  }

  render() {
    return (
      <AppScreen
        {...this.props}
        listOptions={listOptions}
        editFormOptions={editFormOptions}
        onBeforeSync={this.onBeforeSync}
        listKey="name"
        maxListSize="32"
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
