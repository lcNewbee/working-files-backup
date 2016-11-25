import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import validator from 'shared/utils/lib/validator';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
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
  }, {
    value: 'custom',
    label: _('Custom'),
  },
];

const validOptions = Map({
  password: validator({
    rules: 'remarkTxt:["\'\\\\"]|len:[8, 31]',
  }),
  vlanid: validator({
    rules: 'num:[2, 4095]',
  }),
  ssid: validator({
    rules: 'remarkTxt:["\'\\\\"]|len:[1, 31]',
  }),
  upstream: validator({
    rules: 'num:[32, 102400, 0]',
  }),
  downstream: validator({
    rules: 'num:[32, 102400, 0]',
  }),
});
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
    formProps: {
      type: 'select',
    },
  }, {
    id: 'policy_custom_type',
    label: _('Custom Cycle'),
    noTable: true,
    formProps: {
      type: 'checkboxs',
      splitStr: '&',
      options: daysOptions,
      showPrecondition($$data) {
        const curRepaet = $$data.get('policy_type');

        return curRepaet === 'custom';
      },
    },
  }, {
    id: 'policy_times',
    width: '130',
    text: _('Time'),
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
    },
  }, {
    id: 'objects_templatename',
    text: _('Operation Object'),
    formProps: {
      type: 'select',
      required: true,
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
  }, {
    id: 'objects_name',
    noTable: true,
    noForm: true,
    defaultValue: 'ssid',
  },
]);

const propTypes = {
  groupid: PropTypes.oneOfType([
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
    ]);
  }

  componentWillMount() {
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

  onBeforeAction($$actionQuery) {
    const actionType = $$actionQuery.get('action');
    let ret = '';

    if (actionType === 'switch') {
      ret = '';
    }

    return ret;
  }

  onBeforeSave($$actionQuery, $$curListItem) {
    const actionType = $$actionQuery.get('action');
    const subItem = {};

    if (actionType === 'add' || actionType === 'edit') {
      subItem.policy_times = `${$$curListItem.get('policy_date')} ${$$curListItem.get('policy_time')}`;

      if ($$curListItem.get('policy_type') === 'custom') {
        subItem.policy_type = $$curListItem.get('policy_custom_type');
      }
      this.props.updateCurEditListItem(subItem);
    }
  }

  render() {
    const curListOptions = screenOptions.setIn(
      [6, 'options'],
      this.state.ssidOptions,
    );

    return (
      <AppScreen
        {...this.props}
        listOptions={curListOptions}
        onBeforeSave={this.onBeforeSave}
        onBeforeAction={this.onBeforeAction}
        listKey="policy_id"
        actionable
        selectable
        deleteable
      />
    );
  }
}


        // <Modal
        //   isShow={actionQuery.get('action') === 'add' || actionQuery.get('action') === 'edit'}
        //   title={actionQuery.get('myTitle')}
        //   onOk={() => this.props.closeListItemModal(route.id)}
        //   onClose={() => this.props.closeListItemModal(route.id)}
        //   cancelButton={false}
        //   okButton={false}
        //   noFooter
        // >
        //   <FormGroup
        //     type="select"
        //     label={_('Repeat')}
        //     options={repeatOptions}
        //     value={getCurrData('repeat')}
        //     onChange={this.onUpdateSettings('repeat')}
        //   />
        //   {
        //     getCurrData('repeat') === 'once' ? (
        //       <FormGroup
        //         type="date"
        //         label={_('Date')}
        //         displayFormat="YYYY-MM-DD"
        //         value={getCurrData('customDate')}
        //         onChange={data => this.props.updateCurEditListItem({
        //           customDate: data.value,
        //         })}
        //         // withPortal
        //       />
        //     ) : null
        //   }

        //   {
        //     getCurrData('repeat') === 'custom' ? (
        //       <FormGroup
        //         type="checkboxs"
        //         splitStr="&"
        //         value={getCurrData('policy_type')}
        //         label={_('Custom Cycle')}
        //         options={daysOptions}
        //         onChange={data => this.props.updateCurEditListItem({
        //           policy_type: data.value,
        //         })}
        //       />
        //     ) : null
        //   }

          // <FormGroup
          //   label={_('Time')}
          //   type="time"
          //   value={moment(getCurrData('startTime').replace(':', ''), 'hmm')}
          //   format="HH:mm"
          //   showSecond={false}
          //   onChange={data => this.props.updateCurEditListItem({
          //     startTime: data.value,
          //   })}
          // />
        //   <FormGroup
        //     type="switch"
        //     label={_('Operation')}
        //     value={getCurrData('operation')}
        //     onChange={this.onUpdateSettings('operation')}
        //     options={[
        //       {
        //         value: 1,
        //         label: _('Enable'),
        //       }, {
        //         value: 0,
        //         label: _('Disable'),
        //       },
        //     ]}
        //   />
        //   <FormGroup
        //     type="select"
        //     label={_('Operation Object')}
        //     options={[
        //       {
        //         value: 1,
        //         label: _('SSID1'),
        //       }, {
        //         value: 1,
        //         label: _('SSID2'),
        //       },
        //     ]}
        //     value={getCurrData('opObject')}
        //     onChange={this.onUpdateSettings('opObject')}
        //   />

        //   <FormGroup
        //     type="text"
        //     label={_('Description')}
        //     value={getCurrData('remark')}
        //     onChange={this.onUpdateSettings('remark')}
        //   />

        //   <FormGroup
        //     label={_('Enable The Policy')}
        //     type="checkbox"
        //   />

        //   <div className="form-group form-group--save">
        //     <div className="form-control">
        //       <SaveButton
        //         type="button"
        //         loading={this.props.app.get('saving')}
        //         onClick={this.onSave}
        //       />
        //     </div>
        //   </div>
        // </Modal>

View.propTypes = propTypes;
View.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    groupid: state.product.getIn(['group', 'selected', 'id']),
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
  validator.mergeProps(validOptions),
)(View);
