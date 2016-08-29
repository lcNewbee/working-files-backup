import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/utils/lib/validator';
import {
  ListInfo,
} from 'shared/components';
import * as listActions from 'shared/actions/list';
import * as appActions from 'shared/actions/app';

const screenOptions = fromJS([
  {
    id: 'id',
    text: _('No'),
    formProps: {
      type: 'plain-text',
    },
  }, {
    id: 'status',
    text: _('Status'),
    formProps: {
      label: _('Interface Status'),
      type: 'checkbox',
    },
  }, {
    id: 'arpProxy',
    text: _('ARP Proxy'),
    formProps: {
      type: 'checkbox',
      label: _('Enable ARP Proxy'),
    },
  }, {
    id: 'mainIp',
    text: _('Main IPV4'),
    formProps: {
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'mainMask',
    text: _('Main IPV4 Mask'),
    formProps: {
      validator: validator({
        rules: 'mask',
      }),
    },
  }, {
    id: 'secondIp',
    text: _('Second IPV4'),
    formProps: {
      validator: validator({
        rules: 'ip',
      }),
    },
  }, {
    id: 'secondMask',
    text: _('Second IPV4 Mask'),
    formProps: {
      validator: validator({
        rules: 'mask',
      }),
    },
  }, {
    id: 'ipv6',
    text: _('IPV6'),
  }, {
    id: 'ipv6Mask',
    text: _('IPV6 Mask'),
  }, {
    id: 'description',
    text: _('Description'),
    formProps: {
      type: 'texterae',
    },
  },
]);
const tableOptions = immutableUtils.getTableOptions(screenOptions);
const editFormOptions = immutableUtils.getFormOptions(screenOptions);
const defaultEditData = immutableUtils.getDefaultData(screenOptions);
const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),

  route: PropTypes.object,
  initList: PropTypes.func,
  closeListItemModal: PropTypes.func,
  updateEditListItem: PropTypes.func,
  save: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);

    this.onAction = this.onAction.bind(this);
  }

  onAction(no, type) {
    const query = {
      no,
      type,
    };

    this.props.save(this.props.route.formUrl, query)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          console.log(json);
        }
      });
  }

  render() {
    return (
      <ListInfo
        {...this.props}
        tableOptions={tableOptions}
        editFormOptions={editFormOptions}
        defaultEditData={defaultEditData}
        actionable
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
    store: state.list,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    listActions
  ), dispatch);
}


// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(View);
