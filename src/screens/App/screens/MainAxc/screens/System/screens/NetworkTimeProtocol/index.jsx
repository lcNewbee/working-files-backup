import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';

const propTypes = {
  store: PropTypes.instanceOf(Map),
};
const defaultProps = {};

const settingsOptions = fromJS([
  {
    id: 'service',
    label: _('Service'),
    fieldset: 'acTime',
    legend: _('AC Time Synchronization Setting'),
    type: 'checkbox',
  },
  {
    id: 'server1',
    fieldset: 'acTime',
    label: _('Server1'),
    type: 'text',
  },
  {
    id: 'server2',
    fieldset: 'acTime',
    label: _('Server2'),
    type: 'text',
  },
  {
    id: 'server3',
    fieldset: 'acTime',
    label: _('Server3'),
    type: 'text',
  },
  {
    id: 'sTimeInterval',
    fieldset: 'acTime',
    label: _('Synchronization Time Interval'),
    type: 'text',
  },
  {
    id: 'service2',
    label: _('Service'),
    fieldset: 'apTime',
    legend: _('AP Time Synchronization Setting'),
    type: 'checkbox',
  },
  {
    id: 'ipType',
    label: _('IP Type'),
    fieldset: 'apTime',
    type: 'select',
    options: [
      {
        value: 'ipv4',
        label: _('IPv4'),
      }, {
        value: 'ipv6',
        label: _('IPv6'),
      },
    ],
    defaultValue: 'ipv4',
  },
  {
    id: 'ipAddress',
    label: _('Synchronization IP Address'),
    type: 'text',
  },
  {
    id: 'syTimeInterval',
    label: _('Synchronization Time Interval'),
    type: 'text',
  },

]).groupBy(item => item.get('fieldset'))
.toList();


export default class View extends React.Component {
  render() {
    return (
      <AppScreen
        {...this.props}
        settingsFormOptions={settingsOptions}
        hasSettingsSaveButton
        noTitle
      />
    );
  }
}
//  <div className="o-form">
//           <fieldset>
//             <legend className="o-form__legend">{_('AC Time Synchronization Setting')}</legend>
//             <FormGroup
//               label={_('Service')}
//               type="checkbox"
//               value="1"
//             />
//             <FormGroup
//               label={_('Server1')}
//               type="text"
//             />
//             <FormGroup
//               label={_('Server2')}
//               type="text"
//             />
//             <FormGroup
//               label={_('Server3')}
//               type="text"
//             />
//             <FormGroup label={_('Synchronization Time Interval')}>
//               <input
//                 type="text"
//               />
//             </FormGroup>
//           </fieldset>

//           <fieldset>
//             <legend className="o-form__legend">{_('AP Time Synchronization Setting')}</legend>
//             <FormGroup
//               label={_('Service')}
//               type="checkbox"
//               value="1"
//             />
//             <FormGroup
//               // label={_('IP Type')}
//               // type="select"
//               options={selectOptions}
//             />
//             <FormGroup
//               label={_('Synchronization IP Address')}
//               type="text"
//             />
//             <FormGroup
//               label={_('Synchronization Time Interval')}
//               type="text"
//             />
//           </fieldset>
//         </div>
//       </AppScreen>

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
