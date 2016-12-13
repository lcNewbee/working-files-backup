import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import validator from 'shared/utils/lib/validator';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

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
    label: _('Exactly-once'),
  }, {
    value: 'Mon&Tue&Wed&Thu&Fri&Sat&Sun',
    label: _('Everyday'),
  }, {
    value: 'Mon&Tue&Wed&Thu&Fri',
    label: _('Weekdays'),
  },
  // {
  //   value: 'Loop',
  //   label: _('Fixed Time Interval'),
  // },
  {
    value: 'custom',
    label: _('Custom'),
  },
];
const objectsNameOptions = [
  {
    value: 'ssid',
    label: _('SSID'),
  }, {
    value: 'scan',
    label: _('Scan'),
  },
];

const daysOptions = fromJS([
  {
    value: 'Mon',
    label: _('Mon'),
  }, {
    value: 'Tue',
    label: _('Tue'),
  }, {
    value: 'Wed',
    label: _('Wed'),
  }, {
    value: 'Thu',
    label: _('Thu'),
  }, {
    value: 'Fri',
    label: _('Fri'),
  }, {
    value: 'Sat',
    label: _('Sat'),
  }, {
    value: 'Sun',
    label: _('Sun'),
  },
]);
const screenOptions = fromJS([
  {
    id: 'policy_type',
    label: _('Repeat'),
    options: policyTypeOptions,
    width: '120',
    defaultValue: 'Mon&Tue&Wed&Thu&Fri&Sat&Sun',
    transform(val) {
      const oldVal = val;
      let ret = oldVal || '';

      if (oldVal !== 'Mon&Tue&Wed&Thu&Fri&Sat&Sun' &&
        oldVal !== 'Mon&Tue&Wed&Thu&Fri' && oldVal !== 'Once') {
        ret = ret.split('&').map(
          day => _(day),
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
    label: _('Custom Cycle'),
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
      showPrecondition($$data) {
        const curRepaet = $$data.get('policy_type');

        return curRepaet === 'custom';
      },
    },
  }, {
    id: 'policy_times',
    width: '130',
    text: _('Time'),
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
    text: _('Date'),
    noTable: true,
    defaultValue: moment().format('YYYY-MM-DD'),
    formProps: {
      type: 'date',
      showPrecondition($$data) {
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
    text: _('Time'),
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
    label: _('Type'),
    options: objectsNameOptions,
    defaultValue: 'ssid',
    formProps: {
      type: 'switch',
    },
  }, {
    id: 'objects_templatename',
    text: _('Operation Object'),
    formProps: {
      type: 'select',
      required: true,
      showPrecondition($$data) {
        const curRepaet = $$data.get('objects_name');

        return curRepaet !== 'scan';
      },
    },
  }, {
    id: 'objects_templateswitch',
    text: _('Operation'),
    defaultValue: '1',
    options: [
      {
        value: '1',
        label: _('Enable'),
      }, {
        value: '0',
        label: _('Disable'),
      },
    ],
    formProps: {
      type: 'switch',
      showPrecondition($$data) {
        const curRepaet = $$data.get('objects_name');

        return curRepaet !== 'scan';
      },
    },
  }, {
    id: 'policy_enbale',
    label: _('Policy Switch'),
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
      ssidOptions: fromJS([]),
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

  componentDidUpdate(prevProps) {
    this.fetchObjectList(prevProps);
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

      this.props.updateCurEditListItem(subItem);
    }
  }

  fetchObjectList(prevProps) {
    const { store } = this.props;
    const curScreenId = store.get('curScreenId');
    const curListObjectType = store.getIn([curScreenId, 'curListItem', 'objects_name']);
    let prevListObjectType;

    if (prevProps) {
      prevListObjectType = prevProps.store.getIn([curScreenId, 'curListItem', 'objects_name']);
    }

    if (curListObjectType === 'ssid') {
      if (prevListObjectType !== 'ssid' || prevProps.groupid !== this.props.groupid ||
          this.state.ssidOptions.isEmpty()) {
        getSsidList({
          groupid: this.props.groupid,
          page: 1,
          size: 100,
        }).then(
          (options) => {
            this.setState({
              ssidOptions: fromJS(options),
            });
          },
        );
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
      this.state.ssidOptions,
    ).setIn(
      [
        screenOptions.findIndex(
          $$item => $$item.get('id') === 'objects_templateid',
        ),
        'options',
      ],
      this.state.objectsIdOptions,
    );

    return (
      <AppScreen
        {...this.props}
        title={_('Wireless Scheduler')}
        listOptions={curListOptions}
        onBeforeSave={this.onBeforeSave}
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
