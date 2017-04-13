import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';

function getSsidList(data) {
  return utils.fetch('goform/group/ssidSetting', data)
    .then(json => (
      json.data.list.map(
        item => ({
          value: item.ssid,
          label: item.ssid,
        }),
      )
    ),
  );
}

const policyTypeOptions = [
  {
    value: 'Once',
    label: __('Exactly-once'),
  }, {
    value: 'Mon&Tue&Wed&Thu&Fri&Sat&Sun',
    label: __('Everyday'),
  }, {
    value: 'Mon&Tue&Wed&Thu&Fri',
    label: __('Weekdays'),
  },
  // {
  //   value: 'Loop',
  //   label: __('Fixed Time Interval'),
  // },
  {
    value: 'custom',
    label: __('Custom'),
  },
];
const objectsNameOptions = [
  {
    value: 'ssid',
    label: __('SSID'),
  }, {
    value: 'scan',
    label: __('Scan'),
  },
  // {
  //   value: 'radio',
  //   label: __('Radio'),
  // },
];

const daysOptions = fromJS([
  {
    value: 'Mon',
    label: __('Mon'),
  }, {
    value: 'Tue',
    label: __('Tue'),
  }, {
    value: 'Wed',
    label: __('Wed'),
  }, {
    value: 'Thu',
    label: __('Thu'),
  }, {
    value: 'Fri',
    label: __('Fri'),
  }, {
    value: 'Sat',
    label: __('Sat'),
  }, {
    value: 'Sun',
    label: __('Sun'),
  },
]);

const screenOptions = fromJS([
  {
    id: 'policy_type',
    label: __('Repeat'),
    options: policyTypeOptions,
    width: '120',
    defaultValue: 'Mon&Tue&Wed&Thu&Fri&Sat&Sun',
    transform(val) {
      const oldVal = val;
      let ret = oldVal || '';

      if (oldVal !== 'Mon&Tue&Wed&Thu&Fri&Sat&Sun' &&
        oldVal !== 'Mon&Tue&Wed&Thu&Fri' && oldVal !== 'Once') {
        ret = ret.split('&').map(
          day => __(day),
        ).join(',');
      } else {
        policyTypeOptions.forEach(
          (item) => {
            if (item.value === ret) {
              ret = item.label;
            }
          },
        );
      }
      return ret;
    },
    formProps: {
      type: 'select',
      initValue($$data) {
        const oldVal = $$data.get('policy_type');
        let ret = oldVal;

        if (oldVal !== 'Mon&Tue&Wed&Thu&Fri&Sat&Sun' &&
          oldVal !== 'Mon&Tue&Wed&Thu&Fri' && oldVal !== 'Once') {
          ret = 'custom';
        }
        return ret;
      },
    },
  }, {
    id: 'policy_custom_type',
    label: __('Custom Cycle'),
    noTable: true,
    formProps: {
      type: 'checkboxs',
      splitStr: '&',
      options: daysOptions,
      initValue($$data) {
        const oldVal = $$data.get('policy_type');
        const ret = oldVal;
        return ret;
      },
      visible($$data) {
        const curRepaet = $$data.get('policy_type');

        return curRepaet === 'custom';
      },
    },
  }, {
    id: 'policy_times',
    width: '130',
    text: __('Time'),
    transform(val, $$data) {
      const type = $$data.get('policy_type');
      let ret = val || ' ';

      if (type !== 'Once') {
        ret = ret.split(' ')[1];
      }

      return ret;
    },
    noForm: true,
  }, {
    id: 'policy_date',
    width: '130',
    text: __('Date'),
    noTable: true,
    defaultValue: moment().format('YYYY-MM-DD'),
    formProps: {
      type: 'date',
      visible($$data) {
        const curRepaet = $$data.get('policy_type');

        return curRepaet === 'Once';
      },
      initValue($$data) {
        const oldVal = $$data.get('policy_times');
        let dateStr = oldVal;

        if (oldVal) {
          dateStr = oldVal.split(' ');
          dateStr = dateStr[0];
        } else {
          dateStr = $$data.get('policy_date');
        }
        return dateStr;
      },
    },
  }, {
    id: 'policy_time',
    text: __('Time'),
    noTable: true,
    defaultValue: moment().format('HH:mm'),
    formProps: {
      type: 'time',
      formatter: 'HH:mm',
      showSecond: false,
      initValue($$data) {
        const oldVal = $$data.get('policy_times');
        let timeStr = oldVal;

        if (oldVal) {
          timeStr = oldVal.split(' ')[1];
        } else {
          timeStr = $$data.get('policy_time');
        }
        return timeStr;
      },
    },
  },
  {
    id: 'objects_name',
    label: __('Type'),
    options: objectsNameOptions,
    defaultValue: 'ssid',
    formProps: {
      type: 'switch',
    },
  }, {
    id: 'objects_templatename',
    text: __('Operation Object'),
    formProps: {
      type: 'select',
      required: true,
      visible($$data) {
        const curRepaet = $$data.get('objects_name');

        return curRepaet !== 'scan';
      },
    },
  }, {
    id: 'objects_templateswitch',
    text: __('Operation'),
    defaultValue: '1',
    options: [
      {
        value: '1',
        label: __('Enable'),
      }, {
        value: '0',
        label: __('Disable'),
      },
    ],
    formProps: {
      type: 'switch',
      visible($$data) {
        const curRepaet = $$data.get('objects_name');

        return curRepaet !== 'scan';
      },
    },
  }, {
    id: 'policy_enbale',
    label: __('Policy Switch'),
    width: '90px',
    type: 'switch',
    actionName: 'switch',
    actionKey: 'allKeys',
    defaultValue: '1',
    formProps: {
      type: 'checkbox',
    },
  },
]);

