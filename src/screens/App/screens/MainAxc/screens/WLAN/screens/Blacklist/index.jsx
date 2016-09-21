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
    id: 'ssid',
    text: _('终端类型'),
  }, {
    id: 'ssid',
    text: _('封锁原因'),
  },
]);

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),

  route: PropTypes.object,
  initList: PropTypes.func,
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
          alert('ds');
        }
      });
  }

  render() {
    const { route, store } = this.props;
    const tableOptions = blcklistTableOptions;
    const editData = store.getIn([route.id, 'data', 'edit']) || Map({});
    const actionBarChildren = (
      <FormGroup
        dispaly="inline"
        label={_('动态黑名单老化时间')}
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

    return (
      <ListInfo
        {...this.props}
        actionBarChildren={actionBarChildren}
        tableOptions={tableOptions}
        actionable
        editAbled={false}
      >
        <Modal
          isShow={!editData.isEmpty()}
          title={editData.get('myTitle')}
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
