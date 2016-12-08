import React, { PropTypes } from 'react';
import { Map } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { radioAdvance } from 'shared/config/axcRadio';
import {
  FormGroup,
} from '../Form';
import FormContainer from '../Organism/FormContainer';

const propTypes = {
  onChangeData: PropTypes.func,
  onChangeItem: PropTypes.func,
  onSave: PropTypes.func,
  actionable: PropTypes.bool,

  store: PropTypes.instanceOf(Map),
  app: PropTypes.instanceOf(Map),
};
const defaultProps = {
};
const formOptions = radioAdvance.map(
  ($$item) => {
    let $$ret = $$item;

    if ($$item.get('id') === 'txchain' || $$item.get('id') === 'rxchain') {
      $$ret = $$ret.set('inputStyle', {
        display: 'block',
      });
    }

    return $$ret;
  },
);

class DeviceSystem extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.getCurData = this.getCurData.bind(this);
  }
  getCurData(name) {
    return this.props.store.getIn(['data', name]);
  }
  render() {
    const { app, store, actionable, ...restProps } = this.props;
    const formData = store.getIn(['data']);

    return (
      <FormContainer
        {...restProps}
        method="POST"
        data={formData}
        className="o-form o-form--compassed"
        options={formOptions}
        isSaving={app.get('saving')}
        header={[
          <FormGroup
            key="dapterSelect"
            type="switch"
            inputStyle={{
              display: 'block',
            }}
            label={_('Select Network Adapter')}
            value={this.getCurData('activeIndex')}
            options={this.getCurData('radiosOptions')}
            onChange={option => this.props.onChangeItem({
              configurationRadioIndex: option.value,
            })}
          />,
        ]}
        hasSaveButton={actionable}
      />
    );
  }
}
DeviceSystem.propTypes = propTypes;
DeviceSystem.defaultProps = defaultProps;

export default DeviceSystem;
