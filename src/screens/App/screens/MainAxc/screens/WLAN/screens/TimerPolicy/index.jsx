import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import validator from 'shared/utils/lib/validator';
import { connect } from 'react-redux';
import { fromJS, Map, List } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  ListInfo, FormGroup, Modal, SaveButton, Checkbox,
  FormInput,
} from 'shared/components';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';
import channels from 'shared/config/country.json';
import moment from 'moment';

const channelsList = List(channels);
const weekDayStyle = {
  marginLeft: '12px',
  marginRight: '4px',
};
const blcklistTableOptions = fromJS([
  {
    id: 'timerRange',
    text: _('时段'),
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
    text: _('重复'),
  }, {
    id: 'remark',
    text: _('Remark'),
  },
]);
const repeatOptions = [
  {
    value: '0',
    label: _('只执行一次'),
  }, {
    value: '1',
    label: _('每天'),
  }, {
    value: '2',
    label: _('周一至周五'),
  }, {
    value: '5',
    label: _('自定义周期'),
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

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  validateOption: PropTypes.object,
  route: PropTypes.object,
  initList: PropTypes.func,
  save: PropTypes.func,
  addListItem: PropTypes.func,
  closeListItemModal: PropTypes.func,
  editListItemByIndex: PropTypes.func,
  updateEditListItem: PropTypes.func,
  onListAction: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);

    this.onAction = this.onAction.bind(this);
    this.getCurrData = this.getCurrData.bind(this);
    this.onUpdateSettings = this.onUpdateSettings.bind(this);
    this.onSave = this.onSave.bind(this);
  }
  onSave() {
    this.props.onListAction();
  }
  onAction(action, mac) {
    const query = {
      mac,
      action,
    };

    this.props.save('/goform/blacklist', query)
      .then((json) => {});
  }
  onUpdateSettings(name) {
    return (item) => {
      const data = {};

      data[name] = item.value;
      this.props.updateEditListItem(data);
    };
  }
  onUpdateTime(momentObj, ddd) {
    console.log(momentObj.format('HH:mm'), ddd);
  }

  getCurrData(name) {
    return this.props.store.getIn([this.props.route.id, 'data', 'edit', name]) || '';
  }
  getCountryOptions() {
    return channelsList.map((item) => ({
      value: item.country,
      label: b28n.getLang() === 'cn' ? _(item.cn) : _(item.en),
    })).toJS();
  }

  getChannelsOptions(currCountry) {
    let i;
    let len;
    let channelsRange;
    const channelsOptions = [
      {
        value: '0',
        label: _('auto'),
      },
    ];
    const channelsOption = channelsList.find(
      (item) => item.country === currCountry
    );

    if (channelsOption) {
      channelsRange = channelsOption['2.4g'].split('-');
      i = parseInt(channelsRange[0], 10);
      len = parseInt(channelsRange[1], 10);
    } else {
      i = 1;
      len = 13;
    }

    for (i; i <= len; i++) {
      channelsOptions.push({
        value: `${i}`,
        label: `${i}`,
      });
    }

    return channelsOptions;
  }

  render() {
    const { route, store } = this.props;
    const editData = store.getIn([route.id, 'data', 'edit']) || Map({});
    const getCurrData = this.getCurrData;
    const channelsOptions = this.getChannelsOptions(getCurrData('country'));

    const tableOptions = blcklistTableOptions.push(fromJS({
      id: 'enabled',
      width: '80',
      text: _('启用状态'),
      transform(val) {
        return (
          <Checkbox
            checked={val === '1'}
            style={{
              marginTop: '3px',
            }}
          />
        );
      },
    }));

    return (
      <ListInfo
        {...this.props}
        tableOptions={tableOptions}
        defaultItem={{
          dataType: 'date',
        }}
        actionable
      >
        <Modal
          isShow={!editData.isEmpty()}
          title={editData.get('myTitle')}
          onOk={() => this.props.closeListItemModal(route.id)}
          onClose={() => this.props.closeListItemModal(route.id)}
          cancelButton={false}
          okButton={false}
        >

          <FormGroup
            type="select"
            label={_('操作SSID')}
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
                label={_('日期')}
                dateFormat="YYYY-MM-DD"
                selected={moment(getCurrData('customDate'))}
                onChange={(data) => this.props.updateEditListItem({
                  customDate: data.value,
                })}
              />
            ) : null
          }

          {
            getCurrData('repeat') === '5' ? (
              <FormGroup
                label={_('自定义周期')}
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
              onChange={(data) => this.props.updateEditListItem({
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
              onChange={(data) => this.props.updateEditListItem({
                endTime: data.value,
              })}
            />
          </FormGroup>

          <FormGroup
            type="text"
            label={_('Description')}
            options={channelsOptions}
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
      </ListInfo>
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
