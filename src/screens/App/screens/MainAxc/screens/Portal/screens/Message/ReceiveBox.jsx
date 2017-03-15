import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';
import { Button } from 'shared/components/Button';
import FormContainer from 'shared/components/Organism/FormContainer';


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
    text: _('Receiver Type'),
    noForm: true,
    noTable: true,
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '0',
        label: _('System User'),
      }, {
        value: '1',
        label: _('AP User'),
      },
    ],
  }, {
    id: 'toname',
    text: _('Receiver'),
    noTable: true,
    formProps: {
      type: 'select',
      required: true,
    },
  }, {
    id: 'fromid',
    text: _('Sender ID'),
    noForm: true,
    noTable: true,
    formProps: {
      required: true,
    },
  }, {
    id: 'fromPos',
    text: _('Sender Type'),
    noForm: true,
    noTable: true,
    formProps: {
      type: 'select',
      required: true,
    },
  }, {
    id: 'fromname',
    text: _('Sender'),
    noForm: true,
    formProps: {
      type: 'select',
      required: true,
    },
  },
  {
    id: 'title',
    text: _('Title'),
    formProps: {
      required: true,
      maxLength: 32,
      validator: validator({
        rules: 'utf8Len:[1,31]',
      }),
    },
  }, {
    id: 'date',
    text: _('Date'),
    noForm: true,
    formProps: {
      required: true,
    },
  }, {
    id: 'description',
    text: _('Content'),
    noTable: true,
    formProps: {
      type: 'textarea',
      required: true,
      maxLength: 256,
      validator: validator({
        rules: 'utf8Len:[1,255]',
      }),
    },
  }, {
    id: 'ip',
    text: _('IP'),
    noTable: true,
    noForm: true,
    formProps: {
      required: true,
    },
  }, {
    id: 'toId',
    text: _('Receiver ID'),
    type: 'text',
    noTable: true,
    noForm: true,
    formProps: {
      required: true,
    },
  }, {
    id: 'state',
    text: _('State'),
    noForm: true,
    actionName: 'update',
    type: 'switch',
    formProps: {
      type: 'checkbox',
      value: 1,
    },
  }, {
    id: 'delin',
    text: _('delin'),
    type: 'text',
    noTable: true,
    noForm: true,
    formProps: {
      required: true,
    },
  }, {
    id: 'delout',
    text: _('delout'),
    type: 'text',
    noTable: true,
    noForm: true,
    formProps: {
      required: true,
    },
  }, {
    id: '__actions__',
    text: _('Actions'),
    noForm: true,
  },
]);
const sendMessageOptions = fromJS([
  {
    id: 'toname',
    label: _('Receiver'),
    form: 'sendMessage',
    required: true,
    type: 'select',
  },
  {
    id: 'title',
    label: _('Title'),
    form: 'sendMessage',
    type: 'text',
    required: true,
    maxLength: 32,
    validator: validator({
      rules: 'utf8Len:[1,31]',
    }),
  },
  {
    id: 'description',
    label: _('Content'),
    form: 'sendMessage',
    type: 'textarea',
    required: true,
    maxLength: 256,
    rows: '5',
    validator: validator({
      rules: 'utf8Len:[1,255]',
    }),
  },
]);
const viewMessageOptions = fromJS([
  {
    id: 'date',
    label: _('Date'),
    type: 'text',
    form: 'viewMessage',
    required: true,
  },
  {
    id: 'ip',
    label: _('IP'),
    form: 'viewMessage',
    type: 'text',
    required: true,
  },
  {
    id: 'title',
    label: _('Title'),
    form: 'viewMessage',
    type: 'text',
    required: true,
  },
  {
    id: 'description',
    label: _('Content'),
    form: 'viewMessage',
    type: 'textarea',
    rows: '5',
    required: true,
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
          hasSaveButton
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
      .setIn([-1, 'transform'], (val, $$data) => (
        <span>
          <Button
            text={_('View Message')}
            key="viewActionButton"
            icon="eye"
            theme="primary"
            onClick={() => {
              this.props.changeScreenActionQuery({
                action: 'viewMessage',
                myTitle: _('View Message'),
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
            text={_('Reply')}
            key="sendActionButton"
            icon="mail-reply"
            theme="primary"
            onClick={() => {
              this.props.changeScreenActionQuery({
                action: 'sendMessage',
                myTitle: _('Reply'),
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
        text={_('Send Message')}
        key="sendActionButton"
        icon="envelope-o"
        theme="primary"
        onClick={() => this.props.changeScreenActionQuery({
          action: 'sendMessage',
          myTitle: _('Send Message'),
        })}
      />
    );
    return (
      <AppScreen
        {...this.props}
        listOptions={curListOptions}
        actionBarChildren={listActionBarChildren}
        modalChildren={this.renderSendMessageModal()}
        actionable
        selectable
        addable={false}
        editable={false}
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
