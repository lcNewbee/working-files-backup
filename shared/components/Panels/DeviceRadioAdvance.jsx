import React, { PropTypes } from 'react';
import { fromJS, Map } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {
  FormGroup,
} from '../Form';
import FormContainer from '../Organism/FormContainer';

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
    this.getCurData = this.getCurData.bind(this);
  }
  getCurData(name) {
    return this.props.store.getIn(['data', name]);
  }
  render() {
    const { app, store, ...restProps } = this.props;
    const formData = store.getIn(['data']);
    const formOptions = fromJS([
      {
        id: 'phymode',
        label: _('Work Mode'),
        type: 'select',
        defaultValue: 'B/G/N',
        options: [
          {
            value: 'B/G/N',
            label: 'B/G/N',
          }, {
            value: 'B/G',
            label: 'B/G',
          }, {
            value: 'B/N',
            label: 'B/N',
          }, {
            value: '802.11N',
            label: '802.11N',
          }, {
            value: '802.11G',
            label: '802.11G',
          }, {
            value: '802.11B',
            label: '802.11B',
          }, {
            value: '802.11A',
            label: '802.11A',
          }, {
            value: '802.11N58',
            label: '802.11N58',
          },
        ],
      }, {
        id: 'maxclientcount',
        type: 'number',
        min: 1,
        max: 999,
        defaultValue: 32,
        label: _('Max Clients'),
      }, {
        id: 'beaconinterval',
        type: 'number',
        min: 1,
        max: 8191,
        defaultValue: 100,
        label: _('Beacon Interval'),
      }, {
        id: 'fragthreshold',
        label: _('帧的分片门限值'),
        type: 'number',
        min: 256,
        max: 2346,
        defaultValue: 2346,
      }, {
        id: 'maxrxduration',
        label: _('maxrxduration'),
        type: 'number',
        min: 1,
        max: 15,
        defaultValue: 4,
      }, {
        id: 'rtsthreshold',
        label: _('RTS发送请求门限'),
        type: 'number',
        min: 0,
        max: 2346,
        defaultValue: 2346,
      }, {
        id: 'shortretrythreshold',
        label: _('小于RTS门限最大重传次数'),
        type: 'number',
        min: 1,
        max: 15,
        defaultValue: 7,
      }, {
        id: 'longretrythreshold',
        label: _('大于RTS门限最大重传次数'),
        type: 'number',
        min: 1,
        max: 15,
        defaultValue: 4,
      }, {
        id: 'dtim',
        label: _('信标帧间隔的数量'),
        type: 'number',
        min: 1,
        max: 15,
        defaultValue: 7,
      }, {
        id: 'wmmenable',
        label: _('wmm开关'),
        type: 'checkbox',
        value: '1',
        defaultValue: '0',
      }, {
        id: 'cwmin',
        label: _('wmm竞争窗口值的最小时间'),
        type: 'number',
        min: 1,
        max: 3600,
        defaultValue: 60,
      }, {
        id: 'cwmax',
        label: _('wmm竞争窗口值的最大时间'),
        type: 'number',
        min: 1,
        max: 3600,
        defaultValue: 60,
      }, {
        id: 'aifs',
        label: _('wmm任意内部数据帧间隙'),
        type: 'number',
        min: 1,
        max: 3600,
        defaultValue: 60,
      }, {
        id: 'txop',
        label: _('txop'),
        type: 'number',
        min: 1,
        max: 3600,
        defaultValue: 60,
      }, {
        id: 'admctrmandatory',
        label: _('admctrmandatory'),
        type: 'number',
        min: 1,
        max: 3600,
        defaultValue: 60,
      }, {
        id: 'spatialstreams',
        label: _('空间流'),
        type: 'switch',
        inputStyle: {
          width: '100%',
        },
        options: [
          {
            value: '0',
            label: _('Custom'),
          }, {
            value: '1x1',
            label: '1x1',
          }, {
            value: '2x2',
            label: '2x2',
          }, {
            value: '3x3',
            label: '3x3',
          }, {
            value: '4x4',
            label: '4x4',
          },
        ],
        value: '1',
        defaultValue: '1',
      }, {
        id: 'txchain',
        label: _('自定义发射空间流'),
        type: 'text',
        maxLength: 32,
        defaultValue: '',
        required: true,
        showPrecondition(data) {
          return data.get('spatialstreams') === '0';
        },
      }, {
        id: 'rxchain',
        label: _('自定义接收空间流'),
        type: 'text',
        maxLength: 32,
        defaultValue: '',
        showPrecondition(data) {
          return data.get('spatialstreams') === '0';
        },
      }, {
        id: 'shortgi',
        label: _('shortgi'),
        type: 'checkbox',
        value: '1',
        defaultValue: '1',
      }, {
        id: 'preamble',
        label: _('preamble'),
        type: 'switch',
        inputStyle: {
          width: '100%',
        },
        options: [
          {
            value: '1',
            label: _('Short'),
          }, {
            value: '0',
            label: _('Long'),
          },
        ],
        defaultValue: '1',
        showPrecondition(data) {
          return data.get('shortgi') === '1';
        },
      }, {
        id: 'ampdu',
        label: _('ampdu'),
        type: 'checkbox',
        value: '1',
        defaultValue: '0',
      }, {
        id: 'amsdu',
        label: _('amsdu'),
        type: 'checkbox',
        value: '1',
        defaultValue: '0',
      }, {
        id: 'rateset',
        label: _('速率集'),
        type: 'text',
        maxLength: '32',
        defaultValue: '',
      },
    ]);

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
        hasSaveButton
      />
    );
  }
}
DeviceSystem.propTypes = propTypes;
DeviceSystem.defaultProps = defaultProps;

export default DeviceSystem;
