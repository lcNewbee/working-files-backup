import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  FormGroup, FormInput,
} from 'shared/components/Form';
import Modal from 'shared/components/Modal';
import ListInfo from 'shared/components/Template/ListInfo';
import { Button, SaveButton } from 'shared/components/Button';
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
    const tableOptions = blcklistTableOptions;
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
        editable={false}
        selectable
      >
        <Modal
          isShow={isModelShow}
          title={actionQuery.get('myTitle')}
          onOk={() => this.props.closeListItemModal(route.id)}
          onClose={() => this.props.closeListItemModal(route.id)}
          noFooter
        >
          <FormGroup
            type="text"
            label={_('MAC Address')}
            value={editData.get('mac')}
          />
          <FormGroup
            type="text"
            label={_('Block Reason')}
            value={editData.get('reason')}
          />
          <div className="form-group form-group--save">
            <div className="form-control">
              <SaveButton
                type="button"
                loading={app.get('saving')}
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
