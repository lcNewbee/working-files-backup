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
const queryFormOptions = fromJS([
  {
    id: 'payType',
    type: 'select',
    label: __('Acc Type'),
    options: [
      {
        value: '-100',
        label: __('ALL'),
      }, {
        value: '0',
        label: __('Unavailability'),
      }, {
        value: '1',
        label: __('Free of Charge'),
      },
      {
        value: '2',
        label: __('Timekeeping'),
      }, {
        value: '3',
        label: __('Buy Out'),
      }, {
        value: '4',
        label: __('Traffic'),
      }, {
        value: '-1',
        label: __('Outside User'),
      },
    ],
    saveOnChange: true,
  }, {
    id: 'categoryType',
    type: 'select',
    label: __('Voucher Type'),
    options: [
      {
        value: '-100',
        label: __('ALL'),
      }, {
        value: '0',
        label: __('Hourly Voucher'),
      }, {
        value: '1',
        label: __('Dayly Voucher'),
      },
      {
        value: '2',
        label: __('Monthly Voucher'),
      }, {
        value: '3',
        label: __('Yearly Voucher'),
      }, {
        value: '4',
        label: __('Traffic Voucher'),
      },
    ],
    saveOnChange: true,
  },
]);

const listOptions = fromJS([
  {
    id: 'name',
    text: __('Coupon Name'),
    width: '120px',
    formProps: {
      type: 'text',
      required: true,
      maxLength: 129,
      validator: validator({
        rules: 'utf8Len:[1,128]',
      }),
      render(val) {
        return __(val);
      },
    },
  }, {
    id: 'payType',
    text: __('Acc Type'),
    width: '120px',
    noForm: true,
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '0',
        label: __('Unavailability'),
      }, {
        value: '1',
        label: __('Free of Charge'),
      },
      {
        value: '2',
        label: __('Timekeeping'),
      }, {
        value: '3',
        label: __('Buy Out'),
      }, {
        value: '4',
        label: __('Traffic'),
      }, {
        value: '-1',
        label: __('Outside User'),
      },
    ],
  }, {
    id: 'categoryName',
    text: __('Voucher Name'),
    noTable: true,
    formProps: {
      type: 'select',
      required: true,
    },
  }, {
    id: 'categoryType',
    text: __('Voucher Type'),
    noForm: true,
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '0',
        label: __('Hourly Voucher'),
      }, {
        value: '1',
        label: __('Dayly Voucher'),
      },
      {
        value: '2',
        label: __('Monthly Voucher'),
      }, {
        value: '3',
        label: __('Yearly Voucher'),
      }, {
        value: '4',
        label: __('Traffic Voucher'),
      },
    ],
  }, {
    id: 'cardCount',
    text: __('Voucher Number'),
    noTable: true,
    formProps: {
      type: 'number',
      min: 0,
      validator: validator({
        rules: 'num:[0,9999]',
      }),
    },
  }, {
    id: 'maclimit',
    text: __('MAC Limit'),
    noForm: true,
    noTable: true,
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '0',
        label: __('Closed'),
      }, {
        value: '1',
        label: __('Open'),
      },
    ],
  }, {
    id: 'maclimitcount',
    noForm: true,
    noTable: true,
    text: __('MAC Quantity'),
    formProps: {
      type: 'number',
      required: true,
      min: 0,
      validator: validator({
        rules: 'num:[0,9999]',
      }),
    },
  }, {
    id: 'autologin',
    text: __('Auto Login'),
    noForm: true,
    noTable: true,
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '0',
        label: __('Closed'),
      }, {
        value: '1',
        label: __('Open'),
      },
    ],
  }, {
    id: 'speed',
    text: __('Speed Limit'),
    noForm: true,
    noTable: true,
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '1',
        label: __('1M'),
      },
    ],
  }, {
    id: 'cdKey',
    text: __('CD Key'),
    noForm: true,
    formProps: {
      type: 'text',
      required: true,
    },
  },
  {
    id: 'payTime',
    text: __('Voucher Value'),
    noForm: true,
    formProps: {
      type: 'number',
      required: true,
      min: 0,
      validator: validator({
        rules: 'num:[0,9999]',
      }),
    },
  }, {
    id: 'state',
    text: __('State'),
    noForm: true,
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '-1',
        label: __('Unpayed'),
      }, {
        value: '0',
        label: __('New Voucher'),
      }, {
        value: '1',
        label: __('Sold'),
      }, {
        value: '2',
        label: __('Active'),
      },
    ],
  }, {
    id: 'accountName',
    text: __('Recharge User'),
    noForm: true,
    formProps: {
      type: 'text',
      required: true,
      maxLength: 33,
      validator: validator({
        rules: 'utf8Len:[1,32]',
      }),
    },
  }, {
    id: 'buyDate',
    text: __('Order Date'),
    noForm: true,
    width: '120px',
    options: [],
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'payDate',
    text: __('Recharge Date'),
    noForm: true,
    width: '120px',
    options: [],
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'money',
    text: __('Voucher Cost'),
    formProps: {
      type: 'text',
      help: __('$'),
    },
  }, {
    id: 'decsription',
    noTable: true,
    text: __('Description'),
    render(val) {
      return __(val);
    },
    formProps: {
      type: 'textarea',
      render(val) {
        return __(val);
      },
    },
  }, {
    id: '__actions__',
    noForm: true,
    text: __('Actions'),
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
  },
  {
    id: 'description',
    label: __('Content'),
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
  changeScreenQuery: PropTypes.func,
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
    this.props.changeScreenQuery({
      payType: '-100',
      categoryType: '-100',
    });
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
      .setIn([-1, 'render'], (val, $$data) => {
        const type = $$data.get('categoryType');
        let x;
        switch (type) {
          case 0:
            x = __('Hourly Voucher');
            break;
          case 1:
            x = __('Dayly Voucher');
            break;
          case 2:
            x = __('Monthly Voucher');
            break;
          case 3:
            x = __('Yearly Voucher');
            break;
          default:
            x = __('Yearly Voucher');
        }
        if ($$data.get('state') === '0') {
          return (
            <Button
              text={__('Send to Users')}
              key="sendActionButton"
              icon="mail-forward"
              theme="primary"
              onClick={() => {
                this.props.changeScreenActionQuery({
                  action: 'sendMessage',
                  myTitle: __('Send to Users'),
                });
                this.props.updateCurEditListItem({
                  id: $$data.get('id'),
                  title: __('CD Key of Recharge Voucher'),
                  description: __('Coupon Name:') + $$data.get('name') + __('; ') + __('CD Key:') + $$data.get('cdKey') + __('; ') + __('Category Type:') + x,
                });
              }}
            />);
        }
        return (
          <Button
            text={__('Voucher Sold Out')}
            key="sendoutActionButton"
            icon="mail-forward"
          />);
      });
    return (
      <AppScreen
        {...this.props}
        listOptions={curListOptions}
        queryFormOptions={queryFormOptions}
        modalChildren={this.renderSendMessageModal()}
        noTitle
        actionable
        selectable
        searchable
        searchProps={{
          placeholder: `${__('Name')}`,
        }}
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
