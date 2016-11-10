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

const screenOptions = fromJS([
  {
    id: 'model',
    text: _('AP Model'),
    width: '120px',
    formProps: {
      type: 'select',
      required: true,
    },
  }, {
    id: 'softVersion',
    text: _('Soft Version'),
    defaultValue: '',
    formProps: {
      type: 'text',
      maxLength: '32',
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
export default class View extends React.Component {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'getApModelList',
    ]);
    this.state = {
      modelSelectPlaceholder: _('Loading'),
      modelIsloading: true,
      modelOptions: [],
    };
  }
  componentWillMount() {
    this.getApModelList();
  }
  getApModelList() {
    utils.fetch('goform/system/ap/model')
      .then((json) => {
        let options = [];

        if (json && json.data && json.data.list) {
          options = json.data.list.map(
            item => ({
              value: item.name,
              label: item.name,
            })
          );
        }
        this.setState({
          modelSelectPlaceholder: undefined,
          modelIsloading: false,
          modelOptions: options,
        });
      }
    );
  }
  render() {
    const { modelIsloading, modelOptions, modelSelectPlaceholder } = this.state;
    const myEditFormOptions = editFormOptions.mergeIn(
      [0, 0], {
        isLoading: modelIsloading,
        options: modelOptions,
        placeholder: modelSelectPlaceholder,
      }
    );
    return (
      <ListInfo
        {...this.props}
        tableOptions={tableOptions}
        editFormOptions={myEditFormOptions}
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
