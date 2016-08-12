import React from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import Select from 'react-select';
import { FormGroup, FormInput } from 'shared/components';
import Table from 'shared/components/Table';
import * as actions from './actions.js';
import reducer from './reducer.js';

const radioOptions = [
  { value: '1', label: _('Radio 1(2.4G)') },
  { value: '2', label: _('Radio 1(5G)') },
];

const qosTempOptions = [
  { value: '1', label: _('Default') },
  { value: '2', label: _('Custom') },
];

const wapEdcaOptions = fromJS([
  {
    id: 'Application',
    text: _('Application'),
  },
  {
    id: 'AIFS',
    text: 'AIFS',
    transform: (val) => (
      <div
        style={{ marginLeft: '-200px',
                marginTop: '8px',
                marginBotton: '5px',
              }}
      >
        <FormGroup>
          <FormInput
            value={val}
          />
        </FormGroup>
      </div>
      ),
  },
  {
    id: 'cwMin',
    text: 'cwMin',
    transform: (val) => (
      <div
        style={{ marginLeft: '-200px',
                marginTop: '8px',
                marginBotton: '5px',
              }}
      >
        <FormGroup>
          <FormInput
            value={val}
          />
        </FormGroup>
      </div>
      ),
  },
  {
    id: 'cwMax',
    text: 'cwMax',
    transform: (val) => (
      <div
        style={{ marginLeft: '-200px',
                marginTop: '8px',
                marginBotton: '5px',
              }}
      >
        <FormGroup>
          <FormInput
            value={val}
          />
        </FormGroup>
      </div>
      ),
  },
  {
    id: 'Max.Burst',
    text: 'Max.Burst',
    transform: (val) => (
      <div
        style={{ marginLeft: '-200px',
                marginTop: '8px',
                marginBotton: '5px',
              }}
      >
        <FormGroup>
          <FormInput
            value={val}
          />
        </FormGroup>
      </div>
      ),
  },
]);

/** *************测试数据**************************/
const wapEdcaList = fromJS([
  {
    Application: 'Voice',
    AIFS: 1,
    cwMin: 3,
    cwMax: 7,
    'Max.Burst': 1.5,
  },
],
);


/** **************测试数据完***************************/


export default class QoS extends React.Component {


  render() {
    return (
      <div>
        <div className="radioSelect">
          <h3>{_('Select Your Radio')}</h3>
          <FormGroup
            label="Radio"
          >
            <Select
              options={radioOptions}
            />
          </FormGroup>
          <FormGroup
            label="EDCA Template"
          >
            <Select
              options={qosTempOptions}
            />
          </FormGroup>
        </div>
        <div className="qosSettings">
          <h3>{_('QoS Setting')}</h3>
          <FormGroup
            label={_('WAP EDCA Parameters')}
          >
            <Table
              className="table"
              options={wapEdcaOptions}
              list={wapEdcaList}
            />
          </FormGroup>
        </div>
        <FormGroup
          label="Wi-Fi Multimedia(WMM)"
          type="checkbox"
        />
        <div className="stationEdcaPara">
          <FormGroup
            label={_('Station EDCA Parameters')}
          >
            <Table
              className="table"
              options={wapEdcaOptions}
              list={wapEdcaList}
            />
          </FormGroup>
        </div>
        <FormGroup
          label="No Acknowledgement"
          type="checkbox"
        />
        <FormGroup
          label="APSD"
          type="checkbox"
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const myState = state.qos;

  return {
    fecthing: myState.get('fetching'),
  };
}

export const Screen = connect(
  mapStateToProps,
  actions
)(QoS);

export const qos = reducer;
