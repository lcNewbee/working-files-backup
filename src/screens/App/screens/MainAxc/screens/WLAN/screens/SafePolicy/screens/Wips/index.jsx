import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import validator from 'shared/utils/lib/validator';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  ListInfo, FormInput,
} from 'shared/components';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const screenOptions = fromJS([
  {
    id: 'policyName',
    text: _('Policy Name'),
    width: '120',
  }, {
    id: 'opObject',
    width: '120',
    text: _('Access Point Work Mode'),
    options: [
      {
        value: '0',
        label: _('Normal'),
      }, {
        value: '1',
        label: _('Scan First'),
      },
    ],
    defaultValue: '1',
    formProps: {
      type: 'switch',
    },
  }, {
    id: 'scanType',
    text: _('Scan Type'),
    defaultValue: '0',
    options: [
      {
        value: '0',
        label: _('Passive'),
      }, {
        value: '1',
        label: _('Initiative'),
      },
    ],
    formProps: {
      type: 'switch',
    },
  }, {
    id: 'maxPower',
    text: _('Max Power'),
    formProps: {
      type: 'range',
      min: 12,
      max: 2333,
    },
  }, {
    id: 'minPower',
    text: _('Min Power'),

    formProps: {
      type: 'range',
      min: 12,
      max: 2333,
    },
  }, {
    id: '5gCalibrationInterval',
    text: _('5G Calibration Interval'),
  }, {
    id: '24gCalibrationInterval',
    text: _('2.4G Calibration Interval'),
  }, {
    id: '24gNeighborcoefficient',
    text: _('2.4G Neighbor coefficient'),
  }, {
    id: 'protect24gMode',
    text: _('2.4G timeid'),
  }, {
    id: 'enabled',
    width: '60',
    text: _('Status'),
    formProps: {
      type: 'checkbox',
    },
  },
]);

const blcklistTableOptions = immutableUtils.getTableOptions(screenOptions);
const editFormOptions = immutableUtils.getFormOptions(screenOptions);
const defaultData = immutableUtils.getDefaultData(screenOptions);

const validOptions = Map({
  password: validator({
    rules: 'remarkTxt:["\'\\\\"]|len:[8, 31]',
  }),
  vlanid: validator({
    rules: 'num:[2, 4095]',
  }),
  ssid: validator({
    rules: 'remarkTxt:["\'\\\\"]|len:[1, 31]',
  }),
  upstream: validator({
    rules: 'num:[32, 102400, 0]',
  }),
  downstream: validator({
    rules: 'num:[32, 102400, 0]',
  }),
});

const propTypes = {
  save: PropTypes.func,
  closeListItemModal: PropTypes.func,
  onListAction: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'onAction', 'onSave',
    ]);
  }
  onSave() {
    this.props.onListAction()
      .then(() => {
        this.props.closeListItemModal();
      });
  }
  onAction(action, data) {
    this.props.save('/goform/blacklist', data)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          console.log(11);
        }
      });
  }

  render() {
    const tableOptions = blcklistTableOptions.mergeIn([-1], {
      transform: val => (
        <FormInput
          type="checkbox"
          style={{
            marginTop: '3px',
          }}
          onChange={data => this.onAction('switch', data)}
        />
      ),
    });

    return (
      <ListInfo
        {...this.props}
        tableOptions={tableOptions}
        editFormOptions={editFormOptions}
        defaultEditData={defaultData}
        noTitle
        actionable
      />
    );
  }
}

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
    screenActions
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions)
)(View);
