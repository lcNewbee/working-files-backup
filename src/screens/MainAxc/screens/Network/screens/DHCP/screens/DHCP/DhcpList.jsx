import React from 'react'; import PropTypes from 'prop-types';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';

import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';

const listOptions = fromJS([
  {
    id: 'name',
    text: __('Name'),
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
    text: __('Domain'),
    formProps: {
      maxLength: '31',
      type: 'text',
    },
  }, {
    id: 'startIp',
    text: __('IP Address'),
    formProps: {
      required: true,
      notEditable: true,
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'mask',
    text: __('Subnet Mask'),
    formProps: {
      required: true,
      notEditable: true,
      validator: validator({
        rules: 'mask',
      }),
    },
  }, {
    id: 'gateway',
    text: __('Gateway'),
    formProps: {
      required: true,
      maxLength: '31',
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'mainDns',
    text: __('Primary DNS'),
    formProps: {
      maxLength: '31',
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'secondDns',
    text: __('Secondary DNS'),
    formProps: {
      maxLength: '31',
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'releaseTime',
    text: __('Lease Time'),
    formProps: {
      type: 'number',
      required: true,
      help: __('Range: 300-604800 Seconds'),
      min: '300',
      max: '604800',
      defaultValue: '7200',
      validator: validator({
        rules: 'num[300,604800]',
      }),
    },
  }, {
    id: 'opt43',
    text: __('AC Address'),
    noTable: true,
    formProps: {
      type: 'text',
      validator: validator({
        rules: 'iplist:[";"]',
      }),
    },
  }, {
    id: 'opt60',
    text: __('Vendor ID'),
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
    const actionType = $$actionQuery.get('action');
    const startIp = $$curListItem.get('startIp');
    const mask = $$curListItem.get('mask');
    const gateway = $$curListItem.get('gateway');
    let $$curList = store.getIn([store.get('curScreenId'), 'data', 'list']);
    let ret = '';

    if (actionType === 'add' || actionType === 'edit') {
      ret = validator.combine.needSameNet(startIp, mask, gateway, {
        ipLabel: __('Start IP'),
        ip2Label: __('Gateway'),
      });

      // 过滤正在编辑的项
      if (actionType === 'edit') {
        $$curList = $$curList.filter(
          $$item => $$item.get('name') !== $$curListItem.get('name'),
        );
      }
      console.log($$curList.toJS())
      if ($$curList.find(
        ($$item) => {
          console.log($$item.toJS(), $$item.get('mask'));
          return validator.combine.noSameSegment(
            startIp,
            mask,
            $$item.get('startIp'),
            $$item.get('mask'),
            {
              ipLabel: '',
              ip1Label: '',
            },
          );
        },
      )) {
        ret = __('Same %s item already exists', __('segment'));
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
