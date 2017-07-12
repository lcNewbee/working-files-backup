import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';

import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';
import { Button } from 'shared/components/Button';
import FormContainer from 'shared/components/Organism/FormContainer';
import moment from 'moment';

const defaultQuery = {
  startDate: moment().format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD'),
};

function getUserName() {
  return utils.fetch('goform/portal/account/accountList')
    .then(json => (
      {
        options: json.data.list.map(
          item => ({
            value: item.loginName,
            label: item.loginName,
          }),
        ),
      }
    ),
  );
}

const listOptions = fromJS([
  {
    id: 'toPos',
    text: __('Receiver Type'),
    noForm: true,
    noTable: true,
    formProps: {
      type: 'select',
    },
    options: [
      {
        value: '0',
        label: __('System User'),
      }, {
        value: '1',
        label: __('AP User'),
      },
    ],
  }, {
    id: 'toname',
    text: __('Receiver'),
    noTable: true,
    formProps: {
      type: 'select',
    },
  }, {
    id: 'fromid',
    text: __('Sender ID'),
    noForm: true,
    noTable: true,
    formProps: {
      type: 'text',
    },
  }, {
    id: 'fromPos',
    text: __('Sender Type'),
    noForm: true,
    noTable: true,
    formProps: {
      type: 'select',
    },
  }, {
    id: 'fromname',
    text: __('Sender'),
    noForm: true,
    formProps: {
      type: 'select',
      required: true,
    },
  },
  {
    id: 'title',
    text: __('Title'),
    formProps: {
      required: true,
      maxLength: 129,
      validator: validator({
        rules: 'utf8Len:[1,128]',
      }),
    },
  }, {
    id: 'date',
    text: __('Date'),
    noForm: true,
    formProps: {
      required: true,
    },
  }, {
    id: 'description',
    text: __('Content'),
    noTable: true,
    formProps: {
      type: 'textarea',
      required: true,
      maxLength: 257,
      validator: validator({
        rules: 'utf8Len:[1,256]',
      }),
    },
  }, {
    id: 'ip',
    text: __('IP'),
    noTable: true,
    noForm: true,
    formProps: {
      required: true,
    },
  }, {
    id: 'toId',
    text: __('Receiver ID'),
    type: 'text',
    noTable: true,
    noForm: true,
    formProps: {
      required: true,
    },
  }, {
    id: 'state',
    text: __('State'),
    noForm: true,
    actionName: 'update',
    type: 'switch',
    formProps: {
      type: 'checkbox',
      value: 1,
    },
  }, {
    id: 'delin',
    text: __('delin'),
    type: 'text',
    noTable: true,
    noForm: true,
    formProps: {
      required: true,
    },
  }, {
    id: 'delout',
    text: __('delout'),
    type: 'text',
    noTable: true,
    noForm: true,
    formProps: {
      required: true,
    },
  }, {
    id: '__actions__',
    text: __('Actions'),
    noForm: true,
  },
]);
const sendMessageOptions = fromJS([
  {
    id: 'toname',
    label: __('Receiver'),
    form: 'sendMessage',
    required: true,
    type: 'select',
  },
  {
    id: 'title',
    label: __('Title'),
    form: 'sendMessage',
    type: 'text',
    required: true,
    maxLength: 129,
    validator: validator({
      rules: 'utf8Len:[1,128]',
    }),
  },
  {
    id: 'description',
    label: __('Content'),
    form: 'sendMessage',
    type: 'textarea',
    required: true,
    maxLength: 257,
    rows: '5',
    validator: validator({
      rules: 'utf8Len:[1,256]',
    }),
  },
]);
const viewMessageOptions = fromJS([
  {
    id: 'date',
    label: __('Date'),
    type: 'plain-text',
    form: 'viewMessage',
  },
  {
    id: 'ip',
    label: __('IP'),
    form: 'viewMessage',
    type: 'plain-text',
  },
  {
    id: 'title',
    label: __('Title'),
    form: 'viewMessage',
    type: 'plain-text',
  },
  {
    id: 'description',
    label: __('Content'),
    form: 'viewMessage',
    type: 'textarea',
    rows: '5',
    readOnly: true,
  },
]);

const propTypes = {
  app: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  store: PropTypes.instanceOf(Map),
  save: PropTypes.func,
  updateCurEditListItem: PropTypes.func,
  changeScreenActionQuery: PropTypes.func,
  onListAction: PropTypes.func,
  changeScreenQuery: PropTypes.func,
  createModal: PropTypes.func,
};
const defaultProps = {};

