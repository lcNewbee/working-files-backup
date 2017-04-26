import React from 'react';
import PropTypes from 'prop-types';
import { Map, fromJS } from 'immutable';
import { radioAdvance } from 'shared/config/axcRadio';
import FormGroup from 'shared/components/Form/FormGroup';
import PureComponent from 'shared/components/Base/PureComponent';
import FormContainer from 'shared/components/Organism/FormContainer';

const propTypes = {
  onChangeData: PropTypes.func,
  onChangeItem: PropTypes.func,
  resetVaildateMsg: PropTypes.func,
  onSave: PropTypes.func.isRequired,
  actionable: PropTypes.bool,
  deviceIndex: PropTypes.number,

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

class DeviceSystem extends PureComponent {
  constructor(props) {
    super(props);

    this.getCurData = this.getCurData.bind(this);
    this.onChangeRadio = this.onChangeRadio.bind(this);
    this.initFormOptions = this.initFormOptions.bind(this);

    this.initFormOptions(props);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.store.get('data') !== this.props.store.get('data')) {
      this.initFormOptions(nextProps);
    }
  }
  componentWillUnmount() {
    this.props.resetVaildateMsg();
  }

  onChangeRadio(data) {
    const myData = data;
    const txchain = data.txchain;

    if (txchain !== undefined) {
      myData.rxchain = txchain;
    }

    if (this.props.onChangeData) {
      this.props.onChangeData(myData);
    }
  }
  getCurData(name) {
    return this.props.store.getIn(['data', name]);
  }
  initFormOptions(props) {
    const formData = props.store.getIn(['data']);

    this.myFormOptions = formOptions.map(
      ($$item) => {
        const maxRateset = formData.get('ratesupport') || '';
        const spatialstreams = formData.get('spatialstreams') || 3;
        let tmpArr = [];
        let $$tmpOptions = [];
        let $$ret = $$item;

        // 自定义空间流
        if ($$item.get('id') === 'txchain' || $$item.get('id') === 'rxchain') {
          tmpArr = new Array(parseInt(spatialstreams, 10));

          $$tmpOptions = fromJS(tmpArr).map(
            (val, index) => {
              const n = index + 1;
              return {
                value: `${n}`,
                label: `${n}x${n}`,
              };
            },
          );
          $$ret = $$item.set('options', $$tmpOptions);

        // 速率集
        } else if ($$item.get('id') === 'rateset') {
          if (maxRateset.indexOf('MCS') !== -1) {
            tmpArr = new Array(parseInt(maxRateset.split('MCS')[1], 10) + 1);
          } else {
            tmpArr = [];
          }

          $$tmpOptions = fromJS(tmpArr).map(
            (val, index) => {
              const n = index;
              return {
                value: `MCS${n}`,
                label: `MCS${n}`,
              };
            },
          );
          $$ret = $$item.set('options', $$tmpOptions);
        }

        return $$ret;
      },
    );
  }

  render() {
    const { app, store, deviceIndex, actionable, ...restProps } = this.props;
    const formData = store.getIn(['data']);
    const formId = `radioAdv${deviceIndex}`;

    return (
      <FormContainer
        {...restProps}
        method="POST"
        data={formData}
        id={formId}
        className="o-form o-form--compassed"
        options={this.myFormOptions}
        isSaving={app.get('saving')}
        header={[
          <FormGroup
            key="dapterSelect"
            type="switch"
            inputStyle={{
              display: 'block',
            }}
            label={__('Select Network Adapter')}
            value={this.getCurData('activeIndex')}
            options={this.getCurData('radiosOptions')}
            onChange={option => this.props.onChangeItem({
              configurationRadioIndex: option.value,
            })}
          />,
        ]}
        actionable={actionable}
        hasSaveButton={actionable}
        onSave={
          () => this.props.onSave(formId)
        }
        onChangeData={this.onChangeRadio}
        saveText={__('Apply')}
        savingText={__('Applying')}
        savedText={__('Applied')}
      />
    );
  }
}
DeviceSystem.propTypes = propTypes;
DeviceSystem.defaultProps = defaultProps;

export default DeviceSystem;
