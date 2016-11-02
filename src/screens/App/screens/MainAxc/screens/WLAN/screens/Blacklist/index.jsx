import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  FormGroup, FormInput,
} from 'shared/components/Form';
import ListInfo from 'shared/components/Template/ListInfo';
import { SaveButton } from 'shared/components/Button';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const screenOptions = fromJS([
  {
    id: 'mac',
    text: _('MAC Address'),
    formProps: {
      required: true,
    },
  }, {
    id: 'vendor',
    text: _('Manufacturer'),
    noForm: true,
  }, {
    id: 'clientType',
    text: _('Client Type'),
    noForm: true,
  }, {
    id: 'reason',
    text: _('Reason'),
    formProps: {
      type: 'textarea',
      maxLenght: 128,
    },
  },
]);
const tableOptions = immutableUtils.getTableOptions(screenOptions);
const editFormOptions = immutableUtils.getFormOptions(screenOptions);
const defaultEditData = immutableUtils.getDefaultData(screenOptions);

const propTypes = {
  store: PropTypes.instanceOf(Map),
  app: PropTypes.instanceOf(Map),

  route: PropTypes.object,
  closeListItemModal: PropTypes.func,
  save: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);

    this.onAction = this.onAction.bind(this);
  }
  onAction(mac, action) {
    const query = {
      mac,
      action,
    };

    this.props.save('goform/blacklist', query)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          // alert('ds');
        }
      });
  }

  render() {
    const { app, route, store } = this.props;
    const editData = store.getIn([route.id, 'curListItem']) || Map({});
    const actionBarChildren = (
      <FormGroup
        key="blacklistD"
        display="inline"
        label={_('Dynamic Blacklists Release Time')}
        style={{
          marginBottom: '0',
        }}
      >
        <FormInput
          type="text"
          style={{
            marginRight: '8px',
          }}
        />
        <SaveButton
          theme="info"
        />
      </FormGroup>
    );
    const actionQuery = store.getIn([route.id, 'actionQuery']) || Map({});
    const isModelShow = actionQuery.get('action') === 'add' || actionQuery.get('action') === 'edit';

    return (
      <ListInfo
        {...this.props}
        actionBarChildren={actionBarChildren}
        tableOptions={tableOptions}
        editFormOptions={editFormOptions}
        defaultEditData={defaultEditData}
        listKey="allKeys"
        actionable
        editable={false}
        selectable
      />
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
    screenActions
  ), dispatch);
}


// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(View);