export default class OpenPortalBase extends React.Component {
  constructor(props) {
    super(props);
    this.onAction = this.onAction.bind(this);
    this.state = {
      userNameOptions: fromJS([]),
    };
    utils.binds(this, [
      'onSave',
      'renderSendMessageModal',
    ]);
    this.screenId = props.route.id;
  }
  componentWillMount() {
    getUserName()
      .then((data) => {
        this.setState({
          userNameOptions: fromJS(data.options),
        });
      });
  }
  onSave() {
    this.props.onListAction({
      needMerge: true,
    });
  }
  onAction(no, type) {
    const query = {
      no,
      type,
    };

    this.props.save(this.props.route.formUrl, query)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          return json;
        }
        return json;
      });
  }
  renderSendMessageModal() {
    const { store, app, route } = this.props;
    const isSendMessage = store.getIn([route.id, 'actionQuery', 'action']) === 'sendMessage';
    const getSendMessageOptions = sendMessageOptions
        .setIn([0, 'options'], this.state.userNameOptions);
    const isViewMessage = store.getIn([route.id, 'actionQuery', 'action']) === 'viewMessage';

    if (!isSendMessage && !isViewMessage) {
      return null;
    }
    if (isViewMessage) {
      return (
        <FormContainer
          id="viewMessage"
          options={viewMessageOptions}
          data={store.getIn([route.id, 'curListItem'])}
          onChangeData={this.props.updateCurEditListItem}
          onSave={() => this.onSave('viewMessage')}
          invalidMsg={app.get('invalid')}
          validateAt={app.get('validateAt')}
          isSaving={app.get('saving')}
          savedText="ssss"
        />
      );
    }
    return (
      <FormContainer
        id="sendMessage"
        options={getSendMessageOptions}
        data={store.getIn([route.id, 'curListItem'])}
        onChangeData={this.props.updateCurEditListItem}
        onSave={() => this.onSave('sendMessage')}
        invalidMsg={app.get('invalid')}
        validateAt={app.get('validateAt')}
        isSaving={app.get('saving')}
        savedText="ssss"
        hasSaveButton
      />
    );
  }
  render() {
    const curListOptions = listOptions
      .setIn([1, 'options'], this.state.userNameOptions)
      .setIn([-1, 'render'], (val, $$data) => (
        <span>
          <Button
            text={__('View Message')}
            key="viewActionButton"
            icon="eye"
            theme="primary"
            onClick={() => {
              this.props.changeScreenActionQuery({
                action: 'viewMessage',
                myTitle: __('View Message'),
              });
              this.props.updateCurEditListItem({
                date: $$data.get('date'),
                ip: $$data.get('ip'),
                title: $$data.get('title'),
                description: $$data.get('description'),
              });
            }}
          />
          <Button
            text={__('Reply')}
            key="sendActionButton"
            icon="mail-reply"
            theme="primary"
            onClick={() => {
              this.props.changeScreenActionQuery({
                action: 'sendMessage',
                myTitle: __('Reply'),
              });
              this.props.updateCurEditListItem({
                toname: $$data.get('fromname'),
              });
            }}
          />
        </span>
          ),
        );
    const listActionBarChildren = (
      <Button
        text={__('Send Message')}
        key="sendActionButton"
        icon="envelope-o"
        theme="primary"
        onClick={() => this.props.changeScreenActionQuery({
          action: 'sendMessage',
          myTitle: __('Send Message'),
        })}
      />
    );
    const queryFormOptions = fromJS([
      {
        id: 'startDate',
        type: 'date',
        label: __('Start Date'),
        isOutsideRange: () => false,
        onChange: (data) => {
          Promise.resolve().then(() => {
            const { store } = this.props;
            const curScreenId = store.get('curScreenId');
            const endDate = store.getIn([curScreenId, 'query', 'endDate']);
            let startDate = data.value;
            const curDate = moment().format('YYYY-MM-DD');
            const overDate = moment(curDate).isBefore(startDate);
            const diff = moment(endDate).isBefore(startDate);
            if (diff) {
              this.props.createModal({
                type: 'alert',
                text: __(
                  '%s should be the date of today or before %s!',
                    __('Start Date'),
                    __('End Date'),
                ),
              });
              startDate = endDate;
              this.props.changeScreenQuery({ startDate });
            } else if (!diff && overDate) {
              this.props.createModal({
                type: 'alert',
                text: __(
                 'Please choose the date of today or before today!',
                ),
              });
              startDate = curDate;
              this.props.changeScreenQuery({ startDate });
            } else {
              this.props.changeScreenQuery({ startDate });
            }
          });
        },
        // saveOnChange: true,
      }, {
        id: 'endDate',
        type: 'date',
        label: __('End Date'),
        onChange: (data) => {
          Promise.resolve().then(() => {
            const { store } = this.props;
            const curScreenId = store.get('curScreenId');
            const startDate = store.getIn([curScreenId, 'query', 'startDate']);
            let endDate = data.value;
            const curDate = moment().format('YYYY-MM-DD');
            const overDate = moment(curDate).isBefore(endDate);
            const diff = moment(endDate).isBefore(startDate);
            if (diff) {
              this.props.createModal({
                type: 'alert',
                text: __(
                 '%s should be the date of today or after %s !',
                    __('End Date'),
                    __('Start Date'),
                ),
              });
              endDate = curDate;
              this.props.changeScreenQuery({ endDate });
            } else if (!diff && overDate) {
              this.props.createModal({
                type: 'alert',
                text: __(
                 'Please choose the date of today or before today!',
                ),
              });
              endDate = curDate;
              this.props.changeScreenQuery({ endDate });
            } else {
              this.props.changeScreenQuery({ endDate });
            }
          });
        },
        isOutsideRange: () => false,
        saveOnChange: true,
      },
    ]);
    return (
      <AppScreen
        {...this.props}
        initOption={{
          query: defaultQuery,
        }}
        queryFormOptions={queryFormOptions}
        listOptions={curListOptions}
        modalChildren={this.renderSendMessageModal()}
        actionable
        selectable
        addable={false}
        editable={false}
        searchable
        searchProps={{
          placeholder: `${__('Sender')}/${__('Title')}`,
        }}
      />
    );
  }
}

OpenPortalBase.propTypes = propTypes;
OpenPortalBase.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
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
)(OpenPortalBase);
