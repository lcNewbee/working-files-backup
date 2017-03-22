import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

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
const $$listOptions = fromJS([
  {
    id: 'name',
    text: __('Port Name'),
    options: [],
    formProps: {
      form: 'port',
      type: 'select',
      notEditable: true,
      required: true,
    },
  }, {
    id: 'ip',
    text: __('IP Address'),
    formProps: {
      form: 'port',
      type: 'text',
      required: true,
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'mask',
    text: __('Subnet Mask'),
    formProps: {
      form: 'port',
      type: 'text',
      required: true,
      validator: validator({
        rules: 'mask',
      }),
    },
  },
]);
const propTypes = {};
const defaultProps = {};


export default class NetworkInterface extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      portOptions: fromJS([]),
      listOptions: $$listOptions,
    };
    utils.binds(this, [
      'onBeforeSync',
    ]);
  }

  componentWillMount() {
    getPortList()
      .then(
        (data) => {
          this.setState({
            listOptions: $$listOptions.setIn(
              [0, 'options'],
              data.options,
            ),
          });

          return data;
        },
      );
  }

  onBeforeSync($$actionQuery, $$curListItem) {
    const { store, route } = this.props;
    const actionType = $$actionQuery.get('action');
    const ip = $$curListItem.get('ip');
    const mask = $$curListItem.get('mask');
    let $$curList = store.getIn([route.id, 'data', 'list']);
    let ret = '';

    if (actionType === 'add' || actionType === 'edit') {
      ret = validator.combine.noBroadcastIp(ip, mask);

      // 过滤正在编辑的项
      if (actionType === 'edit') {
        $$curList = $$curList.filter(
          $$item => $$item.get('id') !== $$curListItem.get('id'),
        );
      }

      // 检测是否有相同IP或网段的接口
      if ($$curList.find($$item => ip === $$item.get('ip'))) {
        ret = __('Same %s item already exists', __('IP'));
      } else if ($$curList.find(
        $$item => validator.combine.needSeparateSegment(
          ip,
          mask,
          $$item.get('ip'),
          $$item.get('mask'),
          {
            ipLabel: '',
            ip1Label: '',
          },
        ),
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
        listOptions={this.state.listOptions}
        onBeforeSync={this.onBeforeSync}
        editFormId="port"
        listKey="allKeys"
        maxListSize="24"
        deleteable={
          ($$item, index) => (index !== 0)
        }
        selectable={
          ($$item, index) => (index !== 0)
        }
        actionable
      />
    );
  }
}

NetworkInterface.propTypes = propTypes;
NetworkInterface.defaultProps = defaultProps;

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
)(NetworkInterface);