const propTypes = {
  store: PropTypes.object,
  groupid: PropTypes.oneOfType([
    PropTypes.number, PropTypes.string,
  ]),
  groupname: PropTypes.oneOfType([
    PropTypes.number, PropTypes.string,
  ]),
  updateCurEditListItem: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      objectOptions: fromJS([]),
    };
    utils.binds(this, [
      'onBeforeSave',
      'onBeforeAction',
      'fetchObjectList',
    ]);
  }

  componentWillMount() {
    this.fetchObjectList();
  }
  componentWillUpdate(nextProps) {
    this.fetchObjectList(nextProps);
  }

  onBeforeSave($$actionQuery, $$curListItem) {
    const actionType = $$actionQuery.get('action');
    const subItem = {};

    if (actionType === 'add' || actionType === 'edit') {
      subItem.policy_times = `${$$curListItem.get('policy_date')} ${$$curListItem.get('policy_time')}`;

      if ($$curListItem.get('policy_type') === 'custom') {
        subItem.policy_type = $$curListItem.get('policy_custom_type');
      }

      if ($$curListItem.get('objects_name') === 'scan') {
        subItem.objects_templatename = this.props.groupname;
        subItem.objects_templateid = this.props.groupid;
      }

      if ($$curListItem.get('objects_name') === 'radio') {
        subItem.objects_templateid = this.props.groupid;
      }

      this.props.updateCurEditListItem(subItem);
    }
  }

  fetchObjectList(nextProps) {
    const { store } = this.props;
    const curScreenId = store.get('curScreenId');
    const curListObjectType = store.getIn([curScreenId, 'curListItem', 'objects_name']);
    let nextListObjectType = '';

    if (nextProps) {
      nextListObjectType = nextProps.store.getIn([curScreenId, 'curListItem', 'objects_name']);
    }

    if (nextListObjectType !== curListObjectType || nextProps.groupid !== this.props.groupid) {
      if (nextListObjectType === 'ssid') {
        getSsidList({
          groupid: this.props.groupid,
          page: 1,
          size: 100,
        }).then(
          (options) => {
            this.setState({
              objectOptions: fromJS(options),
            });
          },
        );
      } else if (nextListObjectType === 'radio') {
        this.setState({
          objectOptions: fromJS([
            {
              value: '1',
              label: `${__('Radio')}1`,
            },
            {
              value: '2',
              label: `${__('Radio')}2`,
            },
            {
              value: '3',
              label: `${__('Radio')}3`,
            },
            {
              value: '4',
              label: `${__('Radio')}4`,
            },
          ]),
        });
      }
    }
  }

  render() {
    const curListOptions = screenOptions.setIn(
      [
        screenOptions.findIndex(
          $$item => $$item.get('id') === 'objects_templatename',
        ),
        'options',
      ],
      this.state.objectOptions,
    );

    return (
      <AppScreen
        {...this.props}
        title={__('Wireless Scheduler')}
        listOptions={curListOptions}
        onBeforeSave={this.onBeforeSave}
        initOption={{
          query: {
            page: 1,
            size: 50,
          },
        }}
        listKey="policy_id"
        actionable
        selectable
        deleteable
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
    groupname: state.product.getIn(['group', 'selected', 'groupname']),
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
