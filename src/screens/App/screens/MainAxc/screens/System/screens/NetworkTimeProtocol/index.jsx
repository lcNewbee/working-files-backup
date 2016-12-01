import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import FormGroup from 'shared/components/Form/FormGroup';
import MySelect from 'shared/components/Select/index';
import SaveButton from 'shared/components/Button/SaveButton';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';

const propTypes = {
  store: PropTypes.instanceOf(Map),
};
const defaultProps = {};

const settingsOptions = fromJS([
  {
    id: 'ipType',
    label: _('IP Type'),
    fileset: 'acTime',
    legend: _('AC Time Synchronization Setting'),
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
    defaultValue: 'ipv6',
  },
  {
    id: 'we',
    label: _('IP Type'),
    fileset: 'acTime',
    type: 'select',
    options: [
      {
        value: 'ipv4',
        disabled: true,
        label: _('IPv4'),
      }, {
        value: 'ipv6',
        label: _('IPv6'),
      },
    ],
    defaultValue: 'ipv6',
  },
]);


export default class View extends React.Component {
  render() {
    return (
      <AppScreen
        {...this.props}
        settingsFormOptions={settingsOptions}
        noTitle
      />
    );
  }
}
//  <div className="o-form">
//           <fileset>
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
//           </fileset>

//           <fileset>
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
//           </fileset>
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
