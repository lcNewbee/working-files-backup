import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import validator from 'shared/utils/lib/validator';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { FormGroup, FormInput, Checkbox } from 'shared/components/Form';
import Modal from 'shared/components/Modal';
import AppScreen from 'shared/components/Template/AppScreen';
import SaveButton from 'shared/components/Button/SaveButton';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const repeatOptions = [
  {
    value: '0',
    label: _('Exactly-once'),
  }, {
    value: '1',
    label: _('Everyday'),
  }, {
    value: '2',
    label: _('Workday'),
  }, {
    value: '5',
    label: _('Custom'),
  },
];

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
const listOptions = fromJS([
  {
    id: 'timerRange',
    text: _('Timer Range'),
    width: '120',
    transform(val, item) {
      return `${item.get('startTime')} - ${item.get('endTime')}`;
    },
  }, {
    id: 'opObject',
    width: '120',
    text: _('Operate Object'),
  }, {
    id: 'repeat',
    text: _('Repeat'),
    defaultValue: '1',
  }, {
    id: 'remark',
    text: _('Remark'),
  }, {
    id: 'startTime',
    text: _('Start Time'),
    defaultValue: '8:00',
  }, {
    id: 'endTime',
    text: _('End Time'),
    defaultValue: '22:00',
  },
]);

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  closeListItemModal: PropTypes.func,
  updateCurEditListItem: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);

    this.getCurrData = this.getCurrData.bind(this);
    this.onUpdateSettings = this.onUpdateSettings.bind(this);
  }
  onUpdateSettings(name) {
    return (item) => {
      const data = {};

      data[name] = item.value;
      this.props.updateCurEditListItem(data);
    };
  }
  getCurrData(name) {
    return this.props.store.getIn([this.props.route.id, 'curListItem', name]) || '';
  }

  render() {
    const { route, store } = this.props;
    const actionQuery = store.getIn([route.id, 'actionQuery']) || Map({});
    const getCurrData = this.getCurrData;
    const myListOptions = listOptions.push(fromJS({
      id: 'enabled',
      width: '80',
      text: _('Status'),
      transform() {
        return (
          <Checkbox
            style={{
              marginTop: '3px',
            }}
          />
        );
      },
    }));

    return (
      <AppScreen
        {...this.props}
        listOptions={myListOptions}
        actionable
        selectable
        customModal
      >
        <Modal
          isShow={actionQuery.get('action') === 'add' || actionQuery.get('action') === 'edit'}
          title={actionQuery.get('myTitle')}
          onOk={() => this.props.closeListItemModal(route.id)}
          onClose={() => this.props.closeListItemModal(route.id)}
          cancelButton={false}
          okButton={false}
          noFooter
        >
          <FormGroup
            type="select"
            label={_('SSID')}
            options={[
              {
                value: 1,
                label: _('SSID1'),
              }, {
                value: 1,
                label: _('SSID2'),
              },
            ]}
            value={getCurrData('opObject')}
            onChange={this.onUpdateSettings('opObject')}
          />
          <FormGroup
            type="select"
            label={_('Repeat')}
            options={repeatOptions}
            value={getCurrData('repeat')}
            onChange={this.onUpdateSettings('repeat')}
          />
          {
            getCurrData('repeat') === '0' ? (
              <FormGroup
                type="date"
                label={_('Date')}
                displayFormat="YYYY-MM-DD"
                value={getCurrData('customDate')}
                onChange={data => this.props.updateCurEditListItem({
                  customDate: data.value,
                })}
                // withPortal
              />
            ) : null
          }

          {
            getCurrData('repeat') === '5' ? (
              <FormGroup
                label={_('Custom Cycle')}
              >
                <FormInput
                  type="checkbox"
                  theme="square"
                  text={_('Mo')}
                />
                <FormInput
                  type="checkbox"
                  theme="square"
                  text={_('Tu')}
                />
                <FormInput
                  type="checkbox"
                  theme="square"
                  text={_('We')}
                />
                <FormInput
                  type="checkbox"
                  theme="square"
                  text={_('Th')}
                />
                <FormInput
                  type="checkbox"
                  theme="square"
                  text={_('Fr')}
                />
                <FormInput
                  type="checkbox"
                  theme="square"
                  text={_('Sa')}
                />
                <FormInput
                  type="checkbox"
                  theme="square"
                  text={_('Su')}
                />
              </FormGroup>
            ) : null
          }

          <FormGroup
            label={_('Time Range')}
            value={getCurrData('startTime')}
          >
            <FormInput
              type="time"
              className="text"
              value={moment(getCurrData('startTime').replace(':', ''), 'hmm')}
              onChange={data => this.props.updateCurEditListItem({
                startTime: data.value,
              })}
              format="HH:mm"
              showSecond={false}
              style={{
                width: '120px',
              }}
            />
            -
            <FormInput
              type="time"
              className="text"
              value={moment(getCurrData('endTime').replace(':', ''), 'hmm')}
              format="HH:mm"
              showSecond={false}
              style={{
                width: '120px',
              }}
              onChange={data => this.props.updateCurEditListItem({
                endTime: data.value,
              })}
            />
          </FormGroup>

          <FormGroup
            type="text"
            label={_('Description')}
            value={getCurrData('remark')}
            onChange={this.onUpdateSettings('remark')}
          />

          <FormGroup
            label={_('Enable The Policy')}
            type="checkbox"
          />

          <div className="form-group form-group-save">
            <div className="form-control">
              <SaveButton
                type="button"
                loading={this.props.app.get('saving')}
                onClick={this.onSave}
              />
            </div>
          </div>
        </Modal>
      </AppScreen>
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    groupid: state.product.getIn(['group', 'selected', 'id']),
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
  validator.mergeProps(validOptions),
)(View);
