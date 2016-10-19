import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  ListInfo, Button, Modal, FormGroup, FormInput,
} from 'shared/components';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const blcklistTableOptions = fromJS([
  {
    id: 'mac',
    text: _('MAC Address'),
  }, {
    id: 'vendor',
    text: _('Manufacturer'),
  }, {
    id: 'clientType',
    text: _('Client Type'),
  }, {
    id: 'reason',
    text: _('Reason'),
  },
]);

const propTypes = {
  store: PropTypes.instanceOf(Map),

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
  componentWillMount() {
    this.props.changeScreenActionQuery({
      groupid: this.props.groupid,
    });
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.groupid !== nextProps.groupid) {
      this.props.changeScreenActionQuery({
        groupid: nextProps.groupid,
      });
    }
  }
  onAction(mac, action) {
    const query = {
      mac,
      action,
    };

    this.props.save('goform/blacklist', query)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          alert('ds');
        }
      });
  }

  render() {
    const { route, store } = this.props;
    const tableOptions = blcklistTableOptions;
    const editData = store.getIn([route.id, 'curListItem']) || Map({});
    const actionBarChildren = (
      <FormGroup
        key="blacklistD"
        display="inline"
        label={_('Dynamic Blacklists Release Time')}
      >
        <FormInput
          type="text"
          style={{
            marginRight: '8px',
          }}
        />
        <Button
          text={_('Save')}
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
        listKey="allKeys"
        actionable
        editAbled={false}
      >
        <Modal
          isShow={isModelShow}
          title={actionQuery.get('myTitle')}
          onOk={() => this.props.closeListItemModal(route.id)}
          onClose={() => this.props.closeListItemModal(route.id)}
        >
          <FormGroup
            type="text"
            label={_('MAC Address')}
          />
          <FormGroup
            type="text"
            label={_('Block Reason')}
          />
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
