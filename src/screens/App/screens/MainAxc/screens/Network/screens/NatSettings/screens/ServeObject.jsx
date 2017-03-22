import React from 'react';
import { fromJS } from 'immutable';
import { AppScreen, FormInput, } from 'shared/components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';

const portIdOptions = [
  { label: 'GE0/0', value: '0' },
  { label: 'GE0/1', value: '1' },
  { label: 'GE0/2', value: '2' },
  { label: 'GE0/3', value: '3' },
  { label: 'GE0/4', value: '4' },
  { label: 'GE0/5', value: '5' },
  { label: 'GE0/6', value: '6' },
  { label: 'GE0/7', value: '7' },
  { label: 'GE0/8', value: '8' },
  { label: 'GE0/9', value: '9' },
  { label: 'GE0/10', value: '10' },
  { label: 'GE0/11', value: '11' },
  { label: 'GE0/12', value: '12' },
  { label: 'GE0/13', value: '13' },
];

const slotIdOptions = [
  { label: 'slot_0', value: '0' },
  { label: 'slot_1', value: '1' },
  { label: 'slot_2', value: '2' },
  { label: 'slot_3', value: '3' },
];

const balanceAlgthmOptions = [
  { label: __('Source MAC'), value: 'srcmac' },
  { label: __('Destiation MAc'), value: 'desmac' },
  { label: __('Source & Destination MAC'), value: 'mac' },
  { label: __('Source IP'), value: 'srcip' },
  { label: __('Destination IP'), value: 'desmac' },
  { label: __('Source & Destination IP'), value: 'ip' },
];

const protoTypeOptions = [
  { label: 'any', value: 'any' },
  { label: 'icmp', value: 'icmp' },
  { label: 'tcp', value: 'tcp' },
  { label: 'udp', value: 'udp' },
  { label: 'icmpv6', value: 'icmpv6' },
];

export default class View extends React.Component {
  constructor(props) {
    super(props);

    // this.aclGroupListOptions = fromJS([]);
  }

//   componentWillMount() {
//     this.props.fetch('goform/network/extendacl/rulebinding', { page: 'all' })
//         .then((json) => {
//           if (json.state && json.state.code === 2000) {
//             const list = fromJS(json.data.list);
//             this.aclGroupListOptions = list.map((item) => {
//               const groupId = item.get('groupId');
//               const groupName = item.get('groupName');
//               return fromJS({ label: groupName, value: groupId });
//             });
//           }
//           console.log(this.aclGroupListOptions);
//         });
//   }

  render() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const curListItem = store.getIn([curScreenId, 'curListItem']);
    const listOptions = fromJS([
      {
        id: 'id',
        type: 'select',
        text: __('ID'),
        notEditable: true,
        formProps: {
          noAdd: true,
        },
      },
      {
        id: 'serveName',
        text: __('Serve Name'),
        formProps: {
          type: 'text',
        },
      },
      {
        id: 'protoType',
        text: __('Protocol'),
        formProps: {
          type: 'select',
          options: protoTypeOptions,
        },
      },
      {
        id: 'srcPortRange',
        text: __('Source Port'),
        transform: (val, item) => {
          const srcStartPort = item.get('srcStartPort');
          const srcEndPort = item.get('srcEndPort');
          return `${srcStartPort} - ${srcEndPort}`;
        },
        formProps: {
          children: [
            <FormInput
              type="number"
              className="fl"
              style={{ width: '93px' }}
              value={curListItem.get('srcStartPort')}
            />,
            <span
              className="fl"
              style={{ marginTop: '5px' }}
            >
              {'-- '}
            </span>,
            <FormInput
              type="number"
              className="fl"
              style={{ width: '93px' }}
              value={curListItem.get('srcEndPort')}
            />,
          ],
        },
      },
      {
        id: 'destPortRange',
        text: __('Destination Port'),
        transform: (val, item) => {
          const destStartPort = item.get('srcStartPort');
          const destEndPort = item.get('srcEndPort');
          return `${destStartPort} - ${destEndPort}`;
        },
        formProps: {
          children: [
            <FormInput
              type="number"
              className="fl"
              style={{ width: '93px' }}
              value={curListItem.get('destStartPort')}
            />,
            <span
              className="fl"
              style={{ marginTop: '5px' }}
            >
              {'-- '}
            </span>,
            <FormInput
              type="number"
              className="fl"
              style={{ width: '93px' }}
              value={curListItem.get('destEndPort')}
            />,
          ],
        },
      },
      {
        id: 'description',
        text: __('Description'),
        formProps: {
          type: 'textarea',
        },
      },
    ]);
    return (
      <AppScreen
        {...this.props}
        listOptions={listOptions}
        addable
        deleteable
        actionable
        editable
        selectable
      />
    );
  }
}

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

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(View);
