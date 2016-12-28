import React, { PropTypes } from 'react';
import { Map, fromJS } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { radioAdvance } from 'shared/config/axcRadio';
import {
  FormGroup,
} from '../Form';
import FormContainer from '../Organism/FormContainer';

const propTypes = {
  onChangeData: PropTypes.func,
  onChangeItem: PropTypes.func,
  onSave: PropTypes.func.isRequired,
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
    const myFormOptions = formOptions.map(
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

    return (
      <FormContainer
        {...restProps}
        method="POST"
        data={formData}
        className="o-form o-form--compassed"
        options={myFormOptions}
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
        onSave={
          () => this.props.onSave('radioAdvance')
        }
      />
    );
  }
}
DeviceSystem.propTypes = propTypes;
DeviceSystem.defaultProps = defaultProps;

export default DeviceSystem;
