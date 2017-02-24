import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

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
    type: 'text',
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
    },
  }, {
    id: 'fromid',
    text: _('Sender ID'),
    noTable: true,
    noForm: true,
    formProps: {
      required: true,
    },
  }, {
    id: 'fromname',
    text: _('Sender'),
    type: 'text',
    noTable: true,
    noForm: true,
    formProps: {
      required: true,
    },
  }, {
    id: 'fromPos',
    text: _('Sender Type'),
    type: 'text',
    noTable: true,
    noForm: true,
    formProps: {
      required: true,
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
    type: 'text',
    formProps: {
      required: true,
    },
    options: [
      {
        value: '0',
        label: _('Unread'),
      }, {
        value: '1',
        label: _('Read'),
      },
    ],
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
    actions: [
      {
        icon: 'check-square-o',
        actionName: 'update',
        text: _('Update State'),
      },
    ],
    transform(val, $$item) {
      return (
        <span>
          <a href={`index.html#/main/portal/message/sendmessage/${$$item.get('toname')}`} className="tablelink">{_('Send Again')}</a>
        </span>
      );
    },
  },
]);

const propTypes = {
  route: PropTypes.object,
  save: PropTypes.func,
  updateScreenSettings: PropTypes.func,
};
const defaultProps = {};

export default class OpenPortalBase extends React.Component {
  constructor(props) {
    super(props);
    this.onAction = this.onAction.bind(this);
    this.state = {
      userNameOptions: fromJS([]),
    };
  }
  componentWillMount() {
    getUserName()
      .then((data) => {
        this.setState({
          userNameOptions: fromJS(data.options),
        });
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
        }
      });
  }
  render() {
    const curListOptions = listOptions
      .setIn([1, 'options'], this.state.userNameOptions);
    return (
      <AppScreen
        {...this.props}
        listOptions={curListOptions}
        listKey="id"
        actionable
        selectable
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
