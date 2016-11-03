import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/utils/lib/validator';
import {
  ListInfo,
} from 'shared/components';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

function getPortList() {
  return utils.fetch('goform/system/ap/model')
    .then((json) => {
      const ret = {
        options: [],
      };

      if (json && json.data && json.data.list) {
        ret.options = json.data.list.map(
          item => ({
            value: item.name,
            label: item.name,
          })
        );
      }
      return ret;
    }
  );
}

const screenOptions = fromJS([
  {
    id: 'model',
    text: _('AP Model'),
    width: '120px',
    formProps: {
      type: 'select',
      required: true,
      loadOptions: getPortList,
      isAsync: true,
    },
  }, {
    id: 'softVersion',
    text: _('Soft Version'),
    defaultValue: '',
    formProps: {
      type: 'text',
      required: true,
      validator: validator({}),
    },
  }, {
    id: 'versionFile',
    text: _('Version File'),
    noTable: true,
    defaultValue: '',
    formProps: {
      type: 'file',
      required: true,
      validator: validator({}),
    },
  }, {
    id: 'active',
    text: _('Active Status'),
    actionType: 'active',
    type: 'switch',
    width: '100px',
    formProps: {
      type: 'checkbox',
      value: '1',
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

export default function View(props) {
  return (
    <ListInfo
      {...props}
      tableOptions={tableOptions}
      editFormOptions={editFormOptions}
      editFormOption={{
        hasFile: true,
      }}
      defaultEditData={defaultEditData}
      noTitle
      actionable
      selectable
    />
  );
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
