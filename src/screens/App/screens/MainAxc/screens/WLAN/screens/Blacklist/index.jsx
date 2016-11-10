import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import ListInfo from 'shared/components/Template/ListInfo';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const commonFormOptions = fromJS([
  {
    id: 'dyaging',
    label: _('Dynamic Blacklists Release Time'),
    type: 'number',
    saveOnChange: true,
  },
]);
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
  route: PropTypes.object,
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
    const { route } = this.props;

    return (
      <ListInfo
        {...this.props}
        title={_('Blacklist Settings')}
        listTitle={route.text}
        tableOptions={tableOptions}
        editFormOptions={editFormOptions}
        defaultEditData={defaultEditData}

        settingsFormOption={commonFormOptions}

        listKey="allKeys"
        actionable
        editable={false}
        selectable
        noTitle
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
