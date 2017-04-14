import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { bindActionCreators } from 'redux';
import { fromJS, Map, List } from 'immutable';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import validator from 'shared/validator';
import { FormGroup } from 'shared/components/Form';
import { SaveButton } from 'shared/components';
import { actions as appActions } from 'shared/containers/app';
import * as myActions from './actions';
import myReducer from './reducer';


const msg = {
  upSpeed: __('Up Speed'),
  downSpeed: __('Down Speed'),
  selectGroup: __('Select Group'),
};
const encryptionOptions = [
  {
    value: 'none',
    label: __('NONE'),
  },
  {
    value: 'psk-mixed',
    label: __('STRONG'),
  },
];

const propTypes = {
  fetchDeviceGroups: PropTypes.func,
  fetching: PropTypes.bool,
  data: PropTypes.instanceOf(Map),
  groups: PropTypes.instanceOf(List),
};

const validOptions = Map({});

export const Voip = React.createClass({
  mixins: [PureRenderMixin],

  propTypes,

  componentWillMount() {
    this.props.fetchVoipSettings();
  },

  componentDidUpdate(prevProps) {
    if (prevProps.app.get('refreshAt') !== this.props.app.get('refreshAt')) {
      this.props.fetchVoipSettings();
    }
  },

  componentWillUnmount() {
    this.props.resetVaildateMsg();
  },

  onUpdate(name) {
    return function (data) {
      const settings = {};

      settings[name] = data.value;
      this.props.changeVoipSettings(settings);
    }.bind(this);
  },

  onChangeGroup(item) {
    this.props.changeVoipGroup(item.value);
  },

  onChangeEncryption(item) {
    const data = {
      encryption: item.value,
    };

    this.props.changeVoipSettings(data);
  },

  onSave() {
    this.props.validateAll()
      .then((invalid) => {
        if (invalid.isEmpty()) {
          this.props.setVoip();
        }
      });
  },

  getCurrData(name) {
    return this.props.store.getIn(['data', 'curr', name]);
  },

  getGroupOptions() {
    return this.props.store
      .getIn(['data', 'list'])
      .map((item, i) => {
        const groupname = item.get('groupname');
        let label = groupname;

        if (groupname === 'Default') {
          label = __('Ungrouped Devices');
        }
        return {
          value: groupname,
          label,
        };
      })
      .toJS();
  },

  render() {
    const groupOptions = this.getGroupOptions();
    const getCurrData = this.getCurrData;
    const noControl = this.props.app.get('noControl');

    let settngClassName = 'none';

    if (getCurrData('enable') == '1') {
      settngClassName = '';
    }

    return (
      <div>
        <h3>{ __('Current Group') }</h3>
        <FormGroup
          label={msg.selectGroup}
          type="select"
          options={groupOptions}
          value={getCurrData('groupname')}
          onChange={this.onChangeGroup}
        />

        <h3>{__('VoIP Settings') }</h3>
        <FormGroup
          label={__('Enable VoIP')}
          type="checkbox"
          options={{
            label: __('Enable'),
          }}
          checked={getCurrData('enable') == '1'}
          onChange={this.onUpdate('enable')}
        />

        <FormGroup role="save">
          {
            noControl ? null : (
              <SaveButton
                type="button"
                loading={this.props.app.get('saving')}
                onClick={this.onSave}
              />
            )
          }
        </FormGroup>
      </div>
    );
  },
});

function mapStateToProps(state) {
  const myState = state.voip;

  return {
    store: myState,
    app: state.app,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    myActions,
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions),
)(Voip);

export const reducer = myReducer;
