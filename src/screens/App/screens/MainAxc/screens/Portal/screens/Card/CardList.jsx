import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';
import { Button } from 'shared/components/Button';
import FormContainer from 'shared/components/Organism/FormContainer';

function getCardCategoryName() {
  return utils.fetch('goform/portal/card/cardcategory', {
    size: 9999,
    page: 1,
  })
    .then(json => (
      {
        options: json.data.list.map(
          item => ({
            value: item.id,
            label: item.name,
          }),
        ),
      }
    ),
  );
}
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
    id: 'name',
    text: _('Recharge Name'),
    width: '120px',
    formProps: {
      type: 'text',
      required: true,
      maxLength: 32,
      validator: validator({
        rules: 'utf8Len:[1,31]',
      }),
    },
  }, {
    id: 'payType',
    text: _('Recharge Type'),
    width: '120px',
    noForm: true,
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '0',
        label: _('Unavailability'),
      }, {
        value: '1',
        label: _('Free of Charge'),
      },
      {
        value: '2',
        label: _('Timekeeping'),
      }, {
        value: '3',
        label: _('Buy Out'),
      }, {
        value: '4',
        label: _('Traffic'),
      }, {
        value: '-1',
        label: _('Outside User'),
      },
    ],
  }, {
    id: 'categoryName',
    text: _('Category Name'),
    noTable: true,
    formProps: {
      type: 'select',
      required: true,
    },
  }, {
    id: 'categoryType',
    text: _('Category Type'),
    noForm: true,
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '0',
        label: _('Hour Card'),
      }, {
        value: '1',
        label: _('Day Card'),
      },
      {
        value: '2',
        label: _('Month Card'),
      }, {
        value: '3',
        label: _('Year Card'),
      }, {
        value: '4',
        label: _('Traffic Card'),
      },
    ],
  }, {
    id: 'cardCount',
    text: _('Card Number'),
    noTable: true,
    formProps: {
      type: 'number',
      required: true,
      min: 0,
      validator: validator({
        rules: 'num[0,9999]',
      }),
    },
  }, {
    id: 'maclimit',
    text: _('Mac Limit'),
    noForm: true,
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '0',
        label: _('Closed'),
      }, {
        value: '1',
        label: _('Open'),
      },
    ],
  }, {
    id: 'maclimitcount',
    noForm: true,
    text: _('Mac Quantity'),
    formProps: {
      type: 'number',
      required: true,
      min: 0,
      validator: validator({
        rules: 'num[0,9999]',
      }),
    },
  }, {
    id: 'autologin',
    text: _('Auto Login'),
    noForm: true,
    noTable: true,
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '0',
        label: _('Closed'),
      }, {
        value: '1',
        label: _('Open'),
      },
    ],
  }, {
    id: 'speed',
    text: _('Speed Limit'),
    noForm: true,
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '1',
        label: _('1M'),
      },
    ],
  }, {
    id: 'cdKey',
    text: _('CD Key'),
    noForm: true,
    formProps: {
      type: 'text',
      required: true,
    },
  },
  {
    id: 'payTime',
    text: _('Count'),
    noForm: true,
    formProps: {
      type: 'number',
      required: true,
      min: 0,
      validator: validator({
        rules: 'num[0,9999]',
      }),
    },
  }, {
    id: 'state',
    text: _('State'),
    noForm: true,
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '-1',
        label: _('Unpayed'),
      }, {
        value: '0',
        label: _('New Card'),
      }, {
        value: '1',
        label: _('Sold'),
      }, {
        value: '2',
        label: _('Active'),
      },
    ],
  }, {
    id: 'accountName',
    text: _('Recharge User'),
    noForm: true,
    formProps: {
      type: 'text',
      required: true,
      maxLength: 32,
      validator: validator({
        rules: 'utf8Len:[1,31]',
      }),
    },
  }, {
    id: 'buyDate',
    text: _('Order Date'),
    noForm: true,
    width: '120px',
    options: [],
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'payDate',
    text: _('Recharge Date'),
    noForm: true,
    width: '120px',
    options: [],
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'money',
    text: _('Price'),
    formProps: {
      type: 'text',
      required: true,
      help: _('$'),
    },
  }, {
    id: 'decsription',
    noTable: true,
    text: _('Description'),
    formProps: {
      type: 'textarea',
      required: true,
    },
  }, {
    id: '__actions__',
    noForm: true,
    text: _('Actions'),
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
  },
  {
    id: 'description',
    label: _('Content'),
    form: 'sendMessage',
    type: 'textarea',
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
export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryTypeOptions: fromJS([]),
    };
    utils.binds(this, [
      'onSave',
      'renderSendMessageModal',
    ]);
    this.screenId = props.route.id;
  }

  componentWillMount() {
    getCardCategoryName()
      .then((data) => {
        this.setState({
          categoryTypeOptions: fromJS(data.options),
        });
      });
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
    if (!isSendMessage) {
      return null;
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
      .setIn([2, 'options'], this.state.categoryTypeOptions)
      .setIn([-1, 'transform'], (val, $$data) => {
        const type = $$data.get('categoryType');
        let x;
        switch (type) {
          case 0:
            x = _('Hour Card');
            break;
          case 1:
            x = _('Day Card');
            break;
          case 2:
            x = _('Month Card');
            break;
          case 3:
            x = _('Year Card');
            break;
          default:
            x = _('Year Card');
        }
        if ($$data.get('state') === '0') {
          return (
            <Button
              text={_('Send to Users')}
              key="sendActionButton"
              icon="mail-forward"
              theme="primary"
              onClick={() => {
                this.props.changeScreenActionQuery({
                  action: 'sendMessage',
                  myTitle: _('Send to Users'),
                });
                this.props.updateCurEditListItem({
                  id: $$data.get('id'),
                  title: _('CD Key of Recharge Card '),
                  description: _('Recharge Name:') + $$data.get('name') + _('; ') + _('CD Key:') + $$data.get('cdKey') + _('; ') + _('Category Type:') + x,
                });
              }}
            />);
        }
        return (
          <Button
            text={_('Card Sold Out')}
            key="sendoutActionButton"
            icon="mail-forward"
          />);
      });
    return (
      <AppScreen
        {...this.props}
        listOptions={curListOptions}
        modalChildren={this.renderSendMessageModal()}
        noTitle
        actionable
        selectable
        editable={false}
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
    screenActions,
  ), dispatch);
}


// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(View);
