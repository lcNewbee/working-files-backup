import React, { PropTypes } from 'react';
import { Map } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {
  FormGroup,
} from '../Form';

import {
  SaveButton,
} from '../Button';

const propTypes = {
  onChangeData: PropTypes.func,
  onChangeItem: PropTypes.func,
  onSave: PropTypes.func,

  store: PropTypes.instanceOf(Map),
  app: PropTypes.instanceOf(Map),
};

const defaultProps = {
};
class DeviceSystem extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onSave = this.onSave.bind(this);
    this.getCurData = this.getCurData.bind(this);
  }
  onSave() {
    if (this.props.onSave) {
      this.props.onSave();
    }
  }
  getCurData(name) {
    return this.props.store.getIn(['data', name]);
  }
  render() {
    const { app } = this.props;
    const { getCurData } = this;

    return (
      <div className="o-form o-form--compassed">
        <FormGroup
          type="switch"
          inputStyle={{
            display: 'block',
          }}
          label={_('Select Network Adapter')}
          value={getCurData('activeIndex')}
          options={getCurData('radiosOptions')}
          onChange={option => this.props.onChangeItem({
            configurationRadioIndex: option.value,
          })}
        />
        <FormGroup
          type="number"
          label={_('Max Users')}
          value={getCurData('maxclientcount')}
          onChange={option => this.props.onChangeData({
            maxclientcount: option.value,
          })}
        />
        <div className="row">
          <div className="cols col-6">
            <FormGroup
              type="number"
              label={_('Beacon Interval')}
              value={getCurData('beaconinterval')}
              onChange={option => this.props.onChangeData({
                beaconinterval: option.value,
              })}
            />
          </div>
          <div className="cols col-6">
            <FormGroup
              type="number"
              label={_('Beacon Interval Number')}
              value={getCurData('dtim')}
              onChange={option => this.props.onChangeData({
                dtim: option.value,
              })}
            />
          </div>
        </div>
        <FormGroup
          type="number"
          label={_('RTS Threshold')}
          value={getCurData('rtsthreshold')}
          onChange={option => this.props.onChangeData({
            rtsthreshold: option.value,
          })}
        />
        <FormGroup
          type="switch"
          inputStyle={{
            display: 'block',
          }}
          options={[
            {
              value: '-1',
              label: 'Disable',
            }, {
              value: '0',
              label: 'Long',
            }, {
              value: '1',
              label: 'Short',
            },
          ]}
          label={_('Preamble')}
          value={getCurData('preamble')}
          onChange={option => this.props.onChangeData({
            preamble: option.value,
          })}
        />

        <div className="form-group--save">
          <SaveButton
            size="sm"
            loading={app.get('saving')}
            onClick={this.onSave}
          />
        </div>

      </div>
    );
  }
}
DeviceSystem.propTypes = propTypes;
DeviceSystem.defaultProps = defaultProps;

export default DeviceSystem;
